# Phase 6: State Machine, Wiring & End-to-End Flow (Steps 26–30)

> **Goal:** Harden the state machine, add proper error handling, add a minimum loading duration (so the terminal animation always plays for at least 3 seconds even if Gemini responds instantly), and ensure the entire idle → calculating → results → reset loop works robustly. By the end of Phase 6, the full app is functional end-to-end.

---

## Step 26 – Create a Minimum Loading Duration Utility

**Why:** Gemini often responds in 1-2 seconds, but the terminal animation needs at least 3 seconds to feel satisfying. We need a utility to enforce a minimum wait time.

**Create new file:** `src/lib/utils.ts`

```typescript
/**
 * Returns a promise that resolves after at least `minMs` milliseconds,
 * even if the inner promise resolves faster.
 * 
 * Usage:
 *   const data = await withMinDuration(fetchFromGemini(), 3000);
 */
export async function withMinDuration<T>(
  promise: Promise<T>,
  minMs: number
): Promise<T> {
  const [result] = await Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, minMs)),
  ]);
  return result;
}
```

---

## Step 27 – Build the Error Display Component

**Why:** When the API fails (network error, Gemini down, invalid response), the user needs clear feedback instead of silently resetting.

**Create new file:** `src/components/ui/ErrorDisplay.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="terminal-box max-w-lg w-full text-center">
        <AlertTriangle className="w-12 h-12 text-blood-red mx-auto mb-4" />
        <h2 className="text-xl font-bold text-blood-red mb-2">
          Build Failed
        </h2>
        <p className="text-muted text-sm mb-6 font-mono">
          {message}
        </p>
        <button
          id="retry-button"
          onClick={onRetry}
          className="btn-primary inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          npm run retry
        </button>
      </div>
    </motion.div>
  );
}
```

---

## Step 28 – Update the Page with Full State Machine

**Why:** Integrate the minimum loading duration, error state, and proper transitions into the main page controller.

**Replace the entire contents of `src/app/page.tsx` with:**

```tsx
"use client";

import { useState, useCallback } from "react";
import HeroSection from "@/components/hero/HeroSection";
import LoadingSection from "@/components/terminal/LoadingSection";
import ResultsDashboard from "@/components/results/ResultsDashboard";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import type { AppState, ROIResponse } from "@/types";
import { useCalculateROI } from "@/hooks/useCalculateROI";
import { withMinDuration } from "@/lib/utils";

const MIN_LOADING_MS = 3500; // Minimum time to show terminal animation

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
        // Enforce minimum loading duration for UX
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

  return (
    <main className="min-h-screen bg-background">
      {/* Error overlay — shows on top of idle state */}
      {errorMessage && appState === "idle" && (
        <ErrorDisplay message={errorMessage} onRetry={handleRetry} />
      )}

      {/* Normal idle state (no error) */}
      {appState === "idle" && !errorMessage && (
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
```

---

## Step 29 – Add Page Transition Animations

**Why:** Transitions between states should feel smooth, not jarring. Wrap each state section in `AnimatePresence` for enter/exit animations.

**Replace the entire contents of `src/app/page.tsx` with** (this enhances Step 28):

```tsx
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
```

---

## Step 30 – Full End-to-End Verification

**Why:** Verify the complete user flow works with real Gemini calls.

### 30a. Ensure `.env.local` has a valid API key

```
GEMINI_API_KEY=your_real_api_key_here
```

### 30b. Start the dev server

```bash
pnpm dev
```

### 30c. Complete flow test — run through all these scenarios

**Scenario 1: Happy path**
1. ✅ Open `http://localhost:3000`
2. ✅ Enter "Folding laundry" and "5"
3. ✅ Click "Calculate Automation ROI"
4. ✅ Terminal loading animation plays for at least 3.5 seconds
5. ✅ Results dashboard appears with all metrics
6. ✅ 5 stack items are listed in left column
7. ✅ Roast is displayed in right column
8. ✅ Click "Close Laptop and Go Do It." → browser attempts to close/navigates to about:blank
9. ✅ Re-open `http://localhost:3000`, repeat, click "try again" → returns to hero section

**Scenario 2: Rapid Gemini response**
1. ✅ Enter any task and minutes
2. ✅ Submit — even if Gemini responds in 1 second, the terminal animation should play for at least 3.5 seconds
3. ✅ Smooth transition to results after the minimum duration

**Scenario 3: Error handling**
1. ✅ Temporarily set `GEMINI_API_KEY=invalid_key` in `.env.local`
2. ✅ Restart dev server (`pnpm dev`)
3. ✅ Submit a task
4. ✅ After loading, error display should appear with "Build Failed" message
5. ✅ Click "npm run retry" → should retry the same task
6. ✅ Restore the correct API key before continuing

**Scenario 4: Page transitions**
1. ✅ Verify fade transitions between idle → loading → results → idle
2. ✅ No janky flashes or layout jumps

**Stop the dev server with `Ctrl+C` after confirming.**

---

## Architectural Decisions Made in Phase 6

| # | Decision | Reasoning |
|---|----------|-----------|
| 1 | **3.5 second minimum loading** | 3.5s is enough time to show ~4 terminal log lines (at 800ms each), creating a satisfying animation. Too short = animation feels interrupted. Too long = users leave. |
| 2 | **`withMinDuration` utility** | Clean way to enforce minimum wait. Uses `Promise.all` so the API call runs immediately — no artificial delay added. |
| 3 | **Error as separate "screen"** | Rather than a toast/modal, the error fills the whole viewport to match the brutalist aesthetic. |
| 4 | **`AnimatePresence mode="wait"`** | Ensures exit animations complete before enter animations start, preventing overlapping states. |
| 5 | **`useCallback` for handlers** | Prevents unnecessary re-renders of child components from function identity changes. |
| 6 | **Retry preserves original inputs** | If the API fails, pressing "retry" re-submits the same task/minutes without the user re-typing. |
