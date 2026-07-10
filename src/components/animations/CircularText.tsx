import { useMemo } from "react";

interface CircularTextProps {
  text: string;
  radius?: number;
  speed?: number;
  direction?: "clockwise" | "counter-clockwise";
  color?: string;
  fontSize?: number;
  className?: string;
}

const CircularText = ({
  text,
  radius = 100,
  speed = 8,
  direction = "clockwise",
  color = "hsl(24, 95%, 53%)",
  fontSize = 14,
  className = "",
}: CircularTextProps) => {
  const chars = useMemo(() => text.split(""), [text]);
  const angleStep = 360 / chars.length;
  const size = radius * 2 + fontSize * 2;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full"
        style={{
          animation: `spin ${speed}s linear infinite`,
          animationDirection: direction === "counter-clockwise" ? "reverse" : "normal",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 font-['JetBrains_Mono',monospace] font-bold"
            style={{
              fontSize,
              color,
              transform: `translate(-50%, -50%) rotate(${angleStep * i}deg) translateY(-${radius}px)`,
              transformOrigin: "center center",
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CircularText;
export type { CircularTextProps };
