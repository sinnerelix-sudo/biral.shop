import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatAznFromQepik } from "@/lib/money";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || !product.isActive) return notFound();

  return (
    <div className="card">
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>{formatAznFromQepik(product.priceAzn)} AZN</p>
      <AddToCartButton productId={product.id} />
    </div>
  );
}
