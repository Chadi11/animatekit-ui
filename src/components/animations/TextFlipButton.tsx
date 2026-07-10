import { useState } from "react";

interface TextFlipButtonProps {
  label?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  bgColor?: string;
  flipColor?: string;
  textColor?: string;
  direction?: "x" | "y";
  className?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const TextFlipButton = ({
  label = "Click Me",
  onClick,
  size = "md",
  bgColor = "#0a0a0a",
  flipColor = "#c2410c",
  textColor = "#ffffff",
  direction = "x",
  className = "",
}: TextFlipButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const s = SIZES[size];

  const handleClick = () => {
    setClicked(true);
    onClick?.();
    setTimeout(() => setClicked(false), 300);
  };

  const frontRotate = direction === "x"
    ? (hovered ? "rotateX(-90deg)" : "rotateX(0deg)")
    : (hovered ? "rotateY(90deg)"  : "rotateY(0deg)");

  const backRotate = direction === "x"
    ? (hovered ? "rotateX(0deg)"  : "rotateX(90deg)")
    : (hovered ? "rotateY(0deg)"  : "rotateY(-90deg)");

  const DURATION = "0.38s";
  const EASE     = "cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <div
      className={`inline-block cursor-pointer ${className}`}
      style={{ perspective: 600 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <div className="relative w-full h-full" style={{
        transform: clicked ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.15s ease",
      }}>
        <div className="relative inline-block">
          {/* FRONT FACE */}
          <div
            className="flex items-center justify-center font-semibold select-none border border-white/10 [backface-visibility:hidden]"
            style={{
              padding: `${s.paddingY}px ${s.paddingX}px`,
              borderRadius: s.borderRadius,
              background: bgColor,
              fontSize: s.fontSize, color: textColor,
              letterSpacing: "0.3px",
              transform: frontRotate,
              transformOrigin: direction === "x" ? "center bottom" : "right center",
              transition: `transform ${DURATION} ${EASE}`,
              position: "relative",
              zIndex: hovered ? 0 : 1,
            }}
          >
            {label}
          </div>
          {/* BACK FACE */}
          <div
            className="flex items-center justify-center font-semibold select-none border border-white/[0.08] [backface-visibility:hidden] absolute inset-0"
            style={{
              padding: `${s.paddingY}px ${s.paddingX}px`,
              borderRadius: s.borderRadius,
              background: flipColor,
              fontSize: s.fontSize, color: textColor,
              letterSpacing: "0.3px",
              transform: backRotate,
              transformOrigin: direction === "x" ? "center top" : "left center",
              transition: `transform ${DURATION} ${EASE}`,
              zIndex: hovered ? 1 : 0,
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextFlipButton;
