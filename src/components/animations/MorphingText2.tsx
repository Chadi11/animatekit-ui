import { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface MorphingText2Props {
  texts: string[];
  morphDuration?: number;
  pauseDuration?: number;
  fontSize?: number;
  color?: string;
  className?: string;
}

const MorphingText2 = ({
  texts,
  morphDuration = 1500,
  pauseDuration = 2000,
  fontSize = 42,
  color = "hsl(24, 95%, 53%)",
  className = "",
}: MorphingText2Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [morphProgress, setMorphProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const longestText = useMemo(
    () => texts.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [texts]
  );

  const nextIndex = (currentIndex + 1) % texts.length;
  const currentWords = (texts[currentIndex] || "").split(" ");
  const nextWords = (texts[nextIndex] || "").split(" ");
  const maxWords = Math.max(currentWords.length, nextWords.length);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      if (isPaused) {
        if (elapsed >= pauseDuration) {
          setIsPaused(false);
          startTimeRef.current = 0;
        }
      } else {
        const progress = Math.min(elapsed / morphDuration, 1);
        setMorphProgress(progress);
        if (progress >= 1) {
          setCurrentIndex(nextIndex);
          setMorphProgress(0);
          setIsPaused(true);
          startTimeRef.current = 0;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    },
    [isPaused, pauseDuration, morphDuration, nextIndex]
  );

  useEffect(() => {
    if (texts.length < 2) return;
    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, texts.length]);

  const getWordStyle = (
    wordCurrent: string,
    wordNext: string,
    isOutgoing: boolean
  ): React.CSSProperties => {
    const same = wordCurrent === wordNext;
    if (same) return { display: "inline-block", opacity: 1, filter: "blur(0px)", transform: "scale(1)" };

    const t = morphProgress;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    if (isOutgoing) {
      return {
        display: "inline-block",
        opacity: 1 - ease,
        filter: `blur(${ease * 6}px)`,
        transform: `scale(${1 - ease * 0.15})`,
        transition: "none",
      };
    }
    return {
      display: "inline-block",
      opacity: ease,
      filter: `blur(${(1 - ease) * 6}px)`,
      transform: `scale(${0.85 + ease * 0.15})`,
      transition: "none",
    };
  };

  return (
    <span
      className={`relative inline-block font-bold text-center ${className}`}
      style={{ fontSize, color, fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Sizer */}
      <span className="invisible whitespace-pre">{longestText}</span>

      {/* Outgoing words */}
      <span className="absolute inset-0 whitespace-pre flex justify-center items-center" aria-hidden="true">
        <span>
          {Array.from({ length: maxWords }).map((_, i) => {
            const cw = currentWords[i] ?? "";
            const nw = nextWords[i] ?? "";
            return (
              <span key={i}>
                {i > 0 && " "}
                <span style={getWordStyle(cw, nw, true)}>{cw}</span>
              </span>
            );
          })}
        </span>
      </span>

      {/* Incoming words */}
      <span className="absolute inset-0 whitespace-pre flex justify-center items-center">
        <span>
          {Array.from({ length: maxWords }).map((_, i) => {
            const cw = currentWords[i] ?? "";
            const nw = nextWords[i] ?? "";
            return (
              <span key={i}>
                {i > 0 && " "}
                <span style={getWordStyle(cw, nw, false)}>{nw}</span>
              </span>
            );
          })}
        </span>
      </span>
    </span>
  );
};

export default MorphingText2;
export type { MorphingText2Props };
