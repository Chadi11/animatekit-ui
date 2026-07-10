import { useRef, useState, useEffect, useCallback } from "react";

interface LaserTraceButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
  laserColor?: string;
  className?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const LaserTraceButton = ({
  label = "Click Me",
  onClick,
  trigger = "view",
  size = "md",
  laserColor = "#00e5ff",
  className = "",
}: LaserTraceButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [clicked, setClicked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);
  const s = SIZES[size];

  const SPEED_NORMAL = 0.004;
  const SPEED_FAST = 0.016;

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); return; }
    const speed = clicked ? SPEED_FAST : SPEED_NORMAL;
    const tick = () => {
      progressRef.current = (progressRef.current + speed) % 1;
      setProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, clicked]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      setBurstPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setClicked(true);
    onClick?.();
    setTimeout(() => {
      setClicked(false);
      setBurstPos(null);
    }, 700);
  }, [onClick]);

  const getLaserPoint = (p: number, w: number, h: number, _r: number) => {
    const perimeter = 2 * (w + h);
    const pos = p * perimeter;
    if (pos < w) return { x: pos, y: 0 };
    if (pos < w + h) return { x: w, y: pos - w };
    if (pos < 2 * w + h) return { x: w - (pos - w - h), y: h };
    return { x: 0, y: h - (pos - 2 * w - h) };
  };

  const TAIL = 18;
  const tailPoints = Array.from({ length: TAIL }, (_, i) => {
    const p = ((progress - i * 0.012) + 1) % 1;
    return p;
  });

  const W = 200; const H = 60;

  return (
    <div
      ref={btnRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      <svg
        className="absolute -inset-0.5 pointer-events-none z-[2] overflow-visible"
        style={{ width: "calc(100% + 4px)", height: "calc(100% + 4px)" }}
        viewBox={`0 0 ${W + 4} ${H + 4}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="laser-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect
          x={2} y={2} width={W} height={H}
          rx={s.borderRadius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />

        {active && tailPoints.map((tp, i) => {
          const pt = getLaserPoint(tp, W, H, s.borderRadius);
          const opacity = (1 - i / TAIL) * 0.6;
          const r = (1 - i / TAIL) * 2.5;
          return (
            <circle
              key={i}
              cx={pt.x + 2} cy={pt.y + 2}
              r={r}
              fill={clicked ? `rgba(255,255,255,${opacity})` : laserColor}
              fillOpacity={clicked ? 1 : opacity}
              filter="url(#laser-glow)"
            />
          );
        })}

        {active && (() => {
          const pt = getLaserPoint(progress, W, H, s.borderRadius);
          return (
            <circle
              cx={pt.x + 2} cy={pt.y + 2} r={3.5}
              fill={clicked ? "#ffffff" : laserColor}
              filter="url(#laser-glow)"
            />
          );
        })()}
      </svg>

      {burstPos && (
        <div
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none z-10"
          style={{
            left: burstPos.x,
            top: burstPos.y,
            background: laserColor,
            transform: "translate(-50%, -50%)",
            animation: "laser-burst 0.6s ease-out forwards",
            boxShadow: `0 0 12px 4px ${laserColor}99`,
          }}
        />
      )}

      <button
        onClick={handleClick}
        className="relative z-[1] font-semibold border-none cursor-pointer tracking-wide outline-none select-none"
        style={{
          fontSize: s.fontSize,
          padding: `${s.paddingY}px ${s.paddingX}px`,
          borderRadius: s.borderRadius,
          background: clicked ? `${laserColor}14` : "rgba(8,8,12,0.95)",
          color: clicked ? laserColor : "rgba(255,255,255,0.88)",
          transition: "background 0.2s ease, color 0.2s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{`
        @keyframes laser-burst {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LaserTraceButton;
