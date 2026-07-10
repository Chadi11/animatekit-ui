import { useEffect, useRef, useState, useMemo } from "react";

interface UnderlineDrawProps {
  text: string;
  underlineColor?: string;
  textColor?: string;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  fontSize?: number;
  roughness?: number;
  repeat?: boolean;
  className?: string;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280 - 0.5;
  };
}

function generateUnderlinePath(
  width: number,
  roughness: number,
  seed: number
): string {
  const rand = seededRandom(seed);
  const steps = Math.max(8, Math.floor(width / 15));
  const overshoot = width * 0.02;

  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const x = -overshoot + i * (width + overshoot * 2) / steps;
    const y = rand() * roughness * 2;
    points.push([x, y]);
  }

  let d = `M ${points[0][0]},${points[0][1]}`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2 + rand() * roughness;
    const cpy = (prev[1] + curr[1]) / 2 + rand() * roughness;
    d += ` Q ${cpx},${cpy} ${curr[0]},${curr[1]}`;
  }

  return d;
}

const UnderlineDraw = ({
  text,
  underlineColor = "#f59e0b",
  textColor = "#1e293b",
  duration = 0.8,
  delay = 0.2,
  strokeWidth = 3,
  fontSize = 32,
  roughness = 2,
  repeat = false,
  className = "",
}: UnderlineDrawProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const [measured, setMeasured] = useState(false);
  const rafRef = useRef<number>(0);

  const seed = useMemo(() => Math.floor(Math.random() * 10000), []);

  const svgWidth = 200;
  const underlinePath = useMemo(
    () => generateUnderlinePath(svgWidth, roughness, seed),
    [roughness, seed]
  );

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      setMeasured(false);
      setActive(false);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setMeasured(true);
        });
      });
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [underlinePath]);

  useEffect(() => {
    if (!measured || pathLength === 0) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setActive(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat, measured, pathLength]);

  const strokeStyle: React.CSSProperties =
    pathLength > 0
      ? {
          strokeDasharray: pathLength,
          strokeDashoffset: active ? 0 : pathLength,
          transition: measured
            ? `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`
            : "none",
        }
      : { opacity: 0 };

  return (
    <span
      ref={containerRef}
      className={`relative inline-block font-bold font-['Space_Grotesk',sans-serif] ${className}`}
      style={{ fontSize, color: textColor }}
    >
      <svg
        className="absolute pointer-events-none overflow-visible"
        style={{ bottom: "-8%", left: "-2%", width: "104%", height: "30%" }}
        viewBox={`0 0 ${svgWidth} 20`}
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d={underlinePath}
          stroke={underlineColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={strokeStyle}
        />
      </svg>
      <span className="relative z-[1]">{text}</span>
    </span>
  );
};

export default UnderlineDraw;
export type { UnderlineDrawProps };
