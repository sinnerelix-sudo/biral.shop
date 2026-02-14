import crypto from "node:crypto";

export type EpointEnv = {
  EPOINT_MERCHANT_ID?: string;
  EPOINT_SECRET?: string;
  EPOINT_CALLBACK_URL?: string;
  EPOINT_SUCCESS_URL?: string;
  EPOINT_FAIL_URL?: string;
  APP_URL?: string;
};

export function isEpointConfigured(env: EpointEnv = process.env): boolean {
  return Boolean(env.EPOINT_MERCHANT_ID && env.EPOINT_SECRET);
}

export function buildEpointRedirect({
  orderId,
  amountQepik,
  description,
  successUrl,
  failUrl,
  callbackUrl,
  env = process.env,
}: {
  orderId: string;
  amountQepik: number;
  description: string;
  successUrl: string;
  failUrl: string;
  callbackUrl: string;
  env?: EpointEnv;
}) {
  if (!isEpointConfigured(env)) {
    throw new Error("ePoint is not configured");
  }

  const payload = `${env.EPOINT_MERCHANT_ID}|${orderId}|${amountQepik}|${callbackUrl}`;
  const signature = crypto.createHmac("sha256", env.EPOINT_SECRET as string).update(payload).digest("hex");
  const url = new URL("https://epoint.example/hosted-payment");
  url.searchParams.set("merchant", env.EPOINT_MERCHANT_ID as string);
  url.searchParams.set("order_id", orderId);
  url.searchParams.set("amount", String(amountQepik));
  url.searchParams.set("description", description);
  url.searchParams.set("success_url", successUrl);
  url.searchParams.set("fail_url", failUrl);
  url.searchParams.set("callback_url", callbackUrl);
  url.searchParams.set("sig", signature);

  return { url: url.toString(), method: "GET" as const };
}

export function verifyEpointCallback(payload: Record<string, string | undefined>, env: EpointEnv = process.env) {
  if (!isEpointConfigured(env)) {
    return { ok: false, reason: "epoint_not_configured" };
  }

  const orderId = payload.order_id;
  const amount = payload.amount;
  const status = payload.status;
  const sig = payload.sig;

  if (!orderId || !amount || !status || !sig) {
    return { ok: false, reason: "missing_fields" };
  }

  const canonical = `${env.EPOINT_MERCHANT_ID}|${orderId}|${amount}|${status}`;
  const expected = crypto.createHmac("sha256", env.EPOINT_SECRET as string).update(canonical).digest("hex");
  if (expected !== sig) return { ok: false, reason: "invalid_signature" };

  return { ok: true, orderId, paid: status === "success" };
}
