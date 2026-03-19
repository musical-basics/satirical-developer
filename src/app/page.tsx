"use client";

import { useState } from "react";
import HeroSection from "@/components/hero/HeroSection";
import type { AppState } from "@/types";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");

  const handleSubmit = (taskName: string, manualMinutes: number) => {
    console.log("Submitted:", { taskName, manualMinutes });
    setAppState("calculating");
  };

  return (
    <main className="min-h-screen bg-background">
      {appState === "idle" && (
        <HeroSection
          onSubmit={handleSubmit}
          isDisabled={appState !== "idle"}
        />
      )}

      {appState === "calculating" && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-neon-green font-mono text-xl cursor-blink">
            Processing
          </p>
        </div>
      )}
    </main>
  );
}
