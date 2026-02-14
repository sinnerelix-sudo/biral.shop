import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyEpointCallback } from "@/lib/epoint";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  const result = verifyEpointCallback(data);
  if (!result.ok || !result.orderId) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: result.orderId },
    data: { status: result.paid ? OrderStatus.PAID : OrderStatus.PAYMENT_FAILED },
  });

  return NextResponse.json({ ok: true });
}
