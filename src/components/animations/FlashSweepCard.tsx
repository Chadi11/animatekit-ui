import { useRef, useState, useEffect, useCallback } from "react";

interface FlashSweepCardProps {
  children?: React.ReactNode;
  sweepColor?: string;
  sweepWidth?: number;
  sweepDuration?: number;
  sweepAngle?: number;
  trigger?: "hover" | "view" | "both";
  intervalMs?: number;
  width?: number;
  height?: number;
  className?: string;
}

const FlashSweepCard = ({
  children,
  sweepColor = "rgba(255,255,255,0.55)",
  sweepWidth = 80,
  sweepDuration = 600,
  sweepAngle = 120,
  trigger = "both",
  intervalMs = 3000,
  width = 320,
  height = 200,
  className = "",
}: FlashSweepCardProps) => {
  const sweepingRef = useRef(false);
  const [progress, setProgress] = useState(-1);
  const animRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  const isAutoMode = trigger === "view" || trigger === "both";
  const isHoverMode = trigger === "hover" || trigger === "both";

  const runSweep = useCallback(() => {
    if (sweepingRef.current) return;
    sweepingRef.current = true;
    setProgress(0);
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / sweepDuration, 1);
      setProgress(p);
      if (p < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        sweepingRef.current = false;
        setProgress(-1);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, [sweepDuration]);

  useEffect(() => {
    if (!isAutoMode) return;
    const schedule = () => {
      intervalRef.current = setTimeout(() => {
        runSweep();
        schedule();
      }, intervalMs);
    };
    intervalRef.current = setTimeout(() => {
      runSweep();
      schedule();
    }, 800);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, [isAutoMode, intervalMs, runSweep]);

  const handleMouseEnter = useCallback(() => {
    if (!isHoverMode) return;
    runSweep();
  }, [isHoverMode, runSweep]);

  const totalTravel = width + sweepWidth * 2;
  const beamCenterPx = -sweepWidth + progress * totalTravel;
  const beamCenterPct = (beamCenterPx / width) * 100;
  const beamHalfPct = (sweepWidth / width) * 100;

  const angleRad = ((sweepAngle - 90) * Math.PI) / 180;
  const skewDeg = (Math.atan(Math.cos(angleRad) / Math.sin(angleRad)) * 180) / Math.PI;

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ width, height, perspective: 600 }}
    >
      <div className="w-full h-full rounded-xl relative overflow-hidden border border-white/[0.12] will-change-transform"
        style={{ background: "linear-gradient(135deg, hsl(0 0% 14%), hsl(0 0% 9%))" }}
      >
        <div className="relative z-[1] w-full h-full">
          {children ?? (
            <>
              <div className="absolute top-4 right-4 text-[11px] px-2.5 py-[3px] rounded-full border border-white/15 text-white/50 tracking-wide uppercase">
                Hover Me
              </div>
              <div className="absolute bottom-5 left-5">
                <h3 className="m-0 text-lg font-medium text-white tracking-tight">
                  Flash Sweep
                </h3>
                <p className="m-0 mt-1 text-[13px] text-white/45">
                  A blade of light, corner to corner
                </p>
              </div>
            </>
          )}
        </div>

        {progress >= 0 && (
          <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: `${beamCenterPct - beamHalfPct}%`,
                width: `${beamHalfPct * 2}%`,
                transform: `skewX(${skewDeg}deg)`,
                transformOrigin: "center",
                background: `linear-gradient(
                  to right,
                  transparent 0%,
                  ${sweepColor.replace(/[\d.]+\)$/, "0.0)")} 10%,
                  ${sweepColor} 50%,
                  ${sweepColor.replace(/[\d.]+\)$/, "0.0)")} 90%,
                  transparent 100%
                )`,
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none z-[3] rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]" />
      </div>
    </div>
  );
};

export default FlashSweepCard;
