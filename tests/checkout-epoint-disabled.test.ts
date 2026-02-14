import { checkoutEpoint } from "@/lib/checkout";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    storeSettings: { findUnique: vi.fn().mockResolvedValue({ id: 1, enableEpoint: true, enableWhatsApp: true, whatsappNumber: "994" }) },
    product: { findMany: vi.fn().mockResolvedValue([{ id: "p1", title: "A", priceAzn: 1000, isActive: true }]) },
    order: { create: vi.fn() },
  },
}));

describe("epoint disabled", () => {
  it("throws clear error when env credentials missing", async () => {
    delete process.env.EPOINT_MERCHANT_ID;
    delete process.env.EPOINT_SECRET;

    await expect(
      checkoutEpoint(
        { fullName: "a", phone: "b", address: "c", items: [{ productId: "p1", qty: 1 }] },
        "http://localhost:3000",
      ),
    ).rejects.toThrow("ePoint payment is disabled or misconfigured");
  });
});
