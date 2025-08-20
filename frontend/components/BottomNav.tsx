"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

type RoutePath = "/" | "/search";
type Item = { label: string; href: RoutePath; icon: (active: boolean) => JSX.Element };

function HomeIcon(active: boolean) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className={active ? "scale-110 text-primary transition-transform" : "text-text-dim"}>
      <path fill="currentColor" d="M12 3l9 7-1.2 1.6L19 10.6V20a1 1 0 0 1-1 1h-5v-6H11v6H6a1 1 0 0 1-1-1v-9.4L4.2 11.6 3 10l9-7z"/>
    </svg>
  );
}

function MoreIcon(active: boolean) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className={active ? "scale-110 text-primary transition-transform" : "text-text-dim"}>
      <circle cx="5" cy="12" r="2" fill="currentColor"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <circle cx="19" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const items: Item[] = useMemo(() => ([
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "More", href: "/search", icon: MoreIcon },
  ]), []);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-stroke bg-bg-900/90 backdrop-blur">
      <ul className="grid grid-cols-2 px-4 py-2">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/" && pathname?.startsWith(it.href));
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className="w-full flex flex-col items-center gap-1 py-1 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                aria-current={active ? "page" : undefined}
              >
                {it.icon(active)}
                <span className={active ? "text-text-high" : "text-text-dim"}>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


