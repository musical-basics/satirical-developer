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
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20"
    >
      {/* Terminal icon badge */}
      <div className="flex items-center gap-2 text-neon-green mb-6 text-sm uppercase tracking-widest">
        <Terminal className="w-4 h-4" />
        <span>ProcrastinCalc v1.0.0</span>
      </div>

      {/* Main heading with glitch effect */}
      <GlitchText
        text="Calculate Your Developer ROI."
        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-center mb-4 text-foreground leading-tight"
      />

      {/* Subheading */}
      <p className="text-muted text-center max-w-xl mb-12 text-sm sm:text-base md:text-lg">
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
