import { useRef, useState, useEffect } from "react";

interface NeonFlickerButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const NeonFlickerButton = ({
  label = "Click Me",
  onClick,
  trigger = "view",
  size = "md",
  color = "#00f0ff",
  className = "",
}: NeonFlickerButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [glow, setGlow] = useState(0);
  const [surging, setSurging] = useState(false);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const s = SIZES[size];

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); setGlow(0); return; }
    let lastFlicker = 0;
    let currentGlow = 0.7;
    let flickerInterval = 120;

    const tick = (now: number) => {
      if (!timeRef.current) timeRef.current = now;
      const elapsed = now - lastFlicker;
      if (elapsed > flickerInterval) {
        lastFlicker = now;
        const r = Math.random();
        if (r < 0.08) { currentGlow = 0.05; flickerInterval = 40 + Math.random() * 60; }
        else if (r < 0.15) { currentGlow = 0.3 + Math.random() * 0.3; flickerInterval = 30 + Math.random() * 40; }
        else if (r < 0.25) { currentGlow = 0.9 + Math.random() * 0.1; flickerInterval = 80 + Math.random() * 120; }
        else { currentGlow = 0.65 + Math.random() * 0.2; flickerInterval = 100 + Math.random() * 200; }
        setGlow(currentGlow);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); timeRef.current = 0; };
  }, [active]);

  const handleClick = () => {
    setSurging(true);
    setGlow(0);
    onClick?.();
    setTimeout(() => { setGlow(1); }, 80);
    setTimeout(() => { setGlow(0.8); setSurging(false); }, 250);
  };

  const glowPx = glow * 18;
  const spread = glow * 6;
  const opacity = active ? 0.3 + glow * 0.7 : 0.18;
  const textGlow = active ? `0 0 ${glow * 10}px ${color}` : "none";

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      <button
        onClick={handleClick}
        className="relative z-[1] font-semibold cursor-pointer tracking-wide outline-none select-none"
        style={{
          fontSize: s.fontSize,
          padding: `${s.paddingY}px ${s.paddingX}px`,
          borderRadius: s.borderRadius,
          border: `1.5px solid ${color}`,
          borderColor: `rgba(${hexToRgb(color)}, ${opacity})`,
          background: active ? `rgba(${hexToRgb(color)}, ${glow * 0.07})` : "rgba(8,8,12,0.95)",
          color: active ? color : "rgba(255,255,255,0.8)",
          transform: surging ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.1s ease",
          boxShadow: active
            ? `0 0 ${glowPx}px ${spread}px rgba(${hexToRgb(color)}, ${glow * 0.4}),
               inset 0 0 ${glowPx / 2}px rgba(${hexToRgb(color)}, ${glow * 0.15})`
            : "none",
          textShadow: textGlow,
        }}
      >
        {label}
      </button>
    </div>
  );
};

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default NeonFlickerButton;
