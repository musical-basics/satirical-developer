"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TerminalLine from "@/components/terminal/TerminalLine";
import { getShuffledMessages } from "@/lib/loading-messages";

interface TerminalWindowProps {
  isActive: boolean;
}

export default function TerminalWindow({ isActive }: TerminalWindowProps) {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<string[]>(getShuffledMessages());
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isActive) return;

    // Show first message immediately
    setVisibleMessages([messagesRef.current[0]]);
    indexRef.current = 1;

    const interval = setInterval(() => {
      if (indexRef.current >= messagesRef.current.length) {
        messagesRef.current = getShuffledMessages();
        indexRef.current = 0;
      }

      setVisibleMessages((prev) => [
        ...prev,
        messagesRef.current[indexRef.current],
      ]);
      indexRef.current += 1;
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Terminal Title Bar */}
      <div className="bg-terminal-gray border border-terminal-border border-b-0 rounded-t-lg px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blood-red" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-neon-green" />
        </div>
        <span className="text-muted text-xs ml-2 font-mono">
          procrastincalc — calculating your life choices
        </span>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="bg-background border border-terminal-border border-t-0 rounded-b-lg p-4 
                   h-[300px] md:h-[400px] overflow-y-auto"
      >
        {visibleMessages.map((msg, i) => (
          <TerminalLine key={`${msg}-${i}`} message={msg} index={i} />
        ))}

        {/* Blinking cursor */}
        <div className="text-neon-green text-sm md:text-base font-mono py-0.5 cursor-blink">
          {">"}_
        </div>
      </div>
    </motion.div>
  );
}
