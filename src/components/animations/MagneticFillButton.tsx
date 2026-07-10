import { useRef, useState, useEffect, useCallback } from "react";

interface MagneticFillButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8, borderWidth: 1.5 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10, borderWidth: 1.5 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12, borderWidth: 1.5 },
};

type Side = "left" | "right" | "top" | "bottom";

const MagneticFillButton = ({
  label = "Click Me",
  onClick,
  trigger = "view",
  size = "md",
  className = "",
}: MagneticFillButtonProps) => {
  const [fillProgress, setFillProgress] = useState(0);
  const [entrySide, setEntrySide] = useState<Side>("left");
  const [hue, setHue] = useState(200);
  const [clicked, setClicked] = useState(false);
  const [exploding, setExploding] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const fillRef = useRef(0);
  const targetRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const diff = targetRef.current - fillRef.current;
      if (Math.abs(diff) > 0.002) {
        fillRef.current += diff * 0.12;
        setFillProgress(fillRef.current);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fillRef.current = targetRef.current;
        setFillProgress(targetRef.current);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const getEntrySide = useCallback((e: React.MouseEvent<HTMLDivElement>): Side => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return "left";
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const fromLeft = x, fromRight = rect.width - x, fromTop = y, fromBottom = rect.height - y;
    const min = Math.min(fromLeft, fromRight, fromTop, fromBottom);
    if (min === fromLeft) return "left";
    if (min === fromRight) return "right";
    if (min === fromTop) return "top";
    return "bottom";
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger !== "hover") return;
    const side = getEntrySide(e);
    setEntrySide(side);
    targetRef.current = 1;
    setHue(side === "left" ? 200 : side === "right" ? 280 : side === "top" ? 160 : 240);
  }, [trigger, getEntrySide]);

  const handleMouseLeave = useCallback(() => {
    if (trigger !== "hover" || clicked) return;
    targetRef.current = 0;
  }, [trigger, clicked]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger !== "hover") return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setHue(Math.round(180 + x * 120 + y * 60));
  }, [trigger]);

  const handleClick = useCallback(() => {
    setClicked(true);
    setExploding(true);
    targetRef.current = 1;
    fillRef.current = 1;
    setFillProgress(1);
    onClick?.();
    setTimeout(() => {
      setExploding(false);
      targetRef.current = 0;
      setClicked(false);
    }, 600);
  }, [onClick]);

  const s = SIZES[size];
  const fillColor = `hsl(${hue}, 90%, 55%)`;
  const gradientOrigin = { left: "to right", right: "to left", top: "to bottom", bottom: "to top" }[entrySide];

  const fillStyle = fillProgress > 0 ? {
    background: `linear-gradient(${gradientOrigin},
      ${fillColor} ${fillProgress * 100 - 5}%,
      transparent ${fillProgress * 100 + 5}%
    )`,
  } : {};

  return (
    <div
      ref={btnRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {exploding && (
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            inset: -4,
            borderRadius: s.borderRadius + 4,
            background: fillColor,
            animation: "mag-explode 0.55s ease-out forwards",
          }}
        />
      )}

      <div
        className="absolute z-0 overflow-hidden"
        style={{
          inset: -s.borderWidth,
          borderRadius: s.borderRadius + s.borderWidth,
          border: `${s.borderWidth}px solid ${
            fillProgress > 0.1 ? `hsl(${hue}, 70%, 55%)` : "rgba(255,255,255,0.18)"
          }`,
          transition: "border-color 0.3s ease",
          ...fillStyle,
        }}
      />

      <button
        onClick={handleClick}
        className="relative z-[1] font-semibold border-none cursor-pointer tracking-wide backdrop-blur-sm outline-none select-none"
        style={{
          fontSize: s.fontSize,
          padding: `${s.paddingY}px ${s.paddingX}px`,
          borderRadius: s.borderRadius,
          background: fillProgress > 0.5 ? `hsl(${hue}, 80%, 14%)` : "rgba(8,8,12,0.95)",
          color: fillProgress > 0.4 ? `hsl(${hue}, 60%, 88%)` : "rgba(255,255,255,0.85)",
          transition: "background 0.25s ease, color 0.25s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{`
        @keyframes mag-explode {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MagneticFillButton;
