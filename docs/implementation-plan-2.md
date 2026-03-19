# Phase 2: Layout, Hero Section & Input Form (Steps 6–10)

> **Goal:** Build the full "Confession State" (idle) UI — the hero section with the big heading, the two input fields, and the submit button. By the end of Phase 2, the user sees a stunning brutalist landing page and can type into both fields and click the button (which does nothing yet beyond a `console.log`).

---

## Step 6 – Create the Folder Structure for Components

**Why:** Organize components into logical folders before writing any UI code.

**Terminal commands:**

```bash
mkdir -p src/components/hero
mkdir -p src/components/terminal
mkdir -p src/components/results
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p src/hooks
```

**Expected folder structure after this step:**

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── hero/          ← Hero section components
│   ├── terminal/      ← Loading terminal components
│   ├── results/       ← Results dashboard components
│   └── ui/            ← Reusable UI primitives
├── hooks/             ← Custom React hooks
├── lib/               ← Utility functions
└── types/
    └── index.ts
```

---

## Step 7 – Build the Glitch Text Component

**Why:** The heading needs a glitchy, hacker-aesthetic text effect to match the brutalist design.

**Create new file:** `src/components/ui/GlitchText.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

export default function GlitchText({
  text,
  className = "",
  as: Tag = "h1",
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(true);

  useEffect(() => {
    if (!isGlitching) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === " ") return " ";
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );

      iteration += 1 / 2;

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text, isGlitching]);

  return (
    <Tag
      className={`font-mono font-bold tracking-tight ${className}`}
      data-text={text}
    >
      {displayText}
    </Tag>
  );
}
```

---

## Step 8 – Build the Input Form Component

**Why:** This is the core input UI — two fields: task name (string) and manual minutes (number), plus the submit button.

**Create new file:** `src/components/hero/InputForm.tsx`

```tsx
"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

interface InputFormProps {
  onSubmit: (taskName: string, manualMinutes: number) => void;
  isDisabled: boolean;
}

export default function InputForm({ onSubmit, isDisabled }: InputFormProps) {
  const [taskName, setTaskName] = useState("");
  const [manualMinutes, setManualMinutes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(manualMinutes, 10);
    if (!taskName.trim() || isNaN(minutes) || minutes <= 0) return;
    onSubmit(taskName.trim(), minutes);
  };

  const isValid = taskName.trim().length > 0 && parseInt(manualMinutes, 10) > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      {/* Task Name Input */}
      <div className="space-y-2">
        <label
          htmlFor="task-name-input"
          className="block text-sm text-muted uppercase tracking-widest"
        >
          {">"} What simple task are you actively avoiding?
        </label>
        <input
          id="task-name-input"
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          disabled={isDisabled}
          placeholder="Packing my suitcase..."
          className="w-full bg-terminal-gray border border-terminal-border rounded-md 
                     px-4 py-3 text-foreground font-mono text-lg
                     placeholder:text-muted/50
                     focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(0,255,0,0.2)]
                     transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Manual Minutes Input */}
      <div className="space-y-2">
        <label
          htmlFor="manual-minutes-input"
          className="block text-sm text-muted uppercase tracking-widest"
        >
          {">"} How many minutes would it take to just do it?
        </label>
        <input
          id="manual-minutes-input"
          type="number"
          value={manualMinutes}
          onChange={(e) => setManualMinutes(e.target.value)}
          disabled={isDisabled}
          placeholder="15"
          min="1"
          max="999"
          className="w-full bg-terminal-gray border border-terminal-border rounded-md 
                     px-4 py-3 text-foreground font-mono text-lg
                     placeholder:text-muted/50
                     focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(0,255,0,0.2)]
                     transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* Submit Button */}
      <button
        id="calculate-roi-button"
        type="submit"
        disabled={isDisabled || !isValid}
        className="btn-primary w-full flex items-center justify-center gap-3 text-lg group"
      >
        {isDisabled ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            Calculate Automation ROI
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
```

---

## Step 9 – Build the Hero Section Component

**Why:** This wraps the GlitchText heading + InputForm into a full-screen "Confession State" section.

**Create new file:** `src/components/hero/HeroSection.tsx`

```tsx
"use client";

import GlitchText from "@/components/ui/GlitchText";
import InputForm from "@/components/hero/InputForm";
import { Terminal } from "lucide-react";

interface HeroSectionProps {
  onSubmit: (taskName: string, manualMinutes: number) => void;
  isDisabled: boolean;
}

export default function HeroSection({ onSubmit, isDisabled }: HeroSectionProps) {
  return (
    <section
      id="hero-section"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      {/* Terminal icon badge */}
      <div className="flex items-center gap-2 text-neon-green mb-6 text-sm uppercase tracking-widest">
        <Terminal className="w-4 h-4" />
        <span>ProcrastinCalc v1.0.0</span>
      </div>

      {/* Main heading with glitch effect */}
      <GlitchText
        text="Calculate Your Developer ROI."
        className="text-4xl md:text-6xl lg:text-7xl text-center mb-4 text-foreground"
      />

      {/* Subheading */}
      <p className="text-muted text-center max-w-xl mb-12 text-base md:text-lg">
        Why spend 10 minutes doing a chore when you can spend 4 hours
        automating it?{" "}
        <span className="text-neon-green">Let&apos;s calculate the damage.</span>
      </p>

      {/* Input form */}
      <InputForm onSubmit={onSubmit} isDisabled={isDisabled} />

      {/* Bottom decoration */}
      <div className="mt-16 text-muted/30 text-xs text-center">
        <p>// WARNING: No actual productivity was harmed in the making of this calculator</p>
      </div>
    </section>
  );
}
```

---

## Step 10 – Wire Up the Page & Verify

**Why:** Connect the HeroSection to `page.tsx` so the full idle state renders.

**Replace the entire contents of `src/app/page.tsx` with:**

```tsx
"use client";

import { useState } from "react";
import HeroSection from "@/components/hero/HeroSection";
import type { AppState } from "@/types";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");

  const handleSubmit = (taskName: string, manualMinutes: number) => {
    console.log("Submitted:", { taskName, manualMinutes });
    // Phase 3+ will wire this to the API
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
```

### Verify

**Terminal commands:**

```bash
pnpm dev
```

**Open `http://localhost:3000` and confirm:**

1. ✅ Dark `#050505` background fills the entire viewport
2. ✅ "ProcrastinCalc v1.0.0" badge with terminal icon visible at top
3. ✅ "Calculate Your Developer ROI." heading renders with glitch animation on load
4. ✅ Subheading with "Let's calculate the damage." in green
5. ✅ Two input fields with terminal-style borders
6. ✅ Green "Calculate Automation ROI" button at bottom
7. ✅ Button is disabled until both fields are filled
8. ✅ Clicking button → screen changes to "Processing" with blinking cursor
9. ✅ Monospace font (JetBrains Mono) everywhere
10. ✅ No TypeScript or console errors

**Stop the dev server with `Ctrl+C` after confirming.**

---

## Architectural Decisions Made in Phase 2

| # | Decision | Reasoning |
|---|----------|-----------|
| 1 | **`"use client"` on all interactive components** | Next.js App Router requires this for components using `useState`, `useEffect`, event handlers. |
| 2 | **GlitchText as reusable component** | The glitch effect can be reused on the results page headings too. |
| 3 | **Form validation inline** (not a library) | For 2 fields, a form library (react-hook-form, zod) is overkill. Simple state + validation. |
| 4 | **Component folder structure by feature** | `hero/`, `terminal/`, `results/` — easier for the executing AI to find files. |
| 5 | **Page-level state management with `useState`** | AppState lives in `page.tsx` for now. Simple enough for 3 states. No Zustand needed yet. |
