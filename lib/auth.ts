import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_SEC = 60 * 60 * 8;

type SessionPayload = { exp: number; iat: number; role: "admin" };

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-insecure-secret";
}

function sign(data: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(data).digest("hex");
}

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function createSessionToken(now = Math.floor(Date.now() / 1000)): string {
  const payload: SessionPayload = { iat: now, exp: now + SESSION_TTL_SEC, role: "admin" };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined, now = Math.floor(Date.now() / 1000)): boolean {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expectedSig = sign(body);
  if (!safeEq(sig, expectedSig)) return false;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    return payload.role === "admin" && payload.exp > now;
  } catch {
    return false;
  }
}

export async function setAdminSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export { COOKIE_NAME };
