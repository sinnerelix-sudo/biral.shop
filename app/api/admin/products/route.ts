import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  await prisma.product.create({
    data: {
      title: String(form.get("title") || ""),
      description: String(form.get("description") || ""),
      priceAzn: Math.round(Number(form.get("priceAzn") || 0) * 100),
      imageUrl: String(form.get("imageUrl") || "") || null,
      isActive: true,
    },
  });
  return NextResponse.redirect(new URL("/admin/products", req.url));
}
