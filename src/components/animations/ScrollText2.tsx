import { useEffect, useRef, useState } from "react";

interface ScrollText2Props {
  text: string;
  duration?: number;
  stagger?: number;
  splitBy?: "word" | "character";
  blurAmount?: number;
  color?: string;
  fontSize?: number;
  className?: string;
}

const ScrollText2 = ({
  text,
  duration = 0.6,
  stagger = 80,
  splitBy = "word",
  blurAmount = 10,
  color = "hsl(24, 95%, 53%)",
  fontSize = 32,
  className = "",
}: ScrollText2Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const units =
    splitBy === "character"
      ? text.split("").map((ch, i) => ({ key: i, content: ch === " " ? "\u00A0" : ch }))
      : text.split(" ").map((word, i) => ({ key: i, content: word }));

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap gap-x-2 font-bold font-['Space_Grotesk',sans-serif] ${className}`}
      style={{ fontSize }}
    >
      {units.map((unit) => (
        <span
          key={unit.key}
          className="inline-block"
          style={{
            color,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            filter: isVisible ? "blur(0px)" : `blur(${blurAmount}px)`,
            transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out, filter ${duration}s ease-out`,
            transitionDelay: `${unit.key * stagger}ms`,
          }}
        >
          {unit.content}
        </span>
      ))}
    </div>
  );
};

export default ScrollText2;
export type { ScrollText2Props };
