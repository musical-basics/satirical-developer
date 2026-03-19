# Phase 4: Loading State & Terminal Animation (Steps 16–20)

> **Goal:** Build the "Processing State" — a fake terminal window that cycles through hilarious developer log messages while the real API call to Gemini runs in the background. By the end of Phase 4, clicking "Calculate" shows an animated terminal with scrolling fake logs, and when the API returns, the state transitions to `"results"`.

---

## Step 16 – Create the Fake Loading Messages Data

**Why:** The PRD specifies cycling through developer tropes every ~800ms. We need a large array of funny messages.

**Create new file:** `src/lib/loading-messages.ts`

```typescript
export const LOADING_MESSAGES: string[] = [
  "> npm install @over-engineering/core",
  "> resolving 847 dependency conflicts...",
  "> bootstrapping Next.js for laundry management...",
  "> abstracting the socks array into a microservice...",
  "> deploying Kubernetes cluster for towel folding...",
  "> configuring reverse proxy for shirt organization...",
  "> initializing Redis cache for underwear state...",
  "> setting up Apache Kafka for chore event streaming...",
  "> writing 14 unit tests for a 2-line function...",
  "> arguing with Cursor about semicolons...",
  "> refactoring the dishwasher into a monorepo...",
  "> containerizing your procrastination with Docker...",
  "> provisioning AWS Lambda for trash takeout...",
  "> training a neural network to fold hoodies...",
  "> implementing OAuth2 for your sock drawer...",
  "> spinning up Terraform for bed-making infrastructure...",
  "> migrating your grocery list to PostgreSQL...",
  "> setting up CI/CD pipeline for vacuuming...",
  "> debugging race condition in the laundry queue...",
  "> optimizing GraphQL resolver for dish placement...",
  "> compiling TypeScript for 47 minutes...",
  "> stack overflow: 'how to automate touching grass'",
  "> generating 200-page RFC for taking out recycling...",
  "> scheduling standup to discuss mop architecture...",
  "> adding Sentry error tracking to toaster operations...",
];

/**
 * Returns a shuffled copy of the loading messages array.
 * Ensures messages appear in a different order each time.
 */
export function getShuffledMessages(): string[] {
  const shuffled = [...LOADING_MESSAGES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

---

## Step 17 – Build the Terminal Line Component

**Why:** Each log line in the terminal needs entry animation and proper formatting.

**Create new file:** `src/components/terminal/TerminalLine.tsx`

```tsx
"use client";

import { motion } from "framer-motion";

interface TerminalLineProps {
  message: string;
  index: number;
}

export default function TerminalLine({ message, index }: TerminalLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="text-neon-green text-sm md:text-base font-mono py-0.5"
    >
      {message}
    </motion.div>
  );
}
```

---

## Step 18 – Build the Terminal Window Component

**Why:** This is the main loading UI — a styled terminal window with a title bar, scrollable log area, and auto-scrolling behavior.

**Create new file:** `src/components/terminal/TerminalWindow.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TerminalLine from "@/components/terminal/TerminalLine";
import { getShuffledMessages } from "@/lib/loading-messages";

interface TerminalWindowProps {
  isActive: boolean;
}

export default function TerminalWindow({ isActive }: TerminalWindowProps) {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<string[]>(getShuffledMessages());
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isActive) return;

    // Show first message immediately
    setVisibleMessages([messagesRef.current[0]]);
    indexRef.current = 1;

    const interval = setInterval(() => {
      if (indexRef.current >= messagesRef.current.length) {
        // Reshuffle and start over if we run out
        messagesRef.current = getShuffledMessages();
        indexRef.current = 0;
      }

      setVisibleMessages((prev) => [
        ...prev,
        messagesRef.current[indexRef.current],
      ]);
      indexRef.current += 1;
    }, 800); // PRD specifies 800ms intervals

    return () => clearInterval(interval);
  }, [isActive]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Terminal Title Bar */}
      <div className="bg-terminal-gray border border-terminal-border border-b-0 rounded-t-lg px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blood-red" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-neon-green" />
        </div>
        <span className="text-muted text-xs ml-2 font-mono">
          procrastincalc — calculating your life choices
        </span>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="bg-background border border-terminal-border border-t-0 rounded-b-lg p-4 
                   h-[300px] md:h-[400px] overflow-y-auto"
      >
        {visibleMessages.map((msg, i) => (
          <TerminalLine key={`${msg}-${i}`} message={msg} index={i} />
        ))}

        {/* Blinking cursor at the bottom */}
        <div className="text-neon-green text-sm md:text-base font-mono py-0.5 cursor-blink">
          {">"}_
        </div>
      </div>
    </motion.div>
  );
}
```

---

## Step 19 – Build the Loading Section Wrapper

**Why:** The loading state needs a full-screen wrapper with the terminal window centered, plus a status message above it.

**Create new file:** `src/components/terminal/LoadingSection.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import TerminalWindow from "@/components/terminal/TerminalWindow";

interface LoadingSectionProps {
  taskName: string;
}

export default function LoadingSection({ taskName }: LoadingSectionProps) {
  return (
    <section
      id="loading-section"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      {/* Status header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Engineering a solution for:
        </h2>
        <p className="text-neon-green text-xl md:text-2xl font-bold">
          &quot;{taskName}&quot;
        </p>
      </motion.div>

      {/* Terminal */}
      <TerminalWindow isActive={true} />

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-muted/50 text-xs mt-8 text-center"
      >
        // This is taking longer than it would have taken you to just do the task...
      </motion.p>
    </section>
  );
}
```

---

## Step 20 – Wire Loading State to Page & Verify

**Why:** Connect the `LoadingSection` to `page.tsx` so the UI transitions from hero → loading when the button is clicked.

**Replace the entire contents of `src/app/page.tsx` with:**

```tsx
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

    // Fire off the API call in the background while terminal animates
    const result = await calculate({ taskName, manualMinutes });

    if (result && result.success) {
      setResultData(result);
      setAppState("results");
    } else {
      // On error, go back to idle (Phase 7 will add error UI)
      setAppState("idle");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {appState === "idle" && (
        <HeroSection
          onSubmit={handleSubmit}
          isDisabled={false}
        />
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
```

### Verify

**Terminal commands:**

```bash
pnpm dev
```

**Open `http://localhost:3000` and confirm:**

1. ✅ Fill in "Packing my suitcase" and "15" → Click "Calculate Automation ROI"
2. ✅ Screen transitions to loading state
3. ✅ Terminal window appears with macOS-style title bar (red/yellow/green dots)
4. ✅ "Engineering a solution for: 'Packing my suitcase'" heading visible
5. ✅ Fake log messages appear one by one every ~800ms
6. ✅ Terminal auto-scrolls to show newest messages
7. ✅ Each line has a subtle slide-in animation
8. ✅ Blinking cursor visible at the bottom of the terminal
9. ✅ After a few seconds (when Gemini responds), screen transitions to "Results ready!" placeholder
10. ✅ No TypeScript or console errors

**Stop the dev server with `Ctrl+C` after confirming.**

---

## Architectural Decisions Made in Phase 4

| # | Decision | Reasoning |
|---|----------|-----------|
| 1 | **800ms interval** for log messages | Directly from the PRD: "Rapidly cycles through fake logs every 800ms." |
| 2 | **Shuffled messages** each session | Prevents the same order every time. More fun on repeated uses. |
| 3 | **25 unique messages** | Enough to cover a typical Gemini response time (3-10 seconds). If API takes longer, messages reshuffle and continue. |
| 4 | **Auto-scroll** via `scrollRef` | Terminal should always show the latest log line, like a real terminal. |
| 5 | **API call fires simultaneously** with loading animation | The terminal animation is purely cosmetic — the real Gemini call happens in parallel. When the API returns, we immediately transition to results. |
