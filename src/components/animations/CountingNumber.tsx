import { useEffect, useRef, useState } from "react";

interface CountingNumberProps {
  target: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const CountingNumber = ({
  target,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  fontSize = 48,
  color = "hsl(24 95% 53%)",
  className = "",
}: CountingNumberProps) => {
  const [display, setDisplay] = useState(start.toFixed(decimals));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = start + (target - start) * eased;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, start, duration, decimals]);

  return (
    <span
      className={`inline-block font-bold font-['Space_Grotesk',sans-serif] tabular-nums ${className}`}
      style={{ fontSize, color }}
    >
      {prefix}{display}{suffix}
    </span>
  );
};

export default CountingNumber;
export type { CountingNumberProps };
