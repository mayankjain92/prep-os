"use client";

import React, { useId } from "react";

export interface OrbitalLoaderProps {
  /** Size in pixels or CSS string (e.g., 40, 180, "12rem"). Defaults to 180 */
  size?: number | string;
  /** Custom CSS classes for the container */
  className?: string;
  /** Whether to show the ambient radial glow behind the orbital rings */
  showAmbientGlow?: boolean;
  /** Heading displayed below the loader (e.g. "PrepOS") */
  title?: string;
  /** Subtitle description (e.g. "Synchronizing preparation modules...") */
  subtitle?: string;
  /** Telemetry badge text (e.g. "RUNTIME SYNC", "EST 0.4s") */
  badge?: string;
  /** Whether to render a shimmer progress bar */
  showProgressBar?: boolean;
  /** When true, renders as a full-screen fixed overlay suitable for Next.js loading.tsx */
  fullScreen?: boolean;
}

/**
 * Pure SVG Orbital Loader Graphic
 * High-performance animated SVG with counter-rotating rings, orbital nodes,
 * central AI rhombus spark, and bloom filters.
 */
export function OrbitalLoaderSVG({
  size = 180,
  showAmbientGlow = true,
  className = "",
}: {
  size?: number | string;
  showAmbientGlow?: boolean;
  className?: string;
}) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "_");

  const haloGlowId = `halo-glow-${id}`;
  const primaryGradId = `primary-grad-${id}`;
  const ringGradId = `ring-grad-1-${id}`;
  const bloomId = `bloom-${id}`;

  const dimension = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 300"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full prepos-loader-orbital select-none"
      >
        <defs>
          <radialGradient id={haloGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={primaryGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id={ringGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>

          <filter id={bloomId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes pol-pulse-core {
            0%, 100% {
              transform: scale(0.92);
              opacity: 0.85;
              filter: drop-shadow(0 0 8px rgba(99,102,241,0.5));
            }
            50% {
              transform: scale(1.08);
              opacity: 1;
              filter: drop-shadow(0 0 16px rgba(56,189,248,0.85));
            }
          }
          @keyframes pol-spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pol-spin-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pol-dash-orbit {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 360; }
          }
          @keyframes pol-breath-ring {
            0%, 100% { opacity: 0.3; transform: scale(0.96); }
            50% { opacity: 0.8; transform: scale(1.03); }
          }
          .pol-core-diamond {
            transform-origin: 150px 150px;
            animation: pol-pulse-core 2.6s ease-in-out infinite;
          }
          .pol-orbit-outer {
            transform-origin: 150px 150px;
            animation: pol-spin-cw 9s linear infinite;
          }
          .pol-orbit-mid {
            transform-origin: 150px 150px;
            animation: pol-spin-ccw 6s linear infinite;
          }
          .pol-orbit-dash {
            animation: pol-dash-orbit 4s linear infinite;
          }
          .pol-ambient-halo {
            transform-origin: 150px 150px;
            animation: pol-breath-ring 3.4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .pol-core-diamond,
            .pol-orbit-outer,
            .pol-orbit-mid,
            .pol-orbit-dash,
            .pol-ambient-halo {
              animation: none !important;
            }
          }
        `}</style>

        {/* Ambient Glow */}
        {showAmbientGlow && (
          <circle
            className="pol-ambient-halo"
            cx="150"
            cy="150"
            r="110"
            fill={`url(#${haloGlowId})`}
          />
        )}

        {/* Static Track Rings */}
        <circle
          cx="150"
          cy="150"
          r="88"
          fill="none"
          stroke="#262626"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
        <circle
          cx="150"
          cy="150"
          r="62"
          fill="none"
          stroke="#262626"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />

        {/* Outer Orbit Segment */}
        <g className="pol-orbit-outer">
          <circle
            cx="150"
            cy="150"
            r="88"
            fill="none"
            filter={`url(#${bloomId})`}
            stroke={`url(#${ringGradId})`}
            strokeDasharray="70 210"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <circle
            cx="238"
            cy="150"
            r="4"
            fill="#38bdf8"
            filter={`url(#${bloomId})`}
          />
          <circle cx="62" cy="150" r="2.5" fill="#818cf8" />
        </g>

        {/* Mid Counter-Rotating Orbit */}
        <g className="pol-orbit-mid">
          <circle
            cx="150"
            cy="150"
            r="62"
            fill="none"
            filter={`url(#${bloomId})`}
            stroke="#6366f1"
            strokeDasharray="45 150"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <circle
            cx="150"
            cy="88"
            r="3.5"
            fill="#6366f1"
            filter={`url(#${bloomId})`}
          />
          <circle cx="150" cy="212" r="2" fill="#38bdf8" />
        </g>

        {/* Central Diamond AI / Telemetry Spark */}
        <g className="pol-core-diamond">
          {/* Outer Glow Rhombus */}
          <path
            d="M 150 116 C 150 134 166 150 184 150 C 166 150 150 166 150 184 C 150 166 134 150 116 150 C 134 150 150 134 150 116 Z"
            fill={`url(#${primaryGradId})`}
            filter={`url(#${bloomId})`}
          />
          {/* Precision Inner Highlight */}
          <circle
            cx="150"
            cy="150"
            r="3.5"
            fill="#ffffff"
            filter={`url(#${bloomId})`}
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Main Reusable Orbital Loader Component
 * Can be used inline or as a full-screen application loader.
 */
export function OrbitalLoader({
  size = 180,
  className = "",
  showAmbientGlow = true,
  title,
  subtitle,
  badge,
  showProgressBar = false,
  fullScreen = false,
}: OrbitalLoaderProps) {
  const content = (
    <div className={`relative flex flex-col items-center gap-4 ${fullScreen ? "p-8 max-w-sm sm:max-w-md w-full" : ""}`}>
      {/* Background radial glow */}
      {showAmbientGlow && (
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/15 to-purple-600/20 blur-3xl opacity-75 pointer-events-none" />
      )}

      {/* Telemetry Badge / Pill */}
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] dark:bg-white/[0.04] border border-white/10 dark:border-white/10 text-[11px] font-mono text-muted-foreground shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="relative w-1.5 h-1.5 -ml-3 rounded-full bg-emerald-400" />
          <span>{badge}</span>
        </div>
      )}

      {/* Orbital Animated SVG */}
      <OrbitalLoaderSVG
        size={size}
        showAmbientGlow={showAmbientGlow}
        className="transition-transform duration-300"
      />

      {/* Optional Title & Subtitle */}
      {(title || subtitle) && (
        <div className="flex flex-col items-center gap-1.5 z-10 text-center">
          {title && (
            <div className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1">
              {title === "PrepOS" ? (
                <>
                  <span>Prep</span>
                  <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                    OS
                  </span>
                </>
              ) : (
                <span>{title}</span>
              )}
            </div>
          )}
          {subtitle && (
            <p className="text-xs font-medium text-muted-foreground animate-pulse">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Shimmer Progress Bar */}
      {showProgressBar && (
        <div className="w-48 sm:w-56 h-1 bg-muted/60 rounded-full overflow-hidden relative mt-2 border border-border/30">
          <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-400 rounded-full animate-[shimmer_1.8s_infinite] shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md text-foreground transition-all duration-300 select-none ${className}`}
      >
        {content}
        <span className="sr-only">Loading application, please wait...</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative flex items-center justify-center ${className}`}
    >
      {content}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default OrbitalLoader;
