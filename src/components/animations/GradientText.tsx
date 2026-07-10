import { useMemo } from "react";

interface GradientTextProps {
  text: string;
  speed?: number;
  startColor?: string;
  endColor?: string;
  angle?: number;
  fontSize?: number;
  className?: string;
}

const GradientText = ({
  text,
  speed = 3,
  startColor = "#f97316",
  endColor = "#818cf8",
  angle = 90,
  fontSize = 42,
  className = "",
}: GradientTextProps) => {
  const gradient = useMemo(
    () =>
      `linear-gradient(${angle}deg, ${startColor}, ${endColor}, ${startColor})`,
    [angle, startColor, endColor]
  );

  return (
    <span
      className={`inline-block font-bold font-['Space_Grotesk',sans-serif] bg-clip-text ${className}`}
      style={{
        fontSize,
        background: gradient,
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `gradient-flow ${speed}s ease infinite`,
      }}
    >
      {text}
    </span>
  );
};

export default GradientText;
export type { GradientTextProps };
