import { useRef, useState, useEffect, useCallback } from "react";

interface GlareCardProps {
  children?: React.ReactNode;
  glareColor?: string;
  glareSize?: number;
  tiltAmount?: number;
  trigger?: "hover" | "view" | "both";
  width?: number;
  height?: number;
  className?: string;
}

const GlareCard = ({
  children,
  glareColor = "rgba(255,255,255,0.15)",
  glareSize = 200,
  tiltAmount = 8,
  trigger = "both",
  width = 320,
  height = 200,
  className = "",
}: GlareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [autoAngle, setAutoAngle] = useState(0);
  const animRef = useRef<number>(0);

  const isAutoMode = trigger === "view" || trigger === "both";
  const isHoverMode = trigger === "hover" || trigger === "both";

  useEffect(() => {
    if (!isAutoMode) return;
    const start = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - start) * 0.001;
      setAutoAngle(elapsed * 0.8);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isAutoMode]);

  const autoTilt = isAutoMode && !(isHoverMode && isHovering)
    ? {
        x: Math.sin(autoAngle) * tiltAmount * 0.4,
        y: Math.cos(autoAngle * 0.7) * tiltAmount * 0.4,
      }
    : { x: 0, y: 0 };

  const autoGlare = isAutoMode && !(isHoverMode && isHovering)
    ? {
        x: 50 + Math.sin(autoAngle) * 35,
        y: 50 + Math.cos(autoAngle * 0.7) * 35,
      }
    : { x: 50, y: 50 };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isHoverMode) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({
        x: (y - 0.5) * -tiltAmount * 2,
        y: (x - 0.5) * tiltAmount * 2,
      });
      setGlarePos({ x: x * 100, y: y * 100 });
      setIsHovering(true);
    },
    [isHoverMode, tiltAmount]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isHoverMode) return;
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  }, [isHoverMode]);

  const activeTilt = isHoverMode && isHovering ? tilt : autoTilt;
  const activeGlare = isHoverMode && isHovering ? glarePos : autoGlare;
  const showGlare = isHovering || isAutoMode;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ width, height, perspective: 800 }}
    >
      <div
        className="w-full h-full rounded-xl relative overflow-hidden border border-white/[0.12] will-change-transform"
        style={{
          background: "linear-gradient(135deg, hsl(0 0% 14%), hsl(0 0% 9%))",
          transform: `rotateX(${activeTilt.x}deg) rotateY(${activeTilt.y}deg)`,
          transition: isHovering
            ? "transform 0.1s ease-out"
            : "transform 0.5s ease-out",
        }}
      >
        <div className="relative z-[1] w-full h-full flex items-center justify-center">
          {children}
        </div>

        {showGlare && (
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: `radial-gradient(${glareSize}px circle at ${activeGlare.x}% ${activeGlare.y}%, ${glareColor}, transparent)`,
              transition: isHovering ? "none" : "background 0.3s ease-out",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GlareCard;
