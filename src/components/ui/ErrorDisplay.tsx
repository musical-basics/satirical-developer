"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="terminal-box max-w-lg w-full text-center">
        <AlertTriangle className="w-12 h-12 text-blood-red mx-auto mb-4" />
        <h2 className="text-xl font-bold text-blood-red mb-2">
          Build Failed
        </h2>
        <p className="text-muted text-sm mb-6 font-mono">
          {message}
        </p>
        <button
          id="retry-button"
          onClick={onRetry}
          className="btn-primary inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          npm run retry
        </button>
      </div>
    </motion.div>
  );
}
