"use client";

import { DoubtSection } from "@/features/doubts/components/DoubtSection";

export default function DoubtsDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-neutral-200 pb-28 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        {/* BEGIN: PageHeader */}
        <section className="space-y-1" data-purpose="header-section">
          <span className="text-[11px] font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
            REVISION & RETENTION
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Doubts & Target Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-3xl">
            Personal queue of tricky DSA problems, CS Theory sticking points, and target questions flagged for second-pass review.
          </p>
        </section>
        {/* END: PageHeader */}

        <DoubtSection />
      </main>
    </div>
  );
}
