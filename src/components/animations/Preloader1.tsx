import { useState, useEffect } from "react";

interface Preloader1Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  stripColor?: string;
  stripCount?: number;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader1 = ({
  onComplete,
  greetings = [
    { text: "Hello",     lang: "en" },
    { text: "你好",       lang: "zh" },
    { text: "مرحبًا",    lang: "ar" },
    { text: "Hola",      lang: "es" },
    { text: "こんにちは",  lang: "ja" },
  ],
  intervalMs = 700,
  stripColor = "#f97316",
  stripCount = 8,
  landingContent,
  contained = false,
}: Preloader1Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (currentIndex < greetings.length - 1) {
      const t = setTimeout(() => setCurrentIndex((p) => p + 1), intervalMs);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setIsRevealing(true);
        setTimeout(() => {
          setIsDone(true);
          onComplete?.();
        }, 1400);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [currentIndex, greetings.length, intervalMs, onComplete]);

  return (
    <div
      className={`${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden`}
    >
      {/* Landing content */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[1]"
        style={{
          background: "#ffffff",
          opacity: isDone ? 1 : isRevealing ? 1 : 0,
          transition: "opacity 0.4s ease 0.2s",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {/* Strip overlay */}
      {!isDone && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {[...Array(stripCount)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                backgroundColor: stripColor,
                clipPath: `polygon(${i * (100 / stripCount)}% 0%, ${(i + 1) * (100 / stripCount)}% 0%, ${(i + 1) * (100 / stripCount)}% 100%, ${i * (100 / stripCount)}% 100%)`,
                transform: isRevealing ? "translateY(-100%)" : "translateY(0)",
                transition: "transform 0.7s cubic-bezier(0.76,0,0.24,1)",
                transitionDelay: isRevealing ? `${i * 80}ms` : "0ms",
              }}
            />
          ))}
        </div>
      )}

      {/* Greeting text */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none"
          style={{
            opacity: isRevealing ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          {greetings.map((greeting, index) => (
            <div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: index === currentIndex ? 1 : 0,
                transform:
                  index === currentIndex ? "scale(1) translateY(0)"
                  : index < currentIndex  ? "scale(0.9) translateY(-16px)"
                  : "scale(1.1) translateY(16px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                fontFamily:
                  greeting.lang === "ar" ? "Arial, sans-serif"
                  : greeting.lang === "zh" || greeting.lang === "ja" ? "system-ui, sans-serif"
                  : "inherit",
              }}
            >
              <h1 className="font-black m-0 text-white"
                style={{
                  fontSize: "clamp(48px, 10vw, 96px)",
                  letterSpacing: "-2px",
                  textShadow: "0 4px 30px rgba(0,0,0,0.1)",
                }}
              >
                {greeting.text}
              </h1>
            </div>
          ))}
          {/* Progress dots */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            {greetings.map((_, i) => (
              <div key={i} className="h-1.5 rounded-sm" style={{
                width: i === currentIndex ? 40 : 8,
                background: i === currentIndex ? "#fff" : "rgba(255,255,255,0.3)",
                transition: "width 0.3s ease, background 0.3s ease",
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Preloader1;
