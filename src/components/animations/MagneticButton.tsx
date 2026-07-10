import { useState } from "react";
import { Rocket } from "lucide-react";

interface MagneticButtonProps {
  label?: string;
  bgColor?: string;
  textColor?: string;
  strength?: number;
  onClick?: () => void;
  className?: string;
}

const MagneticButton = ({
  label = "Launch Now",
  bgColor = "#D62700",
  textColor = "#FFFFFF",
  strength = 0.3,
  onClick,
  className = "",
}: MagneticButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <button
      className={`relative px-10 py-4 rounded-2xl font-bold text-base border-none cursor-pointer outline-none select-none overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        color: textColor,
        backgroundColor: bgColor,
        transform: `translate(${position.x}px, ${position.y}px) scale(${isHovered ? 1.05 : 1})`,
        transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
        boxShadow: isHovered
          ? "0 10px 30px rgba(0,0,0,0.3)"
          : "0 4px 15px rgba(0,0,0,0.2)",
      }}
    >
      <span className="flex items-center gap-3 relative z-[1]">
        <Rocket
          className="w-5 h-5"
          style={{
            transition: "transform 0.3s ease",
            transform: isHovered ? "translateY(-3px) rotate(-15deg)" : "translateY(0) rotate(0deg)",
          }}
        />
        {label}
      </span>
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,135,51,0.4), transparent)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </button>
  );
};

export default MagneticButton;
