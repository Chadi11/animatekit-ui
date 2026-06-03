import { useState } from "react";
import Loader4 from "@/components/animations/Loader4";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (size: number, color: string, petals: number, speed: number, strokeWidth: number, tailLength: number) =>
  `import { useEffect, useRef } from "react";

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
  size = ${size},
  color = "${color}",
  petals = ${petals},
  speed = ${speed},
  strokeWidth = ${strokeWidth},
  tailLength = ${tailLength},
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

    const buildPoints = (cx: number, cy: number, baseR: number, amplitude: number, numPetals: number, samples: number) => {
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
      ctx.strokeStyle = \`rgba(\${rgb.r},\${rgb.g},\${rgb.b},0.12)\`;
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
        ctx.strokeStyle = \`rgba(\${rgb.r},\${rgb.g},\${rgb.b},\${Math.pow(t, 1.4).toFixed(3)})\`;
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

export default Loader4;`;

const propsData = [
  { name: "size", type: "number", default: "80", description: "Canvas size in pixels" },
  { name: "color", type: "string", default: '"#000000"', description: "Stroke color (hex)" },
  { name: "petals", type: "number", default: "6", description: "Number of flower petals" },
  { name: "speed", type: "number", default: "1.6", description: "Loop duration in seconds" },
  { name: "strokeWidth", type: "number", default: "4", description: "Line thickness in pixels" },
  { name: "tailLength", type: "number", default: "0.28", description: "Trailing tail length (0-1)" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes" },
];

const Loader4Page = () => {
  const [size, setSize] = useState(80);
  const [color, setColor] = useState("#f97316");
  const [petals, setPetals] = useState(6);
  const [speed, setSpeed] = useState(1.6);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [tailLength, setTailLength] = useState(0.28);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [loaderKey, setLoaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Loaders</p>
        <h1 className="text-2xl font-bold text-foreground">Loader 4 — Flower Trace</h1>
        <p className="text-sm text-muted-foreground mt-1">A tapered comet tracing a polar sine flower path. Smooth, hypnotic, and never self-intersecting.</p>
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
            <Loader4 key={loaderKey} size={size} color={color} petals={petals} speed={speed} strokeWidth={strokeWidth} tailLength={tailLength} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(size, color, petals, speed, strokeWidth, tailLength)} language="React / TypeScript" />
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
              <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={40} max={160} step={4} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Petals <span className="text-primary ml-1">{petals}</span></Label>
              <Slider value={[petals]} onValueChange={([v]) => setPetals(v)} min={3} max={12} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}s</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={0.6} max={4} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Stroke Width <span className="text-primary ml-1">{strokeWidth}px</span></Label>
              <Slider value={[strokeWidth]} onValueChange={([v]) => setStrokeWidth(v)} min={1} max={10} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tail Length <span className="text-primary ml-1">{tailLength.toFixed(2)}</span></Label>
              <Slider value={[tailLength]} onValueChange={([v]) => setTailLength(v)} min={0.1} max={0.6} step={0.01} />
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

export default Loader4Page;
