import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface SliceRevealButtonProps {
  label?: string;
  bgColor?: string;
  sliceColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const SliceRevealButton = ({
  label = "Explore",
  bgColor = "#000000",
  sliceColor = "#f97316",
  textColor = "#D4E9E2",
  onClick,
  className = "",
}: SliceRevealButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative py-5 px-12 rounded-xl font-bold text-lg border-none cursor-pointer outline-none select-none overflow-hidden"
        style={{
          color: textColor,
          backgroundColor: bgColor,
          transform: isHovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.3s ease",
        }}
      >
        <span className="flex items-center gap-3 relative z-[2]">
          {label}
          <ArrowUpRight
            className="w-5 h-5"
            style={{
              transition: "transform 0.3s ease",
              transform: isHovered ? "translate(2px, -2px)" : "translate(0, 0)",
            }}
          />
        </span>

        {/* Top slice */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 z-[1]"
          style={{
            backgroundColor: sliceColor,
            transform: isHovered ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.4s ease-out",
          }}
        />

        {/* Bottom slice */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 z-[1]"
          style={{
            backgroundColor: sliceColor,
            transform: isHovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.4s ease-out",
          }}
        />
      </button>
    </div>
  );
};

export default SliceRevealButton;
