"use client";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";

type Props = {
  seriesUrl: string;
  postId?: number;
  className?: string;
  children: React.ReactNode;
};

export default function AnimeLink({ seriesUrl, postId, className, children }: Props) {
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let finalPostId = postId;
    if (!finalPostId || !Number.isFinite(finalPostId)) {
      try {
        const base = getApiBaseUrl();
        const res = await fetch(`${base}/api/anime_details?url=${encodeURIComponent(seriesUrl)}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.postId === "number" && Number.isFinite(data.postId)) {
            finalPostId = data.postId;
          }
        }
      } catch {}
    }
    // If it's a movie page (/movies/), don't append season
    const isMovie = /\/movies\//i.test(seriesUrl);
    const qs = new URLSearchParams({ url: seriesUrl });
    if (!isMovie) qs.set("season", "1");
    if (finalPostId) qs.set("post_id", String(finalPostId));
    router.push(`/title?${qs.toString()}`);
  };

  return (
    <a href={`/title?url=${encodeURIComponent(seriesUrl)}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}


