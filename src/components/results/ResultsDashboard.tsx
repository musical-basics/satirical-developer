"use client";

import { motion } from "framer-motion";
import MetricCard from "@/components/results/MetricCard";
import StackList from "@/components/results/StackList";
import RoastCard from "@/components/results/RoastCard";
import { XCircle } from "lucide-react";

interface ResultsDashboardProps {
  data: {
    proposedStack: string[];
    architectureSummary: string;
    automationHours: number;
    roast: string;
    taskName: string;
    manualMinutes: number;
    netHoursWasted: number;
  };
  onReset: () => void;
}

export default function ResultsDashboard({
  data,
  onReset,
}: ResultsDashboardProps) {
  return (
    <section
      id="results-section"
      className="min-h-screen px-6 py-12 md:py-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-muted text-sm uppercase tracking-widest mb-2">
            // Analysis complete for
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            &quot;{data.taskName}&quot;
          </h2>
        </motion.div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <MetricCard
            label="Hours to Automate"
            value={data.automationHours}
            unit="hrs"
            color="red"
          />
          <MetricCard
            label="Manual Time"
            value={data.manualMinutes}
            unit="min"
            color="green"
          />
          <MetricCard
            label="Net Time Wasted"
            value={data.netHoursWasted}
            unit="hrs"
            color="red"
          />
        </div>

        {/* Two Column Layout: Stack + Roast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StackList
            stack={data.proposedStack}
            summary={data.architectureSummary}
          />
          <RoastCard roast={data.roast} taskName={data.taskName} />
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            id="close-laptop-button"
            onClick={() => {
              try {
                window.close();
              } catch {
                window.location.href = "about:blank";
              }
            }}
            className="bg-blood-red text-background font-mono font-bold 
                       px-10 py-5 rounded-md text-xl
                       hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] 
                       transition-all duration-300
                       inline-flex items-center gap-3 cursor-pointer border-none"
          >
            <XCircle className="w-6 h-6" />
            Close Laptop and Go Do It.
          </button>

          <button
            id="try-again-button"
            onClick={onReset}
            className="text-muted text-sm underline hover:text-neon-green transition-colors cursor-pointer bg-transparent border-none"
          >
            or waste more time with another calculation...
          </button>
        </motion.div>

        {/* Footer joke */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-muted/30 text-xs mt-16"
        >
          // You spent more time reading this result than it would have taken to
          do the task
        </motion.p>
      </div>
    </section>
  );
}
