import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  await prisma.order.update({
    where: { id: String(form.get("orderId")) },
    data: { status: String(form.get("status")) as OrderStatus },
  });
  return NextResponse.redirect(new URL("/admin/orders", req.url));
}
