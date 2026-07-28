"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInCard({
  children,
  className,
  delay = 0,
  onClick,
  ...props
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedProgressBar({
  pct,
  color = "bg-xblue",
  className = "h-1.5 w-full bg-border/50 overflow-hidden rounded-full",
}: {
  pct: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <motion.div
        initial={false}
        animate={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full rounded-full transition-colors duration-300 ${color}`}
      />
    </div>
  );
}
