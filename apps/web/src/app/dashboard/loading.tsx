"use client";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Skeleton */}
      <div className="p-8 rounded-3xl bg-card/60 border border-border/60 relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2.5 w-full sm:w-2/3">
            <div className="h-4 w-32 bg-muted/70 rounded-md animate-pulse" />
            <div className="h-8 w-64 bg-muted rounded-xl animate-pulse" />
            <div className="h-4 w-full max-w-md bg-muted/50 rounded-md animate-pulse" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-muted rounded-full animate-pulse" />
            <div className="h-10 w-28 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-card/50 border border-border/50 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-muted/60 animate-pulse" />
              <div className="h-4 w-16 bg-muted/50 rounded-md animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-muted rounded-md animate-pulse" />
              <div className="h-3.5 w-full bg-muted/40 rounded-md animate-pulse" />
            </div>
            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-xblue/30 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="p-6 rounded-3xl bg-card/40 border border-border/40 space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="h-6 w-48 bg-muted/70 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-muted/60 rounded-lg animate-pulse" />
        </div>

        <div className="space-y-3">
          {[1, 2, 4, 5].map((i) => (
            <div key={i} className="h-14 w-full bg-muted/20 rounded-xl border border-border/30 animate-pulse flex items-center px-4 justify-between">
              <div className="flex items-center gap-3 w-1/2">
                <div className="h-5 w-5 bg-muted/50 rounded-md" />
                <div className="h-4 w-40 bg-muted/50 rounded-md" />
              </div>
              <div className="h-6 w-20 bg-muted/40 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
