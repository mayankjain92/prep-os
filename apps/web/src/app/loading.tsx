"use client";

import { OrbitalLoader } from "@/components/shared/OrbitalLoader";

export default function Loading() {
  return (
    <OrbitalLoader
      fullScreen
      size={180}
      title="PrepOS"
      subtitle="Synchronizing preparation modules..."
      badge="TELEMETRY SYNC"
      showProgressBar
    />
  );
}
