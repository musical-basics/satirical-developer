"use client";

import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: "red" | "green" | "default";
}

export default function MetricCard({
  label,
  value,
  unit,
  color = "default",
}: MetricCardProps) {
  const colorClasses = {
    red: "text-blood-red",
    green: "text-neon-green",
    default: "text-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="terminal-box text-center"
    >
      <p className="text-muted text-xs uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`text-5xl md:text-7xl font-bold ${colorClasses[color]}`}>
        {value}
        {unit && (
          <span className="text-lg md:text-2xl text-muted ml-2">{unit}</span>
        )}
      </p>
    </motion.div>
  );
}
