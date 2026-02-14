import { PaymentMethod, Prisma, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureStoreSettings } from "@/lib/settings";
import { sanitizeText } from "@/lib/sanitize";
import { formatAznFromQepik } from "@/lib/money";
import { buildEpointRedirect, isEpointConfigured } from "@/lib/epoint";

export type CheckoutItem = { productId: string; qty: number };

export type CheckoutInput = {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  items: CheckoutItem[];
};

function validateCheckoutInput(input: CheckoutInput) {
  if (!input.fullName || input.fullName.length > 120) throw new Error("Invalid full name");
  if (!input.phone || input.phone.length > 30) throw new Error("Invalid phone");
  if (!input.address || input.address.length > 300) throw new Error("Invalid address");
  if (input.note && input.note.length > 500) throw new Error("Invalid note");
  if (!input.items.length) throw new Error("Cart is empty");
}

async function resolveItems(items: CheckoutItem[]) {
  const ids = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const rows = items.map((item) => {
    const product = byId.get(item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    const qty = Math.max(1, Math.min(item.qty, 99));
    const lineTotalAzn = product.priceAzn * qty;
    return {
      productId: product.id,
      titleSnapshot: product.title,
      unitPriceAzn: product.priceAzn,
      qty,
      lineTotalAzn,
    };
  });

  const totalAzn = rows.reduce((sum, item) => sum + item.lineTotalAzn, 0);
  return { rows, totalAzn };
}

export function buildWhatsappUrl({ number, text }: { number: string; text: string }) {
  const cleanNumber = number.replace(/\D/g, "");
  const url = new URL(`https://wa.me/${cleanNumber}`);
  url.searchParams.set("text", text);
  return url.toString();
}

export async function checkoutWhatsApp(input: CheckoutInput) {
  validateCheckoutInput(input);
  const settings = await ensureStoreSettings();
  if (!settings.enableWhatsApp || !settings.whatsappNumber) {
    throw new Error("WhatsApp payment is disabled");
  }

  const { rows, totalAzn } = await resolveItems(input.items);

  const order = await prisma.order.create({
    data: {
      status: OrderStatus.PENDING_WHATSAPP,
      totalAzn,
      currency: "AZN",
      customerName: sanitizeText(input.fullName),
      phone: sanitizeText(input.phone),
      address: sanitizeText(input.address),
      note: input.note ? sanitizeText(input.note) : null,
      paymentMethod: PaymentMethod.WHATSAPP,
      items: { create: rows },
    },
    include: { items: true },
  });

  const itemsText = order.items.map((i) => `- ${sanitizeText(i.titleSnapshot)} x${i.qty}`).join("\n");
  const tpl = settings.whatsappTemplate || "Sifariş #{{orderId}}\n{{items}}\nCəmi: {{totalAzn}} AZN";
  const message = tpl
    .replaceAll("{{orderId}}", order.id)
    .replaceAll("{{customerName}}", order.customerName)
    .replaceAll("{{phone}}", order.phone)
    .replaceAll("{{address}}", order.address)
    .replaceAll("{{items}}", itemsText)
    .replaceAll("{{totalAzn}}", formatAznFromQepik(order.totalAzn));

  return { orderId: order.id, redirectUrl: buildWhatsappUrl({ number: settings.whatsappNumber, text: message }) };
}

export async function checkoutEpoint(input: CheckoutInput, baseUrl: string) {
  validateCheckoutInput(input);
  const settings = await ensureStoreSettings();
  if (!settings.enableEpoint || !isEpointConfigured(process.env)) {
    throw new Error("ePoint payment is disabled or misconfigured");
  }

  const { rows, totalAzn } = await resolveItems(input.items);

  const order = await prisma.order.create({
    data: {
      status: OrderStatus.PENDING_PAYMENT,
      totalAzn,
      currency: "AZN",
      customerName: sanitizeText(input.fullName),
      phone: sanitizeText(input.phone),
      address: sanitizeText(input.address),
      note: input.note ? sanitizeText(input.note) : null,
      paymentMethod: PaymentMethod.EPOINT,
      items: { create: rows },
    },
  });

  const callbackUrl = process.env.EPOINT_CALLBACK_URL || `${baseUrl}/api/epoint/callback`;
  const successUrl = process.env.EPOINT_SUCCESS_URL || `${baseUrl}/epoint/success`;
  const failUrl = process.env.EPOINT_FAIL_URL || `${baseUrl}/epoint/fail`;

  const redirect = buildEpointRedirect({
    orderId: order.id,
    amountQepik: order.totalAzn,
    description: `Order ${order.id}`,
    callbackUrl,
    successUrl,
    failUrl,
  });

  return { orderId: order.id, redirectUrl: redirect.url };
}

export async function getCheckoutPaymentOptions() {
  const settings = await ensureStoreSettings();
  return {
    whatsapp: settings.enableWhatsApp && Boolean(settings.whatsappNumber),
    epoint: settings.enableEpoint && isEpointConfigured(process.env),
  };
}
