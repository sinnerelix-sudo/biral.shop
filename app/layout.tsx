import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body>
        <div className="container">
          <nav className="nav">
            <Link href="/">Ana səhifə</Link>
            <Link href="/cart">Səbət</Link>
            <Link href="/checkout">Sifariş</Link>
            <Link href="/admin/products">Admin</Link>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
