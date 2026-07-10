import { useRef, useState } from "react";

interface TypewriterBorderButtonProps {
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

const TypewriterBorderButton = ({
  label = "Click Me",
  onClick,
  trigger = "view",
  size = "md",
  color = "#ffffff",
  className = "",
}: TypewriterBorderButtonProps) => {
  const [drawProgress, setDrawProgress] = useState(trigger === "view" ? 1 : 0);
  const [clicked, setClicked]           = useState(false);
  const [pulsing, setPulsing]           = useState(false);
  const rafRef     = useRef<number>(0);
  const progressRef = useRef(trigger === "view" ? 1 : 0);
  const dirRef      = useRef<"draw" | "erase">("draw");
  const s = SIZES[size];

  const DRAW_SPEED  = 0.022;
  const ERASE_SPEED = 0.028;
  const SNAP_SPEED  = 0.12;

  const animate = (speed: number, target: number) => {
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const diff = target - progressRef.current;
      if (Math.abs(diff) < 0.005) {
        progressRef.current = target;
        setDrawProgress(target);
        return;
      }
      progressRef.current += (diff > 0 ? speed : -speed);
      progressRef.current = Math.max(0, Math.min(1, progressRef.current));
      setDrawProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleMouseEnter = () => {
    if (trigger !== "hover") return;
    dirRef.current = "draw";
    animate(DRAW_SPEED, 1);
  };

  const handleMouseLeave = () => {
    if (trigger !== "hover" || clicked) return;
    dirRef.current = "erase";
    animate(ERASE_SPEED, 0);
  };

  const handleClick = () => {
    setClicked(true);
    setPulsing(true);
    animate(SNAP_SPEED, 1);
    onClick?.();
    setTimeout(() => { setPulsing(false); setClicked(false); }, 600);
  };

  const W = 200; const H = 54;
  const perimeter = 2 * (W + H);
  const drawn = drawProgress * perimeter;
  const remaining = perimeter - drawn;

  const getPenPos = (p: number) => {
    const pos = p * perimeter;
    if (pos < W) return { x: pos + 3, y: 3 };
    if (pos < W + H) return { x: W + 3, y: pos - W + 3 };
    if (pos < 2 * W + H) return { x: W - (pos - W - H) + 3, y: H + 3 };
    return { x: 3, y: H - (pos - 2 * W - H) + 3 };
  };

  const penPos = getPenPos(Math.min(drawProgress, 0.999));
  const glowIntensity = clicked ? 1 : drawProgress;

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="absolute -inset-[3px] w-[calc(100%+6px)] h-[calc(100%+6px)] pointer-events-none z-[2] overflow-visible"
        viewBox={`0 0 ${W + 6} ${H + 6}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="tw-glow">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect x={3} y={3} width={W} height={H} rx={s.borderRadius}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />

        {drawProgress > 0 && (
          <rect x={3} y={3} width={W} height={H} rx={s.borderRadius}
            fill="none" stroke={color}
            strokeWidth={pulsing ? 2 : 1.5}
            strokeDasharray={`${drawn} ${remaining}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            filter={glowIntensity > 0.3 ? "url(#tw-glow)" : undefined}
            opacity={0.5 + glowIntensity * 0.5}
          />
        )}

        {drawProgress > 0.01 && drawProgress < 0.999 && (
          <circle cx={penPos.x} cy={penPos.y} r={3} fill={color} filter="url(#tw-glow)" opacity={0.9} />
        )}

        {pulsing && (
          <rect x={3} y={3} width={W} height={H} rx={s.borderRadius}
            fill="none" stroke={color} strokeWidth={1} opacity={0}
            style={{ animation: "tw-pulse 0.55s ease-out forwards" }}
          />
        )}
      </svg>

      <button
        onClick={handleClick}
        className="relative z-[1] border-none cursor-pointer tracking-wide outline-none select-none font-semibold"
        style={{
          fontSize: s.fontSize,
          padding: `${s.paddingY}px ${s.paddingX}px`,
          borderRadius: s.borderRadius,
          background: clicked ? "rgba(255,255,255,0.06)" : "rgba(8,8,12,0.96)",
          color: drawProgress > 0.5 ? color : "rgba(255,255,255,0.7)",
          transition: "background 0.2s ease, color 0.3s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{`
        @keyframes tw-pulse {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.12); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TypewriterBorderButton;
