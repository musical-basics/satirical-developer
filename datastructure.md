# Data Structures & Schemas

## 1. API Request Payload
Sent from the client to the `/api/calculate-roi` Next.js route:
```typescript
interface ROIRequest {
  taskName: string;      // e.g., "Packing my suitcase"
  manualMinutes: number; // e.g., 15
}
2. Gemini System Prompt & Expected JSON Output
The server prompts Gemini to act as a cynical Staff Engineer. It MUST return this exact JSON structure:

TypeScript
interface AIResponsePayload {
  proposedStack: string[];     // Array of 4-5 absurdly overkill technologies
  architectureSummary: string; // 1 sentence explaining the ridiculous system
  automationHours: number;     // An absurdly high number (e.g., 42)
  roast: string;               // A 2-sentence brutal roast telling them to just do the task
}
3. UI State (Zustand or React useState)
TypeScript
type AppState = 'idle' | 'calculating' | 'results';