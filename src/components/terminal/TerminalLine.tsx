"use client";

import { motion } from "framer-motion";

interface TerminalLineProps {
  message: string;
  index: number;
}

export default function TerminalLine({ message, index }: TerminalLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="text-neon-green text-sm md:text-base font-mono py-0.5"
    >
      {message}
    </motion.div>
  );
}
