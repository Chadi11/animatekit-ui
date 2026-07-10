import { useEffect, useRef, useState } from "react";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=780&fit=crop";

interface MotionTrailImageProps {
  imageSrc?: string;
  followStrength?: number;
  smoothing?: number;
  trailLength?: number;
  fadeSpeed?: number;
  imageWidth?: number;
  trailSpacing?: number;
}

const MotionTrailImage = ({
  imageSrc = DEFAULT_IMAGE,
  followStrength = 50,
  smoothing = 0.1,
  trailLength = 8,
  fadeSpeed = 0.55,
  imageWidth = 280,
  trailSpacing = 1.4,
}: MotionTrailImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const trailCount = Math.max(1, Math.min(12, trailLength));
  const trailPos = useRef<{ x: number; y: number }[]>(
    Array.from({ length: trailCount }, () => ({ x: 0, y: 0 }))
  );
  const initialized = useRef(false);
  const [, forceRender] = useState(0);
  const snapshot = useRef<{ x: number; y: number }[]>([]);
  const imgH = Math.round(imageWidth * 1.3);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const initCenter = () => {
      const cx = el.offsetWidth / 2;
      const cy = el.offsetHeight / 2;
      currentPos.current = { x: cx, y: cy };
      targetPos.current = { x: cx, y: cy };
      trailPos.current.forEach((p) => { p.x = cx; p.y = cy; });
    };
    initCenter();
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = el.offsetWidth / 2;
      const cy = el.offsetHeight / 2;
      const s = followStrength / 100;
      targetPos.current = { x: cx + (mx - cx) * s, y: cy + (my - cy) * s };
      if (!initialized.current) {
        currentPos.current = { ...targetPos.current };
        trailPos.current.forEach((p) => { p.x = targetPos.current.x; p.y = targetPos.current.y; });
        initialized.current = true;
      }
    };
    el.addEventListener("mousemove", onMove);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const sm = Math.max(0.01, Math.min(0.5, smoothing));
    const tick = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, sm);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, sm);
      for (let i = 0; i < trailPos.current.length; i++) {
        const leader = i === 0 ? currentPos.current : trailPos.current[i - 1];
        const lag = Math.max(0.01, sm * (1 - i * 0.06));
        trailPos.current[i].x = lerp(trailPos.current[i].x, leader.x, lag);
        trailPos.current[i].y = lerp(trailPos.current[i].y, leader.y, lag);
      }
      snapshot.current = [
        { ...currentPos.current },
        ...trailPos.current.map((p) => ({ ...p })),
      ];
      forceRender((n) => n + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [followStrength, smoothing]);

  const fd = Math.max(0.05, Math.min(0.95, fadeSpeed));
  const sp = Math.max(0.5, Math.min(3, trailSpacing));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[520px] bg-[#0c0c0f] overflow-hidden cursor-crosshair"
    >
      {snapshot.current
        .slice(1)
        .reverse()
        .map((pos, ri) => {
          const i = trailCount - 1 - ri;
          const opacity = Math.pow(fd, (i + 1) * sp);
          const scale = 1 - i * 0.018;
          return (
            <div
              key={ri}
              className="absolute rounded-[14px] overflow-hidden pointer-events-none will-change-transform"
              style={{
                width: imageWidth,
                height: imgH,
                opacity,
                transform: `translate(${Math.round(pos.x - imageWidth / 2)}px, ${Math.round(pos.y - imgH / 2)}px) scale(${scale})`,
              }}
            >
              <img src={imageSrc} alt="" draggable={false} className="w-full h-full object-cover block" />
            </div>
          );
        })}
      {snapshot.current[0] && (
        <div
          className="absolute rounded-[14px] overflow-hidden z-10 pointer-events-none will-change-transform shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          style={{
            width: imageWidth,
            height: imgH,
            transform: `translate(${Math.round(snapshot.current[0].x - imageWidth / 2)}px, ${Math.round(snapshot.current[0].y - imgH / 2)}px)`,
          }}
        >
          <img src={imageSrc} alt="Motion Trail" draggable={false} className="w-full h-full object-cover block" />
        </div>
      )}
    </div>
  );
};

export default MotionTrailImage;
