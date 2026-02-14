import "./globals.css";
import { IconButton } from "@/components/ui";
import { MainNav } from "@/components/layout/MainNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body>
        <header className="top-shell">
          <div className="container">
            <div className="topbar">
              <div className="brand">
                <span className="brand-dot" />
                <span>biral.shop</span>
              </div>
              <input className="search" aria-label="Axtar" placeholder="Məhsul axtar..." />
              <div className="icon-group">
                <IconButton type="button" aria-label="Bildirişlər">◻</IconButton>
                <IconButton type="button" aria-label="Seçilmişlər">◻</IconButton>
                <IconButton type="button" aria-label="Profil">◻</IconButton>
              </div>
            </div>
            <MainNav />
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
