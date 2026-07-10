import { useEffect, useRef } from "react";

interface Loader5Props {
  color?: string;
  size?: number;
  bounceHeight?: number;
  speed?: number;
  className?: string;
}

const Loader5 = ({
  color = "#000000",
  size = 24,
  bounceHeight = 60,
  speed = 1.0,
  className = "",
}: Loader5Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const BALLS = [{ delay: 0 }, { delay: 0.15 }, { delay: 0.3 }];

    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });

    const gap = size * 1.4;
    const totalW = BALLS.length * size + (BALLS.length - 1) * gap;
    const W = totalW + size * 2;
    const H = bounceHeight + size * 3.5;

    canvas.width = W;
    canvas.height = H;

    const groundY = H - size * 0.7;
    const startX = (W - totalW) / 2 + size / 2;
    const rgb = hexToRgb(color);

    const frame = (ts: number) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = (ts - startTimeRef.current) / 1000;
      ctx.clearRect(0, 0, W, H);

      BALLS.forEach((ball, i) => {
        const t = ((elapsed / speed - ball.delay) % 1 + 1) % 1;
        const heightT = Math.abs(Math.sin(t * Math.PI));
        const squash = 1 - heightT;
        const scaleX = 1 + squash * 0.55;
        const scaleY = 1 - squash * 0.45;

        const cx = startX + i * (size + gap);
        const ballY = groundY - heightT * bounceHeight;
        const rx = (size / 2) * scaleX;
        const ry = (size / 2) * scaleY;

        ctx.beginPath();
        ctx.ellipse(
          cx,
          groundY + size * 0.09,
          (size / 2) * (0.9 + squash * 0.3),
          size * 0.09 * (0.4 + squash * 0.6),
          0, 0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.12 + squash * 0.18})`;
        ctx.fill();

        const grad = ctx.createRadialGradient(
          cx - rx * 0.25, ballY - ry * 0.25, ry * 0.05,
          cx, ballY, Math.max(rx, ry)
        );
        grad.addColorStop(0, `rgba(255,255,255,0.95)`);
        grad.addColorStop(0.4, `rgba(${rgb.r},${rgb.g},${rgb.b},0.95)`);
        grad.addColorStop(1, `rgba(${Math.floor(rgb.r * 0.3)},${Math.floor(rgb.g * 0.3)},${Math.floor(rgb.b * 0.3)},0.8)`);

        ctx.beginPath();
        ctx.ellipse(cx, ballY, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [color, size, bounceHeight, speed]);

  const gap = size * 1.4;
  const totalW = 3 * size + 2 * gap;
  const W = totalW + size * 2;
  const H = bounceHeight + size * 3.5;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="status"
      aria-label="Loading"
      style={{ display: "block", width: W, height: H }}
    />
  );
};

export default Loader5;
export type { Loader5Props };
