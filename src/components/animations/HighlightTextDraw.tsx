import { useEffect, useRef, useState, useMemo } from "react";

interface HighlightTextDrawProps {
  text: string;
  highlightColor?: string;
  textColor?: string;
  duration?: number;
  delay?: number;
  highlightHeight?: number;
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

function generateMarkerShape(
  width: number,
  height: number,
  roughness: number,
  seed: number
): string {
  const rand = seededRandom(seed);
  const steps = Math.max(6, Math.floor(width / 20));

  const topPoints: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const overshoot = width * 0.04;
    const x = -overshoot + i * (width + overshoot * 2) / steps;
    const y = rand() * roughness * 3;
    topPoints.push([x, y]);
  }

  const bottomPoints: [number, number][] = [];
  for (let i = steps; i >= 0; i--) {
    const overshoot = width * 0.04;
    const x = -overshoot + i * (width + overshoot * 2) / steps;
    const y = height + rand() * roughness * 3;
    bottomPoints.push([x, y]);
  }

  let d = `M ${topPoints[0][0]},${topPoints[0][1]}`;

  for (let i = 1; i < topPoints.length; i++) {
    const prev = topPoints[i - 1];
    const curr = topPoints[i];
    const cpx = (prev[0] + curr[0]) / 2 + rand() * roughness * 2;
    const cpy = (prev[1] + curr[1]) / 2 + rand() * roughness * 2;
    d += ` Q ${cpx},${cpy} ${curr[0]},${curr[1]}`;
  }

  const lastTop = topPoints[topPoints.length - 1];
  const firstBottom = bottomPoints[0];
  d += ` Q ${lastTop[0] + rand() * roughness * 2},${(lastTop[1] + firstBottom[1]) / 2} ${firstBottom[0]},${firstBottom[1]}`;

  for (let i = 1; i < bottomPoints.length; i++) {
    const prev = bottomPoints[i - 1];
    const curr = bottomPoints[i];
    const cpx = (prev[0] + curr[0]) / 2 + rand() * roughness * 2;
    const cpy = (prev[1] + curr[1]) / 2 + rand() * roughness * 2;
    d += ` Q ${cpx},${cpy} ${curr[0]},${curr[1]}`;
  }

  const lastBottom = bottomPoints[bottomPoints.length - 1];
  d += ` Q ${lastBottom[0] + rand() * roughness * 2},${(lastBottom[1] + topPoints[0][1]) / 2} ${topPoints[0][0]},${topPoints[0][1]}`;

  d += " Z";
  return d;
}

const HighlightTextDraw = ({
  text,
  highlightColor = "#93c5fd",
  textColor = "#1e293b",
  duration = 0.8,
  delay = 0.2,
  highlightHeight = 90,
  fontSize = 32,
  roughness = 2,
  repeat = false,
  className = "",
}: HighlightTextDrawProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const clipId = useMemo(() => `marker-clip-${Math.random().toString(36).slice(2, 8)}`, []);

  const seed = useMemo(() => Math.floor(Math.random() * 10000), []);

  const svgWidth = 200;
  const svgHeight = 100;
  const shapeHeight = (highlightHeight / 100) * svgHeight;
  const shapeY = (svgHeight - shapeHeight) / 2;

  const markerPath = useMemo(
    () => generateMarkerShape(svgWidth, shapeHeight, roughness, seed),
    [roughness, seed, shapeHeight]
  );

  useEffect(() => {
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
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <span
      ref={containerRef}
      className={`relative inline-block font-bold font-['Space_Grotesk',sans-serif] ${className}`}
      style={{ fontSize, color: textColor }}
    >
      <svg
        className="absolute bottom-0 pointer-events-none overflow-visible"
        style={{ left: "-4%", width: "108%", height: "100%" }}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x="0"
              y="0"
              width={svgWidth}
              height={svgHeight}
              style={{
                transform: active ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: `transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
              }}
            />
          </clipPath>
        </defs>
        <g
          clipPath={`url(#${clipId})`}
          transform={`translate(0, ${shapeY})`}
        >
          <path
            d={markerPath}
            fill={highlightColor}
            opacity={0.5}
          />
        </g>
      </svg>
      <span className="relative z-[1]">{text}</span>
    </span>
  );
};

export default HighlightTextDraw;
export type { HighlightTextDrawProps };
