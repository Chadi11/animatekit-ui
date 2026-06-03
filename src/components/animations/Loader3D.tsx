import { useId } from "react";

interface Loader3DProps {
  color?: string;
  shadowColor?: string;
  size?: number;
  speed?: number;
  className?: string;
}

const Loader3D = ({
  color = "#ffffff",
  shadowColor = "#000000",
  size = 20,
  speed = 1.2,
  className = "",
}: Loader3DProps) => {
  const uid = useId().replace(/:/g, "");
  const cls = `ak-loader3d-${uid}`;

  const orbs = [0, 1, 2];
  const gap = size * 0.7;

  return (
    <div
      className={`inline-flex items-end ${className}`}
      role="status"
      aria-label="Loading"
      style={{ gap, height: size * 2.6 }}
    >
      <style>{`
        @keyframes ${cls}-bounce {
          0%, 100% {
            transform: translateY(0px);
            animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0);
          }
          50% {
            transform: translateY(-${size * 1.4}px);
            animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
          }
        }
        @keyframes ${cls}-shadow {
          0%, 100% { transform: scaleX(1); opacity: 0.35; }
          50%      { transform: scaleX(0.4); opacity: 0.1; }
        }
        .${cls}-orb    { animation: ${cls}-bounce ${speed}s ease-in-out infinite; }
        .${cls}-shadow { animation: ${cls}-shadow ${speed}s ease-in-out infinite; }
      `}</style>

      {orbs.map((i) => {
        const delay = `${i * speed * 0.15}s`;
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-end"
            style={{ height: "100%" }}
          >
            <div
              className={`${cls}-orb`}
              style={{
                width: size,
                height: size,
                borderRadius: "9999px",
                background: `radial-gradient(circle at 30% 30%, #ffffff, ${color} 60%, ${color})`,
                boxShadow: `inset -${size * 0.1}px -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.2)`,
                animationDelay: delay,
              }}
            />
            <div
              className={`${cls}-shadow`}
              style={{
                width: size * 1.1,
                height: size * 0.18,
                marginTop: size * 0.15,
                borderRadius: "9999px",
                background: shadowColor,
                filter: "blur(2px)",
                animationDelay: delay,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Loader3D;
export type { Loader3DProps };
