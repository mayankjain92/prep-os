import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-neutral-200 flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-2 border-transparent border-t-sky-500 border-r-cyan-400 animate-spin" />
        <div className="absolute flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Loading"
            width={28}
            height={28}
            priority
            className="h-7 w-7 object-contain animate-pulse drop-shadow-[0_0_10px_rgba(0,212,255,0.7)]"
          />
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
        Loading PrepOS...
      </p>
    </div>
  );
}
