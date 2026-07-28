/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
  href?: string;
  className?: string;
}

export function Logo({ size = "md", iconOnly = false, href, className = "" }: LogoProps) {
  const sizeMap = {
    sm: { img: "h-6 w-6", text: "text-lg" },
    md: { img: "h-8 w-8", text: "text-xl" },
    lg: { img: "h-11 w-11", text: "text-2xl" },
    xl: { img: "h-16 w-16", text: "text-4xl" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      {/* Pure Cutout Emblem Icon (No Box Container) */}
      <img
        src="/logo.svg"
        alt="PrepOS Emblem Cutout"
        className={`${currentSize.img} object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]`}
      />

      {!iconOnly && (
        <span className={`font-black tracking-tight ${currentSize.text} text-foreground flex items-center`}>
          Prep<span className="bg-gradient-to-r from-xblue to-cyan-400 bg-clip-text text-transparent">OS</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
