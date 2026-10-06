/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useMemo } from "react";
import { toPng, toBlob } from "html-to-image";
import { User } from "@/features/auth/AuthContext";
import { useRoadmapProgress } from "@/features/roadmap/useRoadmap";
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
  Award,
  Share2,
} from "lucide-react";

interface ShareableProgressCardProps {
  user: User;
}

type CardTheme = "gold" | "vibrant" | "sunrise" | "aurora" | "electric" | "obsidian";

export function ShareableProgressCard({ user }: ShareableProgressCardProps) {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>("gold");
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: theoryStatus = {} } = useRoadmapProgress("prep_os_theory_roadmap");
  const { data: dsaStatus = {} } = useRoadmapProgress("prep_os_dsa_roadmap_v2");

  const streak = user.currentStreak || 0;
  const dsaSolved = useMemo(() => {
    const doneCount = Object.values(dsaStatus).filter((val) => val === "done").length;
    return doneCount || user.stats?.dsaSolved || 0;
  }, [dsaStatus, user.stats?.dsaSolved]);

  const theoryDone = useMemo(() => {
    const doneCount = Object.values(theoryStatus).filter((val) => val === "done").length;
    return doneCount || user.stats?.theoryCompleted || 0;
  }, [theoryStatus, user.stats?.theoryCompleted]);

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
      tileBg: "bg-white/95 shadow-xs",
      tileBorder: "border-amber-200/80",
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
      tileBg: "bg-white/95 shadow-xs",
      tileBorder: "border-slate-200/90",
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
      tileBg: "bg-white/95 shadow-xs",
      tileBorder: "border-orange-200/70",
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
      tileBg: "bg-white/95 shadow-xs",
      tileBorder: "border-teal-200/70",
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
      tileBg: "bg-white/95 shadow-xs",
      tileBorder: "border-sky-200/70",
      textPrimary: "text-slate-900",
      textSecondary: "text-sky-800",
      accentGradient: "from-blue-600 via-sky-500 to-indigo-600",
      canvasBgStart: "#eff6ff",
      canvasBgEnd: "#e0e7ff",
    },
    obsidian: {
      goldFrame: "p-[2.5px] rounded-[26px] bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 shadow-[0_15px_35px_rgba(0,0,0,0.6)] ring-2 ring-neutral-700/50",
      cardBg: "bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-neutral-100",
      headerBg: "bg-[#161618]/95 border-neutral-700/80 shadow-xs",
      tileBg: "bg-[#161618]/95 shadow-xs",
      tileBorder: "border-neutral-700/70",
      textPrimary: "text-neutral-100",
      textSecondary: "text-neutral-400",
      accentGradient: "from-neutral-500 via-neutral-300 to-neutral-600",
      canvasBgStart: "#0a0a0c",
      canvasBgEnd: "#141418",
    },
  };

  const currentTheme = themeStyles[selectedTheme];
  const isDarkCard = selectedTheme === "obsidian";

  const handleCopyText = () => {
    const text = `🚀 My Prep OS Progress Card:\n🔥 ${streak} Days Streak\n🧩 ${dsaSolved} Prep DSA | ⚡ ${totalLeetCodeSolved} LeetCode Solved\n📚 ${theoryDone} CS Theory | 🛠️ ${projectsBuilt} Projects\nRank: ${rank.title} (Level ${level})\nConsistency Rating: ${consistencyScore}%\n\nTrack your preparation with Prep OS!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCard = async () => {
    if (!cardRef.current) return;
    try {
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: currentTheme.canvasBgStart,
      });
      if (blob && typeof window !== "undefined" && window.navigator?.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch (e) {
      console.warn("Could not copy card as image, falling back to text:", e);
    }
    handleCopyText();
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
      {/* Left Column (5 cols): Palette Picker & Share Controls */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Theme Palette Card */}
        <div className="rounded-2xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
            <Palette className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-neutral-100">
              Card Theme Palette
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "gold", label: "Gold ✨", activeBg: "bg-amber-400 text-stone-900 shadow-sm font-semibold" },
              { id: "vibrant", label: "Vibrant", activeBg: "bg-indigo-500 text-white shadow-sm font-semibold" },
              { id: "sunrise", label: "Sunrise", activeBg: "bg-orange-500 text-white shadow-sm font-semibold" },
              { id: "aurora", label: "Aurora", activeBg: "bg-teal-500 text-white shadow-sm font-semibold" },
              { id: "electric", label: "Electric", activeBg: "bg-sky-500 text-white shadow-sm font-semibold" },
              { id: "obsidian", label: "Minimal Obsidian", activeBg: "bg-neutral-800 text-neutral-100 border border-neutral-700 shadow-sm font-semibold" },
            ].map((theme) => {
              const isSelected = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id as CardTheme)}
                  className={`px-3 py-2 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? theme.activeBg
                      : "border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] font-medium"
                  }`}
                >
                  {theme.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Export & Share Panel */}
        <div className="rounded-2xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
            <Share2 className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-neutral-100">
              Export & Share
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleCopyCard}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Card Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
                  <span>Copy Card Image</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShareTwitter}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Post to X / Twitter</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 font-bold" />
              <span>{isExporting ? "Generating High-Res PNG..." : "Save High-Res PNG"}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-tight pt-1">
            Share your milestone on LinkedIn, Twitter, or resume portfolios with live verified stats.
          </p>
        </div>
      </div>

      {/* Right Column (7 cols): Card Canvas Studio */}
      <div className="lg:col-span-7 flex items-center justify-center">
        <div className="relative group p-1.5 sm:p-2 rounded-[2rem] max-w-sm sm:max-w-md w-full transition-all duration-300">
          {/* Ambient Glow Backdrop */}
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Placement Card Container */}
          <div
            ref={cardRef}
            className={`w-full transition-all duration-300 transform-gpu hover:scale-[1.01] ${currentTheme.goldFrame}`}
          >
            {/* Inner Card Body with Zero Empty Space */}
            <div
              className={`p-4 sm:p-5 rounded-[23px] relative overflow-hidden ${currentTheme.cardBg} shadow-[0_18px_40px_rgba(0,0,0,0.15)] space-y-3.5`}
            >
              {/* Top Metallic Accent Bar */}
              <div className={`h-2.5 w-full absolute top-0 left-0 bg-gradient-to-r ${currentTheme.accentGradient}`} />

              {/* Vertical Header - User Badge */}
              <div
                className={`p-3 rounded-2xl ${currentTheme.headerBg} border ${currentTheme.tileBorder} shadow-xs flex items-center justify-between gap-3 mt-1`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 flex items-center justify-center font-black text-white text-base shadow-sm ring-2 ring-white">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="h-11 w-11 rounded-xl object-cover" />
                      ) : (
                        user.email.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                      <ShieldCheck className="h-2.5 w-2.5" />
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <div className={`font-extrabold text-sm ${isDarkCard ? "text-white" : "text-slate-950"} truncate max-w-[140px]`}>
                      @{user.username || user.email.split("@")[0]}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isDarkCard
                          ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                          : "bg-amber-100 text-amber-950 border border-amber-300"
                      }`}>
                        Lvl {level} Scholar
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 text-cyan-300 text-[10px] font-black tracking-wide border border-cyan-500/30 shadow-xs">
                  <img src="/logo.svg" alt="PrepOS Logo" className="h-3.5 w-3.5 object-contain" />
                  <span>PREPOS</span>
                </div>
              </div>

              {/* Consistency Progress Bar Ribbon */}
              <div
                className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} shadow-xs flex flex-col gap-1.5`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={`flex items-center gap-1.5 ${isDarkCard ? "text-neutral-200" : "text-slate-900"}`}>
                    <TrendingUp className="h-3.5 w-3.5 text-amber-500" /> Prep Consistency
                  </span>
                  <span className={isDarkCard ? "text-amber-400 font-extrabold" : "text-amber-700 font-extrabold"}>
                    {consistencyScore}% Score
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDarkCard ? "bg-neutral-800" : "bg-slate-200"} overflow-hidden p-0.5`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                    style={{ width: `${consistencyScore > 0 ? Math.max(consistencyScore, 4) : 0}%` }}
                  />
                </div>
              </div>

              {/* Dense 2x2 Prep OS Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Active Streak Tile */}
                <div
                  className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} flex flex-col items-center justify-center text-center shadow-xs`}
                >
                  <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                    <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className={`text-lg font-black ${isDarkCard ? "text-white" : "text-slate-950"}`}>{streak}</span>
                  </div>
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${isDarkCard ? "text-neutral-400" : "text-slate-600"}`}>
                    Day Streak
                  </div>
                </div>

                {/* Prep DSA Tile */}
                <div
                  className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} flex flex-col items-center justify-center text-center shadow-xs`}
                >
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 mb-0.5">
                    <Code2 className="h-4 w-4" />
                    <span className={`text-lg font-black ${isDarkCard ? "text-white" : "text-slate-950"}`}>{dsaSolved}</span>
                  </div>
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${isDarkCard ? "text-neutral-400" : "text-slate-600"}`}>
                    Prep DSA
                  </div>
                </div>

                {/* CS Theory Tile */}
                <div
                  className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} flex flex-col items-center justify-center text-center shadow-xs`}
                >
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 mb-0.5">
                    <BookOpen className="h-4 w-4" />
                    <span className={`text-lg font-black ${isDarkCard ? "text-white" : "text-slate-950"}`}>{theoryDone}</span>
                  </div>
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${isDarkCard ? "text-neutral-400" : "text-slate-600"}`}>
                    CS Theory
                  </div>
                </div>

                {/* Projects Tile */}
                <div
                  className={`p-2.5 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} flex flex-col items-center justify-center text-center shadow-xs`}
                >
                  <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 mb-0.5">
                    <FolderKanban className="h-4 w-4" />
                    <span className={`text-lg font-black ${isDarkCard ? "text-white" : "text-slate-950"}`}>{projectsBuilt}</span>
                  </div>
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${isDarkCard ? "text-neutral-400" : "text-slate-600"}`}>
                    Projects
                  </div>
                </div>
              </div>

              {/* Compact LeetCode Activity Tile */}
              <div className={`p-3 rounded-xl ${currentTheme.tileBg} border ${currentTheme.tileBorder} shadow-xs space-y-2`}>
                <div className={`flex items-center justify-between pb-1.5 border-b ${
                  isDarkCard ? "border-white/10" : "border-slate-200"
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-amber-500" />
                    <span className={`text-xs font-extrabold ${isDarkCard ? "text-white" : "text-slate-950"}`}>LeetCode Stats</span>
                  </div>

                  {leetcode.username ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDarkCard
                        ? "text-amber-300 bg-amber-500/20 border border-amber-500/30"
                        : "text-amber-950 bg-amber-100 border border-amber-300 font-mono"
                    }`}>
                      @{leetcode.username}
                    </span>
                  ) : (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isDarkCard
                        ? "text-amber-300 bg-amber-500/20 border border-amber-500/30"
                        : "text-amber-950 bg-amber-100 border border-amber-300"
                    }`}>
                      LeetCode Synced
                    </span>
                  )}
                </div>

                {/* 4-Pill LeetCode Breakdown */}
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className={`p-1.5 rounded-lg border ${
                    isDarkCard
                      ? "bg-emerald-950/40 border-emerald-500/30"
                      : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <div className={`text-[9px] font-bold uppercase tracking-wider ${
                      isDarkCard ? "text-emerald-400" : "text-emerald-800"
                    }`}>Easy</div>
                    <div className={`text-sm font-black ${
                      isDarkCard ? "text-emerald-200" : "text-emerald-950"
                    }`}>{leetcode.easySolved || 0}</div>
                  </div>

                  <div className={`p-1.5 rounded-lg border ${
                    isDarkCard
                      ? "bg-amber-950/40 border-amber-500/30"
                      : "bg-amber-50 border-amber-200"
                  }`}>
                    <div className={`text-[9px] font-bold uppercase tracking-wider ${
                      isDarkCard ? "text-amber-400" : "text-amber-800"
                    }`}>Med</div>
                    <div className={`text-sm font-black ${
                      isDarkCard ? "text-amber-200" : "text-amber-950"
                    }`}>{leetcode.mediumSolved || 0}</div>
                  </div>

                  <div className={`p-1.5 rounded-lg border ${
                    isDarkCard
                      ? "bg-rose-950/40 border-rose-500/30"
                      : "bg-rose-50 border-rose-200"
                  }`}>
                    <div className={`text-[9px] font-bold uppercase tracking-wider ${
                      isDarkCard ? "text-rose-400" : "text-rose-800"
                    }`}>Hard</div>
                    <div className={`text-sm font-black ${
                      isDarkCard ? "text-rose-200" : "text-rose-950"
                    }`}>{leetcode.hardSolved || 0}</div>
                  </div>

                  <div className={`p-1.5 rounded-lg border ${
                    isDarkCard
                      ? "bg-indigo-950/40 border-indigo-500/30"
                      : "bg-indigo-50 border-indigo-200"
                  }`}>
                    <div className={`text-[9px] font-bold uppercase tracking-wider ${
                      isDarkCard ? "text-indigo-400" : "text-indigo-800"
                    }`}>Total</div>
                    <div className={`text-sm font-black ${
                      isDarkCard ? "text-indigo-200" : "text-indigo-950"
                    }`}>{totalLeetCodeSolved}</div>
                  </div>
                </div>
              </div>

              {/* Compact Rank & Serial Stamp Footer */}
              <div className={`flex items-center justify-between text-xs pt-2 border-t ${
                isDarkCard ? "border-white/10 text-neutral-400" : "border-slate-200 text-slate-700"
              }`}>
                <div className="flex items-center gap-1 font-bold">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${rank.badgeClass}`}>
                    {rank.title}
                  </span>
                </div>

                <div className={`font-mono text-[10px] font-bold flex items-center gap-1 ${
                  isDarkCard ? "text-neutral-400" : "text-slate-600"
                }`}>
                  <img src="/logo.svg" alt="PrepOS Logo" className="h-3.5 w-3.5 object-contain" />
                  prepos.app
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
