import { useRef, useState, useCallback } from "react";

interface RippleFlipButtonProps {
  label?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  bgColor?: string;
  rippleColor?: string;
  textColor?: string;
  className?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const RippleFlipButton = ({
  label = "Click Me",
  onClick,
  size = "md",
  bgColor = "#0a0a0a",
  rippleColor = "#c2410c",
  textColor = "#ffffff",
  className = "",
}: RippleFlipButtonProps) => {
  const [scale, setScale] = useState(0);
  const [textFlipped, setTextFlipped] = useState(false);
  const [clicked, setClicked] = useState(false);
  const rafRef = useRef<number>(0);
  const scaleRef = useRef(0);
  const targetRef = useRef(0);
  const runningRef = useRef(false);
  const s = SIZES[size];

  const startLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    const tick = () => {
      const diff = targetRef.current - scaleRef.current;
      if (Math.abs(diff) < 0.005) {
        scaleRef.current = targetRef.current;
        setScale(targetRef.current);
        runningRef.current = false;
        return;
      }
      const speed = diff > 0 ? 0.09 : 0.07;
      scaleRef.current += diff * speed * (1 / Math.max(scaleRef.current, 0.1));
      scaleRef.current = Math.max(0, Math.min(1, scaleRef.current));
      setScale(scaleRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleMouseEnter = () => {
    targetRef.current = 1;
    startLoop();
    setTimeout(() => setTextFlipped(true), 160);
  };

  const handleMouseLeave = () => {
    targetRef.current = 0;
    startLoop();
    setTimeout(() => setTextFlipped(false), 120);
  };

  const handleClick = () => {
    setClicked(true);
    onClick?.();
    setTimeout(() => setClicked(false), 180);
  };

  const CIRCLE_SIZE = 300;

  return (
    <button
      className={`relative inline-flex items-center justify-center font-semibold border border-white/10 cursor-pointer tracking-wide overflow-hidden outline-none select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        fontSize: s.fontSize,
        padding: `${s.paddingY}px ${s.paddingX}px`,
        borderRadius: s.borderRadius,
        background: bgColor,
        color: textColor,
        transform: clicked ? "scale(0.96)" : "scale(1)",
        transition: "transform 0.15s ease",
      }}
    >
      <span
        className="absolute top-1/2 left-1/2 rounded-full pointer-events-none z-[1]"
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          background: rippleColor,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      />
      <span className="relative z-[2] block">
        <span
          className="block"
          style={{
            transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
            transform: textFlipped ? "translateY(-120%) rotateX(90deg)" : "translateY(0%) rotateX(0deg)",
            opacity: textFlipped ? 0 : 1,
            transformOrigin: "center bottom",
          }}
        >
          {label}
        </span>
        <span
          className="flex items-center justify-center absolute inset-0"
          style={{
            transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
            transform: textFlipped ? "translateY(0%) rotateX(0deg)" : "translateY(120%) rotateX(-90deg)",
            opacity: textFlipped ? 1 : 0,
            transformOrigin: "center top",
          }}
        >
          {label}
        </span>
      </span>
    </button>
  );
};

export default RippleFlipButton;
