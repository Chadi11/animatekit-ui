import { useEffect, useRef, useState, useMemo } from "react";

interface RippleEffect2Props {
  text?: string;
  color?: string;
  count?: number;
  duration?: number;
  size?: number;
  className?: string;
}

const RippleEffect2 = ({
  text = "Ripple",
  color = "#a0a0a0",
  count = 5,
  duration = 4,
  size = 400,
  className = "",
}: RippleEffect2Props) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const keyframesCSS = useMemo(() => `
@keyframes ripple-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.15; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.5; }
}`, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <style>{keyframesCSS}</style>
      {inView &&
        Array.from({ length: count }).map((_, i) => {
          const ringSize = size * ((i + 1) / count);
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                width: ringSize,
                height: ringSize,
                border: `1.5px solid ${color}`,
                transform: "translate(-50%, -50%) scale(0.95)",
                opacity: 0.15,
                animation: `ripple-pulse ${duration}s ease-in-out ${(i * duration) / count}s infinite`,
              }}
            />
          );
        })}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold tracking-wide pointer-events-none whitespace-nowrap"
        style={{
          fontSize: size * 0.12,
          color,
          opacity: 0.7,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default RippleEffect2;
