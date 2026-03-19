"use client";

import { useState } from "react";
import HeroSection from "@/components/hero/HeroSection";
import LoadingSection from "@/components/terminal/LoadingSection";
import type { AppState, ROIResponse } from "@/types";
import { useCalculateROI } from "@/hooks/useCalculateROI";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentTask, setCurrentTask] = useState("");
  const [, setResultData] = useState<ROIResponse | null>(null);
  const { calculate } = useCalculateROI();

  const handleSubmit = async (taskName: string, manualMinutes: number) => {
    setCurrentTask(taskName);
    setAppState("calculating");

    const result = await calculate({ taskName, manualMinutes });

    if (result && result.success) {
      setResultData(result);
      setAppState("results");
    } else {
      setAppState("idle");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {appState === "idle" && (
        <HeroSection onSubmit={handleSubmit} isDisabled={false} />
      )}

      {appState === "calculating" && (
        <LoadingSection taskName={currentTask} />
      )}

      {appState === "results" && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-neon-green font-mono text-xl">
            Results ready! (Phase 5 will build this UI)
          </p>
        </div>
      )}
    </main>
  );
}
