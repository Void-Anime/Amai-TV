"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { HomeIcon, MagnifyingGlassIcon, TvIcon, FilmIcon, SwatchIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";

type RoutePath = "/" | "/search" | "/series" | "/movies" | "/anime" | "/cartoon";
type Item = { label: string; href: RoutePath; icon: (active: boolean) => JSX.Element };

function HomeIconComponent(active: boolean) {
  return <HomeIcon className={(active ? "text-white" : "text-gray-400") + " h-5 w-5 transition-all duration-300"} />;
}

function SearchIconComponent(active: boolean) {
  return <MagnifyingGlassIcon className={(active ? "text-white" : "text-gray-400") + " h-5 w-5 transition-all duration-300"} />;
}

function SeriesIconComponent(active: boolean) {
  return <TvIcon className={(active ? "text-white" : "text-gray-400") + " h-5 w-5 transition-all duration-300"} />;
}

function MoviesIconComponent(active: boolean) {
  return <FilmIcon className={(active ? "text-white" : "text-gray-400") + " h-5 w-5 transition-all duration-300"} />;
}

function AnimeIconComponent(active: boolean) {
  return <SwatchIcon className={(active ? "text-white" : "text-gray-400") + " h-5 w-5 transition-all duration-300"} />;
}

function CartoonIconComponent(active: boolean) {
  return <Square3Stack3DIcon className={(active ? "text-white" : "text-gray-400") + " h-5 w-5 transition-all duration-300"} />;
}

export default function DesktopNav() {
  const pathname = usePathname();
  const items: Item[] = useMemo(() => ([
    { label: "HOME", href: "/", icon: HomeIconComponent },
    { label: "SEARCH", href: "/search", icon: SearchIconComponent },
    { label: "SERIES", href: "/series", icon: SeriesIconComponent },
    { label: "MOVIES", href: "/movies", icon: MoviesIconComponent },
    { label: "ANIME", href: "/anime", icon: AnimeIconComponent },
    { label: "CARTOON", href: "/cartoon", icon: CartoonIconComponent },
  ]), []);

  return (
         <nav className="hidden md:block fixed bottom-0 inset-x-0 z-50 bg-black/80 backdrop-blur-sm border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex justify-center space-x-16 py-3">
          {items.map((it) => {
            const active = pathname === it.href || (it.href !== "/" && pathname?.startsWith(it.href));
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className="flex flex-col items-center gap-1 py-1 px-2 rounded transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  aria-current={active ? "page" : undefined}
                >
                  {/* Active indicator dot */}
                  {active && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full mb-1 animate-pulse" />
                  )}
                  
                  {/* Icon */}
                  <div className="transition-transform duration-300 hover:scale-110">
                    {it.icon(active)}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-semibold tracking-wide transition-all duration-300 ${active ? "text-white" : "text-gray-400"}`}>
                    {it.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
