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
