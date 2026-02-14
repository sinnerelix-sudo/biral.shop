"use client";

import { FormEvent, useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

type PaymentOpts = { whatsapp: boolean; epoint: boolean };

export default function CheckoutPage() {
  const [options, setOptions] = useState<PaymentOpts>({ whatsapp: false, epoint: false });

  useEffect(() => {
    fetch("/api/checkout/options").then((r) => r.json()).then(setOptions);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>, endpoint: string) {
    e.preventDefault();
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
      alert(data.error || "Xəta");
      return;
    }
    window.location.href = data.redirectUrl;
  }

  return (
    <form className="card">
      <h1>Sifariş</h1>
      <input name="fullName" placeholder="Ad Soyad" required />
      <input name="phone" placeholder="Telefon" required />
      <textarea name="address" placeholder="Ünvan" required />
      <textarea name="note" placeholder="Qeyd" />
      {options.whatsapp ? <button onClick={(e) => void submit(e as any, "/api/checkout/whatsapp")}>WhatsApp ilə sifariş</button> : null}
      {options.epoint ? <button onClick={(e) => void submit(e as any, "/api/checkout/epoint")}>Kartla ödəniş (ePoint)</button> : null}
      {!options.whatsapp && !options.epoint ? <p>Hazırda ödəniş üsulu mövcud deyil.</p> : null}
    </form>
  );
}
