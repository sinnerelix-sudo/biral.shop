"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getCart } from "@/lib/cart";
import { formatAznFromQepik } from "@/lib/money";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

type PaymentOpts = { whatsapp: boolean; epoint: boolean };
type ProductLite = { id: string; title: string; priceAzn: number };

export default function CheckoutPage() {
  const [options, setOptions] = useState<PaymentOpts>({ whatsapp: false, epoint: false });
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    fetch("/api/checkout/options").then((r) => r.json()).then(setOptions);
    const items = getCart();
    const ids = items.map((i) => i.productId).join(",");
    if (!ids) return;
    fetch(`/api/products?ids=${ids}`).then((r) => r.json()).then((products: ProductLite[]) => {
      const byId = Object.fromEntries(products.map((p) => [p.id, p]));
      const total = items.reduce((sum, item) => sum + ((byId[item.productId]?.priceAzn ?? 0) * item.qty), 0);
      setCartTotal(total);
    });
  }, []);

  const hasPayment = useMemo(() => options.whatsapp || options.epoint, [options]);

  async function submit(e: FormEvent<HTMLFormElement>, endpoint: string) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") || ""),
      phone: String(fd.get("phone") || ""),
      address: String(fd.get("address") || ""),
      note: String(fd.get("note") || ""),
      items: getCart(),
    };
    const res = await fetch(endpoint, { method: "POST", body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Xəta");
      return;
    }
    window.location.href = data.redirectUrl;
  }

  return (
    <div>
      <h1 className="section-title">Sifariş</h1>
      <div className="two-col">
        <form className="card">
          <div className="form-row"><Label htmlFor="fullName">Ad Soyad</Label><Input id="fullName" name="fullName" required /></div>
          <div className="form-row"><Label htmlFor="phone">Telefon</Label><Input id="phone" name="phone" required /></div>
          <div className="form-row"><Label htmlFor="address">Ünvan</Label><Textarea id="address" name="address" required /></div>
          <div className="form-row"><Label htmlFor="note">Qeyd (opsional)</Label><Textarea id="note" name="note" /></div>
          {error ? <p style={{ color: "#b42318" }}>{error}</p> : null}

          <div className="card" style={{ padding: 12, marginBottom: 10 }}>
            <strong>Ödəniş metodu</strong>
            <p className="muted">Uyğun olan metodu seçin.</p>
            {options.whatsapp ? <Button type="button" onClick={(e) => void submit(e as any, "/api/checkout/whatsapp")} style={{ width: "100%", marginBottom: 8 }}>WhatsApp ilə sifariş</Button> : null}
            {options.epoint ? <Button type="button" variant="secondary" onClick={(e) => void submit(e as any, "/api/checkout/epoint")} style={{ width: "100%" }}>Kartla ödəniş (ePoint)</Button> : null}
            {!hasPayment ? <p className="muted">Hazırda ödəniş üsulu mövcud deyil.</p> : null}
          </div>
        </form>

        <Card>
          <h3>Sifariş xülasəsi</h3>
          <p className="muted">Ara cəm</p>
          <p className="price">{formatAznFromQepik(cartTotal)} AZN</p>
          <p className="muted">Çatdırılma: 0.00 AZN</p>
          <hr className="divider" />
          <p><strong>Cəmi: {formatAznFromQepik(cartTotal)} AZN</strong></p>
        </Card>
      </div>
    </div>
  );
}
