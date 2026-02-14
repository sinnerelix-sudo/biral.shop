import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      enableWhatsApp: form.get("enableWhatsApp") === "on",
      enableEpoint: form.get("enableEpoint") === "on",
      whatsappNumber: String(form.get("whatsappNumber") || "").trim(),
      whatsappTemplate: String(form.get("whatsappTemplate") || "").trim(),
    },
    create: {
      id: 1,
      enableWhatsApp: form.get("enableWhatsApp") === "on",
      enableEpoint: form.get("enableEpoint") === "on",
      whatsappNumber: String(form.get("whatsappNumber") || "").trim(),
      whatsappTemplate: String(form.get("whatsappTemplate") || "").trim(),
    },
  });
  return NextResponse.redirect(new URL("/admin/settings", req.url));
}
