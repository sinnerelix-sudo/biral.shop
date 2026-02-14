import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-layout">
      <aside className="card admin-nav">
        <Link href="/admin/products" className="main-link">Məhsullar</Link>
        <Link href="/admin/orders" className="main-link">Sifarişlər</Link>
        <Link href="/admin/settings" className="main-link">Parametrlər</Link>
      </aside>
      <div>{children}</div>
    </div>
  );
}
