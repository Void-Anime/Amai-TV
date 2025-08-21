import Image from "next/image";

export function CardSkeleton() {
  return (
    <div className="space-y-2">
      <div className="skeleton aspect-[2/3] w-full" />
      <div className="skeleton h-3 w-3/4" />
    </div>
  );
}

export function ScreenSkeleton() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-28 h-28">
          <Image
            unoptimized
            src="https://i.ibb.co/YBQ2N8w7/logo.png"
            alt="AMAI TV"
            fill
            sizes="112px"
            className="object-contain opacity-90"
          />
        </div>
        <div className="skeleton h-2 w-40" />
        <div className="skeleton h-2 w-24" />
      </div>
    </div>
  );
}


