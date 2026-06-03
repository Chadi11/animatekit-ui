import { useRef, useState, useEffect } from "react";

interface RainbowOrbitButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8, borderWidth: 2 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10, borderWidth: 2 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12, borderWidth: 2 },
};

const RainbowOrbitButton = ({
  label = "Click Me",
  onClick,
  trigger = "view",
  size = "md",
  className = "",
}: RainbowOrbitButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [clicked, setClicked] = useState(false);
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number>(0);
  const angleRef = useRef(0);
  const s = SIZES[size];

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); return; }
    const speed = clicked ? 4 : 1.2;
    const tick = () => {
      angleRef.current = (angleRef.current + speed) % 360;
      setAngle(angleRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, clicked]);

  const handleClick = () => {
    setClicked(true);
    onClick?.();
    setTimeout(() => setClicked(false), 600);
  };

  const rainbow = `conic-gradient(from ${angle}deg, #ff0080, #ff8c00, #ffe000, #40e0d0, #0080ff, #8000ff, #ff0080)`;

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      {/* Rainbow border layer */}
      <div className="absolute z-0" style={{
        inset: -s.borderWidth,
        borderRadius: s.borderRadius + s.borderWidth,
        background: active ? rainbow : "transparent",
        border: active ? "none" : `${s.borderWidth}px solid rgba(255,255,255,0.15)`,
        transition: "opacity 0.3s ease",
        filter: clicked ? `blur(1px) brightness(2)` : active ? "blur(0.5px)" : "none",
      }} />

      {/* Flash ring on click */}
      {clicked && (
        <div className="absolute z-0 pointer-events-none" style={{
          inset: -s.borderWidth - 4,
          borderRadius: s.borderRadius + s.borderWidth + 4,
          border: "2px solid rgba(255,255,255,0.7)",
          animation: "pulse-ring 0.6s ease-out forwards",
        }} />
      )}

      {/* Button face */}
      <button
        onClick={handleClick}
        className="relative z-[1] border-none cursor-pointer tracking-wide outline-none select-none backdrop-blur-sm"
        style={{
          fontSize: s.fontSize,
          fontWeight: 600,
          padding: `${s.paddingY}px ${s.paddingX}px`,
          borderRadius: s.borderRadius,
          background: clicked
            ? "rgba(255,255,255,0.15)"
            : "rgba(10,10,10,0.92)",
          color: clicked ? "#ffffff" : "rgba(255,255,255,0.9)",
          transition: "background 0.2s ease, color 0.2s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default RainbowOrbitButton;
