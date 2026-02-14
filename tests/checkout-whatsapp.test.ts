import { checkoutWhatsApp } from "@/lib/checkout";

vi.mock("@/lib/prisma", () => {
  let createdOrder: any;
  return {
    prisma: {
      storeSettings: { findUnique: vi.fn().mockResolvedValue({ id: 1, enableWhatsApp: true, whatsappNumber: "994501112233", whatsappTemplate: "Sifariş {{orderId}} {{items}} {{totalAzn}}" }) },
      product: { findMany: vi.fn().mockResolvedValue([{ id: "p1", title: "Test", priceAzn: 2500, isActive: true }]) },
      order: {
        create: vi.fn().mockImplementation(({ data }: any) => {
          createdOrder = {
            id: "ord1",
            ...data,
            items: data.items.create,
          };
          return Promise.resolve(createdOrder);
        }),
      },
    },
  };
});

describe("whatsapp checkout", () => {
  it("creates pending whatsapp order and returns wa.me url", async () => {
    const result = await checkoutWhatsApp({
      fullName: "Ali Veli",
      phone: "0501234567",
      address: "Baku",
      items: [{ productId: "p1", qty: 2 }],
    });

    expect(result.orderId).toBe("ord1");
    expect(result.redirectUrl.startsWith("https://wa.me/994501112233")).toBe(true);
    expect(decodeURIComponent(result.redirectUrl)).toContain("ord1");
    expect(decodeURIComponent(result.redirectUrl)).toContain("50.00");
  });
});
