import { useState, useEffect, useRef, useCallback } from "react";

interface Preloader3Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  bgColor?: string;
  accentColor?: string;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const COLS = 6;
const RTL_LANGS = new Set(["ar", "he", "fa", "ur"]);

const Preloader3 = ({
  onComplete,
  greetings = [
    { text: "Hello",      lang: "en" },
    { text: "你好",        lang: "zh" },
    { text: "مرحبًا",     lang: "ar" },
    { text: "Hola",       lang: "es" },
    { text: "こんにちは",   lang: "ja" },
  ],
  intervalMs = 750,
  bgColor = "#111111",
  accentColor = "#ffffff",
  landingContent,
  contained = false,
}: Preloader3Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"greet" | "wipe" | "done">("greet");
  const [visibleLetters, setVisibleLetters] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Store props in refs to avoid stale closure issues in effects
  const greetingsRef = useRef(greetings);
  const intervalMsRef = useRef(intervalMs);
  const onCompleteRef = useRef(onComplete);
  greetingsRef.current = greetings;
  intervalMsRef.current = intervalMs;
  onCompleteRef.current = onComplete;

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    if (phase !== "greet") return;
    clear();
    setVisibleLetters(0);
    const word = greetingsRef.current[currentIndex].text;
    const isRtl = RTL_LANGS.has(greetingsRef.current[currentIndex].lang);

    if (isRtl) {
      // For RTL languages, reveal the whole word at once
      const t = setTimeout(() => setVisibleLetters(word.length), 100);
      timers.current.push(t);
    } else {
      word.split("").forEach((_, i) => {
        const t = setTimeout(() => setVisibleLetters(i + 1), i * 65 + 100);
        timers.current.push(t);
      });
    }
    return clear;
  }, [currentIndex, phase, clear]);

  useEffect(() => {
    if (phase !== "greet") return;
    const word = greetingsRef.current[currentIndex].text;
    const isRtl = RTL_LANGS.has(greetingsRef.current[currentIndex].lang);
    const letterDone = isRtl ? 100 : word.length * 65 + 100;
    const hold = Math.max(intervalMsRef.current - letterDone, 260);
    const t = setTimeout(() => {
      if (currentIndex < greetingsRef.current.length - 1) {
        setCurrentIndex((p) => p + 1);
      } else {
        const t2 = setTimeout(() => {
          setPhase("wipe");
          const t3 = setTimeout(() => {
            setPhase("done");
            onCompleteRef.current?.();
          }, 1200);
          timers.current.push(t3);
        }, 380);
        timers.current.push(t2);
      }
    }, letterDone + hold);
    timers.current.push(t);
    return clear;
  }, [currentIndex, phase, clear]);

  const isWiping = phase === "wipe";
  const isDone   = phase === "done";
  const word     = greetings[currentIndex]?.text ?? "";
  const lang     = greetings[currentIndex]?.lang ?? "en";
  const isRtl    = RTL_LANGS.has(lang);

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

      {/* Column wipe */}
      {!isDone && [...Array(COLS)].map((_, i) => {
        const colW = 100 / COLS;
        return (
          <div
            key={i}
            className="absolute top-0 bottom-0 z-50"
            style={{
              left: `${i * colW}%`,
              width: `${colW + 0.1}%`,
              background: bgColor,
              transform: isWiping ? "translateY(-105%)" : "translateY(0)",
              transition: isWiping
                ? `transform 0.75s cubic-bezier(0.76,0,0.24,1) ${i * 60}ms`
                : "none",
              clipPath: `polygon(0% 0%, 100% 0%, 100% calc(100% - ${i * 8}px), 0% calc(100% - ${(i + 1) * 8}px))`,
            }}
          />
        );
      })}

      {/* Greeting text */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4 pointer-events-none"
          style={{
            opacity: isWiping ? 0 : 1,
            transition: "opacity 0.25s ease",
          }}
        >
          {/* Counter — top right */}
          <div className="absolute top-6 right-6 text-xs tracking-[2px] tabular-nums" style={{
            color: `${accentColor}50`,
          }}>
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="mx-1.5" style={{ color: `${accentColor}30` }}>/</span>
            {String(greetings.length).padStart(2, "0")}
          </div>

          <div
            className="flex items-baseline flex-wrap justify-center"
            dir={isRtl ? "rtl" : undefined}
            style={{
              fontFamily:
                lang === "ar" ? "Arial, sans-serif"
                : lang === "zh" || lang === "ja" ? "system-ui, sans-serif"
                : "inherit",
            }}
          >
            {isRtl ? (
              /* RTL: render the whole word as one block to preserve cursive joining */
              <span
                className="inline-block font-extrabold leading-none"
                style={{
                  fontSize: "clamp(52px, 11vw, 96px)",
                  color: accentColor,
                  letterSpacing: "0px",
                  opacity: visibleLetters >= word.length ? 1 : 0,
                  transform: visibleLetters >= word.length ? "translateY(0)" : "translateY(18px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                }}
              >
                {word}
              </span>
            ) : (
              word.split("").map((char, i) => (
                <span
                  key={`${currentIndex}-${i}`}
                  className="inline-block font-extrabold leading-none"
                  style={{
                    fontSize: "clamp(52px, 11vw, 96px)",
                    color: accentColor,
                    letterSpacing: "-1px",
                    opacity: i < visibleLetters ? 1 : 0,
                    transform: i < visibleLetters ? "translateY(0)" : "translateY(18px)",
                    transition: "opacity 0.22s ease, transform 0.22s ease",
                  }}
                >
                  {char}
                </span>
              ))
            )}
          </div>
          <div className="text-[11px] tracking-[4px] uppercase" style={{
            color: `${accentColor}40`,
            opacity: visibleLetters >= word.length ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}>
            {lang}
          </div>
        </div>
      )}
    </div>
  );
};

export default Preloader3;
