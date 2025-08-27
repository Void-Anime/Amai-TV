"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createTitleUrl } from "@/lib/utils";

type AnimeCardProps = {
  url: string;
  title: string | null;
  image?: string | null;
  postId?: number;
  genres?: string[];
  rating?: number;
  year?: number;
  episodeCount?: number;
  isNew?: boolean;
  isPopular?: boolean;
};

export default function NewAnimeCard({
  url,
  title,
  image,
  postId,
  genres,
  rating,
  year,
  episodeCount,
  isNew = false,
  isPopular = false,
}: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate the new slug-based URL
  const titleUrl = title ? createTitleUrl(title, postId) : url;

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={titleUrl}
        className="block"
      >
        {/* Card Container */}
        <div className="relative overflow-hidden rounded-xl bg-black border border-white/10 transition-all duration-300 group-hover:border-white/25">
          {/* Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={title || "Anime"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isNew && (
                <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  NEW
                </span>
              )}
              {isPopular && (
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                  HOT
                </span>
              )}
            </div>

            {/* Rating */}
            {rating && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-white text-xs font-medium">{rating}</span>
              </div>
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <svg className="w-8 h-8 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            {/* Title */}
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-2">
              {title || "Untitled"}
            </h3>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              {year && <span>{year}</span>}
              {episodeCount && <span>{episodeCount} eps</span>}
            </div>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-black text-gray-200 text-xs rounded-full border border-white/15"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button className="w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/90 transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
