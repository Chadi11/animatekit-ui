import { useState, useEffect, useRef } from "react";

interface Preloader2Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  bgColor?: string;
  textColor?: string;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader2 = ({
  onComplete,
  greetings = [
    { text: "HELLO",     lang: "en" },
    { text: "你好",       lang: "zh" },
    { text: "مرحبًا",    lang: "ar" },
    { text: "HOLA",      lang: "es" },
    { text: "こんにちは",  lang: "ja" },
  ],
  intervalMs = 680,
  bgColor = "#0a0a0a",
  textColor = "#ffffff",
  landingContent,
  contained = false,
}: Preloader2Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"greet" | "collapse" | "done">("greet");
  const [lineGrown, setLineGrown] = useState(false);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLineGrown(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "greet") return;
    if (currentIndex < greetings.length - 1) {
      tickRef.current = setTimeout(() => setCurrentIndex((p) => p + 1), intervalMs);
    } else {
      tickRef.current = setTimeout(() => {
        setPhase("collapse");
        setTimeout(() => {
          setPhase("done");
          onComplete?.();
        }, 1100);
      }, 900);
    }
    return () => { if (tickRef.current) clearTimeout(tickRef.current); };
  }, [currentIndex, phase, greetings.length, intervalMs, onComplete]);

  const isCollapsing = phase === "collapse";
  const isDone = phase === "done";

  return (
    <div className={`${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden`}>
      {/* Landing */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[1]"
        style={{
          background: "#ffffff",
          opacity: isDone || isCollapsing ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {/* Collapsing panel */}
      {!isDone && (
        <div
          className="absolute inset-0 z-50"
          style={{
            backgroundColor: bgColor,
            transformOrigin: isCollapsing ? "top center" : "bottom center",
            transform: isCollapsing ? "scaleY(0)" : "scaleY(1)",
            transition: isCollapsing ? "transform 0.85s cubic-bezier(0.76,0,0.24,1)" : "none",
          }}
        />
      )}

      {/* Greeting text */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-3 pointer-events-none"
          style={{
            opacity: isCollapsing ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          <div className="relative h-20 w-full overflow-hidden flex items-center justify-center">
            {greetings.map((greeting, index) => (
              <div
                key={index}
                className="absolute w-full flex items-center justify-center"
                style={{
                  transform:
                    index === currentIndex ? "translateY(0)"
                    : index < currentIndex  ? "translateY(-100%)"
                    : "translateY(100%)",
                  opacity: index === currentIndex ? 1 : 0,
                  transition: "transform 0.45s cubic-bezier(0.76,0,0.24,1), opacity 0.45s ease",
                  fontFamily:
                    greeting.lang === "ar" ? "Arial, sans-serif"
                    : greeting.lang === "zh" || greeting.lang === "ja" ? "system-ui, sans-serif"
                    : "Georgia, serif",
                }}
              >
                <span className="font-light uppercase leading-none" style={{
                  fontSize: "clamp(36px, 8vw, 64px)",
                  color: textColor,
                  letterSpacing: "10px",
                }}>
                  {greeting.text}
                </span>
              </div>
            ))}
          </div>
          <div className="h-px" style={{
            background: `${textColor}30`,
            width: lineGrown ? 80 : 0,
            transition: "width 1.2s ease",
          }} />
          <div className="text-[11px] tracking-[3px] tabular-nums" style={{
            color: `${textColor}40`,
          }}>
            {String(currentIndex + 1).padStart(2, "0")} / {String(greetings.length).padStart(2, "0")}
          </div>
        </div>
      )}
    </div>
  );
};

export default Preloader2;
