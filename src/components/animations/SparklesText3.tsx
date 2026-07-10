import { useState, useEffect, useCallback, useRef } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
}

interface SparklesText3Props {
  text?: string;
  sparkleColor?: string;
  sparkleCount?: number;
  fontSize?: number;
  textColor?: string;
  speed?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

const SparklesText3 = ({
  text = "Big Sparkles",
  sparkleColor = "#fbbf24",
  sparkleCount = 8,
  fontSize = 48,
  textColor = "currentColor",
  speed = 900,
  minSize = 12,
  maxSize = 28,
  className = "",
}: SparklesText3Props) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const counter = useRef(0);

  const createSparkle = useCallback((): Sparkle => {
    return {
      id: counter.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (maxSize - minSize) + minSize,
      rotation: Math.random() * 360,
      color: sparkleColor,
    };
  }, [sparkleColor, minSize, maxSize]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSparkle = createSparkle();
      setSparkles((prev) => {
        const filtered = prev.length >= sparkleCount * 2 ? prev.slice(-sparkleCount) : prev;
        return [...filtered, newSparkle];
      });
    }, speed / sparkleCount);
    return () => clearInterval(interval);
  }, [createSparkle, sparkleCount, speed]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setSparkles((prev) => (prev.length > sparkleCount * 3 ? prev.slice(-sparkleCount * 2) : prev));
    }, speed * 2);
    return () => clearInterval(cleanup);
  }, [sparkleCount, speed]);

  return (
    <span
      className={`relative inline-block font-bold font-['Space_Grotesk',sans-serif] ${className}`}
      style={{ fontSize, color: textColor }}
    >
      <span className="absolute -inset-[30%] pointer-events-none z-[2] overflow-visible">
        {sparkles.map((s) => (
          <svg
            key={s.id}
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill={s.color}
            className="absolute pointer-events-none drop-shadow-[0_0_4px_currentColor]"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `rotate(${s.rotation}deg)`,
              animation: `sparkle-pop ${speed}ms ease-in-out forwards`,
            }}
          >
            <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
          </svg>
        ))}
      </span>
      <span className="relative z-[1]">{text}</span>
    </span>
  );
};

export default SparklesText3;
export type { SparklesText3Props };
