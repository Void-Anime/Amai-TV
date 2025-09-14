"use client";

import Link from "next/link";
import { createTitleUrl } from "@/lib/utils";
import { useRef, useState, useEffect } from 'react';

type SeasonItem = { 
  season: number | string; 
  label: string; 
  nonRegional: boolean; 
  regionalLanguageInfo?: { 
    isNonRegional: boolean; 
    isSubbed: boolean; 
    isDubbed: boolean; 
    languageType: 'dubbed' | 'subbed' | 'unknown' 
  } 
};

export default function SeasonSelector({
  seasons,
  selected,
  seriesUrl,
  postId,
}: {
  seasons: SeasonItem[];
  selected?: number;
  seriesUrl: string;
  postId?: number;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  
  // Extract title from URL to generate slug
  const title = decodeURIComponent(seriesUrl.split('/').filter(Boolean).pop() || '');
  
  // Check if we need scroll arrow
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollArrow(scrollWidth > clientWidth);
      }
    };
    
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [seasons]);
  
  // Scroll function
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  // Determine if season is dubbed or subbed based on regional language info
  const getSeasonType = (season: SeasonItem) => {
    // Use the enhanced regional language info if available
    if (season.regionalLanguageInfo) {
      return season.regionalLanguageInfo.languageType;
    }
    
    // Fallback to label parsing
    const lowerLabel = season.label.toLowerCase();
    if (lowerLabel.includes('dub') || lowerLabel.includes('dubbed')) {
      return 'dubbed';
    } else if (lowerLabel.includes('sub') || lowerLabel.includes('subbed')) {
      return 'subbed';
    }
    
    // Check nonRegional flag as additional indicator
    if (season.nonRegional) {
      return 'subbed';
    }
    
    return null;
  };
  
  return (
    <div className="relative">
      <div 
        ref={scrollContainerRef}
        className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide" 
        role="tablist" 
        aria-label="Seasons"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {seasons.map((s) => {
          const href = createTitleUrl(title, postId, Number(s.season));
          const isActive = selected === Number(s.season);
          const seasonType = getSeasonType(s);
          
          return (
            <a
              key={String(s.season)}
              href={href}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all duration-300 font-medium text-xs flex-shrink-0 w-auto relative ${
                isActive 
                  ? 'bg-purple-500 text-white font-bold border-none shadow-md' 
                  : 'bg-gray-800 text-gray-200 border border-gray-600 hover:bg-purple-600 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                {s.label}
                {seasonType === 'dubbed' && (
                  <span className="px-1.5 py-0.5 bg-green-600/30 text-green-400 text-xs rounded font-semibold">
                    Dub
                  </span>
                )}
                {seasonType === 'subbed' && (
                  <span className="px-1.5 py-0.5 bg-blue-600/30 text-blue-400 text-xs rounded font-semibold">
                    Sub
                  </span>
                )}
              </span>
            </a>
          );
        })}
      </div>
      
      {/* Scroll Arrow */}
      {showScrollArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-purple-600 text-white p-2 rounded-lg transition-all duration-300 shadow-lg border border-gray-600"
          aria-label="Scroll to see more seasons"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}


