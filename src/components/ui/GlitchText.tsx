"use client";

import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

export default function GlitchText({
  text,
  className = "",
  as: Tag = "h1",
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(true);

  useEffect(() => {
    if (!isGlitching) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === " ") return " ";
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );

      iteration += 1 / 2;

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text, isGlitching]);

  return (
    <Tag
      className={`font-mono font-bold tracking-tight ${className}`}
      data-text={text}
    >
      {displayText}
    </Tag>
  );
}
