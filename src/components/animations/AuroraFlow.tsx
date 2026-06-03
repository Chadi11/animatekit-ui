import { useEffect, useRef, useState, useMemo } from "react";

const COLOR_SCHEMES = {
  aurora: [
    { stops: ["#00ffd5", "#00bfff", "#7b2fff"], opacity: 0.55, yBase: 0.55, amp: 0.13, freq: 0.11, phase: 0.0 },
    { stops: ["#00ff88", "#00cfff", "#a855f7"], opacity: 0.45, yBase: 0.45, amp: 0.15, freq: 0.09, phase: 1.8 },
    { stops: ["#34d399", "#818cf8", "#c084fc"], opacity: 0.38, yBase: 0.62, amp: 0.12, freq: 0.13, phase: 3.5 },
    { stops: ["#06b6d4", "#6366f1", "#8b5cf6"], opacity: 0.30, yBase: 0.38, amp: 0.17, freq: 0.07, phase: 0.9 },
    { stops: ["#10b981", "#3b82f6", "#d946ef"], opacity: 0.22, yBase: 0.70, amp: 0.10, freq: 0.15, phase: 2.4 },
  ],
  sunset: [
    { stops: ["#ff6b35", "#ff0080", "#ff4500"], opacity: 0.55, yBase: 0.55, amp: 0.13, freq: 0.11, phase: 0.0 },
    { stops: ["#ffd700", "#ff6347", "#ff1493"], opacity: 0.45, yBase: 0.45, amp: 0.15, freq: 0.09, phase: 1.8 },
    { stops: ["#ff8c00", "#dc143c", "#ff69b4"], opacity: 0.38, yBase: 0.62, amp: 0.12, freq: 0.13, phase: 3.5 },
    { stops: ["#ff4500", "#ff0066", "#ff8800"], opacity: 0.30, yBase: 0.38, amp: 0.17, freq: 0.07, phase: 0.9 },
    { stops: ["#ffb347", "#ff6b9d", "#c0392b"], opacity: 0.22, yBase: 0.70, amp: 0.10, freq: 0.15, phase: 2.4 },
  ],
  ocean: [
    { stops: ["#00d4ff", "#0099cc", "#006994"], opacity: 0.55, yBase: 0.55, amp: 0.13, freq: 0.11, phase: 0.0 },
    { stops: ["#7fffd4", "#00ced1", "#1e90ff"], opacity: 0.45, yBase: 0.45, amp: 0.15, freq: 0.09, phase: 1.8 },
    { stops: ["#48d1cc", "#4169e1", "#00bfff"], opacity: 0.38, yBase: 0.62, amp: 0.12, freq: 0.13, phase: 3.5 },
    { stops: ["#20b2aa", "#1e90ff", "#87ceeb"], opacity: 0.30, yBase: 0.38, amp: 0.17, freq: 0.07, phase: 0.9 },
    { stops: ["#b0e0e6", "#4682b4", "#00ffff"], opacity: 0.22, yBase: 0.70, amp: 0.10, freq: 0.15, phase: 2.4 },
  ],
  rose: [
    { stops: ["#ff9ecd", "#ff3d9a", "#c44dff"], opacity: 0.55, yBase: 0.55, amp: 0.13, freq: 0.11, phase: 0.0 },
    { stops: ["#ffd6e7", "#ff85b3", "#e040fb"], opacity: 0.45, yBase: 0.45, amp: 0.15, freq: 0.09, phase: 1.8 },
    { stops: ["#ffb3d9", "#f06292", "#ba68c8"], opacity: 0.38, yBase: 0.62, amp: 0.12, freq: 0.13, phase: 3.5 },
    { stops: ["#ff80ab", "#ec407a", "#ab47bc"], opacity: 0.30, yBase: 0.38, amp: 0.17, freq: 0.07, phase: 0.9 },
    { stops: ["#fce4ec", "#f48fb1", "#ce93d8"], opacity: 0.22, yBase: 0.70, amp: 0.10, freq: 0.15, phase: 2.4 },
  ],
};

interface AuroraFlowProps {
  speed?: number;
  intensity?: number;
  colorScheme?: "aurora" | "sunset" | "ocean" | "rose";
  starField?: boolean;
  bgColor?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AuroraFlow = ({
  speed = 0.4,
  intensity = 0.8,
  colorScheme = "aurora",
  starField = true,
  bgColor = "#020408",
  width = 400,
  height = 400,
  className = "",
}: AuroraFlowProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const stars = useMemo(() => {
    if (!starField) return [];
    return Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.3 + Math.random() * 1.0,
      a: 0.1 + Math.random() * 0.5,
    }));
  }, [starField]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bands = COLOR_SCHEMES[colorScheme];

    const hexRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const buildWavePath = (t: number, band: typeof bands[0], bandHeight: number) => {
      const W = width, H = height;
      const yCenter = (band.yBase + band.amp * Math.sin(t * band.freq + band.phase)) * H;
      const N = 60;
      const topPts: [number, number][] = [];
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * W;
        const nx = i / N;
        const dy =
          Math.sin(nx * Math.PI * 3.5 + t * band.freq * 2.1 + band.phase) * H * 0.055 +
          Math.sin(nx * Math.PI * 1.8 + t * band.freq * 1.4 + band.phase + 1.2) * H * 0.035 +
          Math.sin(nx * Math.PI * 5.2 + t * band.freq * 0.8 + band.phase + 2.5) * H * 0.018;
        topPts.push([x, yCenter + dy]);
      }
      return { topPts, yCenter, bandH: bandHeight };
    };

    const drawBand = (band: typeof bands[0], topPts: [number, number][], _yCenter: number, bandH: number, alpha: number) => {
      const W = width;
      const N = topPts.length - 1;
      const layers = [
        { hw: bandH * 2.8, a: 0.06 },
        { hw: bandH * 1.6, a: 0.12 },
        { hw: bandH * 0.8, a: 0.22 },
        { hw: bandH * 0.3, a: 0.55 },
      ];
      layers.forEach(({ hw, a }) => {
        ctx.beginPath();
        ctx.moveTo(topPts[0][0], topPts[0][1] - hw);
        for (let i = 1; i <= N; i++) ctx.lineTo(topPts[i][0], topPts[i][1] - hw);
        for (let i = N; i >= 0; i--) ctx.lineTo(topPts[i][0], topPts[i][1] + hw);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, W, 0);
        const stops = band.stops;
        const { r: r0, g: g0, b: b0 } = hexRgb(stops[0]);
        const { r: r1, g: g1, b: b1 } = hexRgb(stops[1]);
        const { r: r2, g: g2, b: b2 } = hexRgb(stops[2]);
        const fa = (alpha * a * intensity).toFixed(3);
        grad.addColorStop(0.00, `rgba(${r0},${g0},${b0},${fa})`);
        grad.addColorStop(0.20, `rgba(${r0},${g0},${b0},${(alpha*a*intensity*0.7).toFixed(3)})`);
        grad.addColorStop(0.50, `rgba(${r1},${g1},${b1},${fa})`);
        grad.addColorStop(0.80, `rgba(${r2},${g2},${b2},${(alpha*a*intensity*0.7).toFixed(3)})`);
        grad.addColorStop(1.00, `rgba(${r2},${g2},${b2},${fa})`);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    };

    const drawStars = (t: number) => {
      stars.forEach(star => {
        const twinkle = star.a * (0.6 + 0.4 * Math.sin(t * 2.1 + star.x * 37.3));
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle.toFixed(3)})`;
        ctx.fill();
      });
    };

    // Parse bgColor for atmosphere overlays
    const bgRgb = hexRgb(bgColor.startsWith("#") ? bgColor : "#020408");

    const drawAtmosphere = () => {
      const tg = ctx.createLinearGradient(0, 0, 0, height * 0.30);
      tg.addColorStop(0, `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},0.95)`);
      tg.addColorStop(1, `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},0.00)`);
      ctx.fillStyle = tg;
      ctx.fillRect(0, 0, width, height * 0.30);

      const bg = ctx.createLinearGradient(0, height, 0, height * 0.65);
      bg.addColorStop(0, `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},0.90)`);
      bg.addColorStop(1, `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},0.00)`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, height * 0.65, width, height * 0.35);

      const lrA = 0.45;
      const lg = ctx.createLinearGradient(0, 0, width * 0.12, 0);
      lg.addColorStop(0, `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},${lrA})`);
      lg.addColorStop(1, `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},0.00)`);
      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, width * 0.12, height);

      const rg = ctx.createLinearGradient(width, 0, width * 0.88, 0);
      rg.addColorStop(0, `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},${lrA})`);
      rg.addColorStop(1, `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},0.00)`);
      ctx.fillStyle = rg;
      ctx.fillRect(width * 0.88, 0, width * 0.12, height);
    };

    const drawScanlines = () => {
      ctx.save();
      ctx.globalAlpha = 0.018;
      for (let y = 0; y < height; y += 3) {
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, y, width, 1);
      }
      ctx.restore();
    };

    const drawBloom = (band: typeof bands[0], topPts: [number, number][], _yCenter: number, bandH: number, alpha: number) => {
      const W = width;
      const N = topPts.length - 1;
      const bloomOffsets = [-bandH * 0.4, bandH * 0.4, -bandH * 0.8, bandH * 0.8];
      bloomOffsets.forEach(offset => {
        ctx.beginPath();
        ctx.moveTo(topPts[0][0], topPts[0][1] + offset - bandH * 0.25);
        for (let i = 1; i <= N; i++) ctx.lineTo(topPts[i][0], topPts[i][1] + offset - bandH * 0.25);
        for (let i = N; i >= 0; i--) ctx.lineTo(topPts[i][0], topPts[i][1] + offset + bandH * 0.25);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, W, 0);
        const { r: r1, g: g1, b: b1 } = hexRgb(band.stops[1]);
        const ba = (alpha * 0.04 * intensity).toFixed(3);
        grad.addColorStop(0,   `rgba(${r1},${g1},${b1},0)`);
        grad.addColorStop(0.5, `rgba(${r1},${g1},${b1},${ba})`);
        grad.addColorStop(1,   `rgba(${r1},${g1},${b1},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    };

    const animate = (timestamp: number) => {
      const t = timestamp * 0.001 * speed;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      if (starField) drawStars(t);

      ctx.globalCompositeOperation = "screen";
      const bandHeight = Math.min(width, height) * 0.18;

      bands.forEach(band => {
        const breathe = 0.7 + 0.3 * Math.sin(t * band.freq * 1.5 + band.phase + 0.5);
        const alpha = band.opacity * breathe;
        const { topPts, yCenter, bandH } = buildWavePath(t, band, bandHeight);
        drawBloom(band, topPts, yCenter, bandH, alpha);
        drawBand(band, topPts, yCenter, bandH, alpha);
      });

      ctx.globalCompositeOperation = "source-over";
      drawAtmosphere();
      drawScanlines();

      animRef.current = requestAnimationFrame(animate);
    };

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [inView, speed, intensity, colorScheme, starField, bgColor, width, height, stars]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded ${className}`}
      style={{
        width,
        height,
        backgroundColor: bgColor,
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block"
      />
    </div>
  );
};

export default AuroraFlow;
