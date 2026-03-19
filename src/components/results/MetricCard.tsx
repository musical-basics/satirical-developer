"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: "red" | "green" | "default";
  animateValue?: boolean;
  delay?: number;
}

export default function MetricCard({
  label,
  value,
  unit,
  color = "default",
  animateValue = true,
  delay = 0,
}: MetricCardProps) {
  const colorClasses = {
    red: "text-blood-red",
    green: "text-neon-green",
    default: "text-foreground",
  };

  const glowClasses = {
    red: "hover:shadow-[0_0_30px_rgba(255,0,0,0.15)]",
    green: "hover:shadow-[0_0_30px_rgba(0,255,0,0.15)]",
    default: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`terminal-box text-center transition-shadow duration-500 ${glowClasses[color]}`}
    >
      <p className="text-muted text-xs uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`text-5xl md:text-7xl font-bold ${colorClasses[color]}`}>
        {animateValue && typeof value === "number" ? (
          <AnimatedCounter value={value} duration={2} />
        ) : (
          value
        )}
        {unit && (
          <span className="text-lg md:text-2xl text-muted ml-2">{unit}</span>
        )}
      </p>
    </motion.div>
  );
}
