"use client";

import { motion } from "framer-motion";
import { Server } from "lucide-react";

interface StackListProps {
  stack: string[];
  summary: string;
}

export default function StackList({ stack, summary }: StackListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="terminal-box h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-5 h-5 text-neon-green" />
        <h3 className="text-lg font-bold text-neon-green uppercase tracking-wider">
          Proposed Architecture
        </h3>
      </div>

      <p className="text-muted text-sm mb-6 italic border-l-2 border-neon-green/30 pl-3">
        {summary}
      </p>

      <ul className="space-y-3">
        {stack.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
            className="flex items-start gap-3"
          >
            <span className="text-neon-green font-bold text-sm mt-0.5 shrink-0">
              [{String(i + 1).padStart(2, "0")}]
            </span>
            <span className="text-foreground text-sm">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
