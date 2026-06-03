import { useState } from "react";
import { Waves } from "lucide-react";

interface RippleWaveButtonProps {
  label?: string;
  bgColor?: string;
  rippleColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const RippleWaveButton = ({
  label = "Click Wave",
  bgColor = "#D62700",
  rippleColor = "#F5EBDC",
  textColor = "#F5EBDC",
  onClick,
  className = "",
}: RippleWaveButtonProps) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    onClick?.();
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        onClick={createRipple}
        className="relative px-10 py-4 rounded-[14px] font-bold text-base border-none cursor-pointer outline-none select-none overflow-hidden shadow-lg"
        style={{ color: textColor, backgroundColor: bgColor }}
      >
        <span className="flex items-center gap-2 relative z-[1]">
          <Waves className="w-5 h-5" />
          {label}
        </span>

        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute w-0 h-0 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: rippleColor,
              opacity: 0.4,
              animation: "rippleWaveExpand 1s ease-out forwards",
            }}
          />
        ))}
      </button>

      <style>{`
        @keyframes rippleWaveExpand {
          0% { width: 0; height: 0; opacity: 0.5; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default RippleWaveButton;
