"use client";

import { useState } from "react";
import HeroSection from "@/components/hero/HeroSection";
import LoadingSection from "@/components/terminal/LoadingSection";
import ResultsDashboard from "@/components/results/ResultsDashboard";
import type { AppState, ROIResponse } from "@/types";
import { useCalculateROI } from "@/hooks/useCalculateROI";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentTask, setCurrentTask] = useState("");
  const [resultData, setResultData] = useState<ROIResponse | null>(null);
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

  const handleReset = () => {
    setAppState("idle");
    setResultData(null);
    setCurrentTask("");
  };

  return (
    <main className="min-h-screen bg-background">
      {appState === "idle" && (
        <HeroSection onSubmit={handleSubmit} isDisabled={false} />
      )}

      {appState === "calculating" && (
        <LoadingSection taskName={currentTask} />
      )}

      {appState === "results" && resultData?.data && (
        <ResultsDashboard data={resultData.data} onReset={handleReset} />
      )}
    </main>
  );
}
