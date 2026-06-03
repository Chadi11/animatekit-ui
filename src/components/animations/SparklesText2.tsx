import { useState, useEffect, useCallback, useRef } from "react";

interface GlitterDot {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface SparklesText2Props {
  text?: string;
  colors?: string[];
  fontSize?: number;
  density?: number;
  speed?: number;
  className?: string;
}

const SparklesText2 = ({
  text = "Glitter",
  colors = ["#fbbf24", "#f472b6", "#60a5fa"],
  fontSize = 48,
  density = 15,
  speed = 500,
  className = "",
}: SparklesText2Props) => {
  const [dots, setDots] = useState<GlitterDot[]>([]);
  const counter = useRef(0);
  const colorIdx = useRef(0);

  const createDot = useCallback((): GlitterDot => {
    const color = colors[colorIdx.current % colors.length];
    colorIdx.current++;
    return {
      id: counter.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 2,
      color,
    };
  }, [colors]);

  useEffect(() => {
    const interval = setInterval(() => {
      const batch = Array.from({ length: Math.ceil(density / 5) }, () => createDot());
      setDots((prev) => {
        const trimmed = prev.length > density * 4 ? prev.slice(-density * 2) : prev;
        return [...trimmed, ...batch];
      });
    }, speed / density * 3);
    return () => clearInterval(interval);
  }, [createDot, density, speed]);

  const gradientStyle = `linear-gradient(135deg, ${colors[0] || "#fbbf24"}, ${colors[1] || "#f472b6"}, ${colors[2] || "#60a5fa"})`;

  return (
    <span
      className={`relative inline-block font-bold font-['Space_Grotesk',sans-serif] ${className}`}
      style={{ fontSize }}
    >
      <span className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
        {dots.map((d) => (
          <span
            key={d.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
              backgroundColor: d.color,
              animation: `glitter-flash ${speed}ms ease-in-out forwards`,
            }}
          />
        ))}
      </span>

      <span className="invisible">{text}</span>
      
      <span
        className="absolute inset-0 flex items-center justify-center z-[1] bg-clip-text"
        style={{
          background: gradientStyle,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {text}
      </span>
    </span>
  );
};

export default SparklesText2;
export type { SparklesText2Props };
