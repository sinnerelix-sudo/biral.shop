import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");
  const where = idsParam ? { id: { in: idsParam.split(",").filter(Boolean) } } : { isActive: true };
  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}
