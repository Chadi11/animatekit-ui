import { useState, useEffect, useCallback } from "react";

interface TypingText2Props {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  fontSize?: number;
  color?: string;
  cursorChar?: string;
  cursorBlinkSpeed?: number;
}

const TypingText2 = ({
  text,
  speed = 80,
  delay = 0,
  loop = false,
  fontSize = 32,
  color = "#e2e8f0",
  cursorChar = "|",
  cursorBlinkSpeed = 500,
}: TypingText2Props) => {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);

  const reset = useCallback(() => {
    setDisplayedCount(0);
    setIsErasing(false);
    setIsWaiting(true);
  }, []);

  useEffect(() => {
    if (!isWaiting) return;
    const timer = setTimeout(() => setIsWaiting(false), delay);
    return () => clearTimeout(timer);
  }, [delay, isWaiting]);

  useEffect(() => {
    if (isWaiting) return;

    if (!isErasing) {
      if (displayedCount >= text.length) {
        if (loop) {
          const timer = setTimeout(() => setIsErasing(true), 1200);
          return () => clearTimeout(timer);
        }
        return;
      }
      const timer = setInterval(() => {
        setDisplayedCount((c) => c + 1);
      }, speed);
      return () => clearInterval(timer);
    } else {
      if (displayedCount <= 0) {
        const timer = setTimeout(() => reset(), 500);
        return () => clearTimeout(timer);
      }
      const timer = setInterval(() => {
        setDisplayedCount((c) => c - 1);
      }, speed / 2);
      return () => clearInterval(timer);
    }
  }, [isWaiting, isErasing, displayedCount, text.length, speed, loop, reset]);

  const blinkKeyframes = `@keyframes typing-cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;

  return (
    <>
      <style>{blinkKeyframes}</style>
      <span
        className="inline-block font-bold min-h-[1.2em] whitespace-pre-wrap"
        style={{ fontSize, color }}
      >
        {text.slice(0, displayedCount)}
        <span className="font-normal" style={{
          animation: `typing-cursor-blink ${cursorBlinkSpeed}ms step-end infinite`,
        }}>
          {cursorChar}
        </span>
      </span>
    </>
  );
};

export default TypingText2;
