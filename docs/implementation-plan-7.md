# Phase 7: Animations, Polish & Micro-interactions (Steps 31–35)

> **Goal:** Add the final layer of visual polish — counting number animations for metrics, particle/scanline effects, hover micro-interactions, keyboard shortcut support, and responsive design fixes. By the end of Phase 7, the app feels premium, alive, and delightfully over-the-top.

---

## Step 31 – Build Animated Counter Component

**Why:** The "Hours to Automate" metric should count up from 0 to the final number dramatically, not just appear. This is the money moment.

**Create new file:** `src/components/ui/AnimatedCounter.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    if (value >= 100) return Math.round(latest);
    return Math.round(latest * 10) / 10;
  });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (v) => {
      setDisplayValue(String(v));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, motionValue, rounded]);

  return (
    <motion.span className={className}>
      {displayValue}
    </motion.span>
  );
}
```

---

## Step 32 – Update MetricCard to Use AnimatedCounter

**Why:** Wire the counting animation into the metric cards on the results dashboard.

**Replace the entire contents of `src/components/results/MetricCard.tsx` with:**

```tsx
"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: "red" | "green" | "default";
  animateValue?: boolean;
  delay?: number;
}

export default function MetricCard({
  label,
  value,
  unit,
  color = "default",
  animateValue = true,
  delay = 0,
}: MetricCardProps) {
  const colorClasses = {
    red: "text-blood-red",
    green: "text-neon-green",
    default: "text-foreground",
  };

  const glowClasses = {
    red: "hover:shadow-[0_0_30px_rgba(255,0,0,0.15)]",
    green: "hover:shadow-[0_0_30px_rgba(0,255,0,0.15)]",
    default: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`terminal-box text-center transition-shadow duration-500 ${glowClasses[color]}`}
    >
      <p className="text-muted text-xs uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`text-5xl md:text-7xl font-bold ${colorClasses[color]}`}>
        {animateValue && typeof value === "number" ? (
          <AnimatedCounter value={value} duration={2} />
        ) : (
          value
        )}
        {unit && (
          <span className="text-lg md:text-2xl text-muted ml-2">{unit}</span>
        )}
      </p>
    </motion.div>
  );
}
```

---

## Step 33 – Add Scanline Overlay Effect

**Why:** A subtle CRT scanline effect over the whole page reinforces the terminal/hacker aesthetic.

### 33a. Add scanline CSS to `src/app/globals.css`

**Append the following at the very end of `src/app/globals.css`:**

```css
@layer components {
  /* CRT scanline overlay effect */
  .scanline-overlay {
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.03) 0px,
      rgba(0, 0, 0, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
  }
}
```

### 33b. Add the overlay to `src/app/layout.tsx`

**Replace the entire contents of `src/app/layout.tsx` with:**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProcrastinCalc | Calculate Your Developer ROI",
  description:
    "Why spend 10 minutes doing a chore when you can spend 4 hours automating it? Calculate the true cost of over-engineering.",
  openGraph: {
    title: "ProcrastinCalc | Calculate Your Developer ROI",
    description:
      "Why spend 10 minutes doing a chore when you can spend 4 hours automating it?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProcrastinCalc | Calculate Your Developer ROI",
    description:
      "Why spend 10 minutes doing a chore when you can spend 4 hours automating it?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">
        {children}
        {/* CRT scanline overlay for hacker aesthetic */}
        <div className="scanline-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
```

---

## Step 34 – Add Keyboard Shortcut Support

**Why:** Power users (developers are the target audience) expect keyboard shortcuts. Enter to submit, Escape to reset.

**Create new file:** `src/hooks/useKeyboardShortcuts.ts`

```typescript
"use client";

import { useEffect } from "react";

interface KeyboardShortcutOptions {
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onEscape }: KeyboardShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key — reset to idle
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEscape]);
}
```

### Wire it into `src/app/page.tsx`

**Add this import at the top of page.tsx:**

```tsx
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
```

**Add this hook call inside the `Home` component, after the state declarations:**

```tsx
useKeyboardShortcuts({
  onEscape: handleReset,
});
```

---

## Step 35 – Responsive Design Audit & Fix

**Why:** Ensure the app looks great on mobile, tablet, and desktop.

### 35a. Update `src/components/hero/HeroSection.tsx`

Ensure these responsive classes are present:

- Heading: `text-3xl sm:text-4xl md:text-6xl lg:text-7xl`
- Subheading: `text-sm sm:text-base md:text-lg`
- Section padding: `px-4 sm:px-6 py-12 sm:py-20`

**Replace the GlitchText usage in `HeroSection.tsx`:**

```tsx
<GlitchText
  text="Calculate Your Developer ROI."
  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-center mb-4 text-foreground leading-tight"
/>
```

### 35b. Update `src/components/results/ResultsDashboard.tsx` metric grid

Ensure the metric grid is responsive:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
```

### 35c. Test at these viewport widths

| Viewport | What to check |
|----------|---------------|
| 375px (iPhone SE) | All text readable, inputs full-width, cards stack vertically |
| 768px (iPad) | 2-column metrics, stacked stack+roast |
| 1024px (laptop) | Full 3-column metrics, 2-column stack+roast |
| 1440px (desktop) | Everything centered, max-widths respected |

### Verify

```bash
pnpm dev
```

1. ✅ Open Chrome DevTools → responsive mode
2. ✅ Test at 375px, 768px, 1024px, 1440px
3. ✅ Number counter animation plays on results page
4. ✅ Subtle scanline effect visible (very faint horizontal lines)
5. ✅ Press Escape on results page → resets to hero
6. ✅ Hover over metric cards → subtle glow effect
7. ✅ All text is readable at every breakpoint

**Stop the dev server with `Ctrl+C` after confirming.**

---

## Architectural Decisions Made in Phase 7

| # | Decision | Reasoning |
|---|----------|-----------|
| 1 | **Framer Motion `useMotionValue` + `animate`** for counter | Performant, GPU-accelerated animation. Better than `setInterval`-based counting. |
| 2 | **Scanline overlay as fixed div** | Uses `pointer-events: none` so it doesn't block clicks. Pure CSS, zero performance cost. |
| 3 | **`z-index: 50`** for scanlines | Above content but below modals (if we add any). |
| 4 | **Opacity `0.03`** for scanlines | Barely visible — just enough to add texture without hurting readability. |
| 5 | **Escape key shortcut only** | Enter already works for form submission. Escape is the natural "go back" key. No other shortcuts needed for a 1-page app. |
