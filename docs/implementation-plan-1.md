# Phase 1: Project Scaffolding & Design System (Steps 1–5)

> **Goal:** Initialize a production-ready Next.js 14 project with Tailwind CSS, install every dependency, configure the design system tokens (colors, fonts, spacing), and create reusable TypeScript type files. By the end of Phase 1, `pnpm dev` runs with zero errors and shows the default Next.js page styled with our custom dark theme.

---

## Step 1 – Scaffold Next.js 14 with App Router

**Why:** We need a clean Next.js 14 project using the App Router inside the existing repo folder.

**Terminal commands (run from the repo root `/Users/lionelyu/Documents/New Version/satirical-developer`):**

```bash
# Check available options first
npx -y create-next-app@latest --help

# Scaffold into current directory
npx -y create-next-app@latest ./ \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm
```

**Expected result:** The repo root now has `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, etc.

**Gotcha:** If `create-next-app` asks interactive questions despite flags, the `--use-pnpm` flag may not exist on all versions. If that happens, just run:
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
Then manually rename `package-lock.json` → delete it, and run `pnpm install`.

---

## Step 2 – Install All Project Dependencies

**Why:** We need Framer Motion for animations, Lucide for icons, and the Google Generative AI SDK for Gemini.

**Terminal commands:**

```bash
# Production deps
pnpm add framer-motion lucide-react @google/generative-ai

# Dev deps (none extra needed beyond what create-next-app installed)
```

**Verify:**
```bash
pnpm ls --depth=0
```
You should see `framer-motion`, `lucide-react`, and `@google/generative-ai` listed.

---

## Step 3 – Configure Tailwind Design Tokens

**Why:** The PRD mandates a specific brutalist design system:
- Background: `#050505`
- Neon green (manual): `#00FF00`
- Blood red (automation): `#FF0000`
- Monospace font throughout

**File to edit:** `tailwind.config.ts`

**Replace the entire contents of `tailwind.config.ts` with:**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette from PRD
        background: "#050505",
        foreground: "#E0E0E0",
        "neon-green": "#00FF00",
        "blood-red": "#FF0000",
        "terminal-gray": "#1A1A1A",
        "terminal-border": "#333333",
        "muted": "#888888",
      },
      fontFamily: {
        mono: [
          "'JetBrains Mono'",
          "'Fira Code'",
          "'SF Mono'",
          "Consolas",
          "monospace",
        ],
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 255, 0, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 255, 0, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Step 4 – Set Up Global Styles & Font Import

**Why:** We need JetBrains Mono loaded globally, the body set to our dark background, and all default Next.js styling removed.

**File to edit:** `src/app/globals.css`

**Replace the entire contents of `src/app/globals.css` with:**

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: #050505;
    color: #E0E0E0;
    font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Custom scrollbar for terminal vibe */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #050505;
  }

  ::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555555;
  }
}

@layer components {
  /* Reusable terminal-style container */
  .terminal-box {
    @apply bg-terminal-gray border border-terminal-border rounded-lg p-6;
  }

  /* Glowing green button style */
  .btn-primary {
    @apply bg-neon-green text-background font-mono font-bold 
           px-8 py-4 rounded-md text-lg
           hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] 
           transition-all duration-300 
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  /* Red accent text */
  .text-danger {
    @apply text-blood-red font-bold;
  }

  /* Blinking cursor for terminal effect */
  .cursor-blink::after {
    content: "█";
    @apply animate-blink text-neon-green ml-1;
  }
}
```

---

## Step 5 – Create TypeScript Types & Verify Dev Server

**Why:** We need shared TypeScript interfaces from `datastructure.md` in a central location, and we need to confirm `pnpm dev` runs clean.

### 5a. Create the types file

**Create new file:** `src/types/index.ts`

```typescript
// ===== API Request Payload =====
// Sent from client → /api/calculate-roi
export interface ROIRequest {
  taskName: string;       // e.g., "Packing my suitcase"
  manualMinutes: number;  // e.g., 15
}

// ===== Gemini AI Response Payload =====
// Returned from Gemini, parsed by the API route
export interface AIResponsePayload {
  proposedStack: string[];      // Array of 4-5 absurdly overkill technologies
  architectureSummary: string;  // 1 sentence explaining the ridiculous system
  automationHours: number;      // An absurdly high number (e.g., 42)
  roast: string;                // A 2-sentence brutal roast
}

// ===== Full API Response =====
// Returned from /api/calculate-roi → client
export interface ROIResponse {
  success: boolean;
  data?: AIResponsePayload & {
    taskName: string;
    manualMinutes: number;
    netHoursWasted: number;  // automationHours - (manualMinutes / 60)
  };
  error?: string;
}

// ===== App State Machine =====
export type AppState = "idle" | "calculating" | "results";
```

### 5b. Create a `.env.local` template

**Create new file:** `.env.local`

```
# Google Gemini API Key
# Get yours at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here
```

### 5c. Also create `.env.example` (committed to git)

**Create new file:** `.env.example`

```
# Google Gemini API Key
# Get yours at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here
```

### 5d. Update `src/app/layout.tsx`

**Replace the entire contents of `src/app/layout.tsx` with:**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProcrastinCalc | Calculate Your Developer ROI",
  description:
    "Why spend 10 minutes doing a chore when you can spend 4 hours automating it? Calculate the true cost of over-engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
```

### 5e. Verify the dev server

**Terminal commands:**

```bash
pnpm dev
```

**Expected result:**
- Server starts on `http://localhost:3000`
- Page loads with a pitch-black `#050505` background
- Default Next.js content is visible but styled with monospace font
- No TypeScript errors, no build errors in terminal
- Stop the dev server with `Ctrl+C` after confirming

---

## Architectural Decisions Made in Phase 1

| # | Decision | Reasoning |
|---|----------|-----------|
| 1 | **JetBrains Mono** as primary font | Best monospace font for "terminal/hacker-chic" aesthetic. Loaded via Google Fonts CDN. |
| 2 | **`src/` directory** structure | Keeps app code separate from config files. Standard Next.js convention. |
| 3 | **Centralized types** in `src/types/index.ts` | Single source of truth for all interfaces, avoids duplication. |
| 4 | **Extended `ROIResponse`** type | Not in the original docs — added `netHoursWasted` computed field and `success`/`error` wrapper for proper API error handling. |
| 5 | **Tailwind component classes** (`.btn-primary`, `.terminal-box`) | Pre-built utility classes in `globals.css` so the executing AI doesn't need to remember long Tailwind strings. |
| 6 | **Custom CSS animations** in Tailwind config | `blink`, `fadeIn`, `slideUp`, `pulseGlow` — registered as first-class Tailwind utilities so they can be used as `animate-blink`, etc. |

## Questions for You Before Phase 2

1. **Extended `ROIResponse` type:** I added a `netHoursWasted` computed field (`automationHours - manualMinutes / 60`) and wrapped the response in `{ success, data?, error? }`. Is this okay, or do you want the API to return the raw `AIResponsePayload` only?
2. **Font choice:** JetBrains Mono from Google Fonts — happy with this, or do you want a different monospace font?
3. **Tailwind version:** `create-next-app@latest` currently installs **Tailwind v4**. Your `stack.md` just says "Tailwind CSS." Should I pin to **Tailwind v3** for stability, or is v4 fine?
