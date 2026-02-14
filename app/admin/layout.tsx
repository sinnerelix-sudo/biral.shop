import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div>
      <div className="nav">
        <Link href="/admin/products">Məhsullar</Link>
        <Link href="/admin/orders">Sifarişlər</Link>
        <Link href="/admin/settings">Parametrlər</Link>
      </div>
      {children}
    </div>
  );
}
