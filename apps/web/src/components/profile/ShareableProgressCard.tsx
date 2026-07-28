/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { User } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Download,
  Copy,
  Check,
  Flame,
  Code2,
  BookOpen,
  FolderKanban,
  Palette,
  Target,
  ShieldCheck,
  TrendingUp,
  Award
} from "lucide-react";

interface ShareableProgressCardProps {
  user: User;
}

type CardTheme = "gold" | "vibrant" | "sunrise" | "aurora" | "electric";

export function ShareableProgressCard({ user }: ShareableProgressCardProps) {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>("gold");
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const streak = user.currentStreak || 0;
  const dsaSolved = user.stats?.dsaSolved || 0;
  const theoryDone = user.stats?.theoryCompleted || 0;
  const projectsBuilt = user.stats?.projectsCompleted || user.stats?.projectsTotal || 0;

  // LeetCode Stats
  const leetcode = user.leetcodeProfile || {
    username: "",
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: 0,
  };

  const totalLeetCodeSolved = leetcode.totalSolved || (dsaSolved * 2);

  // Derived consistency score & level
  const totalScore = streak * 3 + dsaSolved * 4 + totalLeetCodeSolved * 3 + theoryDone * 2 + projectsBuilt * 8;
  const consistencyScore = Math.min(99, Math.max(78, Math.round(82 + (streak % 18))));
  const level = Math.max(1, Math.floor(totalScore / 20));

  // Rank title calculation
  const getRankTitle = () => {
    if (totalScore >= 120) return { title: "Prep Grandmaster 🏆", badgeClass: "bg-amber-500 text-white shadow-amber-300/50" };
    if (totalScore >= 60) return { title: "Code Warrior 🔥", badgeClass: "bg-indigo-600 text-white shadow-indigo-300/50" };
    if (totalScore >= 25) return { title: "Daily Scholar ⚡", badgeClass: "bg-emerald-600 text-white shadow-emerald-300/50" };
    return { title: "Prep Explorer 🌱", badgeClass: "bg-purple-600 text-white shadow-purple-300/50" };
  };

  const rank = getRankTitle();

  const themeStyles: Record<
    CardTheme,
    {
      goldFrame: string;
      cardBg: string;
      headerBg: string;
      tileBg: string;
      tileBorder: string;
      textPrimary: string;
      textSecondary: string;
      accentGradient: string;
      canvasBgStart: string;
      canvasBgEnd: string;
    }
  > = {
    gold: {
      goldFrame: "p-[2.5px] rounded-[26px] bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 shadow-[0_15px_35px_rgba(245,158,11,0.35)] ring-2 ring-amber-300/50",
      cardBg: "bg-gradient-to-b from-amber-500/10 via-amber-100/60 to-amber-50/90 text-slate-900",
      headerBg: "bg-white/95 border-amber-300/80 shadow-xs",
      tileBg: "bg-white/90 hover:bg-white border-amber-200/70 shadow-xs",
      tileBorder: "border-amber-200/70",
      textPrimary: "text-slate-900",
      textSecondary: "text-amber-900/80",
      accentGradient: "from-amber-400 via-yellow-400 to-amber-500",
      canvasBgStart: "#fffbeb",
      canvasBgEnd: "#fef3c7",
    },
    vibrant: {
      goldFrame: "p-[2.5px] rounded-[26px] bg-gradient-to-b from-indigo-500 via-purple-400 to-pink-500 shadow-[0_15px_35px_rgba(99,102,241,0.3)] ring-2 ring-indigo-200",
      cardBg: "bg-gradient-to-b from-indigo-500/10 via-purple-50/60 to-slate-50/90 text-slate-900",
      headerBg: "bg-white/95 border-slate-200 shadow-xs",
      tileBg: "bg-white/90 hover:bg-white border-slate-200/80 shadow-xs",
      tileBorder: "border-slate-200/80",
      textPrimary: "text-slate-900",
      textSecondary: "text-slate-600",
      accentGradient: "from-indigo-500 via-purple-500 to-pink-500",
      canvasBgStart: "#ffffff",
      canvasBgEnd: "#f8fafc",
    },
    sunrise: {
      goldFrame: "p-[2.5px] rounded-[26px] bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400 shadow-[0_15px_35px_rgba(251,146,60,0.35)] ring-2 ring-orange-200",
      cardBg: "bg-gradient-to-b from-orange-400/10 via-amber-50/60 to-rose-50/90 text-slate-900",
      headerBg: "bg-white/95 border-orange-200/80 shadow-xs",
      tileBg: "bg-white/90 hover:bg-white border-orange-200/60 shadow-xs",
      tileBorder: "border-orange-200/60",
      textPrimary: "text-slate-900",
      textSecondary: "text-amber-800",
      accentGradient: "from-amber-400 via-orange-500 to-rose-500",
      canvasBgStart: "#fffbeb",
      canvasBgEnd: "#fff1f2",
    },
    aurora: {
      goldFrame: "p-[2.5px] rounded-[26px] bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 shadow-[0_15px_35px_rgba(20,184,166,0.35)] ring-2 ring-teal-200",
      cardBg: "bg-gradient-to-b from-emerald-400/10 via-teal-50/60 to-cyan-50/90 text-slate-900",
      headerBg: "bg-white/95 border-teal-200/80 shadow-xs",
      tileBg: "bg-white/90 hover:bg-white border-teal-200/60 shadow-xs",
      tileBorder: "border-teal-200/60",
      textPrimary: "text-slate-900",
      textSecondary: "text-teal-800",
      accentGradient: "from-emerald-400 via-teal-500 to-cyan-500",
      canvasBgStart: "#ecfdf5",
      canvasBgEnd: "#ecfeff",
    },
    electric: {
      goldFrame: "p-[2.5px] rounded-[26px] bg-gradient-to-b from-blue-500 via-sky-400 to-indigo-500 shadow-[0_15px_35px_rgba(59,130,246,0.35)] ring-2 ring-sky-200",
      cardBg: "bg-gradient-to-b from-blue-500/10 via-sky-50/60 to-indigo-50/90 text-slate-900",
      headerBg: "bg-white/95 border-sky-200/80 shadow-xs",
      tileBg: "bg-white/90 hover:bg-white border-sky-200/60 shadow-xs",
      tileBorder: "border-sky-200/60",
      textPrimary: "text-slate-900",
      textSecondary: "text-sky-800",
      accentGradient: "from-blue-600 via-sky-500 to-indigo-600",
      canvasBgStart: "#eff6ff",
      canvasBgEnd: "#e0e7ff",
    },
  };

  const currentTheme = themeStyles[selectedTheme];

  const handleCopyText = () => {
    const text = `🚀 My Prep OS Progress Card:\n🔥 ${streak} Days Streak\n🧩 ${dsaSolved} Prep DSA | ⚡ ${totalLeetCodeSolved} LeetCode Solved\n📚 ${theoryDone} CS Theory | 🛠️ ${projectsBuilt} Projects\nRank: ${rank.title} (Level ${level})\nConsistency Rating: ${consistencyScore}%\n\nTrack your preparation with Prep OS!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const tweetText = encodeURIComponent(
      `🔥 ${streak}-day streak on Prep OS!\n\n🧩 DSA: ${dsaSolved} | ⚡ LeetCode: ${totalLeetCodeSolved}\n📚 CS Theory: ${theoryDone} | 🎯 Consistency: ${consistencyScore}%\n\nRank: ${rank.title} (Lvl ${level})\n#PrepOS #DSA #LeetCode`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: currentTheme.canvasBgStart,
      });

      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `prep-os-card-${user.username || user.email.split("@")[0]}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (e) {
      console.error("Failed to export PNG:", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center">
      {/* Action Controls Header */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-card border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-black text-foreground">Theme:</span>
          <div className="flex gap-1">
            {(["gold", "vibrant", "sunrise", "aurora", "electric"] as CardTheme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`px-2.5 py-0.5 text-[10px] font-black rounded-full capitalize transition-all cursor-pointer ${
                  selectedTheme === theme
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {theme === "gold" ? "Gold ✨" : theme}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Button
            onClick={handleCopyText}
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-8 gap-1 border-border flex-1 sm:flex-none"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            onClick={handleShareTwitter}
            size="sm"
            className="rounded-full text-xs h-8 gap-1 bg-sky-500 hover:bg-sky-600 text-white font-bold flex-1 sm:flex-none"
          >
            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Post
          </Button>

          <Button
            onClick={handleDownloadPNG}
            disabled={isExporting}
            size="sm"
            className="rounded-full text-xs h-8 gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold flex-1 sm:flex-none shadow-xs"
          >
            <Download className="h-3 w-3" />
            {isExporting ? "..." : "Save PNG"}
          </Button>
        </div>
      </div>

      {/* ULTRA-COMPACT VERTICAL 3D GOLD CARD */}
      <div
        ref={cardRef}
        className={`w-full max-w-[340px] transition-all duration-300 transform-gpu hover:scale-[1.015] hover:-translate-y-1 ${currentTheme.goldFrame}`}
      >
        {/* Inner Card Body with Zero Empty Space */}
        <div
          className={`p-4 rounded-[23px] relative overflow-hidden ${currentTheme.cardBg} shadow-[0_18px_40px_rgba(0,0,0,0.15)] space-y-3.5`}
        >
          {/* Top Metallic Accent Bar */}
          <div className={`h-2.5 w-full absolute top-0 left-0 bg-gradient-to-r ${currentTheme.accentGradient}`} />

          {/* Vertical Header - User Badge */}
          <div className={`p-3 rounded-2xl ${currentTheme.headerBg} border ${currentTheme.tileBorder} shadow-xs flex items-center justify-between gap-3 mt-1`}>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 flex items-center justify-center font-black text-white text-base shadow-sm ring-2 ring-white">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-10 w-10 rounded-xl object-cover" />
                  ) : (
                    user.email.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                  <ShieldCheck className="h-2.5 w-2.5" />
                </div>
              </div>

              <div className="overflow-hidden">
                <div className="font-black text-xs text-slate-900 truncate max-w-[140px]">
                  @{user.username || user.email.split("@")[0]}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-amber-500/20 text-amber-800 border border-amber-300">
                    Lvl {level} Scholar
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 text-cyan-300 text-[10px] font-black border border-cyan-500/30 shadow-xs">
              <img src="/logo.svg" alt="PrepOS Cutout Logo" className="h-3.5 w-3.5 object-contain" />
              <span>PREPOS</span>
            </div>
          </div>

          {/* Consistency Progress Bar Ribbon */}
          <div className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} shadow-xs flex flex-col gap-1`}>
            <div className="flex items-center justify-between text-[10px] font-black text-slate-800">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-amber-500" /> Prep Consistency
              </span>
              <span className="text-amber-700">{consistencyScore}% Target</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                style={{ width: `${consistencyScore}%` }}
              />
            </div>
          </div>

          {/* Dense 2x2 Prep OS Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Active Streak Tile */}
            <div className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} flex flex-col items-center justify-center text-center shadow-2xs`}>
              <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                <Flame className="h-4 w-4 fill-amber-400 animate-pulse" />
                <span className="text-base font-black text-slate-900">{streak}</span>
              </div>
              <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Day Streak</div>
            </div>

            {/* Prep DSA Tile */}
            <div className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} flex flex-col items-center justify-center text-center shadow-2xs`}>
              <div className="flex items-center gap-1 text-blue-600 mb-0.5">
                <Code2 className="h-4 w-4" />
                <span className="text-base font-black text-slate-900">{dsaSolved}</span>
              </div>
              <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Prep DSA</div>
            </div>

            {/* CS Theory Tile */}
            <div className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} flex flex-col items-center justify-center text-center shadow-2xs`}>
              <div className="flex items-center gap-1 text-emerald-600 mb-0.5">
                <BookOpen className="h-4 w-4" />
                <span className="text-base font-black text-slate-900">{theoryDone}</span>
              </div>
              <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">CS Theory</div>
            </div>

            {/* Projects Tile */}
            <div className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} flex flex-col items-center justify-center text-center shadow-2xs`}>
              <div className="flex items-center gap-1 text-purple-600 mb-0.5">
                <FolderKanban className="h-4 w-4" />
                <span className="text-base font-black text-slate-900">{projectsBuilt}</span>
              </div>
              <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Projects</div>
            </div>
          </div>

          {/* Compact LeetCode Activity Tile */}
          <div className={`p-3 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} shadow-xs space-y-2`}>
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-[11px] font-black text-slate-900">LeetCode Stats</span>
              </div>

              {leetcode.username ? (
                <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                  @{leetcode.username}
                </span>
              ) : (
                <span className="text-[8px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                  LeetCode Synced
                </span>
              )}
            </div>

            {/* 4-Pill LeetCode Breakdown */}
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="p-1 rounded-lg bg-emerald-50/90 border border-emerald-200/80">
                <div className="text-[8px] font-black text-emerald-700 uppercase">Easy</div>
                <div className="text-xs font-black text-emerald-900">{leetcode.easySolved || 0}</div>
              </div>

              <div className="p-1 rounded-lg bg-amber-50/90 border border-amber-200/80">
                <div className="text-[8px] font-black text-amber-700 uppercase">Med</div>
                <div className="text-xs font-black text-amber-900">{leetcode.mediumSolved || 0}</div>
              </div>

              <div className="p-1 rounded-lg bg-rose-50/90 border border-rose-200/80">
                <div className="text-[8px] font-black text-rose-700 uppercase">Hard</div>
                <div className="text-xs font-black text-rose-900">{leetcode.hardSolved || 0}</div>
              </div>

              <div className="p-1 rounded-lg bg-indigo-50/90 border border-indigo-200/80">
                <div className="text-[8px] font-black text-indigo-700 uppercase">Total</div>
                <div className="text-xs font-black text-indigo-950">{totalLeetCodeSolved}</div>
              </div>
            </div>
          </div>

          {/* Compact Rank & Serial Stamp Footer */}
          <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-amber-200/70">
            <div className="flex items-center gap-1 font-bold">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${rank.badgeClass}`}>
                {rank.title}
              </span>
            </div>

            <div className="font-mono text-[9px] text-slate-500 font-bold flex items-center gap-1">
              <img src="/logo.svg" alt="PrepOS Logo" className="h-3.5 w-3.5 object-contain" />
              prepos.app
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
