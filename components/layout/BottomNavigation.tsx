"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, BookOpen, Compass } from "lucide-react";

const tabs = [
  {
    href: "/",
    label: "Explorer",
    icon: Compass,
    match: (path: string) =>
      path === "/" || path.startsWith("/guidance") || path.startsWith("/semantic-search"),
  },
  {
    href: "/surahs",
    label: "Coran",
    icon: BookOpen,
    match: (path: string) => path.startsWith("/surahs") || path.startsWith("/ayah"),
  },
  {
    href: "/favorites",
    label: "Favoris",
    icon: Bookmark,
    match: (path: string) => path.startsWith("/favorites"),
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`bottom-nav-link ${active ? "is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon aria-hidden="true" fill={active && tab.label === "Favoris" ? "currentColor" : "none"} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
