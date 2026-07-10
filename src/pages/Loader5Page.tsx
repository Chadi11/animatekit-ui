import { useState } from "react";
import Loader5 from "@/components/animations/Loader5";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (color: string, size: number, bounceHeight: number, speed: number) =>
  `import { useEffect, useRef } from "react";

interface Loader5Props {
  color?: string;
  size?: number;
  bounceHeight?: number;
  speed?: number;
  className?: string;
}

const Loader5 = ({
  color = "${color}",
  size = ${size},
  bounceHeight = ${bounceHeight},
  speed = ${speed},
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
        ctx.fillStyle = \`rgba(\${rgb.r},\${rgb.g},\${rgb.b},\${0.12 + squash * 0.18})\`;
        ctx.fill();

        const grad = ctx.createRadialGradient(
          cx - rx * 0.25, ballY - ry * 0.25, ry * 0.05,
          cx, ballY, Math.max(rx, ry)
        );
        grad.addColorStop(0, \`rgba(255,255,255,0.95)\`);
        grad.addColorStop(0.4, \`rgba(\${rgb.r},\${rgb.g},\${rgb.b},0.95)\`);
        grad.addColorStop(1, \`rgba(\${Math.floor(rgb.r * 0.3)},\${Math.floor(rgb.g * 0.3)},\${Math.floor(rgb.b * 0.3)},0.8)\`);

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

export default Loader5;`;

const propsData = [
  { name: "color", type: "string", default: '"#000000"', description: "Ball color (hex)" },
  { name: "size", type: "number", default: "24", description: "Ball diameter in pixels" },
  { name: "bounceHeight", type: "number", default: "60", description: "Bounce arc height in pixels" },
  { name: "speed", type: "number", default: "1.0", description: "Bounce cycle in seconds" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes" },
];

const Loader5Page = () => {
  const [color, setColor] = useState("#f97316");
  const [size, setSize] = useState(24);
  const [bounceHeight, setBounceHeight] = useState(60);
  const [speed, setSpeed] = useState(1.0);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [loaderKey, setLoaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Loaders</p>
        <h1 className="text-2xl font-bold text-foreground">Loader 5 — Squash Bounce</h1>
        <p className="text-sm text-muted-foreground mt-1">Three radially shaded balls bouncing with squash-and-stretch and shadow falloff. A classic with cartoon polish.</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame onReload={() => setLoaderKey((k) => k + 1)}>
            <Loader5 key={loaderKey} color={color} size={size} bounceHeight={bounceHeight} speed={speed} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(color, size, bounceHeight, speed)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size <span className="text-primary ml-1">{size}px</span></Label>
              <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={12} max={48} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Bounce Height <span className="text-primary ml-1">{bounceHeight}px</span></Label>
              <Slider value={[bounceHeight]} onValueChange={([v]) => setBounceHeight(v)} min={20} max={120} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}s</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={0.4} max={2.5} step={0.1} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <PropsTable props={propsData} />
      </div>
    </div>
  );
};

export default Loader5Page;
