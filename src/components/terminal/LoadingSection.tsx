"use client";

import { motion } from "framer-motion";
import TerminalWindow from "@/components/terminal/TerminalWindow";

interface LoadingSectionProps {
  taskName: string;
}

export default function LoadingSection({ taskName }: LoadingSectionProps) {
  return (
    <section
      id="loading-section"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      {/* Status header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Engineering a solution for:
        </h2>
        <p className="text-neon-green text-xl md:text-2xl font-bold">
          &quot;{taskName}&quot;
        </p>
      </motion.div>

      {/* Terminal */}
      <TerminalWindow isActive={true} />

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-muted/50 text-xs mt-8 text-center"
      >
        // This is taking longer than it would have taken you to just do the task...
      </motion.p>
    </section>
  );
}
