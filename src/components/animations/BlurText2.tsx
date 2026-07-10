import { useEffect, useRef, useState, useCallback } from "react";

interface BlurText2Props {
  text: string;
  animateBy?: "word" | "letter";
  direction?: "left" | "right";
  delay?: number;
  blurIntensity?: number;
  color?: string;
  className?: string;
}

const BlurText2 = ({
  text,
  animateBy = "letter",
  direction = "left",
  delay = 80,
  blurIntensity = 8,
  color = "hsl(24, 95%, 53%)",
  className = "",
}: BlurText2Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const units =
    animateBy === "word"
      ? text.split(/(\s+)/)
      : text.split("");

  const nonSpaceUnits = units.filter((u) => !/^\s+$/.test(u));
  const totalUnits = nonSpaceUnits.length;

  const startCycle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let idx = direction === "left" ? 0 : totalUnits - 1;

    intervalRef.current = setInterval(() => {
      setActiveIndex(idx);
      if (direction === "left") {
        idx++;
        if (idx >= totalUnits) idx = 0;
      } else {
        idx--;
        if (idx < 0) idx = totalUnits - 1;
      }
    }, delay);
  }, [delay, direction, totalUnits]);

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
    if (inView) {
      startCycle();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveIndex(-1);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [inView, startCycle]);

  let nonSpaceIdx = 0;

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap font-mono text-4xl font-bold tracking-wider ${className}`}
      style={{ color }}
    >
      {units.map((unit, i) => {
        if (/^\s+$/.test(unit)) {
          return (
            <span key={i} className="inline-block w-[0.3em]" />
          );
        }

        const currentIdx = nonSpaceIdx;
        nonSpaceIdx++;

        const dist = Math.abs(currentIdx - activeIndex);
        const blur = dist <= 2 ? blurIntensity * Math.max(0, 1 - dist / 3) : 0;

        return (
          <span
            key={i}
            className="inline-block"
            style={{
              filter: `blur(${blur}px)`,
              opacity: blur > 0 ? 0.6 + 0.4 * (1 - blur / blurIntensity) : 1,
              transition: `filter ${delay * 1.5}ms ease, opacity ${delay * 1.5}ms ease`,
            }}
          >
            {unit}
          </span>
        );
      })}
    </span>
  );
};

export default BlurText2;
export type { BlurText2Props };
