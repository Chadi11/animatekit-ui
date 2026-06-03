import { useState, useEffect } from "react";

interface Preloader8Props {
  onComplete?: () => void;
  duration?: number;
  stripColor?: string;
  stripCount?: number;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader8 = ({
  onComplete,
  duration = 2200,
  stripColor = "#f97316",
  stripCount = 8,
  landingContent,
  contained = false,
}: Preloader8Props) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsRevealing(true);
      setTimeout(() => {
        setIsDone(true);
        onComplete?.();
      }, stripCount * 80 + 700 + 200);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, stripCount, onComplete]);

  return (
    <div
      className={`${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden`}
      style={{ background: stripColor }}
    >
      <div
        className="absolute inset-0 bg-white flex items-center justify-center z-[1]"
        style={{
          opacity: isDone || isRevealing ? 1 : 0,
          transition: "opacity 0.4s ease 0.2s",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {!isDone && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {[...Array(stripCount)].map((_, i) => {
            const stripW = 100 / stripCount;
            const leftPct = i * stripW;
            const rightPct = (i + 1) * stripW;
            return (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(${leftPct}% 0%, ${rightPct}% 0%, ${rightPct}% 100%, ${leftPct}% 100%)`,
                  transform: isRevealing ? "translateY(-100%)" : "translateY(0)",
                  transition: "transform 0.7s cubic-bezier(0.76,0,0.24,1)",
                  transitionDelay: isRevealing ? `${i * 80}ms` : "0ms",
                }}
              >
                <div className="absolute inset-0" style={{ background: stripColor }} />
                {i < stripCount - 1 && (
                  <div className="absolute top-0 bottom-0 right-0 w-px bg-white/25 z-[2]" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Preloader8;
export type { Preloader8Props };
