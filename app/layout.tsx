import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuranLens",
  description: "Recherche et consultation du Coran par le sens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <header className="topbar">
          <Link href="/" className="brand-link" aria-label="QuranLens">
            <Image src="/brand/logo-mark.svg" alt="" width={34} height={34} priority />
            <span>
              Quran<span>Lens</span>
            </span>
          </Link>
          <nav className="topbar-links" aria-label="Navigation secondaire">
            <Link href="/">Explorer</Link>
            <Link href="/search">Recherche textuelle</Link>
            <Link href="/surahs">Coran</Link>
          </nav>
        </header>
        <main>{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}
