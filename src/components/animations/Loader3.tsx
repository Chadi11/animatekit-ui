import { useId } from "react";

interface Loader3Props {
  size?: number;
  color?: string;
  trackColor?: string;
  thickness?: number;
  speed?: number;
  className?: string;
}

const Loader3 = ({
  size = 56,
  color = "#f97316",
  trackColor = "rgba(0,0,0,0.08)",
  thickness = 5,
  speed = 0.9,
  className = "",
}: Loader3Props) => {
  const uid = useId().replace(/:/g, "");
  const cls = `ak-loader3-${uid}`;

  return (
    <div
      className={`inline-block ${className}`}
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
    >
      <style>{`
        @keyframes ${cls}-spin {
          to { transform: rotate(360deg); }
        }
        .${cls} {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          border: ${thickness}px solid ${trackColor};
          border-top-color: ${color};
          animation: ${cls}-spin ${speed}s linear infinite;
          box-sizing: border-box;
        }
      `}</style>
      <div className={cls} />
    </div>
  );
};

export default Loader3;
export type { Loader3Props };
