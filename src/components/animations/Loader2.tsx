import { useId } from "react";

interface Loader2Props {
  barCount?: number;
  color?: string;
  height?: number;
  width?: number;
  gap?: number;
  speed?: number;
  rounded?: boolean;
  className?: string;
}

const Loader2 = ({
  barCount = 5,
  color = "#f97316",
  height = 40,
  width = 6,
  gap = 4,
  speed = 1,
  rounded = true,
  className = "",
}: Loader2Props) => {
  const uid = useId().replace(/:/g, "");
  const barClass = `ak-loader2-${uid}`;

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap, height }}
      role="status"
      aria-label="Loading"
    >
      <style>{`
        @keyframes ${barClass}-pulse {
          0%, 100% { transform: scaleY(0.3); }
          50%      { transform: scaleY(1); }
        }
        .${barClass} {
          animation: ${barClass}-pulse ${speed}s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
      {[...Array(barCount)].map((_, i) => (
        <div
          key={i}
          className={barClass}
          style={{
            width,
            height: "100%",
            background: color,
            borderRadius: rounded ? 9999 : 2,
            animationDelay: `${(i / barCount) * speed * 0.6}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Loader2;
export type { Loader2Props };
