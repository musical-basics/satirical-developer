# Phase 3: API Route & Gemini Integration (Steps 11–15)

> **Goal:** Build the `/api/calculate-roi` Next.js API route that takes a task name + minutes, sends a system prompt to Gemini, parses the JSON response, computes `netHoursWasted`, and returns a typed `ROIResponse`. By the end of Phase 3, you can hit the API with `curl` and get a valid JSON roast back.

---

## Step 11 – Create the Gemini Client Utility

**Why:** Encapsulate the Gemini SDK initialization in a reusable utility so the API route stays clean.

**Create new file:** `src/lib/gemini.ts`

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not set. Add it to .env.local"
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 1.0,  // High creativity for funnier roasts
  },
});
```

---

## Step 12 – Create the System Prompt

**Why:** The system prompt is the heart of the AI behavior. It must instruct Gemini to return a strict JSON schema and act as a cynical Staff Engineer.

**Create new file:** `src/lib/prompts.ts`

```typescript
import type { ROIRequest } from "@/types";

export function buildSystemPrompt(request: ROIRequest): string {
  return `You are a cynical, battle-hardened Staff Engineer who has seen too many developers waste their lives over-engineering simple tasks. You have ZERO patience for this behavior.

A developer has come to you because they are avoiding this simple task:
- Task: "${request.taskName}"
- Time to do it manually: ${request.manualMinutes} minutes

Your job is to roast them by designing the most absurdly over-engineered software solution possible for this mundane task.

You MUST respond with a valid JSON object matching this EXACT schema (no markdown, no code fences, just raw JSON):

{
  "proposedStack": ["string", "string", "string", "string", "string"],
  "architectureSummary": "string",
  "automationHours": number,
  "roast": "string"
}

Rules:
1. "proposedStack" must be an array of exactly 5 absurdly overkill technologies. Be creative and specific. Examples: "Kubernetes cluster for sock management", "Apache Kafka for towel-fold event streaming", "Redis cluster for underwear state caching". Reference the actual task in each technology name.
2. "architectureSummary" must be exactly 1 sentence describing the ridiculous system architecture as if it were a legitimate technical design document.
3. "automationHours" must be a number between 40 and 2000. The simpler the original task, the higher this number should be.
4. "roast" must be exactly 2 sentences. The first sentence should mock their specific task avoidance. The second sentence should tell them to close their laptop and go do it. Be brutal but funny. Use developer humor.

Remember: You are generating comedy. Be creative, be specific to their task, and be ruthless.`;
}
```

---

## Step 13 – Build the API Route Handler

**Why:** This is the server-side endpoint that receives the form data, calls Gemini, validates the response, and returns a typed `ROIResponse`.

**Create new file:** `src/app/api/calculate-roi/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { buildSystemPrompt } from "@/lib/prompts";
import type { ROIRequest, AIResponsePayload, ROIResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate the request body
    const body: ROIRequest = await request.json();

    if (!body.taskName || typeof body.taskName !== "string" || body.taskName.trim().length === 0) {
      return NextResponse.json<ROIResponse>(
        { success: false, error: "taskName is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (!body.manualMinutes || typeof body.manualMinutes !== "number" || body.manualMinutes <= 0) {
      return NextResponse.json<ROIResponse>(
        { success: false, error: "manualMinutes is required and must be a positive number." },
        { status: 400 }
      );
    }

    // 2. Build the prompt and call Gemini
    const prompt = buildSystemPrompt(body);
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 3. Parse the JSON response from Gemini
    let aiPayload: AIResponsePayload;
    try {
      aiPayload = JSON.parse(text);
    } catch {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json<ROIResponse>(
        { success: false, error: "AI returned invalid JSON. Please try again." },
        { status: 502 }
      );
    }

    // 4. Validate the parsed response has required fields
    if (
      !Array.isArray(aiPayload.proposedStack) ||
      typeof aiPayload.architectureSummary !== "string" ||
      typeof aiPayload.automationHours !== "number" ||
      typeof aiPayload.roast !== "string"
    ) {
      console.error("Gemini response missing required fields:", aiPayload);
      return NextResponse.json<ROIResponse>(
        { success: false, error: "AI response was incomplete. Please try again." },
        { status: 502 }
      );
    }

    // 5. Compute derived fields and return
    const netHoursWasted = aiPayload.automationHours - body.manualMinutes / 60;

    return NextResponse.json<ROIResponse>({
      success: true,
      data: {
        ...aiPayload,
        taskName: body.taskName,
        manualMinutes: body.manualMinutes,
        netHoursWasted: Math.round(netHoursWasted * 10) / 10, // Round to 1 decimal
      },
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json<ROIResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
```

---

## Step 14 – Create the API Client Hook

**Why:** Encapsulate the fetch logic in a custom hook so the component doesn't manage raw fetch calls.

**Create new file:** `src/hooks/useCalculateROI.ts`

```typescript
"use client";

import { useState } from "react";
import type { ROIRequest, ROIResponse } from "@/types";

export function useCalculateROI() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ROIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (request: ROIRequest) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/calculate-roi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data: ROIResponse = await response.json();

      if (!data.success) {
        setError(data.error || "Something went wrong.");
        return null;
      }

      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error. Please try again.";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return { calculate, isLoading, result, error, reset };
}
```

---

## Step 15 – Test the API Route with curl

**Why:** Verify the API works independently before wiring it to the UI.

### 15a. Add your Gemini API key

**Edit `.env.local`** and replace `your_api_key_here` with your real Gemini API key:

```
GEMINI_API_KEY=your_real_api_key_here
```

### 15b. Start the dev server

```bash
pnpm dev
```

### 15c. Test with curl

**In a separate terminal:**

```bash
curl -X POST http://localhost:3000/api/calculate-roi \
  -H "Content-Type: application/json" \
  -d '{"taskName": "Packing my suitcase", "manualMinutes": 15}'
```

**Expected response (shape — exact content will vary):**

```json
{
  "success": true,
  "data": {
    "proposedStack": [
      "Kubernetes cluster for garment containerization",
      "Apache Kafka for suitcase-packing event streaming",
      "Redis for folding-state caching layer",
      "GraphQL gateway for wardrobe item resolution",
      "TensorFlow model for optimal packing arrangement prediction"
    ],
    "architectureSummary": "A distributed microservices architecture leveraging real-time event streams to orchestrate the precise folding and spatial optimization of clothing items into a standardized luggage container.",
    "automationHours": 347,
    "roast": "You're out here trying to automate packing a suitcase instead of spending 15 minutes throwing clothes in a bag like a normal person. Close your laptop, grab your suitcase, and pack the thing before your flight leaves without you.",
    "taskName": "Packing my suitcase",
    "manualMinutes": 15,
    "netHoursWasted": 346.8
  }
}
```

### 15d. Test error handling

```bash
# Missing taskName
curl -X POST http://localhost:3000/api/calculate-roi \
  -H "Content-Type: application/json" \
  -d '{"manualMinutes": 15}'

# Expected: {"success":false,"error":"taskName is required..."}

# Missing manualMinutes
curl -X POST http://localhost:3000/api/calculate-roi \
  -H "Content-Type: application/json" \
  -d '{"taskName": "test"}'

# Expected: {"success":false,"error":"manualMinutes is required..."}
```

**Stop the dev server with `Ctrl+C` after confirming.**

---

## Architectural Decisions Made in Phase 3

| # | Decision | Reasoning |
|---|----------|-----------|
| 1 | **`responseMimeType: "application/json"`** on Gemini config | Forces Gemini to return raw JSON instead of markdown-wrapped code blocks. Eliminates need for regex stripping. |
| 2 | **`temperature: 1.0`** | Higher creativity = funnier roasts. Lower temperature would give boring, safe responses. |
| 3 | **Server-side only Gemini calls** | API key stays on the server. Never exposed to the client. Follows user's rule about server-side actions. |
| 4 | **No retry logic** (for now) | Gemini is fast and reliable. Adding retry logic adds complexity. Can add in Phase 7 polish if needed. |
| 5 | **Custom hook `useCalculateROI`** | Separates network logic from UI. The hook manages loading/error/result states cleanly. |
| 6 | **Rounding `netHoursWasted` to 1 decimal** | Avoids ugly floating-point numbers like `346.75000001`. |
