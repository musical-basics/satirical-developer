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
        netHoursWasted: Math.round(netHoursWasted * 10) / 10,
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
