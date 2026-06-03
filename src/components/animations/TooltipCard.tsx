import { useRef, useState, useCallback } from "react";

interface TooltipCardProps {
  children?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipWidth?: number;
  offset?: { x: number; y: number };
  animationDuration?: number;
  trigger?: "hover" | "always";
  accentColor?: string;
  width?: number;
  height?: number;
  className?: string;
}

const TooltipCard = ({
  children,
  tooltip,
  tooltipWidth = 200,
  offset = { x: 16, y: 16 },
  animationDuration = 120,
  trigger = "hover",
  accentColor = "#4ade80",
  width = 320,
  height = 200,
  className = "",
}: TooltipCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(trigger === "always");
  const rafRef = useRef<number>(0);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const factor = animationDuration <= 80 ? 0.35 : animationDuration <= 150 ? 0.2 : 0.12;

  const animatePos = useCallback(() => {
    const dx = targetPos.current.x - currentPos.current.x;
    const dy = targetPos.current.y - currentPos.current.y;
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      currentPos.current = {
        x: lerp(currentPos.current.x, targetPos.current.x, factor),
        y: lerp(currentPos.current.y, targetPos.current.y, factor),
      };
      setPos({ ...currentPos.current });
      rafRef.current = requestAnimationFrame(animatePos);
    }
  }, [factor]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left + offset.x,
      y: e.clientY - rect.top + offset.y,
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animatePos);
  }, [offset, animatePos]);

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (trigger !== "always") setVisible(false);
    cancelAnimationFrame(rafRef.current);
  }, [trigger]);

  const defaultTooltip = (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
          background: accentColor, boxShadow: `0 0 6px ${accentColor}`,
        }} />
        <span className="text-[11px] text-white/50 tracking-wide uppercase">
          Tooltip Card
        </span>
      </div>
      <p className="m-0 text-[13px] text-white font-medium leading-snug">
        I follow your cursor
      </p>
      <p className="m-0 text-xs text-white/40 leading-relaxed">
        Move your mouse around to see me glide
      </p>
    </div>
  );

  const defaultChildren = (
    <>
      <div className="absolute top-4 right-4 text-[11px] py-[3px] px-2.5 rounded-[20px] border border-white/15 text-white/50 tracking-wide uppercase">
        Hover Me
      </div>
      <div className="absolute bottom-5 left-5">
        <h3 className="m-0 text-lg font-medium text-white tracking-tight">
          Tooltip Card
        </h3>
        <p className="m-0 mt-1 text-[13px] text-white/45">
          Tooltip follows your cursor
        </p>
      </div>
    </>
  );

  return (
    <div
      ref={cardRef}
      className={`relative select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width, height }}
    >
      <div className="w-full h-full rounded-xl relative overflow-hidden cursor-none"
        style={{
          background: "linear-gradient(135deg, hsl(0 0% 14%), hsl(0 0% 9%))",
          border: "1px solid hsl(0 0% 18%)",
        }}
      >
        <div className="relative z-[1] w-full h-full">
          {children ?? defaultChildren}
        </div>
        <div className="absolute inset-0 pointer-events-none z-[2] rounded-xl"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)" }}
        />
      </div>

      {visible && (
        <div
          className="absolute pointer-events-none z-[100]"
          style={{
            left: pos.x, top: pos.y,
            width: tooltipWidth,
            opacity: visible ? 1 : 0, transition: "opacity 0.15s ease",
          }}
        >
          <div className="rounded-[10px] px-3 py-2.5 backdrop-blur-xl"
            style={{
              background: "hsl(0 0% 10% / 0.96)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset",
            }}
          >
            {tooltip ?? defaultTooltip}
          </div>
          <div className="absolute -top-[5px] left-3.5 w-[9px] h-[9px] rounded-tl-sm border-r-0 border-b-0" style={{
            background: "hsl(0 0% 10% / 0.96)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            transform: "rotate(45deg)",
          }} />
        </div>
      )}
    </div>
  );
};

export default TooltipCard;
