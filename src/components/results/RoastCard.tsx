"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface RoastCardProps {
  roast: string;
  taskName: string;
}

export default function RoastCard({ roast, taskName }: RoastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="terminal-box h-full flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-blood-red" />
        <h3 className="text-lg font-bold text-blood-red uppercase tracking-wider">
          The Verdict
        </h3>
      </div>

      <p className="text-muted text-xs mb-4 uppercase tracking-widest">
        RE: &quot;{taskName}&quot;
      </p>

      <div className="flex-1 flex items-center">
        <p className="text-foreground text-base md:text-lg leading-relaxed">
          &ldquo;{roast}&rdquo;
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-terminal-border">
        <p className="text-muted text-xs italic">
          — Your Staff Engineer (who is tired of your commits)
        </p>
      </div>
    </motion.div>
  );
}
