import { NextResponse } from "next/server";
import { getCheckoutPaymentOptions } from "@/lib/checkout";

export async function GET() {
  return NextResponse.json(await getCheckoutPaymentOptions());
}
