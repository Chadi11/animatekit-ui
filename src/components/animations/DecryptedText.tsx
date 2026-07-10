import { useState, useEffect, useCallback, useRef } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  trigger?: "view" | "hover" | "both";
  characterSet?: string;
  color?: string;
  className?: string;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

const DecryptedText = ({
  text,
  speed = 50,
  trigger = "view",
  characterSet = DEFAULT_CHARS,
  color = "hsl(24, 95%, 53%)",
  className = "",
}: DecryptedTextProps) => {
  const [displayed, setDisplayed] = useState<string[]>(() =>
    trigger === "hover" ? text.split("") : text.split("").map(() => " ")
  );
  const [hasAnimated, setHasAnimated] = useState(false);
  const isAnimatingRef = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animate = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setHasAnimated(true);

    const resolved = new Array(text.length).fill(false);
    text.split("").forEach((char, i) => {
      if (char === " ") resolved[i] = true;
    });
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayed(
        text.split("").map((char, i) => {
          if (char === " ") return " ";
          if (resolved[i]) return char;
          if (iteration > i + Math.random() * 8) {
            resolved[i] = true;
            return char;
          }
          return characterSet[Math.floor(Math.random() * characterSet.length)];
        })
      );

      iteration += 1;

      if (resolved.every(Boolean)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        isAnimatingRef.current = false;
      }
    }, speed);
  }, [text, speed, characterSet]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    isAnimatingRef.current = false;
    setHasAnimated(false);
    setDisplayed(
      trigger === "hover" ? text.split("") : text.split("").map(() => " ")
    );
  }, [text, speed, characterSet, trigger]);

  useEffect(() => {
    if (trigger !== "view" && trigger !== "both") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trigger, animate, hasAnimated]);

  useEffect(() => {
    if ((trigger === "view" || trigger === "both") && !hasAnimated) {
      const timeout = setTimeout(() => animate(), 300);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  const handleMouseEnter = () => {
    if (trigger === "hover" || trigger === "both") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      isAnimatingRef.current = false;
      setDisplayed(text.split("").map(() => " "));
      setTimeout(() => animate(), 50);
    }
  };

  return (
    <span
      ref={ref}
      onMouseEnter={handleMouseEnter}
      className={`font-mono text-4xl font-bold tracking-wider inline-block cursor-default ${className}`}
      style={{ color }}
    >
      {displayed.map((char, i) => (
        <span
          key={i}
          className={`inline-block transition-opacity duration-100 ${
            char === text[i] ? "opacity-100" : "opacity-70"
          }`}
          style={{ minWidth: char === " " ? "0.3em" : undefined }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default DecryptedText;
export type { DecryptedTextProps };
