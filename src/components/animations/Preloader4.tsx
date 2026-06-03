import { useState, useEffect, useRef } from "react";

interface Preloader4Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  bgColor?: string;
  accentColor?: string;
  blindCount?: number;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader4 = ({
  onComplete,
  greetings = [
    { text: "Hello",     lang: "en" },
    { text: "你好",       lang: "zh" },
    { text: "مرحبًا",    lang: "ar" },
    { text: "Hola",      lang: "es" },
    { text: "こんにちは",  lang: "ja" },
  ],
  intervalMs = 700,
  bgColor = "#0f0f0f",
  accentColor = "#ffffff",
  blindCount = 6,
  landingContent,
  contained = false,
}: Preloader4Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"greet" | "shutter" | "done">("greet");
  const [closedBlinds, setClosedBlinds] = useState<number[]>([]);
  const [percent, setPercent] = useState(0);
  const percentRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blindTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (phase !== "greet") return;
    const target = Math.round(((currentIndex + 1) / greetings.length) * 100);
    const step = () => {
      setPercent((p) => {
        if (p >= target) return target;
        return p + 1;
      });
    };
    percentRef.current = setInterval(step, 12);
    return () => { if (percentRef.current) clearInterval(percentRef.current); };
  }, [currentIndex, phase, greetings.length]);

  useEffect(() => {
    if (phase !== "greet") return;
    const t = setTimeout(() => {
      if (currentIndex < greetings.length - 1) {
        setCurrentIndex((p) => p + 1);
      } else {
        setPercent(100);
        setTimeout(() => {
          setPhase("shutter");
          for (let i = 0; i < blindCount; i++) {
            const bt = setTimeout(() => {
              setClosedBlinds((prev) => [...prev, i]);
            }, i * 110);
            blindTimers.current.push(bt);
          }
          const doneTimer = setTimeout(() => {
            setPhase("done");
            onComplete?.();
          }, blindCount * 110 + 600);
          blindTimers.current.push(doneTimer);
        }, 500);
      }
    }, intervalMs);
    return () => clearTimeout(t);
  }, [currentIndex, phase, greetings.length, intervalMs, blindCount, onComplete]);

  const isShuttering = phase === "shutter";
  const isDone = phase === "done";

  return (
    <div className={`${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden`}>
      {/* Landing */}
      <div className="absolute inset-0 flex items-center justify-center z-[1]" style={{ background: "#ffffff" }}>
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {/* Blinds */}
      {!isDone && (
        <div className="absolute inset-0 z-50">
          {[...Array(blindCount)].map((_, i) => {
            const isClosed = closedBlinds.includes(i);
            return (
              <div
                key={i}
                className="absolute left-0 right-0 origin-top"
                style={{
                  top: `${(i / blindCount) * 100}%`,
                  height: `${100 / blindCount}%`,
                  background: i % 2 === 0 ? bgColor : "#1a1a1a",
                  transform: isClosed ? "scaleY(0)" : "scaleY(1)",
                  transition: isClosed
                    ? "transform 0.45s cubic-bezier(0.76,0,0.24,1)"
                    : "none",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Content */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center pointer-events-none"
          style={{
            opacity: isShuttering ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {/* Giant bg percentage */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <span className="font-black leading-none select-none tabular-nums" style={{
              fontSize: "clamp(120px, 28vw, 240px)",
              color: `${accentColor}06`,
              letterSpacing: "-8px",
            }}>
              {String(percent).padStart(3, "0")}
            </span>
          </div>
          {/* Greeting */}
          <div className="relative z-[2] text-center">
            {greetings.map((greeting, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-screen"
                style={{
                  position: index === 0 ? "relative" : "absolute",
                  top: index === 0 ? undefined : 0,
                  left: index === 0 ? undefined : "50%",
                  transform: index === 0
                    ? undefined
                    : index === currentIndex
                    ? "translateX(-50%) translateY(0)"
                    : index < currentIndex
                    ? "translateX(-50%) translateY(-30px)"
                    : "translateX(-50%) translateY(30px)",
                  opacity: index === currentIndex ? 1 : 0,
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  fontFamily:
                    greeting.lang === "ar" ? "Arial, sans-serif"
                    : greeting.lang === "zh" || greeting.lang === "ja" ? "system-ui, sans-serif"
                    : "inherit",
                }}
              >
                <span className="font-bold leading-none" style={{
                  fontSize: "clamp(42px, 9vw, 80px)",
                  color: accentColor,
                  letterSpacing: "-1px",
                }}>
                  {greeting.text}
                </span>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="absolute bottom-10 left-0 right-0 flex items-center justify-between px-12">
            <span className="text-[11px] tracking-[3px] uppercase" style={{ color: `${accentColor}30` }}>
              {greetings[currentIndex]?.lang}
            </span>
            <span className="text-xs tracking-[2px] tabular-nums" style={{ color: `${accentColor}30` }}>
              {percent}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preloader4;
