import { useRef, useCallback } from "react";
import { Sparkles, Zap, Layers, Globe, Cpu, Shield } from "lucide-react";

interface MagneticBentoProps {
  magnetStrength?: number;
  liftScale?: number;
  parallaxDepth?: number;
  glowColor?: string;
  borderColor?: string;
  surfaceColor?: string;
  showGlobalSpotlight?: boolean;
  className?: string;
}

interface Tile {
  title: string;
  desc: string;
  icon: React.ElementType;
  span: string;
}

const TILES: Tile[] = [
  { title: "Lightning Fast", desc: "Sub-100ms interactions, every time.", icon: Zap, span: "md:col-span-2 md:row-span-2" },
  { title: "Composable", desc: "Stackable primitives.", icon: Layers, span: "md:col-span-2" },
  { title: "Global", desc: "Edge-deployed worldwide.", icon: Globe, span: "" },
  { title: "Powerful", desc: "GPU-accelerated.", icon: Cpu, span: "" },
  { title: "Secure", desc: "End-to-end encrypted.", icon: Shield, span: "md:col-span-2" },
  { title: "Delightful", desc: "Crafted micro-interactions.", icon: Sparkles, span: "" },
];

const MagneticBento = ({
  magnetStrength = 0.25,
  liftScale = 1.04,
  parallaxDepth = 14,
  glowColor = "#f97316",
  borderColor = "#27272a",
  surfaceColor = "#0b0b0f",
  showGlobalSpotlight = true,
  className = "",
}: MagneticBentoProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoveredIdx = useRef<number>(-1);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const grid = gridRef.current;
      if (!grid) return;
      const gRect = grid.getBoundingClientRect();
      const gx = e.clientX - gRect.left;
      const gy = e.clientY - gRect.top;
      grid.style.setProperty("--gx", `${gx}px`);
      grid.style.setProperty("--gy", `${gy}px`);

      tileRefs.current.forEach((tile, i) => {
        if (!tile) return;
        const r = tile.getBoundingClientRect();
        const cx = r.left + r.width / 2 - gRect.left;
        const cy = r.top + r.height / 2 - gRect.top;
        const dx = gx - cx;
        const dy = gy - cy;
        const dist = Math.hypot(dx, dy);

        // local mouse for inner shine
        tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
        tile.style.setProperty("--my", `${e.clientY - r.top}px`);

        if (i === hoveredIdx.current) {
          // magnetic pull toward cursor
          tile.style.transform = `translate3d(${dx * magnetStrength}px, ${dy * magnetStrength}px, 0) scale(${liftScale})`;
          tile.style.zIndex = "2";
        } else {
          // gentle parallax push away from cursor
          const falloff = Math.max(0, 1 - dist / 600);
          const pushX = -(dx / (dist || 1)) * parallaxDepth * falloff;
          const pushY = -(dy / (dist || 1)) * parallaxDepth * falloff;
          tile.style.transform = `translate3d(${pushX}px, ${pushY}px, 0) scale(1)`;
          tile.style.zIndex = "1";
        }
      });
    },
    [magnetStrength, liftScale, parallaxDepth]
  );

  const handleLeave = useCallback(() => {
    hoveredIdx.current = -1;
    tileRefs.current.forEach((tile) => {
      if (!tile) return;
      tile.style.transform = "translate3d(0,0,0) scale(1)";
      tile.style.zIndex = "1";
    });
    const grid = gridRef.current;
    if (grid) grid.style.setProperty("--g-opacity", "0");
  }, []);

  const handleEnter = useCallback(() => {
    const grid = gridRef.current;
    if (grid) grid.style.setProperty("--g-opacity", "1");
  }, []);

  return (
    <div
      ref={gridRef}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] gap-3 p-3 rounded-3xl ${className}`}
      style={
        {
          background: surfaceColor,
          border: `1px solid ${borderColor}`,
          "--gx": "50%",
          "--gy": "50%",
          "--g-opacity": "0",
        } as React.CSSProperties
      }
    >
      {showGlobalSpotlight && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: "var(--g-opacity)",
            background: `radial-gradient(500px circle at var(--gx) var(--gy), ${glowColor}22, transparent 60%)`,
          }}
        />
      )}

      {TILES.map((tile, i) => {
        const Icon = tile.icon;
        return (
          <div
            key={i}
            ref={(el) => { tileRefs.current[i] = el; }}
            onMouseEnter={() => { hoveredIdx.current = i; }}
            className={`group relative overflow-hidden rounded-2xl p-5 cursor-pointer ${tile.span}`}
            style={{
              background: surfaceColor,
              border: `1px solid ${borderColor}`,
              transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease, border-color 0.3s ease",
              willChange: "transform",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = glowColor;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px -10px ${glowColor}40, 0 0 30px ${glowColor}20`;
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = borderColor;
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            {/* inner cursor shine */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(220px circle at var(--mx) var(--my), ${glowColor}25, transparent 60%)`,
              }}
            />
            <div className="relative z-[1] h-full flex flex-col justify-between">
              <Icon className="w-5 h-5" style={{ color: glowColor }} />
              <div>
                <div className="text-sm font-bold text-white tracking-tight">{tile.title}</div>
                <div className="text-[11px] text-white/50 mt-0.5 leading-snug">{tile.desc}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MagneticBento;
export type { MagneticBentoProps };
