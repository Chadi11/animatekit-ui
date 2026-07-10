import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface FlipButtonProps {
  frontLabel?: string;
  backLabel?: string;
  frontColor?: string;
  backColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const FlipButton = ({
  frontLabel = "Submit",
  backLabel = "Success!",
  frontColor = "#D62700",
  backColor = "#FF8733",
  textColor = "#F5EBDC",
  onClick,
  className = "",
}: FlipButtonProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    onClick?.();
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ perspective: 1000, width: 200, height: 60 }}
    >
      <button
        onClick={handleClick}
        className="absolute w-full h-full border-none bg-transparent cursor-pointer outline-none [transform-style:preserve-3d]"
        style={{
          transition: "transform 0.6s ease",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full flex items-center justify-center rounded-xl font-bold text-base shadow-lg [backface-visibility:hidden]"
          style={{ backgroundColor: frontColor, color: textColor }}
        >
          <span className="flex items-center gap-2">
            {frontLabel}
            <ArrowRight className="w-5 h-5" />
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full flex items-center justify-center rounded-xl font-bold text-base shadow-lg [backface-visibility:hidden]"
          style={{
            backgroundColor: backColor,
            color: textColor,
            transform: "rotateY(180deg)",
          }}
        >
          <span className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            {backLabel}
          </span>
        </div>
      </button>
    </div>
  );
};

export default FlipButton;
