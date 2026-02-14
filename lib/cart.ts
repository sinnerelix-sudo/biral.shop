export type CartItem = { productId: string; qty: number };
const KEY = "cart_items";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return parsed.filter((i) => i.productId && i.qty > 0);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(productId: string, qty: number) {
  const cart = getCart();
  const found = cart.find((item) => item.productId === productId);
  if (found) found.qty += qty;
  else cart.push({ productId, qty });
  saveCart(cart);
}
