import { useState } from "react";
import ParticlesFloat from "@/components/animations/ParticlesFloat";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  count: number,
  color: string,
  speed: number,
  size: number
) => `import { useMemo, useState, useEffect, useRef } from "react";

interface ParticlesFloatProps {
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
}

interface Particle {
  x: number;
  y: number;
  diameter: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

const ParticlesFloat = ({
  count = ${count},
  color = "${color}",
  speed = ${speed},
  size = ${size},
}: ParticlesFloatProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const particles = useMemo<Particle[]>(() => {
    const seeded: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const hash = ((i * 2654435761) >>> 0) / 4294967296;
      const hash2 = (((i + 1) * 2654435761) >>> 0) / 4294967296;
      const hash3 = (((i + 2) * 2654435761) >>> 0) / 4294967296;
      const hash4 = (((i + 3) * 2654435761) >>> 0) / 4294967296;
      seeded.push({
        x: hash * 100,
        y: 80 + hash2 * 20,
        diameter: 2 + hash3 * 4,
        duration: (6 + hash4 * 10) / speed,
        delay: hash * (8 / speed),
        opacity: 0.2 + hash2 * 0.5,
        drift: (hash3 - 0.5) * 30,
      });
    }
    return seeded;
  }, [count, speed]);

  const keyframesCSS = useMemo(
    () => \`
@keyframes particle-float {
  0% { transform: translateY(0) translateX(0); opacity: var(--p-opacity); }
  80% { opacity: var(--p-opacity); }
  100% { transform: translateY(-${size}px) translateX(var(--p-drift)); opacity: 0; }
}\`,
    [size]
  );

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl bg-[#0a0a0a]"
      style={{ width: size, height: size }}
    >
      <style>{keyframesCSS}</style>
      {inView &&
        particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-0"
            style={
              {
                left: \`\${p.x}%\`,
                top: \`\${p.y}%\`,
                width: p.diameter,
                height: p.diameter,
                backgroundColor: color,
                "--p-opacity": p.opacity,
                "--p-drift": \`\${p.drift}px\`,
                animation: \`particle-float \${p.duration}s ease-out \${p.delay}s infinite\`,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
};
// Usage:
// <ParticlesFloat count={${count}} color="${color}" speed={${speed}} size={${size}} />`;


const ParticlesFloatPage = () => {
  const [count, setCount] = useState(30);
  const [color, setColor] = useState("#ffffff");
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState(400);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Backgrounds
        </p>
        <h1 className="text-2xl font-bold text-foreground">Particles Float</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Floating dots that drift upward and fade out — like embers or dust motes. Perfect for ambient landing page backgrounds.
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as "preview" | "code")}
          className="bg-secondary rounded-lg p-1 w-fit"
        >
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
            <ParticlesFloat
              key={previewKey}
              count={count}
              color={color}
              speed={speed}
              size={size}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(count, color, speed, size)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Particle Count <span className="text-primary ml-1">{count}</span></Label>
              <Slider value={[count]} onValueChange={([v]) => { setCount(v); resetPreview(); }} min={10} max={60} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}x</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => { setSpeed(v); resetPreview(); }} min={0.5} max={3} step={0.1} />
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

export default ParticlesFloatPage;
