import { useRef, useEffect, useCallback } from "react";
import { Sparkles, Zap, Layers, Globe, Cpu, Shield, Rocket, Wand2 } from "lucide-react";

interface Marquee3DProps {
  speed?: number;
  perspective?: number;
  tiltX?: number;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  hoverLift?: number;
  proximityRadius?: number;
  pauseOnHover?: boolean;
  glowColor?: string;
  borderColor?: string;
  surfaceColor?: string;
  edgeFade?: boolean;
  className?: string;
}

interface Item {
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const ITEMS: Item[] = [
  { title: "Linear", subtitle: "Issue tracking", icon: Zap },
  { title: "Vercel", subtitle: "Edge platform", icon: Globe },
  { title: "Stripe", subtitle: "Payments", icon: Layers },
  { title: "Raycast", subtitle: "Productivity", icon: Wand2 },
  { title: "Notion", subtitle: "Workspace", icon: Sparkles },
  { title: "Framer", subtitle: "Design", icon: Rocket },
  { title: "Figma", subtitle: "Interface", icon: Cpu },
  { title: "Arc", subtitle: "Browser", icon: Shield },
];

const Marquee3D = ({
  speed = 60,
  perspective = 1200,
  tiltX = 18,
  cardWidth = 220,
  cardHeight = 130,
  gap = 20,
  hoverLift = 80,
  proximityRadius = 200,
  pauseOnHover = true,
  glowColor = "#f97316",
  borderColor = "#27272a",
  surfaceColor = "#0b0b0f",
  edgeFade = true,
  className = "",
}: Marquee3DProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const offsetRef = useRef(0);
  const speedRef = useRef(speed);
  const targetSpeedRef = useRef(speed);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const visibleRef = useRef(true);

  // doubled list for seamless loop
  const list = [...ITEMS, ...ITEMS];
  const single = ITEMS.length;

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    cursorRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    targetSpeedRef.current = pauseOnHover ? 0 : speed * 0.25;
  }, [pauseOnHover, speed]);

  const handleLeave = useCallback(() => {
    cursorRef.current = null;
    targetSpeedRef.current = speed;
    cardRefs.current.forEach((c) => {
      if (!c) return;
      c.style.transform = "translate3d(0,0,0) scale(1)";
      c.style.boxShadow = "none";
      c.style.borderColor = borderColor;
    });
  }, [speed, borderColor]);

  useEffect(() => {
    targetSpeedRef.current = cursorRef.current ? (pauseOnHover ? 0 : speed * 0.25) : speed;
  }, [speed, pauseOnHover]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const tick = (ts: number) => {
      const last = lastTsRef.current || ts;
      const dt = Math.min(64, ts - last) / 1000;
      lastTsRef.current = ts;

      // ease current speed toward target
      speedRef.current += (targetSpeedRef.current - speedRef.current) * Math.min(1, dt * 6);

      const track = trackRef.current;
      if (track && visibleRef.current) {
        const itemW = cardWidth + gap;
        const wrap = single * itemW;
        offsetRef.current -= speedRef.current * dt;
        if (offsetRef.current <= -wrap) offsetRef.current += wrap;
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;

        // cursor proximity lift
        const stage = stageRef.current;
        const cursor = cursorRef.current;
        if (stage && cursor) {
          const sRect = stage.getBoundingClientRect();
          cardRefs.current.forEach((c) => {
            if (!c) return;
            const cr = c.getBoundingClientRect();
            const cx = cr.left + cr.width / 2 - sRect.left;
            const cy = cr.top + cr.height / 2 - sRect.top;
            const dx = cursor.x - cx;
            const dy = cursor.y - cy;
            const dist = Math.hypot(dx, dy);
            const t = Math.max(0, 1 - dist / proximityRadius);
            const lift = hoverLift * t;
            const scale = 1 + 0.08 * t;
            c.style.transform = `translate3d(0,0,${lift}px) scale(${scale})`;
            if (t > 0.05) {
              c.style.borderColor = glowColor;
              c.style.boxShadow = `0 ${20 + 30 * t}px ${40 + 40 * t}px -10px ${glowColor}${Math.floor(30 + 50 * t).toString(16).padStart(2, "0")}, 0 0 ${30 * t}px ${glowColor}40`;
            } else {
              c.style.borderColor = borderColor;
              c.style.boxShadow = "none";
            }
          });
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [cardWidth, gap, single, hoverLift, proximityRadius, glowColor, borderColor]);

  const maskStyle = edgeFade
    ? {
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }
    : {};

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative w-full overflow-hidden rounded-3xl ${className}`}
      style={{
        background: surfaceColor,
        border: `1px solid ${borderColor}`,
        perspective: `${perspective}px`,
        padding: `${cardHeight * 0.6}px 0`,
        ...maskStyle,
      }}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          gap: `${gap}px`,
          transformStyle: "preserve-3d",
          transform: "translate3d(0,0,0)",
          willChange: "transform",
          // tilt applied to a wrapping inner via CSS variable trick:
        }}
      >
        {list.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="shrink-0 relative rounded-2xl flex flex-col justify-between p-5"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                background: surfaceColor,
                border: `1px solid ${borderColor}`,
                transform: `rotateX(${tiltX}deg)`,
                transformOrigin: "center center",
                transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.35s ease, border-color 0.35s ease",
                willChange: "transform",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: glowColor }} />
              <div>
                <div className="text-sm font-bold text-white tracking-tight">{item.title}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{item.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marquee3D;
export type { Marquee3DProps };
