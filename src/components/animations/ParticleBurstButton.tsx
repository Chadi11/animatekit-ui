import { useRef, useState, useEffect, useCallback } from "react";

interface ParticleBurstButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const COLORS = ["#ffd700", "#ff8c00", "#ff4500", "#ffffff", "#ffb347"];
const PARTICLE_COUNT = 16;

interface Particle {
  id: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  opacity: number;
  burstAngle?: number;
  burstDist?: number;
}

const ParticleBurstButton = ({
  label = "Click Me",
  onClick,
  trigger = "view",
  size = "md",
  className = "",
}: ParticleBurstButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [bursting, setBursting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [burstParticles, setBurstParticles] = useState<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const btnRef = useRef<HTMLDivElement>(null);
  const s = SIZES[size];

  const makeParticles = (): Particle[] =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      progress: i / PARTICLE_COUNT,
      speed: 0.003 + Math.random() * 0.004,
      size: 2 + Math.random() * 2.5,
      color: COLORS[i % COLORS.length],
      opacity: 0.6 + Math.random() * 0.4,
    }));

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); setParticles([]); return; }
    const pts = makeParticles();
    setParticles(pts);
    const tick = () => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          progress: (p.progress + p.speed) % 1,
          opacity: 0.5 + 0.5 * Math.sin(p.progress * Math.PI * 6),
        }))
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  const getPoint = (p: number, w: number, h: number) => {
    const perim = 2 * (w + h);
    const pos = p * perim;
    if (pos < w) return { x: pos, y: 0 };
    if (pos < w + h) return { x: w, y: pos - w };
    if (pos < 2 * w + h) return { x: w - (pos - w - h), y: h };
    return { x: 0, y: h - (pos - 2 * w - h) };
  };

  const handleClick = useCallback(() => {
    setBursting(true);
    onClick?.();
    const burst = particles.map((p) => ({
      ...p,
      burstAngle: Math.random() * Math.PI * 2,
      burstDist: 30 + Math.random() * 40,
    }));
    setBurstParticles(burst);
    setTimeout(() => { setBursting(false); setBurstParticles([]); }, 700);
  }, [particles, onClick]);

  const W = 200; const H = 54;

  return (
    <div
      ref={btnRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      <svg
        className="absolute -inset-[3px] pointer-events-none z-[2] overflow-visible"
        style={{ width: "calc(100% + 6px)", height: "calc(100% + 6px)" }}
        viewBox={`0 0 ${W + 6} ${H + 6}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="p-glow">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect x={3} y={3} width={W} height={H} rx={s.borderRadius}
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

        {!bursting && particles.map((p) => {
          const pt = getPoint(p.progress, W, H);
          return (
            <circle key={p.id} cx={pt.x + 3} cy={pt.y + 3} r={p.size / 2}
              fill={p.color} opacity={p.opacity} filter="url(#p-glow)" />
          );
        })}

        {bursting && burstParticles.map((p) => {
          const pt = getPoint(p.progress, W, H);
          return (
            <circle key={`burst-${p.id}`} cx={pt.x + 3} cy={pt.y + 3} r={p.size / 2}
              fill={p.color} opacity={p.opacity} filter="url(#p-glow)"
              style={{
                transform: `translate(${Math.cos(p.burstAngle!) * p.burstDist!}px, ${Math.sin(p.burstAngle!) * p.burstDist!}px)`,
                transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                opacity: 0,
              }}
            />
          );
        })}
      </svg>

      <button
        onClick={handleClick}
        className="relative z-[1] font-semibold border-none cursor-pointer tracking-wide outline-none select-none"
        style={{
          fontSize: s.fontSize,
          padding: `${s.paddingY}px ${s.paddingX}px`,
          borderRadius: s.borderRadius,
          background: bursting ? "rgba(255,180,0,0.08)" : "rgba(8,8,12,0.95)",
          color: bursting ? "#ffd700" : "rgba(255,255,255,0.88)",
          transition: "background 0.2s ease, color 0.2s ease, transform 0.1s ease",
          transform: bursting ? "scale(0.96)" : "scale(1)",
        }}
      >
        {label}
      </button>
    </div>
  );
};

export default ParticleBurstButton;
