import { useState } from "react";

interface OrbitalSpinnerButtonProps {
  label?: string;
  bgColor?: string;
  spinnerColor?: string;
  textColor?: string;
  duration?: number;
  onClick?: () => void;
  className?: string;
}

const OrbitalSpinnerButton = ({
  label = "Process",
  bgColor = "#D62700",
  spinnerColor = "#F5EBDC",
  textColor = "#F5EBDC",
  duration = 3000,
  onClick,
  className = "",
}: OrbitalSpinnerButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (isLoading) return;
    setIsLoading(true);
    onClick?.();
    setTimeout(() => setIsLoading(false), duration);
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        onClick={handleClick}
        className="relative px-10 py-4 rounded-[14px] font-bold text-base border-none outline-none select-none overflow-visible shadow-lg"
        style={{
          color: textColor,
          backgroundColor: bgColor,
          cursor: isLoading ? "wait" : "pointer",
          opacity: isLoading ? 0.85 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <span
          className="flex items-center gap-2 relative z-[1]"
          style={{
            opacity: isLoading ? 0.3 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {label}
        </span>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-[2]">
            <div className="relative w-10 h-10">
              <div
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: spinnerColor }}
              />
              {[0, 120, 240].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-[5px] h-[5px] rounded-full opacity-0"
                  style={{
                    backgroundColor: spinnerColor,
                    animation: `orbitalSpin 1.2s linear infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </button>

      <style>{`
        @keyframes orbitalSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(16px) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(16px) rotate(-360deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OrbitalSpinnerButton;
