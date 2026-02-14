import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD || "";
  const got = String(password || "");

  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  const matches = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!matches) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await setAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
