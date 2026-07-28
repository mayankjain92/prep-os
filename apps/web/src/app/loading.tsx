/* eslint-disable @next/next/no-img-element */
"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md text-foreground transition-all duration-300">
      <div className="relative flex flex-col items-center gap-6 p-8">
        {/* Glowing Background Glow Aura */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-xblue/30 via-cyan-400/20 to-blue-600/30 blur-2xl opacity-60 animate-pulse" />

        {/* Logo Emblem Orbit Container */}
        <div className="relative flex items-center justify-center">
          {/* Animated Spinning Gradient Ring */}
          <div className="h-20 w-20 rounded-full border-2 border-transparent border-t-xblue border-r-cyan-400 animate-spin" />
          
          {/* Reverse Pulsing Secondary Ring */}
          <div className="absolute h-16 w-16 rounded-full border-2 border-transparent border-b-cyan-500 border-l-blue-600 animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />

          {/* Centered PrepOS Emblem Cutout */}
          <div className="absolute flex items-center justify-center p-2">
            <img
              src="/logo.svg"
              alt="Loading PrepOS"
              className="h-9 w-9 object-contain animate-pulse drop-shadow-[0_0_12px_rgba(0,212,255,0.8)]"
            />
          </div>
        </div>

        {/* Animated Brand Typography */}
        <div className="flex flex-col items-center gap-1.5 z-10 text-center">
          <div className="text-xl font-black tracking-tight text-foreground flex items-center gap-1">
            Prep<span className="bg-gradient-to-r from-xblue to-cyan-400 bg-clip-text text-transparent">OS</span>
          </div>
          <p className="text-xs font-semibold text-muted-foreground animate-pulse">
            Synchronizing preparation modules...
          </p>
        </div>

        {/* Shimmer Progress Bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden relative mt-2">
          <div className="h-full w-1/2 bg-gradient-to-r from-xblue via-cyan-400 to-blue-500 rounded-full animate-[shimmer_1.5s_infinite] shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
        </div>
      </div>
    </div>
  );
}
