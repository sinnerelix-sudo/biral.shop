import { NextResponse } from "next/server";
import { checkoutWhatsApp } from "@/lib/checkout";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await checkoutWhatsApp(data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
