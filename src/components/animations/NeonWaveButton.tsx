import { Sparkles } from "lucide-react";

interface NeonWaveButtonProps {
  label?: string;
  bgColor?: string;
  waveColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const NeonWaveButton = ({
  label = "Get Started",
  bgColor = "#D62700",
  waveColor = "#FF8733",
  textColor = "#F5EBDC",
  onClick,
  className = "",
}: NeonWaveButtonProps) => {
  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        onClick={onClick}
        className="relative px-10 py-4 rounded-[14px] font-bold text-base border-none cursor-pointer outline-none select-none overflow-hidden"
        style={{
          color: textColor,
          backgroundColor: bgColor,
          boxShadow: `0 0 20px ${bgColor}66, 0 0 40px ${bgColor}33`,
          transition: "box-shadow 0.3s ease",
        }}
      >
        <span className="flex items-center gap-2 relative z-[1]">
          <Sparkles className="w-5 h-5" />
          {label}
        </span>

        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${waveColor}88, transparent)`,
            animation: "neonWaveSweep 2s ease-in-out infinite",
          }}
        />

        <div
          className="absolute -inset-0.5 rounded-2xl pointer-events-none -z-[1]"
          style={{
            background: `linear-gradient(90deg, transparent, ${waveColor}44, transparent)`,
            animation: "neonWaveSweep 2s ease-in-out infinite",
            filter: "blur(8px)",
          }}
        />
      </button>

      <style>{`
        @keyframes neonWaveSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default NeonWaveButton;
