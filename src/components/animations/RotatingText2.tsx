import { useState, useEffect, useRef, useCallback } from "react";

interface RotatingText2Props {
  texts: string[];
  interval?: number;
  duration?: number;
  fontSize?: number;
  color?: string;
  className?: string;
}

const RotatingText2 = ({
  texts,
  interval = 2500,
  duration = 0.5,
  fontSize = 42,
  color = "#f97316",
  className = "",
}: RotatingText2Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b), "");

  const rotate = useCallback(() => {
    setPhase("exit");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setPhase("enter");
      setTimeout(() => {
        setPhase("idle");
      }, duration * 1000);
    }, duration * 1000);
  }, [duration, texts.length]);

  useEffect(() => {
    if (texts.length < 2) return;
    timerRef.current = setInterval(rotate, interval);
    return () => clearInterval(timerRef.current);
  }, [rotate, interval, texts.length]);

  const getTransform = () => {
    if (phase === "exit") return "translateY(-100%)";
    if (phase === "enter") return "translateY(0%)";
    return "translateY(0%)";
  };

  const getInitialTransform = () => {
    if (phase === "enter") return "translateY(100%)";
    return "translateY(0%)";
  };

  return (
    <span
      className={`relative inline-flex overflow-hidden font-bold ${className}`}
      style={{
        fontSize,
        color,
        height: `${fontSize * 1.3}px`,
        lineHeight: `${fontSize * 1.3}px`,
      }}
    >
      {/* Invisible sizer — determines container width */}
      <span className="invisible whitespace-nowrap">{longestText}</span>

      {/* Visible text — absolute so it doesn't affect width */}
      <span
        className="absolute left-0 top-0 inline-block whitespace-nowrap"
        style={{
          transition: phase !== "idle" ? `transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}s ease` : "none",
          transform: getTransform(),
          opacity: phase === "exit" ? 0 : 1,
        }}
      >
        {texts[currentIndex]}
      </span>
    </span>
  );
};

export default RotatingText2;
