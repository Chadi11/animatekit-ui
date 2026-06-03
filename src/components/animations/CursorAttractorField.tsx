import { useRef, useEffect, useCallback } from "react";

interface CursorAttractorFieldProps {
  gridSize?: number;
  nodeRadius?: number;
  influenceRadius?: number;
  attractStrength?: number;
  lineMode?: boolean;
  accentColor?: string;
  bgColor?: string;
  nodeColor?: string;
  clickShockwave?: boolean;
  height?: number;
  className?: string;
  children?: React.ReactNode;
}

interface Shockwave {
  x: number;
  y: number;
  t: number;
}

const CursorAttractorField = ({
  gridSize = 32,
  nodeRadius = 1.6,
  influenceRadius = 180,
  attractStrength = 0.6,
  lineMode = true,
  accentColor = "#a78bfa",
  bgColor = "#08070d",
  nodeColor = "#3a3550",
  clickShockwave = true,
  height = 460,
  className = "",
  children,
}: CursorAttractorFieldProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const smoothCursorRef = useRef<{ x: number; y: number } | null>(null);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    cursorRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const handleLeave = useCallback(() => {
    cursorRef.current = null;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickShockwave) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    shockwavesRef.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
  }, [clickShockwave]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect();
      sizeRef.current = { w: r.width, h: r.height, dpr };
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const tick = () => {
      const { w, h } = sizeRef.current;

      // smooth cursor
      const target = cursorRef.current;
      if (target) {
        if (!smoothCursorRef.current) smoothCursorRef.current = { ...target };
        else {
          smoothCursorRef.current.x += (target.x - smoothCursorRef.current.x) * 0.18;
          smoothCursorRef.current.y += (target.y - smoothCursorRef.current.y) * 0.18;
        }
      } else {
        smoothCursorRef.current = null;
      }

      if (visibleRef.current) {
        ctx.clearRect(0, 0, w, h);
        // background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);

        // advance shockwaves
        const waves = shockwavesRef.current;
        for (let i = waves.length - 1; i >= 0; i--) {
          waves[i].t += 6;
          if (waves[i].t > Math.max(w, h) * 1.2) waves.splice(i, 1);
        }

        const cols = Math.ceil(w / gridSize) + 1;
        const rows = Math.ceil(h / gridSize) + 1;
        const cursor = smoothCursorRef.current;
        const inf2 = influenceRadius * influenceRadius;

        for (let cy = 0; cy < rows; cy++) {
          for (let cx = 0; cx < cols; cx++) {
            let x = cx * gridSize;
            let y = cy * gridSize;
            let strength = 0;
            let dirX = 0;
            let dirY = 0;

            // cursor attraction
            if (cursor) {
              const dx = cursor.x - x;
              const dy = cursor.y - y;
              const d2 = dx * dx + dy * dy;
              if (d2 < inf2 && d2 > 0.01) {
                const d = Math.sqrt(d2);
                const t = 1 - d / influenceRadius;
                strength = t;
                dirX = dx / d;
                dirY = dy / d;
                // pull node toward cursor
                x += dirX * t * attractStrength * gridSize * 0.7;
                y += dirY * t * attractStrength * gridSize * 0.7;
              }
            }

            // shockwave displacement
            for (const wv of waves) {
              const dx = x - wv.x;
              const dy = y - wv.y;
              const d = Math.sqrt(dx * dx + dy * dy);
              const ringDist = Math.abs(d - wv.t);
              if (ringDist < 40 && d > 0.01) {
                const push = (1 - ringDist / 40) * 14;
                x += (dx / d) * push;
                y += (dy / d) * push;
                strength = Math.max(strength, 0.6);
              }
            }

            if (lineMode && strength > 0.05 && cursor) {
              const len = nodeRadius * 2 + strength * gridSize * 0.55;
              ctx.strokeStyle = mixColor(nodeColor, accentColor, strength);
              ctx.lineWidth = nodeRadius * 0.9 + strength * 1.2;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(x - dirX * len * 0.5, y - dirY * len * 0.5);
              ctx.lineTo(x + dirX * len * 0.5, y + dirY * len * 0.5);
              ctx.stroke();
            } else {
              const r = nodeRadius + strength * 2.4;
              ctx.fillStyle = strength > 0.05 ? mixColor(nodeColor, accentColor, strength) : nodeColor;
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // soft cursor spotlight
        if (cursor) {
          const grad = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, influenceRadius);
          grad.addColorStop(0, hexToRgba(accentColor, 0.18));
          grad.addColorStop(1, hexToRgba(accentColor, 0));
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [gridSize, nodeRadius, influenceRadius, attractStrength, lineMode, accentColor, bgColor, nodeColor]);

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseDown={handleClick}
      className={`relative w-full overflow-hidden rounded-3xl ${className}`}
      style={{ height: `${height}px`, background: bgColor, cursor: "crosshair" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {children && (
        <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

function hexToRgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function mixColor(a: string, b: string, t: number) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

export default CursorAttractorField;
export type { CursorAttractorFieldProps };
