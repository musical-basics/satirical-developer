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
