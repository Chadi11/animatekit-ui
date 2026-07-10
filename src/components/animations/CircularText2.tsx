import { useMemo, useEffect, useRef, useState, useCallback } from "react";

interface CircularText2Props {
  text: string;
  radius?: number;
  speed?: number;
  direction?: "clockwise" | "counter-clockwise";
  color?: string;
  fontSize?: number;
  waveIntensity?: number;
  className?: string;
}

const CircularText2 = ({
  text,
  radius = 100,
  speed = 80,
  direction = "clockwise",
  color = "hsl(24, 95%, 53%)",
  fontSize = 14,
  waveIntensity = 1.5,
  className = "",
}: CircularText2Props) => {
  const chars = useMemo(() => text.split(""), [text]);
  const angleStep = 360 / chars.length;
  const size = radius * 2 + fontSize * 2;

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const startCycle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let idx = direction === "clockwise" ? 0 : chars.length - 1;
    intervalRef.current = setInterval(() => {
      setActiveIndex(idx);
      if (direction === "clockwise") {
        idx = (idx + 1) % chars.length;
      } else {
        idx = idx <= 0 ? chars.length - 1 : idx - 1;
      }
    }, speed);
  }, [speed, direction, chars.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) startCycle();
    else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveIndex(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [inView, startCycle]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {chars.map((char, i) => {
        const dist = Math.min(
          Math.abs(i - activeIndex),
          chars.length - Math.abs(i - activeIndex)
        );
        const maxDist = 3;
        const factor = dist <= maxDist ? 1 - dist / (maxDist + 1) : 0;
        const scale = 1 + factor * (waveIntensity - 1);
        const opacity = 0.4 + factor * 0.6;

        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 font-['JetBrains_Mono',monospace] font-bold"
            style={{
              fontSize,
              color,
              transform: `translate(-50%, -50%) rotate(${angleStep * i}deg) translateY(-${radius}px) scale(${scale})`,
              transformOrigin: "center center",
              opacity,
              transition: `transform ${speed * 1.5}ms ease, opacity ${speed * 1.5}ms ease`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default CircularText2;
export type { CircularText2Props };
