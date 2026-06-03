import { useRef, useState, useEffect } from "react";

interface BreathingGlowButtonProps {
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

const BreathingGlowButton = ({
  label = "Click Me",
  onClick,
  trigger = "view",
  size = "md",
  className = "",
}: BreathingGlowButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [clicked, setClicked] = useState(false);
  const [hue, setHue] = useState(0);
  const [breathe, setBreathe] = useState(1);
  const [ripple, setRipple] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const s = SIZES[size];

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      setHue(0);
      setBreathe(1);
      return;
    }

    const hueSpeed = clicked ? 3 : 0.6;
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = (now - startRef.current) * 0.001;
      setHue((h) => (h + hueSpeed) % 360);
      const breatheSpeed = clicked ? 8 : 2;
      setBreathe(0.5 + 0.5 * Math.sin(elapsed * breatheSpeed));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [active, clicked]);

  const handleClick = () => {
    setClicked(true);
    setRipple(true);
    onClick?.();
    setTimeout(() => setRipple(false), 700);
    setTimeout(() => setClicked(false), 700);
  };

  const glowColor = `hsl(${hue}, 100%, 60%)`;
  const glowSize = active ? 4 + breathe * 10 : 0;

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      {ripple && (
        <div
          className="absolute pointer-events-none z-0"
          style={{
            inset: -s.borderWidth - 2,
            borderRadius: s.borderRadius + s.borderWidth + 2,
            border: `2px solid ${glowColor}`,
            animation: "glow-ripple 0.65s ease-out forwards",
          }}
        />
      )}

      <div
        className="absolute z-0"
        style={{
          inset: -s.borderWidth,
          borderRadius: s.borderRadius + s.borderWidth,
          background: active
            ? `linear-gradient(135deg, hsl(${hue}, 100%, 55%), hsl(${(hue + 120) % 360}, 100%, 55%))`
            : "transparent",
          border: active ? "none" : `${s.borderWidth}px solid rgba(255,255,255,0.14)`,
          boxShadow: active
            ? `0 0 ${glowSize}px ${glowSize / 2}px hsl(${hue}, 100%, 50%)`
            : "none",
          transition: active ? "box-shadow 0.05s ease" : "opacity 0.4s ease",
          opacity: active ? 1 : 0.6,
        }}
      />

      <button
        onClick={handleClick}
        className="relative z-[1] border-none cursor-pointer tracking-wide outline-none select-none backdrop-blur-sm"
        style={{
          fontSize: s.fontSize,
          fontWeight: 600,
          padding: `${s.paddingY}px ${s.paddingX}px`,
          borderRadius: s.borderRadius,
          background: clicked
            ? `hsl(${hue}, 60%, 10%)`
            : "rgba(8,8,12,0.94)",
          color: active
            ? `hsl(${hue}, 60%, 85%)`
            : "rgba(255,255,255,0.85)",
          transition: "background 0.2s ease, color 0.3s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{`
        @keyframes glow-ripple {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default BreathingGlowButton;
