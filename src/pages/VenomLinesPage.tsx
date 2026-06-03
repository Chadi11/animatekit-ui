import { useState } from "react";
import VenomLines from "@/components/animations/VenomLines";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (lineCount: number, speed: number, color: string, backgroundColor: string, size: number) =>
  `import { useState, useEffect, useRef } from "react";

interface VenomLinesProps {
  lineCount?: number;
  speed?: number;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
}

const VenomLines = ({
  lineCount = ${lineCount},
  speed = ${speed},
  color = "${color}",
  backgroundColor = "${backgroundColor}",
  width = 400,
  height = 400,
}: VenomLinesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 255, g: 255, b: 255 };
    };

    const rgb = hexToRgb(color);
    const colorStr = (opacity: number) => \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, \${opacity})\`;

    interface Tendril {
      yStart: number; yEnd: number;
      phase1: number; phase2: number; phase3: number; phase4: number;
      speedMult: number; minWidth: number; maxWidth: number;
      baseOpacity: number; opacityPhase: number;
      segments: number; driftPhase: number; driftAmp: number;
    }

    const tendrils: Tendril[] = Array.from({ length: lineCount }, () => ({
      yStart: Math.random(), yEnd: Math.random(),
      phase1: Math.random() * Math.PI * 2, phase2: Math.random() * Math.PI * 2,
      phase3: Math.random() * Math.PI * 2, phase4: Math.random() * Math.PI * 2,
      speedMult: 0.4 + Math.random() * 0.8,
      minWidth: 0.4 + Math.random() * 0.8, maxWidth: 1.5 + Math.random() * 2.5,
      baseOpacity: 0.15 + Math.random() * 0.55,
      opacityPhase: Math.random() * Math.PI * 2,
      segments: 6 + Math.floor(Math.random() * 5),
      driftPhase: Math.random() * Math.PI * 2, driftAmp: 0.04 + Math.random() * 0.12,
    }));

    const drawTendril = (t: Tendril, time: number) => {
      const ts = time * speed * t.speedMult;
      const driftY = Math.sin(ts * 0.3 + t.driftPhase) * t.driftAmp;
      const yS = Math.max(0.02, Math.min(0.98, t.yStart + driftY));
      const yE = Math.max(0.02, Math.min(0.98, t.yEnd + Math.sin(ts * 0.25 + t.driftPhase + 1.2) * t.driftAmp));

      const x0 = 0, y0 = yS * height, x3 = width, y3 = yE * height;
      const cp1x = width * 0.25 + Math.sin(ts * 0.7 + t.phase1) * width * 0.15;
      const cp1y = y0 + Math.sin(ts * 0.5 + t.phase2) * height * 0.35;
      const cp2x = width * 0.75 + Math.cos(ts * 0.6 + t.phase3) * width * 0.15;
      const cp2y = y3 + Math.cos(ts * 0.45 + t.phase4) * height * 0.35;

      const opacity = t.baseOpacity * (0.5 + 0.5 * Math.sin(ts * 0.8 + t.opacityPhase));

      const steps = t.segments * 4;
      for (let s = 0; s < steps; s++) {
        const tA = s / steps;
        const tB = (s + 1) / steps;

        const bezier = (t: number) => {
          const mt = 1 - t;
          return {
            x: mt*mt*mt*x0 + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*x3,
            y: mt*mt*mt*y0 + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*y3,
          };
        };

        const pA = bezier(tA);
        const pB = bezier(tB);
        const midT = (tA + tB) / 2;
        const thicknessCurve = Math.sin(midT * Math.PI);
        const lw = t.minWidth + (t.maxWidth - t.minWidth) * thicknessCurve;

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.strokeStyle = colorStr(opacity * (0.6 + 0.4 * thicknessCurve));
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x3, y3);
      ctx.strokeStyle = colorStr(opacity * 0.25);
      ctx.lineWidth = 0.3;
      ctx.stroke();
    };

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const time = timeRef.current;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const bgRgb = hexToRgb(backgroundColor);
      ctx.fillStyle = \`rgba(\${bgRgb.r},\${bgRgb.g},\${bgRgb.b},0.85)\`;
      ctx.fillRect(0, 0, width, height);

      tendrils.forEach((t) => drawTendril(t, time));
      animRef.current = requestAnimationFrame(animate);
    };

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [inView, lineCount, speed, color, backgroundColor, width, height]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded"
      style={{ width, height, backgroundColor }}
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
// Usage:
// <VenomLines lineCount={${lineCount}} speed={${speed}} color="${color}" backgroundColor="${backgroundColor}" width={${size}} height={${size}} />`;


const VenomLinesPage = () => {
  const [lineCount, setLineCount] = useState(12);
  const [speed, setSpeed] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [size, setSize] = useState(400);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Backgrounds</p>
        <h1 className="text-2xl font-bold text-foreground">Venom Lines</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Organic, animated tendrils that undulate across the canvas with breathing opacity and variable thickness.
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5">
            <Eye className="h-3.5 w-3.5" /> Preview
          </ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5">
            <Code className="h-3.5 w-3.5" /> Code
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame>
            <VenomLines key={previewKey} lineCount={lineCount} speed={speed} color={color} backgroundColor={backgroundColor} width={size} height={size} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(lineCount, speed, color, backgroundColor, size)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Line Count <span className="text-primary ml-1">{lineCount}</span></Label>
              <Slider value={[lineCount]} onValueChange={([v]) => { setLineCount(v); resetPreview(); }} min={4} max={20} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}x</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => { setSpeed(v); resetPreview(); }} min={0.5} max={3} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Line Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={backgroundColor} onChange={(e) => { setBackgroundColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{backgroundColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size <span className="text-primary ml-1">{size}px</span></Label>
              <Slider value={[size]} onValueChange={([v]) => { setSize(v); resetPreview(); }} min={200} max={600} step={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenomLinesPage;
