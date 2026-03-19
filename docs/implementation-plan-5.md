# Phase 5: Results Dashboard UI (Steps 21–25)

> **Goal:** Build the "Reality Check State" — the results dashboard that shows the Hours Wasted metric, the Proposed Architecture column, the AI Roast column, and the "Close Laptop" CTA. By the end of Phase 5, when you hardcode a fake `ROIResponse`, the results dashboard renders with all metrics and layout correct (but not yet animated — that's Phase 7).

---

## Step 21 – Build the Metric Card Component

**Why:** The "Hours Wasted" big number needs a dedicated, reusable stat card.

**Create new file:** `src/components/results/MetricCard.tsx`

```tsx
"use client";

import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: "red" | "green" | "default";
}

export default function MetricCard({
  label,
  value,
  unit,
  color = "default",
}: MetricCardProps) {
  const colorClasses = {
    red: "text-blood-red",
    green: "text-neon-green",
    default: "text-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="terminal-box text-center"
    >
      <p className="text-muted text-xs uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`text-5xl md:text-7xl font-bold ${colorClasses[color]}`}>
        {value}
        {unit && (
          <span className="text-lg md:text-2xl text-muted ml-2">{unit}</span>
        )}
      </p>
    </motion.div>
  );
}
```

---

## Step 22 – Build the Stack List Component

**Why:** The "Proposed Architecture" column needs to display the 5 ridiculous tech stack items.

**Create new file:** `src/components/results/StackList.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { Server } from "lucide-react";

interface StackListProps {
  stack: string[];
  summary: string;
}

export default function StackList({ stack, summary }: StackListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="terminal-box h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-5 h-5 text-neon-green" />
        <h3 className="text-lg font-bold text-neon-green uppercase tracking-wider">
          Proposed Architecture
        </h3>
      </div>

      {/* Architecture Summary */}
      <p className="text-muted text-sm mb-6 italic border-l-2 border-neon-green/30 pl-3">
        {summary}
      </p>

      {/* Stack Items */}
      <ul className="space-y-3">
        {stack.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
            className="flex items-start gap-3"
          >
            <span className="text-neon-green font-bold text-sm mt-0.5 shrink-0">
              [{String(i + 1).padStart(2, "0")}]
            </span>
            <span className="text-foreground text-sm">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
```

---

## Step 23 – Build the Roast Card Component

**Why:** The AI's personalized roast needs its own dramatic display with red accents.

**Create new file:** `src/components/results/RoastCard.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface RoastCardProps {
  roast: string;
  taskName: string;
}

export default function RoastCard({ roast, taskName }: RoastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="terminal-box h-full flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-blood-red" />
        <h3 className="text-lg font-bold text-blood-red uppercase tracking-wider">
          The Verdict
        </h3>
      </div>

      {/* Task reference */}
      <p className="text-muted text-xs mb-4 uppercase tracking-widest">
        RE: &quot;{taskName}&quot;
      </p>

      {/* The roast */}
      <div className="flex-1 flex items-center">
        <p className="text-foreground text-base md:text-lg leading-relaxed">
          &ldquo;{roast}&rdquo;
        </p>
      </div>

      {/* Signature */}
      <div className="mt-6 pt-4 border-t border-terminal-border">
        <p className="text-muted text-xs italic">
          — Your Staff Engineer (who is tired of your commits)
        </p>
      </div>
    </motion.div>
  );
}
```

---

## Step 24 – Build the Results Dashboard Section

**Why:** This wraps all result components into a cohesive dashboard layout matching the PRD's column structure.

**Create new file:** `src/components/results/ResultsDashboard.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import MetricCard from "@/components/results/MetricCard";
import StackList from "@/components/results/StackList";
import RoastCard from "@/components/results/RoastCard";
import { XCircle } from "lucide-react";

interface ResultsDashboardProps {
  data: {
    proposedStack: string[];
    architectureSummary: string;
    automationHours: number;
    roast: string;
    taskName: string;
    manualMinutes: number;
    netHoursWasted: number;
  };
  onReset: () => void;
}

export default function ResultsDashboard({
  data,
  onReset,
}: ResultsDashboardProps) {
  return (
    <section
      id="results-section"
      className="min-h-screen px-6 py-12 md:py-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-muted text-sm uppercase tracking-widest mb-2">
            // Analysis complete for
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            &quot;{data.taskName}&quot;
          </h2>
        </motion.div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricCard
            label="Hours to Automate"
            value={data.automationHours}
            unit="hrs"
            color="red"
          />
          <MetricCard
            label="Manual Time"
            value={data.manualMinutes}
            unit="min"
            color="green"
          />
          <MetricCard
            label="Net Time Wasted"
            value={data.netHoursWasted}
            unit="hrs"
            color="red"
          />
        </div>

        {/* Two Column Layout: Stack + Roast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StackList
            stack={data.proposedStack}
            summary={data.architectureSummary}
          />
          <RoastCard roast={data.roast} taskName={data.taskName} />
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center space-y-4"
        >
          <button
            id="close-laptop-button"
            onClick={() => {
              // Attempt to close the window, fall back to about:blank
              try {
                window.close();
              } catch {
                window.location.href = "about:blank";
              }
            }}
            className="bg-blood-red text-background font-mono font-bold 
                       px-10 py-5 rounded-md text-xl
                       hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] 
                       transition-all duration-300
                       flex items-center gap-3 mx-auto"
          >
            <XCircle className="w-6 h-6" />
            Close Laptop and Go Do It.
          </button>

          {/* Try Again link */}
          <button
            id="try-again-button"
            onClick={onReset}
            className="text-muted text-sm underline hover:text-neon-green transition-colors"
          >
            or waste more time with another calculation...
          </button>
        </motion.div>

        {/* Footer joke */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-muted/30 text-xs mt-16"
        >
          // You spent more time reading this result than it would have taken to
          do the task
        </motion.p>
      </div>
    </section>
  );
}
```

---

## Step 25 – Wire Results Dashboard to Page & Verify

**Why:** Connect the `ResultsDashboard` to `page.tsx` so the full idle → loading → results flow works.

**Replace the entire contents of `src/app/page.tsx` with:**

```tsx
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
      // On error, go back to idle (Phase 7 adds proper error UI)
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
```

### Verify

**Terminal commands:**

```bash
pnpm dev
```

**Open `http://localhost:3000` and do a full flow test:**

1. ✅ Enter "Packing my suitcase" and "15" in the hero section
2. ✅ Click "Calculate Automation ROI"
3. ✅ Terminal loading animation plays with fake logs
4. ✅ After Gemini responds, results dashboard appears
5. ✅ Top row shows 3 metric cards: "Hours to Automate" (red), "Manual Time" (green), "Net Time Wasted" (red)
6. ✅ Left column shows "Proposed Architecture" with 5 numbered stack items
7. ✅ Right column shows "The Verdict" with the AI's roast in quotes
8. ✅ "Close Laptop and Go Do It." red button visible at bottom
9. ✅ "or waste more time with another calculation..." link visible below CTA
10. ✅ Clicking "try again" resets to hero section

**Stop the dev server with `Ctrl+C` after confirming.**

---

## Architectural Decisions Made in Phase 5

| # | Decision | Reasoning |
|---|----------|-----------|
| 1 | **3-column metric row** (automate hours, manual time, net wasted) | PRD says "massive red number showing Hours Wasted" — we show all 3 for context, with red/green contrast. |
| 2 | **2-column layout** for stack + roast | PRD specifies "Left Column: Proposed Architecture, Right Column: Roast." Responsive: stacks on mobile. |
| 3 | **`window.close()` with `about:blank` fallback** | PRD says "physically attempts to close the window." Most browsers block `window.close()` on user-opened tabs, so we fall back to `about:blank`. |
| 4 | **"Try Again" reset button** | Not in PRD but essential UX — users should be able to recalculate without refreshing. |
| 5 | **Architecture summary** shown as italic blockquote | Differentiates the 1-line summary from the stack list. Subtle left-border accent. |
