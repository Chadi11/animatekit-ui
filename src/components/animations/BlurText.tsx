import { useEffect, useRef, useState } from "react";

interface BlurTextProps {
  text: string;
  animateBy?: "word" | "letter";
  direction?: "top" | "bottom";
  delay?: number;
  color?: string;
  className?: string;
}

const BlurText = ({
  text,
  animateBy = "word",
  direction = "bottom",
  delay = 50,
  color = "hsl(24, 95%, 53%)",
  className = "",
}: BlurTextProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const units =
    animateBy === "word"
      ? text.split(/(\s+)/)
      : text.split("");

  const translateY = direction === "bottom" ? "20px" : "-20px";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap font-mono text-4xl font-bold tracking-wider ${className}`}
      style={{ color }}
    >
      {units.map((unit, i) => {
        if (/^\s+$/.test(unit)) {
          return (
            <span key={i} className="inline-block w-[0.3em]" />
          );
        }

        const unitIndex =
          animateBy === "word"
            ? units.slice(0, i).filter((u) => !/^\s+$/.test(u)).length
            : i;

        return (
          <span
            key={i}
            className="inline-block"
            style={{
              filter: inView ? "blur(0px)" : "blur(10px)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : `translateY(${translateY})`,
              transition: `filter 0.4s ease, opacity 0.4s ease, transform 0.4s ease`,
              transitionDelay: inView ? `${unitIndex * delay}ms` : "0ms",
            }}
          >
            {unit}
          </span>
        );
      })}
    </span>
  );
};

export default BlurText;
export type { BlurTextProps };
