import { useRef, useState, useEffect, useCallback } from "react";

interface ShockwaveRippleButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
  ringColors?: string[];
  className?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const DEFAULT_RING_COLORS = ["#00e5ff", "#7c3aed", "#10b981", "#f59e0b", "#ef4444"];

interface Ring { id: number; born: number; color: string; fast: boolean; }

const ShockwaveRippleButton = ({
  label = "Click Me",
  onClick,
  trigger = "view",
  size = "md",
  ringColors = DEFAULT_RING_COLORS,
  className = "",
}: ShockwaveRippleButtonProps) => {
  const [active, setActive]   = useState(trigger === "view");
  const [rings, setRings]     = useState<Ring[]>([]);
  const [clicked, setClicked] = useState(false);
  const ringIdRef    = useRef(0);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef       = useRef<number>(0);
  const nowRef       = useRef(0);
  const colorIdxRef  = useRef(0);
  const s = SIZES[size];

  useEffect(() => {
    const tick = (t: number) => { nowRef.current = t; rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const spawnRing = useCallback((fast = false) => {
    const id = ringIdRef.current++;
    const color = ringColors[colorIdxRef.current % ringColors.length];
    colorIdxRef.current++;
    setRings((prev) => [...prev.slice(-8), { id, born: nowRef.current, color, fast }]);
  }, [ringColors]);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRings([]);
      return;
    }
    spawnRing();
    intervalRef.current = setInterval(() => spawnRing(), 900);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, spawnRing]);

  useEffect(() => {
    const cull = setInterval(() => {
      setRings((prev) => prev.filter((r) => {
        const age = nowRef.current - r.born;
        const dur = r.fast ? 500 : 1200;
        return age < dur;
      }));
    }, 100);
    return () => clearInterval(cull);
  }, []);

  const handleClick = useCallback(() => {
    setClicked(true);
    onClick?.();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnRing(true), i * 80);
    }
    setTimeout(() => setClicked(false), 500);
  }, [onClick, spawnRing]);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      {rings.map((ring) => {
        const age   = nowRef.current - ring.born;
        const dur   = ring.fast ? 500 : 1200;
        const p     = Math.min(age / dur, 1);
        const ease  = 1 - Math.pow(1 - p, 3);
        const expand = ease * (ring.fast ? 28 : 20);
        const opacity = (1 - ease) * 0.8;
        return (
          <div
            key={ring.id}
            className="absolute pointer-events-none z-0"
            style={{
              inset: -(expand + 2),
              borderRadius: s.borderRadius + expand + 2,
              border: `1.5px solid ${ring.color}`,
              opacity,
            }}
          />
        );
      })}

      <div className="absolute pointer-events-none z-0" style={{
        inset: -1.5,
        borderRadius: s.borderRadius + 1.5,
        border: "1.5px solid rgba(255,255,255,0.14)",
      }} />

      <button
        onClick={handleClick}
        className="relative z-[1] border-none cursor-pointer tracking-wide outline-none select-none"
        style={{
          fontSize: s.fontSize, fontWeight: 600,
          padding: `${s.paddingY}px ${s.paddingX}px`,
          borderRadius: s.borderRadius,
          background: clicked ? `${ringColors[0]}10` : "rgba(8,8,12,0.96)",
          color: "rgba(255,255,255,0.88)",
          transition: "background 0.2s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>
    </div>
  );
};

export default ShockwaveRippleButton;
