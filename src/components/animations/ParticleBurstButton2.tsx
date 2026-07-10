import { useState } from "react";
import { Star } from "lucide-react";

interface ParticleBurstButton2Props {
  label?: string;
  bgColor?: string;
  borderColor?: string;
  particleColor?: string;
  onClick?: () => void;
  className?: string;
}

const ParticleBurstButton2 = ({
  label = "Click Me",
  bgColor = "#D62700",
  borderColor = "#D62700",
  particleColor = "#D62700",
  onClick,
  className = "",
}: ParticleBurstButton2Props) => {
  const [particles, setParticles] = useState<{ id: number; angle: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const createParticles = () => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      angle: i * 30 * (Math.PI / 180),
    }));
    setParticles(newParticles);
    onClick?.();
    setTimeout(() => setParticles([]), 800);
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        onClick={createParticles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative rounded-xl font-bold text-[15px] cursor-pointer outline-none select-none overflow-visible"
        style={{
          padding: "14px 36px",
          color: isHovered ? "#F5EBDC" : borderColor,
          backgroundColor: isHovered ? bgColor : "transparent",
          border: `2px solid ${borderColor}`,
          transition: "all 0.3s ease",
        }}
      >
        <span className="flex items-center gap-2 relative z-[1]">
          <Star className="w-4 h-4" />
          {label}
        </span>

        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none"
            style={{
              backgroundColor: particleColor,
              animation: "particleBurst2 0.8s ease-out forwards",
              ["--cos" as string]: `${Math.cos(particle.angle)}`,
              ["--sin" as string]: `${Math.sin(particle.angle)}`,
            }}
          />
        ))}
      </button>

      <style>{`
        @keyframes particleBurst2 {
          0% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(calc(var(--cos) * 80px), calc(var(--sin) * 80px)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ParticleBurstButton2;
