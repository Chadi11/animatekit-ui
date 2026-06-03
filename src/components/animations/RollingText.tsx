import { useEffect, useState, useRef, useCallback, useMemo } from "react";

interface RollingTextProps {
  texts: string[];
  interval?: number;
  duration?: number;
  stagger?: number;
  fontSize?: number;
  color?: string;
  className?: string;
}

const RollingText = ({
  texts,
  interval = 3000,
  duration = 0.4,
  stagger = 0.05,
  fontSize = 42,
  color = "hsl(24, 95%, 53%)",
  className = "",
}: RollingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayText, setDisplayText] = useState(texts[0] || "");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const longestText = useMemo(
    () => texts.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [texts]
  );

  const maxLen = longestText.length;
  const nextIndex = (currentIndex + 1) % texts.length;
  const nextText = texts[nextIndex] || "";

  const triggerFlip = useCallback(() => {
    setIsFlipping(true);
    const totalDuration = (duration + stagger * maxLen) * 1000;
    setTimeout(() => {
      setDisplayText(texts[(currentIndex + 1) % texts.length] || "");
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setIsFlipping(false);
    }, totalDuration);
  }, [currentIndex, duration, stagger, maxLen, texts]);

  useEffect(() => {
    if (texts.length < 2) return;
    timerRef.current = setInterval(triggerFlip, interval);
    return () => clearInterval(timerRef.current);
  }, [triggerFlip, interval, texts.length]);

  return (
    <span
      className={`relative inline-block font-bold text-center ${className}`}
      style={{
        fontSize,
        color,
        fontFamily: "'Space Grotesk', sans-serif",
        perspective: "500px",
      }}
    >
      {/* Sizer */}
      <span className="invisible whitespace-pre">{longestText}</span>

      {/* Characters */}
      <span className="absolute inset-0 whitespace-pre flex justify-center">
        <span>
          {Array.from({ length: maxLen }).map((_, i) => {
            const currentChar = displayText[i] ?? "\u00A0";
            const nextChar = nextText[i] ?? "\u00A0";
            const same = currentChar === nextChar;
            const delay = i * stagger;

            return (
              <span
                key={i}
                className="inline-block relative align-top overflow-hidden"
                style={{
                  width: "0.55em",
                  height: "1.4em",
                  perspective: "200px",
                }}
              >
                {/* Outgoing */}
                <span
                  className="block absolute inset-0 text-center [backface-visibility:hidden]"
                  style={{
                    transformOrigin: "center bottom",
                    transition: isFlipping && !same
                      ? `transform ${duration}s ease-in ${delay}s, opacity ${duration}s ease-in ${delay}s`
                      : "none",
                    transform: isFlipping && !same ? "rotateX(90deg)" : "rotateX(0deg)",
                    opacity: isFlipping && !same ? 0 : 1,
                  }}
                >
                  {currentChar}
                </span>

                {/* Incoming */}
                <span
                  className="block absolute inset-0 text-center [backface-visibility:hidden]"
                  style={{
                    transformOrigin: "center top",
                    transition: isFlipping && !same
                      ? `transform ${duration}s ease-out ${delay + duration * 0.5}s, opacity ${duration}s ease-out ${delay + duration * 0.5}s`
                      : "none",
                    transform: isFlipping && !same ? "rotateX(0deg)" : "rotateX(-90deg)",
                    opacity: isFlipping && !same ? 1 : 0,
                  }}
                >
                  {nextChar}
                </span>
              </span>
            );
          })}
        </span>
      </span>
    </span>
  );
};

export default RollingText;
export type { RollingTextProps };
