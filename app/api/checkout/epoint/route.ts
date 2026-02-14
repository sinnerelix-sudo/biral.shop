import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { checkoutEpoint } from "@/lib/checkout";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const h = await headers();
    const host = h.get("host") || "localhost:3000";
    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
    const result = await checkoutEpoint(data, `${proto}://${host}`);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
