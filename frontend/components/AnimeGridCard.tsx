"use client";
import Image from 'next/image'
import AnimeLink from '@/components/AnimeLink'
import { useMyList } from '@/components/useMyList'
import { useState } from 'react'

type Props = {
  url: string
  title: string | null
  image?: string | null
  postId?: number
}

export default function AnimeGridCard({ url, title, image, postId }: Props) {
  const { has, toggle } = useMyList();
  const [busy, setBusy] = useState(false);
  const inList = has(url);
  return (
    <AnimeLink seriesUrl={url} postId={postId} className="group relative block rounded-2xl overflow-hidden bg-surface border border-stroke shadow-sm hover:shadow-lg hover:shadow-primary/20 transition">
      <div className="relative aspect-[2/3]">
        {image ? (
          <Image
            unoptimized
            src={image.startsWith('data:') ? image : `/api/image?src=${encodeURIComponent(image)}`}
            alt={title || 'Anime'}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-text-dim">No Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-900/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between gap-2">
          <div>
            <div className="text-sm font-medium line-clamp-2">{title || 'Untitled'}</div>
            <div className="mt-1 text-[11px] text-text-dim">Tap to view details</div>
          </div>
          <button
            disabled={busy}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBusy(true); toggle({ url, title, image, postId }); setTimeout(() => setBusy(false), 150); }}
            className={`rounded-full border px-2 py-1 text-[11px] ${inList ? 'border-primary bg-primary/20' : 'border-stroke bg-bg-900/70'}`}
          >{inList ? 'In List' : 'Add'}</button>
        </div>
      </div>
      <div className="p-3">
        <div className="text-[13px] font-medium line-clamp-2">{title || 'Untitled'}</div>
      </div>
    </AnimeLink>
  )
}


