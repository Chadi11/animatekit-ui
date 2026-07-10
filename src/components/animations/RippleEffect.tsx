import { useEffect, useRef, useState, useMemo } from "react";

interface RippleEffectProps {
  color?: string;
  count?: number;
  duration?: number;
  size?: number;
  delay?: number;
  repeat?: boolean;
  className?: string;
}

const RippleEffect = ({
  color = "#34d399",
  count = 3,
  duration = 2,
  size = 400,
  delay = 0.5,
  repeat = true,
  className = "",
}: RippleEffectProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const keyframesCSS = useMemo(
    () => `
@keyframes ripple-expand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}`,
    []
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <style>{keyframesCSS}</style>
      {inView &&
        Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              border: `2px solid ${color}`,
              backgroundColor: `${color}22`,
              transform: "translate(-50%, -50%) scale(0)",
              opacity: 0,
              animation: `ripple-expand ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * delay}s ${repeat ? "infinite" : "1"} forwards`,
            }}
          />
        ))}
    </div>
  );
};

export default RippleEffect;
