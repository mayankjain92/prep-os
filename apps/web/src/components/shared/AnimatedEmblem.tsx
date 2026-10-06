"use client";

import React from "react";

interface AnimatedEmblemProps {
  className?: string;
  size?: number;
  showBackground?: boolean;
}

export function AnimatedEmblem({
  className = "w-10 h-10",
  size,
  showBackground = false,
}: AnimatedEmblemProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={style}
    >
      <svg
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient
            id="emblemIndigoGrad"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient
            id="emblemGlowGrad"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <filter
            id="emblemSoftGlow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <style>{`
          @keyframes orbitCw {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes orbitCcw {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          @keyframes corePulse {
            0%, 100% {
              transform: scale(1);
              filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.45));
            }
            50% {
              transform: scale(1.045);
              filter: drop-shadow(0 0 26px rgba(56, 189, 248, 0.8));
            }
          }
          @keyframes innerSpark {
            0%, 100% {
              transform: scale(0.96) rotate(0deg);
              opacity: 0.85;
            }
            50% {
              transform: scale(1.08) rotate(45deg);
              opacity: 1;
            }
          }
          @keyframes nodeBlink {
            0%, 100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.35);
              opacity: 1;
            }
          }
          @keyframes ringBreathe {
            0%, 100% {
              r: 28px;
              opacity: 0.45;
            }
            50% {
              r: 34px;
              opacity: 0.85;
            }
          }
          .emb-orbit-cw {
            transform-origin: 256px 256px;
            animation: orbitCw 14s linear infinite;
          }
          .emb-orbit-ccw {
            transform-origin: 256px 256px;
            animation: orbitCcw 22s linear infinite;
          }
          .emb-core {
            transform-origin: 256px 256px;
            animation: corePulse 3.6s ease-in-out infinite;
          }
          .emb-inner-spark {
            transform-origin: 256px 256px;
            animation: innerSpark 7.2s ease-in-out infinite;
          }
          .emb-node {
            transform-origin: center;
            animation: nodeBlink 2.4s ease-in-out infinite;
          }
          .emb-ring {
            animation: ringBreathe 2.8s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .emb-orbit-cw, .emb-orbit-ccw, .emb-core, .emb-inner-spark, .emb-node, .emb-ring {
              animation: none !important;
            }
          }
        `}</style>

        {showBackground && (
          <>
            <rect width="512" height="512" rx="128" fill="#131313" />
            <rect
              x="2"
              y="2"
              width="508"
              height="508"
              rx="126"
              fill="none"
              stroke="#262626"
              strokeWidth="2"
            />
          </>
        )}

        {/* Orbital Track Ring 1 (Inner Track) */}
        <g className="emb-orbit-cw">
          <circle
            cx="256"
            cy="256"
            r="148"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity="0.45"
          />
          <circle cx="360" cy="152" r="7" fill="#38bdf8" className="emb-node" />
          <circle
            cx="152"
            cy="360"
            r="5.5"
            fill="#818cf8"
            className="emb-node"
            style={{ animationDelay: "1.2s" }}
          />
        </g>

        {/* Orbital Track Ring 2 (Outer Track) */}
        <g className="emb-orbit-ccw">
          <circle
            cx="256"
            cy="256"
            r="184"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="16 12"
            opacity="0.3"
          />
          <circle
            cx="390"
            cy="280"
            r="5"
            fill="#a5b4fc"
            className="emb-node"
            style={{ animationDelay: "0.6s" }}
          />
          <circle cx="122" cy="232" r="4" fill="#38bdf8" opacity="0.75" />
        </g>

        {/* Core Diamond Star Emblem */}
        <g className="emb-core">
          <path
            d="M 256 64 C 256 160 256 160 352 256 C 256 256 256 352 256 448 C 256 352 256 352 160 256 C 256 160 256 160 256 64 Z"
            fill="url(#emblemIndigoGrad)"
          />
          <g className="emb-inner-spark">
            <path
              d="M 256 180 C 275 220 292 237 332 256 C 292 275 275 292 256 332 C 237 292 220 275 180 256 C 220 237 237 220 256 180 Z"
              fill="url(#emblemGlowGrad)"
              opacity="0.9"
            />
          </g>
          <circle
            cx="256"
            cy="256"
            r="28"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            className="emb-ring"
          />
          <circle
            cx="256"
            cy="256"
            r="15"
            fill="#ffffff"
            filter="url(#emblemSoftGlow)"
          />
        </g>
      </svg>
    </div>
  );
}
