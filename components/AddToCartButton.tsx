"use client";

import { addToCart } from "@/lib/cart";

export function AddToCartButton({ productId }: { productId: string }) {
  return (
    <button
      onClick={() => {
        addToCart(productId, 1);
        alert("Səbətə əlavə olundu");
      }}
    >
      Səbətə at
    </button>
  );
}
