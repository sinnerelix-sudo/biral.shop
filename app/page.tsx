import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatAznFromQepik } from "@/lib/money";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Card, LinkButton } from "@/components/ui";

export default async function HomePage() {
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });

  if (products.length === 0) {
    return (
      <Card className="empty-state">
        <h1 className="section-title">Məhsullar</h1>
        <p className="muted">Hələ aktiv məhsul yoxdur.</p>
        <div style={{ marginTop: 12 }}><LinkButton href="/admin/products">Admin panelə keç</LinkButton></div>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="section-title">Məhsullar</h1>
      <div className="grid product-grid">
        {products.map((p) => (
          <Card key={p.id}>
            <div className="product-thumb" />
            <h3>{p.title}</h3>
            <p className="price">{formatAznFromQepik(p.priceAzn)} AZN</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link className="btn btn-secondary" href={`/product/${p.id}`}>Bax</Link>
              <AddToCartButton productId={p.id} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
