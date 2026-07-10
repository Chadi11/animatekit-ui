import { useId } from "react";

interface Loader1Props {
  size?: number;
  color?: string;
  dotCount?: number;
  speed?: number;
  trail?: boolean;
  className?: string;
}

const Loader1 = ({
  size = 64,
  color = "#f97316",
  dotCount = 3,
  speed = 1.4,
  trail = true,
  className = "",
}: Loader1Props) => {
  const uid = useId().replace(/:/g, "");
  const orbitClass = `ak-loader1-${uid}`;
  const dotSize = Math.max(6, Math.round(size * 0.18));
  const radius = (size - dotSize) / 2;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <style>{`
        @keyframes ${orbitClass}-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .${orbitClass} {
          position: absolute;
          inset: 0;
          animation: ${orbitClass}-spin ${speed}s linear infinite;
        }
      `}</style>
      {[...Array(dotCount)].map((_, i) => {
        const angle = (i / dotCount) * 360;
        const delay = -((i / dotCount) * speed);
        return (
          <div
            key={i}
            className={orbitClass}
            style={{ animationDelay: `${delay}s` }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: dotSize,
                height: dotSize,
                marginTop: -dotSize / 2,
                marginLeft: -dotSize / 2,
                borderRadius: "9999px",
                background: color,
                transform: `rotate(${angle}deg) translateX(${radius}px)`,
                boxShadow: trail ? `0 0 ${dotSize * 1.4}px ${color}` : "none",
                opacity: 0.9 - i * (0.4 / Math.max(dotCount - 1, 1)),
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Loader1;
export type { Loader1Props };
