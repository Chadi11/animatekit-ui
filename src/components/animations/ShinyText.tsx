import { useMemo } from "react";

interface ShinyTextProps {
  text: string;
  speed?: number;
  shineColor?: string;
  baseColor?: string;
  shineWidth?: number;
  fontSize?: number;
  className?: string;
}

const ShinyText = ({
  text,
  speed = 3,
  shineColor = "#f97316",
  baseColor = "#e2e8f0",
  shineWidth = 80,
  fontSize = 32,
  className = "",
}: ShinyTextProps) => {
  const gradient = useMemo(
    () =>
      `linear-gradient(90deg, ${baseColor} 0%, ${baseColor} ${50 - shineWidth / 2}%, ${shineColor} 50%, ${baseColor} ${50 + shineWidth / 2}%, ${baseColor} 100%)`,
    [baseColor, shineColor, shineWidth]
  );

  return (
    <span
      className={`inline-block font-bold font-['Space_Grotesk',sans-serif] bg-clip-text ${className}`}
      style={{
        fontSize,
        background: gradient,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `shine-sweep ${speed}s linear infinite`,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
export type { ShinyTextProps };
