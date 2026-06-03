import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedCircularProgressProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
  labelColor?: string;
  showValue?: boolean;
  label?: string;
  animationDuration?: number;
  trigger?: "mount" | "hover";
  className?: string;
}

const AnimatedCircularProgress = ({
  value = 75,
  size = 200,
  strokeWidth = 18,
  color = "#4f46e5",
  trackColor = "#e5e7eb",
  textColor = "#1f2937",
  labelColor = "#9ca3af",
  showValue = true,
  label,
  animationDuration = 1200,
  trigger = "mount",
  className = "",
}: AnimatedCircularProgressProps) => {
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(trigger === "mount");
  const rafRef = useRef<number>(0);

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circ = 2 * Math.PI * radius;

  const animate = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const startT = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startT) / animationDuration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(ease * value));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [value, animationDuration]);

  useEffect(() => {
    if (started) animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, value, animate]);

  return (
    <div
      className={`inline-flex flex-col items-center gap-2.5 ${className}`}
      onMouseEnter={() => trigger === "hover" && !started && setStarted(true)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke={trackColor} strokeWidth={strokeWidth}
          />
          {displayed > 0 && (
            <circle
              cx={center} cy={center} r={radius}
              fill="none" stroke={color} strokeWidth={strokeWidth}
              strokeDasharray={`${(displayed / 100) * circ} ${circ}`}
              strokeLinecap="round"
            />
          )}
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span
              className="font-bold leading-none tabular-nums"
              style={{
                fontSize: size * 0.24,
                color: textColor,
                letterSpacing: "-1.5px",
              }}
            >
              {displayed}
            </span>
            {label && (
              <span
                className="uppercase mt-1"
                style={{
                  fontSize: size * 0.09,
                  color: labelColor,
                  letterSpacing: "0.5px",
                }}
              >
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedCircularProgress;
export type { AnimatedCircularProgressProps };
