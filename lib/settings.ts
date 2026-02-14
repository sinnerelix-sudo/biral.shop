import { prisma } from "@/lib/prisma";

export async function ensureStoreSettings() {
  const existing = await prisma.storeSettings.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  return prisma.storeSettings.create({ data: { id: 1 } });
}
