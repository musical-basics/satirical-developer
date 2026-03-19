"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "@/components/hero/HeroSection";
import LoadingSection from "@/components/terminal/LoadingSection";
import ResultsDashboard from "@/components/results/ResultsDashboard";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import type { AppState, ROIResponse } from "@/types";
import { useCalculateROI } from "@/hooks/useCalculateROI";
import { withMinDuration } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const MIN_LOADING_MS = 3500;

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentTask, setCurrentTask] = useState("");
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [resultData, setResultData] = useState<ROIResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { calculate } = useCalculateROI();

  const handleSubmit = useCallback(
    async (taskName: string, manualMinutes: number) => {
      setCurrentTask(taskName);
      setCurrentMinutes(manualMinutes);
      setAppState("calculating");
      setErrorMessage(null);
      setResultData(null);

      try {
        const result = await withMinDuration(
          calculate({ taskName, manualMinutes }),
          MIN_LOADING_MS
        );

        if (result && result.success) {
          setResultData(result);
          setAppState("results");
        } else {
          setErrorMessage(
            result?.error || "The AI couldn't generate a response. Please try again."
          );
          setAppState("idle");
        }
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
        setAppState("idle");
      }
    },
    [calculate]
  );

  const handleReset = useCallback(() => {
    setAppState("idle");
    setResultData(null);
    setCurrentTask("");
    setCurrentMinutes(0);
    setErrorMessage(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (currentTask && currentMinutes > 0) {
      handleSubmit(currentTask, currentMinutes);
    } else {
      handleReset();
    }
  }, [currentTask, currentMinutes, handleSubmit, handleReset]);

  useKeyboardShortcuts({
    onEscape: handleReset,
  });

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {/* Error state */}
        {errorMessage && appState === "idle" && (
          <motion.div
            key="error"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ErrorDisplay message={errorMessage} onRetry={handleRetry} />
          </motion.div>
        )}

        {/* Idle / Hero state */}
        {appState === "idle" && !errorMessage && (
          <motion.div
            key="idle"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <HeroSection onSubmit={handleSubmit} isDisabled={false} />
          </motion.div>
        )}

        {/* Calculating / Loading state */}
        {appState === "calculating" && (
          <motion.div
            key="calculating"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <LoadingSection taskName={currentTask} />
          </motion.div>
        )}

        {/* Results state */}
        {appState === "results" && resultData?.data && (
          <motion.div
            key="results"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ResultsDashboard data={resultData.data} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
