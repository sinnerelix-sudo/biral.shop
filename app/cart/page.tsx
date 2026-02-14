"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCart, saveCart, type CartItem } from "@/lib/cart";
import { formatAznFromQepik } from "@/lib/money";
import { Button, Card } from "@/components/ui";

type ProductLite = { id: string; title: string; priceAzn: number };

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, ProductLite>>({});

  useEffect(() => {
    const cart = getCart();
    setItems(cart);
    const ids = cart.map((x) => x.productId).join(",");
    if (!ids) return;
    fetch(`/api/products?ids=${ids}`)
      .then((r) => r.json())
      .then((list: ProductLite[]) => {
        setProducts(Object.fromEntries(list.map((p) => [p.id, p])));
      });
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + ((products[item.productId]?.priceAzn ?? 0) * item.qty), 0),
    [items, products],
  );

  return (
    <div>
      <h1 className="section-title">Səbət</h1>
      <div className="two-col">
        <Card>
          {items.length === 0 ? <p className="muted">Səbət boşdur</p> : null}
          {items.map((item) => {
            const product = products[item.productId];
            return (
              <div key={item.productId} className="card" style={{ marginBottom: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <strong>{product?.title ?? item.productId}</strong>
                    <p className="muted">{product ? `${formatAznFromQepik(product.priceAzn)} AZN` : ""}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      className="input"
                      style={{ width: 84 }}
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => {
                        const next = items.map((x) => (x.productId === item.productId ? { ...x, qty: Number(e.target.value) || 1 } : x));
                        setItems(next);
                        saveCart(next);
                      }}
                    />
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => {
                        const next = items.filter((x) => x.productId !== item.productId);
                        setItems(next);
                        saveCart(next);
                      }}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
        <Card>
          <h3>Sifariş xülasəsi</h3>
          <p className="muted">Ara cəm</p>
          <p className="price">{formatAznFromQepik(subtotal)} AZN</p>
          <p className="muted">Çatdırılma: 0.00 AZN</p>
          <hr className="divider" />
          <p><strong>Cəmi: {formatAznFromQepik(subtotal)} AZN</strong></p>
          <Link href="/checkout" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>Checkout</Link>
        </Card>
      </div>
    </div>
  );
}
