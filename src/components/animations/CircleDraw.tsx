import { useEffect, useRef, useState, useMemo } from "react";

interface CircleDrawProps {
  text: string;
  circleColor?: string;
  textColor?: string;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  fontSize?: number;
  roughness?: number;
  padding?: number;
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

function generateCirclePath(
  width: number,
  height: number,
  roughness: number,
  seed: number
): string {
  const rand = seededRandom(seed);
  const segments = 32;
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = width / 2;
  const radiusY = height / 2;

  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radiusX + rand() * roughness * 3;
    const y = centerY + Math.sin(angle) * radiusY + rand() * roughness * 3;
    points.push([x, y]);
  }

  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2 + rand() * roughness * 2;
    const cpy = (prev[1] + curr[1]) / 2 + rand() * roughness * 2;
    d += ` Q ${cpx},${cpy} ${curr[0]},${curr[1]}`;
  }

  d += " Z";
  return d;
}

const CircleDraw = ({
  text,
  circleColor = "#ec4899",
  textColor = "#1e293b",
  duration = 1.2,
  delay = 0.2,
  strokeWidth = 3,
  fontSize = 32,
  roughness = 2,
  padding = 20,
  repeat = false,
  className = "",
}: CircleDrawProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const [measured, setMeasured] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 100, height: 50 });
  const rafRef = useRef<number>(0);

  const seed = useMemo(() => Math.floor(Math.random() * 10000), []);

  const circlePath = useMemo(
    () => generateCirclePath(dimensions.width + padding * 2, dimensions.height + padding * 2, roughness, seed),
    [dimensions, padding, roughness, seed]
  );

  useEffect(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  }, [text, fontSize]);

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
  }, [circlePath]);

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

  const svgWidth = dimensions.width + padding * 2;
  const svgHeight = dimensions.height + padding * 2;

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
      className={`relative inline-block ${className}`}
      style={{ padding: `${padding}px` }}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d={circlePath}
          stroke={circleColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={strokeStyle}
        />
      </svg>
      <span
        ref={textRef}
        className="relative z-[1] inline-block font-bold font-['Space_Grotesk',sans-serif]"
        style={{ fontSize, color: textColor }}
      >
        {text}
      </span>
    </span>
  );
};

export default CircleDraw;
export type { CircleDrawProps };
