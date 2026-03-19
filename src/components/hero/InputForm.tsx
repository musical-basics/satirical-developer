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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-10">
      {/* Task Name Input */}
      <div className="space-y-3">
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
      <div className="space-y-3">
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
