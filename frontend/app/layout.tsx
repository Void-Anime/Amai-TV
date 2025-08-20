import './globals.css'
import type { Metadata } from 'next'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'AMAI TV',
  description: 'A modern TypeScript anime streaming UI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="min-h-dvh flex flex-col">
          <header className="sticky top-0 z-40 bg-bg-900/80 backdrop-blur border-b border-stroke">
            <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center gap-3">
              <div className="text-lg md:text-xl font-semibold text-text-high">AMAI TV</div>
              <div className="flex-1 flex justify-center">
                <form action="/search" className="w-full max-w-xl relative">
                  <input name="q" placeholder="Search anime..." className="w-full rounded-md bg-bg-800 border border-stroke px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-primary" />
                  <button className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-primary px-3 py-1">Go</button>
                </form>
              </div>
              <nav className="hidden md:flex gap-4 text-sm text-text-dim">
                <a href="#trending" className="hover:text-text-high">Trending</a>
                <a href="#latest" className="hover:text-text-high">Latest</a>
                <a href="#popular" className="hover:text-text-high">Popular</a>
                <a href="#genres" className="hover:text-text-high">Genres</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <BottomNav />
          <footer className="border-t border-stroke py-6 text-center text-xs text-text-dim">© {new Date().getFullYear()} AMAI TV</footer>
        </div>
      </body>
    </html>
  )
}


