import { useState, useEffect, useRef } from "react";

interface Preloader7Props {
  onComplete?: () => void;
  bgColor?: string;
  accentColor?: string;
  countDuration?: number;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader7 = ({
  onComplete,
  bgColor = "#111111",
  accentColor = "#ffffff",
  countDuration = 2800,
  landingContent,
  contained = false,
}: Preloader7Props) => {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<"count" | "split" | "done">("count");
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (phase !== "count") return;
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / countDuration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(ease * 100);
      setPercent(val);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPercent(100);
        setTimeout(() => {
          setPhase("split");
          setTimeout(() => {
            setPhase("done");
            onComplete?.();
          }, 900);
        }, 300);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, countDuration, onComplete]);

  const isSplit = phase === "split";
  const isDone  = phase === "done";

  const panelClasses = "absolute top-0 bottom-0 z-20 overflow-hidden";
  const panelTransition = (side: "left" | "right") => ({
    background: bgColor,
    transform: isSplit
      ? `translateX(${side === "left" ? "-100%" : "100%"})`
      : "translateX(0)",
    transition: isSplit
      ? "transform 0.75s cubic-bezier(0.76,0,0.24,1)"
      : "none",
  });

  const lineOpacity = phase === "count" ? 0.12 : 0;

  return (
    <div className={`${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden`}>
      {/* Landing page */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[1]"
        style={{
          background: "#ffffff",
          opacity: isDone || isSplit ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {!isDone && (
        <>
          {/* Left panel */}
          <div className={`${panelClasses} left-0 w-1/2`} style={panelTransition("left")}>
            <div className="absolute inset-0 flex items-center justify-end pr-7 overflow-hidden">
              <span className="font-black leading-none tabular-nums select-none inline-block" style={{
                fontSize: "clamp(72px, 18vw, 160px)",
                color: `${accentColor}08`,
                letterSpacing: "-6px",
                transform: "scaleX(-1)",
              }}>
                {String(percent).padStart(3, "0")}
              </span>
            </div>
            <div className="absolute bottom-9 right-7 text-[13px] font-medium tracking-[2px] tabular-nums" style={{
              color: `${accentColor}30`,
            }}>
              {percent}
            </div>
            <div className="absolute bottom-0 left-0 h-0.5" style={{
              width: `${percent}%`,
              background: `${accentColor}20`,
            }} />
          </div>

          {/* Right panel */}
          <div className={`${panelClasses} left-1/2 w-1/2`} style={panelTransition("right")}>
            <div className="absolute inset-0 flex items-center justify-start pl-7 overflow-hidden">
              <span className="font-black leading-none tabular-nums select-none" style={{
                fontSize: "clamp(72px, 18vw, 160px)",
                color: `${accentColor}08`,
                letterSpacing: "-6px",
              }}>
                {String(percent).padStart(3, "0")}
              </span>
            </div>
            <div className="absolute bottom-9 left-7 text-[13px] font-medium tracking-[2px] tabular-nums" style={{
              color: `${accentColor}30`,
            }}>
              {percent}%
            </div>
            <div className="absolute bottom-0 right-0 h-0.5" style={{
              width: `${percent}%`,
              background: `${accentColor}20`,
            }} />
          </div>

          {/* Center divider */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px z-30" style={{
            background: `${accentColor}15`,
            opacity: lineOpacity,
            transition: "opacity 0.3s ease",
          }} />

          {/* Center label */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] flex flex-col items-center gap-2 pointer-events-none"
            style={{
              opacity: isSplit ? 0 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            <span className="font-extrabold leading-none tabular-nums" style={{
              fontSize: "clamp(36px, 8vw, 72px)",
              color: accentColor,
              letterSpacing: "-2px",
            }}>
              {percent}%
            </span>
            <span className="text-[11px] tracking-[4px] uppercase" style={{
              color: `${accentColor}30`,
            }}>
              Loading
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default Preloader7;
