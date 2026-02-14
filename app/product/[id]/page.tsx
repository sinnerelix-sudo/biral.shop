import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatAznFromQepik } from "@/lib/money";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Card } from "@/components/ui";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || !product.isActive) return notFound();

  return (
    <div className="two-col" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
      <Card>
        <div className="product-thumb" style={{ height: 420 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,64px)", gap: 10, marginTop: 12 }}>
          <div className="product-thumb" style={{ margin: 0, height: 64 }} />
          <div className="product-thumb" style={{ margin: 0, height: 64 }} />
          <div className="product-thumb" style={{ margin: 0, height: 64 }} />
          <div className="product-thumb" style={{ margin: 0, height: 64 }} />
        </div>
      </Card>
      <Card>
        <h1 className="section-title" style={{ fontSize: 32 }}>{product.title}</h1>
        <p className="price" style={{ fontSize: 24 }}>{formatAznFromQepik(product.priceAzn)} AZN</p>
        <p className="muted" style={{ marginBottom: 16 }}>{product.description}</p>
        <AddToCartButton productId={product.id} />
      </Card>
    </div>
  );
}
