import { prisma } from "@/lib/prisma";
import { formatAznFromQepik } from "@/lib/money";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="card">
      <h1>Admin Məhsullar</h1>
      <form action="/api/admin/products" method="post">
        <input name="title" placeholder="Başlıq" required />
        <textarea name="description" placeholder="Təsvir" required />
        <input name="priceAzn" placeholder="Qiymət (AZN)" required />
        <input name="imageUrl" placeholder="Şəkil URL" />
        <button type="submit">Əlavə et</button>
      </form>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.title} — {formatAznFromQepik(p.priceAzn)} AZN ({p.isActive ? "active" : "passive"})</li>
        ))}
      </ul>
    </div>
  );
}
