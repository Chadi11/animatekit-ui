import { useState, useEffect, useRef, useCallback } from "react";

interface Preloader5Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  bgColor?: string;
  accentColor?: string;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader5 = ({
  onComplete,
  greetings = [
    { text: "Hello",      lang: "en" },
    { text: "你好",        lang: "zh" },
    { text: "مرحبًا",     lang: "ar" },
    { text: "Hola",       lang: "es" },
    { text: "こんにちは",   lang: "ja" },
  ],
  intervalMs = 700,
  bgColor = "#0d0d0d",
  accentColor = "#ffffff",
  landingContent,
  contained = false,
}: Preloader5Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"greet" | "iris" | "done">("greet");
  const [irisScale, setIrisScale] = useState(1);
  const [ringProgress, setRingProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number>(0);
  const ringRafRef = useRef<number>(0);
  const ringStartRef = useRef<number>(0);

  // Store props in refs for stable access in effects
  const greetingsRef = useRef(greetings);
  const intervalMsRef = useRef(intervalMs);
  const onCompleteRef = useRef(onComplete);
  greetingsRef.current = greetings;
  intervalMsRef.current = intervalMs;
  onCompleteRef.current = onComplete;

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(rafRef.current);
    cancelAnimationFrame(ringRafRef.current);
  }, []);

  useEffect(() => {
    if (phase !== "greet") return;
    ringStartRef.current = performance.now();
    const totalTime = greetingsRef.current.length * intervalMsRef.current;
    const tick = (now: number) => {
      const p = Math.min((now - ringStartRef.current) / totalTime, 1);
      setRingProgress(p);
      if (p < 1) ringRafRef.current = requestAnimationFrame(tick);
    };
    ringRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ringRafRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== "greet") return;
    const t = setTimeout(() => {
      if (currentIndex < greetingsRef.current.length - 1) {
        setCurrentIndex((p) => p + 1);
      } else {
        const t2 = setTimeout(() => {
          setRingProgress(1);
          setPhase("iris");
          const start = performance.now();
          const dur = 950;
          const animate = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            setIrisScale(1 - ease);
            if (p < 1) {
              rafRef.current = requestAnimationFrame(animate);
            } else {
              setPhase("done");
              onCompleteRef.current?.();
            }
          };
          rafRef.current = requestAnimationFrame(animate);
        }, 400);
        timers.current.push(t2);
      }
    }, intervalMsRef.current);
    timers.current.push(t);
    return clearAll;
  }, [currentIndex, phase, clearAll]);

  const isDone = phase === "done";
  const isIris = phase === "iris";
  const R = 38;
  const CIRC = 2 * Math.PI * R;
  const ringDash = ringProgress * CIRC;

  return (
    <div ref={containerRef} className={`${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden`}>
      {/* Landing */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[1]"
        style={{
          background: "#ffffff",
          opacity: isDone || isIris ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {/* Iris circle */}
      {!isDone && (
        <div
          className="absolute rounded-full z-50"
          style={{
            width: 2000, height: 2000,
            top: "50%", left: "50%",
            background: bgColor,
            transform: `translate(-50%, -50%) scale(${irisScale})`,
          }}
        />
      )}

      {/* Greeting content */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-6 pointer-events-none"
          style={{
            opacity: isIris ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <svg width={96} height={96} viewBox="0 0 96 96" className="absolute">
            <circle cx={48} cy={48} r={R} fill="none" stroke={`${accentColor}12`} strokeWidth={1} />
            <circle cx={48} cy={48} r={R} fill="none" stroke={`${accentColor}40`} strokeWidth={1.5}
              strokeDasharray={`${ringDash} ${CIRC}`} strokeLinecap="round" transform="rotate(-90 48 48)" />
          </svg>
          <div className="relative h-[88px] w-full flex items-center justify-center">
            {greetings.map((g, i) => (
              <div key={i} className="absolute w-full flex items-center justify-center" style={{
                opacity: i === currentIndex ? 1 : 0,
                transform:
                  i === currentIndex ? "scale(1) translateY(0)"
                  : i < currentIndex  ? "scale(0.88) translateY(-14px)"
                  : "scale(1.1) translateY(14px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                fontFamily:
                  g.lang === "ar" ? "Arial, sans-serif"
                  : g.lang === "zh" || g.lang === "ja" ? "system-ui, sans-serif"
                  : "inherit",
              }}>
                <span className="font-bold leading-none" style={{
                  fontSize: "clamp(48px, 10vw, 84px)",
                  color: accentColor,
                  letterSpacing: "-2px",
                }}>
                  {g.text}
                </span>
              </div>
            ))}
          </div>
          <div className="text-[11px] tracking-[4px] uppercase -mt-2.5" style={{
            color: `${accentColor}35`,
          }}>
            {greetings[currentIndex]?.lang}
          </div>
          <div className="absolute bottom-9 text-[11px] tracking-[3px] tabular-nums" style={{
            color: `${accentColor}20`,
          }}>
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="mx-1.5" style={{ color: `${accentColor}10` }}>/</span>
            {String(greetings.length).padStart(2, "0")}
          </div>
        </div>
      )}
    </div>
  );
};

export default Preloader5;
