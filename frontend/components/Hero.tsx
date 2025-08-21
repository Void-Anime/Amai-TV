import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-stroke bg-[radial-gradient(ellipse_at_top,rgba(229,72,77,0.25),transparent_60%)]">
      <div className="px-6 py-10 md:py-14">
        <h1 className="text-2xl md:text-3xl font-semibold text-text-high">Dive into AMAI TV</h1>
        <p className="mt-2 text-text-dim max-w-xl">Stream trending anime with a crisp, mobile-first UI, smooth playback, and personalized lists.</p>
        <div className="mt-4">
          <a href="#trending" className="btn btn-primary">Start Watching</a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-900/80 to-transparent" />
      <div className="absolute -right-10 -top-10 opacity-30">
        <Image unoptimized src="https://i.ibb.co/YBQ2N8w7/logo.png" alt="" width={200} height={200} />
      </div>
    </section>
  );
}


