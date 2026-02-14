import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="card">
      <h1>Admin Sifarişlər</h1>
      {orders.map((o) => (
        <div key={o.id} style={{ borderTop: "1px solid #ddd", marginTop: 10 }}>
          <p>#{o.id} — {o.status}</p>
          <p>{o.customerName} / {o.phone}</p>
          <form action="/api/admin/orders" method="post">
            <input type="hidden" name="orderId" value={o.id} />
            <select name="status" defaultValue={o.status}>
              <option value="PENDING_WHATSAPP">PENDING_WHATSAPP</option>
              <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
              <option value="PAID">PAID</option>
              <option value="PAYMENT_FAILED">PAYMENT_FAILED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="PROCESSING">PROCESSING</option>
            </select>
            <button type="submit">Yenilə</button>
          </form>
        </div>
      ))}
    </div>
  );
}
