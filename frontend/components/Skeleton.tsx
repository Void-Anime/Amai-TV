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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/40 to-red-900/20 animate-pulse" />
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Logo with Glow Effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-red-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-32 h-32 bg-black rounded-full p-4 flex items-center justify-center">
              <Image
                unoptimized
                src="https://i.ibb.co/YBQ2N8w7/logo.png"
                alt="AMAI TV"
                width={96}
                height={96}
                className="object-contain opacity-90 animate-pulse"
              />
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-white tracking-wider">
              AMAI TV
            </h1>
            <p className="text-purple-300 text-sm font-medium">
              Loading your anime experience...
            </p>
          </div>

          {/* Loading Bar */}
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-red-500 rounded-full animate-pulse" 
                 style={{
                   animation: 'loading 2s ease-in-out infinite'
                 }} />
          </div>

          {/* Loading Dots */}
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


