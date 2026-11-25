"use client";

import { motion } from "framer-motion";

export function AnimatedProgressBar({
  pct,
  color = "bg-[#6366F1]",
  className = "h-1.5 w-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden rounded-full",
}: {
  pct: number;
  color?: string;
  className?: string;
}) {
  const displayPct = pct > 0 ? Math.max(pct, 3) : 0;
  return (
    <div className={className}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(displayPct, 0), 100)}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}
