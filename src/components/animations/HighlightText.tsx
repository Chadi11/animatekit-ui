import { useEffect, useRef, useState } from "react";

interface HighlightTextProps {
  text: string;
  highlightColor?: string;
  textColor?: string;
  duration?: number;
  delay?: number;
  highlightHeight?: number;
  fontSize?: number;
  repeat?: boolean;
  className?: string;
}

const HighlightText = ({
  text,
  highlightColor = "#f97316",
  textColor = "#1e293b",
  duration = 1,
  delay = 0.2,
  highlightHeight = 40,
  fontSize = 32,
  repeat = false,
  className = "",
}: HighlightTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setActive(false);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <span
      ref={ref}
      className={`relative inline font-bold font-['Space_Grotesk',sans-serif] ${className}`}
      style={{ fontSize, color: textColor }}
    >
      <span
        className="absolute bottom-0 left-0 rounded-sm"
        style={{
          height: `${highlightHeight}%`,
          width: active ? "100%" : "0%",
          background: highlightColor,
          zIndex: 0,
          transition: `width ${duration}s ease-out ${delay}s`,
        }}
      />
      <span className="relative z-[1]">{text}</span>
    </span>
  );
};

export default HighlightText;
export type { HighlightTextProps };
