"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Ana səhifə" },
  { href: "/products", label: "Məhsullar" },
  { href: "/cart", label: "Səbət" },
  { href: "/checkout", label: "Sifariş" },
  { href: "/admin/products", label: "Admin" },
];

export function MainNav() {
  const pathname = usePathname();
  return (
    <div className="main-links">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className={`main-link ${active ? "active" : ""}`}>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
