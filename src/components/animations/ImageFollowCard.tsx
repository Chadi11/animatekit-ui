import { useRef, useState, useCallback, useEffect } from "react";

interface ImageFollowCardProps {
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  label?: string;
  sublabel?: string;
  width?: number;
  height?: number;
  className?: string;
}

const ImageFollowCard = ({
  imageSrc = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=780&fit=crop",
  imageWidth = 200,
  imageHeight = 260,
  label = "Hover Me",
  sublabel = "Move your cursor around",
  width = 420,
  height = 280,
  className = "",
}: ImageFollowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;
    if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
      currentRef.current = {
        x: lerp(currentRef.current.x, targetRef.current.x, 0.1),
        y: lerp(currentRef.current.y, targetRef.current.y, 0.1),
      };
      setPos({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      targetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    },
    [animate]
  );

  const handleMouseEnter = useCallback(() => setVisible(true), []);
  const handleMouseLeave = useCallback(() => {
    setVisible(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const imgOffsetX = 20;
  const imgOffsetY = -imageHeight / 2;

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] cursor-none select-none bg-black ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-[1]"
        style={{
          transition: "opacity 0.3s ease",
          opacity: visible ? 0.15 : 1,
        }}
      >
        <div className="text-[22px] font-bold text-white tracking-tight uppercase">
          {label}
        </div>
        <div className="text-xs text-white/40 tracking-widest uppercase">
          {sublabel}
        </div>
      </div>

      <div
        className="absolute rounded-xl overflow-hidden pointer-events-none z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        style={{
          left: pos.x + imgOffsetX,
          top: pos.y + imgOffsetY,
          width: imageWidth,
          height: imageHeight,
          opacity: visible && loaded ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        <img
          src={imageSrc}
          alt=""
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover block"
        />
      </div>

      <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] z-[2]" />
    </div>
  );
};

export default ImageFollowCard;
export type { ImageFollowCardProps };
