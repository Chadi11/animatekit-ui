import { useEffect, useRef, useState, useMemo } from "react";

interface AuroraBackgroundProps {
  colors?: [string, string, string];
  speed?: number;
  blur?: number;
  size?: number;
  bgColor?: string;
  className?: string;
}

const AuroraBackground = ({
  colors = ["#6366f1", "#ec4899", "#14b8a6"],
  speed = 1,
  blur = 80,
  size = 400,
  bgColor = "#0a0a0a",
  className = "",
}: AuroraBackgroundProps) => {
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

  const durations = useMemo(
    () => [8 / speed, 12 / speed, 15 / speed],
    [speed]
  );

  const keyframesCSS = useMemo(
    () => `
@keyframes aurora-drift-1 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(15%, -20%) scale(1.1); }
  50% { transform: translate(-10%, 15%) scale(0.9); }
  75% { transform: translate(20%, 10%) scale(1.05); }
}
@keyframes aurora-drift-2 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(-20%, 10%) scale(1.15); }
  50% { transform: translate(15%, -15%) scale(0.85); }
  75% { transform: translate(-5%, 20%) scale(1.1); }
}
@keyframes aurora-drift-3 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(10%, 20%) scale(0.9); }
  50% { transform: translate(-20%, -10%) scale(1.15); }
  75% { transform: translate(15%, -15%) scale(0.95); }
}`,
    []
  );

  const blobs = useMemo(
    () => [
      {
        color: colors[0],
        width: size * 0.7,
        height: size * 0.6,
        top: "10%",
        left: "10%",
        animation: `aurora-drift-1 ${durations[0]}s ease-in-out infinite`,
      },
      {
        color: colors[1],
        width: size * 0.6,
        height: size * 0.7,
        top: "20%",
        left: "40%",
        animation: `aurora-drift-2 ${durations[1]}s ease-in-out infinite`,
      },
      {
        color: colors[2],
        width: size * 0.65,
        height: size * 0.55,
        top: "35%",
        left: "15%",
        animation: `aurora-drift-3 ${durations[2]}s ease-in-out infinite`,
      },
    ],
    [colors, size, durations]
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        width: size,
        height: size,
        background: bgColor,
      }}
    >
      <style>{keyframesCSS}</style>
      {inView &&
        blobs.map((blob, i) => (
          <div
            key={i}
            className="absolute rounded-full [mix-blend-mode:screen] will-change-transform"
            style={{
              top: blob.top,
              left: blob.left,
              width: blob.width,
              height: blob.height,
              background: `radial-gradient(circle, ${blob.color}88 0%, ${blob.color}00 70%)`,
              filter: `blur(${blur}px)`,
              animation: blob.animation,
            }}
          />
        ))}
    </div>
  );
};

export default AuroraBackground;
