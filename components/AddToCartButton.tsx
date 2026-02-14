"use client";

import { addToCart } from "@/lib/cart";
import { Button } from "@/components/ui";

export function AddToCartButton({ productId }: { productId: string }) {
  return (
    <Button
      type="button"
      onClick={() => {
        addToCart(productId, 1);
        alert("Səbətə əlavə olundu");
      }}
    >
      Səbətə at
    </Button>
  );
}
