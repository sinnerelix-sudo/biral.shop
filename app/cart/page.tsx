"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, saveCart, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  return (
    <div className="card">
      <h1>Səbət</h1>
      {items.length === 0 ? <p>Səbət boşdur</p> : null}
      {items.map((item) => (
        <div key={item.productId}>
          <span>{item.productId}</span>
          <input
            type="number"
            min={1}
            value={item.qty}
            onChange={(e) => {
              const next = items.map((x) => (x.productId === item.productId ? { ...x, qty: Number(e.target.value) || 1 } : x));
              setItems(next);
              saveCart(next);
            }}
          />
          <button
            onClick={() => {
              const next = items.filter((x) => x.productId !== item.productId);
              setItems(next);
              saveCart(next);
            }}
          >
            Sil
          </button>
        </div>
      ))}
      <Link href="/checkout">Checkout</Link>
    </div>
  );
}
