import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatAznFromQepik } from "@/lib/money";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function HomePage() {
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1>Məhsullar</h1>
      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.title}</h3>
            <p>{formatAznFromQepik(p.priceAzn)} AZN</p>
            <Link href={`/product/${p.id}`}>Bax</Link>
            <AddToCartButton productId={p.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
