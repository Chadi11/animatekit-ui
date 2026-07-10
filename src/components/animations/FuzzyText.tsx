import { useEffect, useRef, useState, useCallback } from "react";

interface FuzzyTextProps {
  text: string;
  intensity?: number;
  speed?: number;
  enableBlur?: boolean;
  color?: string;
  fontSize?: number;
  className?: string;
}

interface CharOffset {
  x: number;
  y: number;
  blur: number;
}

const FuzzyText = ({
  text,
  intensity = 2,
  speed = 50,
  enableBlur = true,
  color = "hsl(24, 95%, 53%)",
  fontSize = 40,
  className = "",
}: FuzzyTextProps) => {
  const [offsets, setOffsets] = useState<CharOffset[]>([]);
  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const chars = text.split("");

  const updateOffsets = useCallback(() => {
    setOffsets(
      chars.map(() => ({
        x: (Math.random() - 0.5) * 2 * intensity,
        y: (Math.random() - 0.5) * 2 * intensity,
        blur: enableBlur ? Math.random() * intensity * 0.5 : 0,
      }))
    );
  }, [chars.length, intensity, enableBlur]);

  useEffect(() => {
    const interval = 1000 / speed;
    const animate = (time: number) => {
      if (time - lastUpdateRef.current >= interval) {
        updateOffsets();
        lastUpdateRef.current = time;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, updateOffsets]);

  return (
    <span
      className={`inline-flex font-bold tracking-wide ${className}`}
      style={{ fontSize, color }}
      aria-label={text}
    >
      {chars.map((char, i) => {
        const o = offsets[i] || { x: 0, y: 0, blur: 0 };
        return (
          <span
            key={i}
            className="inline-block will-change-[transform,filter]"
            style={{
              transform: `translate(${o.x}px, ${o.y}px)`,
              filter: o.blur > 0 ? `blur(${o.blur}px)` : undefined,
              whiteSpace: char === " " ? "pre" : undefined,
            }}
            aria-hidden="true"
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default FuzzyText;
export type { FuzzyTextProps };
