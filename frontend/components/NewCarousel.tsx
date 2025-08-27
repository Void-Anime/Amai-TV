"use client";
import { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type CarouselProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showViewAll?: boolean;
  viewAllHref?: string;
  autoplay?: boolean;
  autoplayIntervalMs?: number;
  loop?: boolean;
};

export default function NewCarousel({
  title,
  subtitle,
  children,
  showViewAll = false,
  viewAllHref,
  autoplay = false,
  autoplayIntervalMs = 2500,
  loop = false,
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollStep, setScrollStep] = useState<number>(380);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      try {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      } catch (error) {
        console.error('Error checking scroll position:', error);
      }
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      try {
        const scrollAmount = scrollStep || 400;
        const newScrollLeft =
          scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
        
        scrollContainerRef.current.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      } catch (error) {
        console.error('Error scrolling:', error);
      }
    }
  };

  const handleScroll = () => {
    checkScrollPosition();
  };

  // Measure child width to scroll by one card
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const measure = () => {
      try {
        const first = el.firstElementChild as HTMLElement | null;
        if (first) {
          // Include the gap ~16px (gap-4)
          const gapPx = 16;
          const w = first.getBoundingClientRect().width + gapPx;
          if (w > 0) setScrollStep(w);
        }
      } catch {}
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children]);

  // Check scroll position on mount and when children change
  useEffect(() => {
    checkScrollPosition();
  }, [children]);

  // Continuous autoplay (smooth sliding). Pauses on hover.
  useEffect(() => {
    if (!autoplay) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    let rafId = 0;
    const speedPxPerFrame = 0.8; // smooth slow slide

    const tick = () => {
      try {
        if (!isHovered) {
          const { scrollLeft, scrollWidth, clientWidth } = el;
          const nearEnd = scrollLeft >= scrollWidth - clientWidth - 1;
          if (nearEnd) {
            if (loop) {
              el.scrollTo({ left: 0 });
            }
          } else {
            el.scrollLeft = scrollLeft + speedPxPerFrame;
          }
        }
      } catch {}
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [autoplay, loop, isHovered]);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        </div>
        {showViewAll && viewAllHref && (
          <a
            href={viewAllHref}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
          >
            View All →
          </a>
        )}
      </div>

      {/* Carousel Container */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>

        {/* Navigation Arrows */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 ${
              canScrollLeft
                ? "hover:bg-black/90 hover:scale-110 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </div>

        <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 ${
              canScrollRight
                ? "hover:bg-black/90 hover:scale-110 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Indicators */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-1">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
