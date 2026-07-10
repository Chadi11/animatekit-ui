import { useEffect, useState, useRef, useCallback } from "react";

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  duration?: number;
  fontSize?: number;
  color?: string;
  className?: string;
}

const RotatingText = ({
  texts,
  interval = 2500,
  duration = 0.5,
  fontSize = 42,
  color = "hsl(24, 95%, 53%)",
  className = "",
}: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const nextIndex = (currentIndex + 1) % texts.length;

  const rotate = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setDisplayIndex((prev) => (prev + 1) % texts.length);
      setIsAnimating(false);
    }, duration * 1000);
  }, [duration, texts.length]);

  useEffect(() => {
    if (texts.length < 2) return;
    timerRef.current = setInterval(rotate, interval);
    return () => clearInterval(timerRef.current);
  }, [rotate, interval, texts.length]);

  return (
    <span
      className={`relative inline-flex overflow-hidden font-bold ${className}`}
      style={{
        fontSize,
        color,
        fontFamily: "'Space Grotesk', sans-serif",
        height: `${fontSize * 1.3}px`,
        lineHeight: `${fontSize * 1.3}px`,
      }}
    >
      {/* Outgoing */}
      <span
        className="inline-block absolute left-0 top-0 w-full"
        style={{
          transition: `transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out`,
          transform: isAnimating ? "translateY(-100%)" : "translateY(0)",
          opacity: isAnimating ? 0 : 1,
        }}
      >
        {texts[displayIndex]}
      </span>

      {/* Incoming */}
      <span
        className="inline-block absolute left-0 top-0 w-full"
        style={{
          transition: `transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out`,
          transform: isAnimating ? "translateY(0)" : "translateY(100%)",
          opacity: isAnimating ? 1 : 0,
        }}
      >
        {texts[nextIndex]}
      </span>

      {/* Invisible sizer */}
      <span className="invisible whitespace-nowrap">
        {texts.reduce((a, b) => (a.length > b.length ? a : b), "")}
      </span>
    </span>
  );
};

export default RotatingText;
export type { RotatingTextProps };
