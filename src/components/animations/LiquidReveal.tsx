import { useRef, useCallback, useEffect, useId, useState } from "react";

interface LiquidRevealProps {
  imageSrc?: string;
  lensSize?: number;
  distortionStrength?: number;
  desaturateOutside?: number;
  lensZoom?: number;
  rippleColor?: string;
  width?: number;
  height?: number;
  className?: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  born: number;
}

const LiquidReveal = ({
  imageSrc = "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200",
  lensSize = 220,
  distortionStrength = 30,
  desaturateOutside = 0.7,
  lensZoom = 1.08,
  rippleColor = "#ffffff",
  width = 720,
  height = 480,
  className = "",
}: LiquidRevealProps) => {
  const uid = useId().replace(/:/g, "");
  const filterId = `liquid-${uid}`;
  const maskId = `lens-${uid}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: width / 2, y: height / 2 });
  const currentRef = useRef({ x: width / 2, y: height / 2 });
  const lastMoveRef = useRef({ x: width / 2, y: height / 2, t: 0 });
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const rippleIdRef = useRef(0);

  const [pos, setPos] = useState({ x: width / 2, y: height / 2 });
  const [radius, setRadius] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tick = useCallback(() => {
    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;
    currentRef.current = {
      x: lerp(currentRef.current.x, targetRef.current.x, 0.18),
      y: lerp(currentRef.current.y, targetRef.current.y, 0.18),
    };
    setPos({ ...currentRef.current });

    // cleanup expired ripples (>900ms)
    const now = performance.now();
    setRipples((prev) => prev.filter((r) => now - r.born < 900));

    if (activeRef.current || Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const ensureRaf = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      targetRef.current = { x, y };

      const now = performance.now();
      const dt = now - lastMoveRef.current.t;
      if (dt > 0) {
        const vx = (x - lastMoveRef.current.x) / dt;
        const vy = (y - lastMoveRef.current.y) / dt;
        const speed = Math.hypot(vx, vy);
        if (speed > 1.2 && now - lastMoveRef.current.t > 80) {
          setRipples((prev) => {
            const next = [...prev, { id: rippleIdRef.current++, x, y, born: now }];
            return next.slice(-4);
          });
          lastMoveRef.current.t = now;
          lastMoveRef.current.x = x;
          lastMoveRef.current.y = y;
        }
      }
      ensureRaf();
    },
    [ensureRaf]
  );

  const handleEnter = useCallback(() => {
    activeRef.current = true;
    setRadius(lensSize / 2);
    ensureRaf();
  }, [lensSize, ensureRaf]);

  const handleLeave = useCallback(() => {
    activeRef.current = false;
    setRadius(0);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden rounded-2xl cursor-none select-none ${className}`}
      style={{ width, height, background: "#000" }}
    >
      {/* Inline SVG for filter + mask */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale={distortionStrength} />
          </filter>
          <mask id={maskId}>
            <rect width={width} height={height} fill="black" />
            <circle cx={pos.x} cy={pos.y} r={radius} fill="white" />
          </mask>
        </defs>
      </svg>

      {/* Bottom: desaturated full image */}
      <img
        src={imageSrc}
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover block pointer-events-none"
        style={{ filter: `saturate(${1 - desaturateOutside}) brightness(0.7)` }}
      />

      {/* Top: full-color, distorted, masked to lens */}
      <svg
        width={width}
        height={height}
        className="absolute inset-0 pointer-events-none"
      >
        <g mask={`url(#${maskId})`}>
          <image
            href={imageSrc}
            x={(width * (1 - lensZoom)) / 2}
            y={(height * (1 - lensZoom)) / 2}
            width={width * lensZoom}
            height={height * lensZoom}
            preserveAspectRatio="xMidYMid slice"
            filter={`url(#${filterId})`}
          />
        </g>

        {/* Lens ring */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r={radius}
          fill="none"
          stroke={rippleColor}
          strokeOpacity="0.35"
          strokeWidth="1"
          style={{ transition: "r 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)" }}
        />

        {/* Velocity ripples */}
        {ripples.map((r) => {
          const age = (performance.now() - r.born) / 900;
          const rr = lensSize * 0.4 + age * lensSize * 0.9;
          const op = (1 - age) * 0.5;
          return (
            <circle
              key={r.id}
              cx={r.x}
              cy={r.y}
              r={rr}
              fill="none"
              stroke={rippleColor}
              strokeOpacity={op}
              strokeWidth={1.5}
            />
          );
        })}
      </svg>

      {/* Custom soft cursor dot */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: pos.x - 4,
          top: pos.y - 4,
          width: 8,
          height: 8,
          background: rippleColor,
          opacity: radius > 0 ? 0.8 : 0,
          boxShadow: `0 0 12px ${rippleColor}`,
          transition: "opacity 0.25s ease",
        }}
      />
    </div>
  );
};

export default LiquidReveal;
export type { LiquidRevealProps };
