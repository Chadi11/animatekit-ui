import { useRef, useState } from "react";

interface TiltHoverCardProps {
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  shadow?: boolean;
  className?: string;
}

const TiltHoverCard = ({
  maxTilt = 15,
  scale = 1.05,
  perspective = 1000,
  shadow = true,
  className = "",
}: TiltHoverCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) scale(1)");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * maxTilt;
    const tiltY = (x - 0.5) * maxTilt;
    setTransform(`rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setTransform("rotateX(0deg) rotateY(0deg) scale(1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className={`inline-block ${className}`}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-80 h-[400px] rounded-[20px] overflow-hidden cursor-pointer will-change-transform"
        style={{
          background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          transform,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          boxShadow: shadow && isHovered
            ? "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.15)"
            : "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* Content */}
        <div className="relative z-[1] h-full flex flex-col justify-end p-7">
          {/* Decorative circles */}
          <div className="absolute top-10 right-[30px] w-20 h-20 rounded-full border-2 border-indigo-500/30 opacity-60" />
          <div className="absolute top-[70px] right-[50px] w-10 h-10 rounded-full bg-indigo-500/15" />
          <div className="absolute top-[30px] left-[30px] w-[60px] h-[3px] rounded-sm" style={{
            background: "linear-gradient(90deg, rgba(99,102,241,0.6), transparent)",
          }} />

          {/* Text content */}
          <div className="text-[11px] tracking-[3px] uppercase text-indigo-400/70 mb-2">
            Interactive
          </div>
          <div className="text-[28px] font-extrabold text-white leading-tight mb-3">
            Tilt Hover
            <br />
            Card
          </div>
          <div className="text-[13px] text-white/50 leading-relaxed">
            Move your cursor over this card to see the 3D tilt effect with parallax depth.
          </div>
        </div>

        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
            transition: isHovered ? "none" : "opacity 0.5s ease",
          }}
        />

        {/* Border glow */}
        <div
          className="absolute inset-0 rounded-[20px] pointer-events-none z-[3]"
          style={{
            border: `1px solid rgba(99,102,241,${isHovered ? 0.4 : 0.15})`,
            transition: "border-color 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

export default TiltHoverCard;
