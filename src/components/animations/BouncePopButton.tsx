import { useState } from "react";
import { Heart } from "lucide-react";

interface BouncePopButtonProps {
  label?: string;
  likedLabel?: string;
  bgColor?: string;
  activeColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const BouncePopButton = ({
  label = "Love It",
  likedLabel = "Loved!",
  bgColor = "#D62700",
  activeColor = "#FF8733",
  textColor = "#F5EBDC",
  onClick,
  className = "",
}: BouncePopButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setLiked(!liked);
    onClick?.();
    setTimeout(() => setIsPressed(false), 300);
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        onClick={handleClick}
        className="relative px-10 py-4 rounded-2xl font-bold text-base border-none cursor-pointer outline-none select-none overflow-visible shadow-lg"
        style={{
          color: textColor,
          backgroundColor: liked ? activeColor : bgColor,
          transform: isPressed ? "scale(0.85)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background-color 0.3s ease",
        }}
      >
        <span className="flex items-center gap-2 relative z-[1]">
          <Heart
            className="w-5 h-5"
            style={{
              fill: liked ? textColor : "none",
              transition: "fill 0.3s ease",
            }}
          />
          {liked ? likedLabel : label}
        </span>

        {isPressed && (
          <>
            <div
              className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full pointer-events-none"
              style={{
                border: `3px solid ${activeColor}`,
                animation: "popOut 0.5s ease-out forwards",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-[60px] h-[60px] rounded-full pointer-events-none opacity-0"
              style={{
                border: `2px solid ${bgColor}`,
                animation: "popOut 0.5s ease-out 0.1s forwards",
              }}
            />
          </>
        )}
      </button>

      <style>{`
        @keyframes popOut {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default BouncePopButton;
