import { useEffect, useRef } from "react";

interface Loader4Props {
  size?: number;
  color?: string;
  petals?: number;
  speed?: number;
  strokeWidth?: number;
  tailLength?: number;
  className?: string;
}

const Loader4 = ({
  size = 80,
  color = "#000000",
  petals = 6,
  speed = 1.6,
  strokeWidth = 4,
  tailLength = 0.28,
  className = "",
}: Loader4Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });

    const buildPoints = (
      cx: number,
      cy: number,
      baseR: number,
      amplitude: number,
      numPetals: number,
      samples: number
    ) => {
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= samples; i++) {
        const angle = (i / samples) * Math.PI * 2;
        const r = baseR + amplitude * Math.cos(numPetals * angle);
        pts.push({
          x: cx + r * Math.cos(angle - Math.PI / 2),
          y: cy + r * Math.sin(angle - Math.PI / 2),
        });
      }
      return pts;
    };

    const SAMPLES = 600;
    const INTERNAL = 180;
    canvas.width = INTERNAL;
    canvas.height = INTERNAL;

    const baseR = 30;
    const amplitude = 18;
    const rgb = hexToRgb(color);
    const sw = strokeWidth * (INTERNAL / size);
    const pts = buildPoints(INTERNAL / 2, INTERNAL / 2, baseR, amplitude, petals, SAMPLES);
    const tailSteps = Math.floor(tailLength * SAMPLES);

    const frame = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      progressRef.current = (progressRef.current + dt / speed) % 1;

      ctx.clearRect(0, 0, INTERNAL, INTERNAL);

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.12)`;
      ctx.lineWidth = sw;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      const headIdx = Math.floor(progressRef.current * (pts.length - 1));
      for (let step = 0; step < tailSteps - 1; step++) {
        const t = step / (tailSteps - 1);
        const idxA = ((headIdx - tailSteps + step) % pts.length + pts.length) % pts.length;
        const idxB = ((headIdx - tailSteps + step + 1) % pts.length + pts.length) % pts.length;
        ctx.beginPath();
        ctx.moveTo(pts[idxA].x, pts[idxA].y);
        ctx.lineTo(pts[idxB].x, pts[idxB].y);
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.pow(t, 1.4).toFixed(3)})`;
        ctx.lineWidth = sw * (0.2 + 0.8 * t);
        ctx.lineCap = "round";
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      progressRef.current = 0;
    };
  }, [size, color, petals, speed, strokeWidth, tailLength]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="status"
      aria-label="Loading"
      style={{ display: "block", width: size, height: size }}
    />
  );
};

export default Loader4;
export type { Loader4Props };
