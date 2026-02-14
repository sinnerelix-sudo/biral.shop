"use client";

import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <form
      className="card"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const res = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password: fd.get("password") }) });
        if (res.ok) router.push("/admin/products");
        else alert("Yanlış şifrə");
      }}
    >
      <h1>Admin Giriş</h1>
      <input name="password" type="password" placeholder="Şifrə" required />
      <button type="submit">Giriş et</button>
    </form>
  );
}
