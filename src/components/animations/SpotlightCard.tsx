import { useRef, ReactNode } from "react";

interface SpotlightCardProps {
  spotlightColor?: string;
  spotlightSize?: number;
  borderGlow?: boolean;
  className?: string;
  children?: ReactNode;
}

const SpotlightCard = ({
  spotlightColor = "rgba(249,115,22,0.25)",
  spotlightSize = 300,
  borderGlow = true,
  className = "",
  children,
}: SpotlightCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    el.style.setProperty("--opacity", "1");
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.setProperty("--opacity", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl ${className}`}
      style={
        {
          background: "#0b0b0f",
          border: "1px solid rgba(255,255,255,0.08)",
          "--mx": "50%",
          "--my": "50%",
          "--opacity": "0",
        } as React.CSSProperties
      }
    >
      {/* Spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--opacity)",
          background: `radial-gradient(${spotlightSize}px circle at var(--mx) var(--my), ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Border glow */}
      {borderGlow && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: "var(--opacity)",
            background: `radial-gradient(${spotlightSize * 1.2}px circle at var(--mx) var(--my), ${spotlightColor}, transparent 60%)`,
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: 1,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
};

export default SpotlightCard;
export type { SpotlightCardProps };
