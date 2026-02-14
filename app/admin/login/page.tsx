"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Input, Label } from "@/components/ui";

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <form
        className="card"
        style={{ width: "min(100%, 460px)" }}
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const res = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password: fd.get("password") }) });
          if (res.ok) router.push("/admin/products");
          else alert("Yanlış şifrə");
        }}
      >
        <h1 className="section-title" style={{ fontSize: 28 }}>Admin Giriş</h1>
        <div className="form-row">
          <Label htmlFor="password">Şifrə</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" style={{ width: "100%" }}>Giriş et</Button>
      </form>
    </div>
  );
}
