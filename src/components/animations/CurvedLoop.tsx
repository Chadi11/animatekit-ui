import { useEffect, useRef, useState } from "react";

interface CurvedLoopProps {
  text: string;
  speed?: number;
  direction?: "forward" | "reverse";
  amplitude?: number;
  color?: string;
  fontSize?: number;
  className?: string;
}

const CurvedLoop = ({
  text,
  speed = 5,
  direction = "forward",
  amplitude = 40,
  color = "hsl(24, 95%, 53%)",
  fontSize = 24,
  className = "",
}: CurvedLoopProps) => {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const pathId = useRef(`curved-path-${Math.random().toString(36).slice(2, 9)}`).current;

  const width = 600;
  const height = amplitude * 2 + fontSize * 2;
  const midY = height / 2;

  // Generate a sine-wave path
  const pathD = (() => {
    const points: string[] = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = midY + Math.sin((i / segments) * Math.PI * 2) * amplitude;
      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return points.join(" ");
  })();

  // Duplicate text to fill the path for seamless looping
  const repeatedText = (text + "   ").repeat(6);

  useEffect(() => {
    const step = direction === "forward" ? 1 : -1;
    const pixelsPerSecond = 60 / speed;

    const animate = (time: number) => {
      if (lastTimeRef.current) {
        const delta = (time - lastTimeRef.current) / 1000;
        setOffset((prev) => {
          let next = prev + step * delta * pixelsPerSecond;
          if (next > 100) next -= 100;
          if (next < 0) next += 100;
          return next;
        });
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, direction]);

  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        <text
          fill={color}
          fontSize={fontSize}
          fontWeight={700}
          fontFamily="'Space Grotesk', sans-serif"
        >
          <textPath
            href={`#${pathId}`}
            startOffset={`${offset}%`}
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CurvedLoop;
export type { CurvedLoopProps };
