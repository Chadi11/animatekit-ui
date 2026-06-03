import { useState } from "react";
import AuroraBackground from "@/components/animations/AuroraBackground";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  colors: [string, string, string],
  speed: number,
  blur: number,
  size: number
) => `import { useMemo, useState, useEffect, useRef } from "react";

interface AuroraBackgroundProps {
  colors?: [string, string, string];
  speed?: number;
  blur?: number;
  size?: number;
}

const AuroraBackground = ({
  colors = ["#6366f1", "#ec4899", "#14b8a6"],
  speed = ${speed},
  blur = ${blur},
  size = ${size},
}: AuroraBackgroundProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
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

  const durations = useMemo(
    () => [8 / speed, 12 / speed, 15 / speed],
    [speed]
  );

  const keyframesCSS = useMemo(
    () => \`
@keyframes aurora-drift-1 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(15%, -20%) scale(1.1); }
  50% { transform: translate(-10%, 15%) scale(0.9); }
  75% { transform: translate(20%, 10%) scale(1.05); }
}
@keyframes aurora-drift-2 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(-20%, 10%) scale(1.15); }
  50% { transform: translate(15%, -15%) scale(0.85); }
  75% { transform: translate(-5%, 20%) scale(1.1); }
}
@keyframes aurora-drift-3 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(10%, 20%) scale(0.9); }
  50% { transform: translate(-20%, -10%) scale(1.15); }
  75% { transform: translate(15%, -15%) scale(0.95); }
}\`,
    []
  );

  const blobs = useMemo(
    () => [
      {
        color: colors[0],
        width: size * 0.7,
        height: size * 0.6,
        top: "10%",
        left: "10%",
        animation: \`aurora-drift-1 \${durations[0]}s ease-in-out infinite\`,
      },
      {
        color: colors[1],
        width: size * 0.6,
        height: size * 0.7,
        top: "20%",
        left: "40%",
        animation: \`aurora-drift-2 \${durations[1]}s ease-in-out infinite\`,
      },
      {
        color: colors[2],
        width: size * 0.65,
        height: size * 0.55,
        top: "35%",
        left: "15%",
        animation: \`aurora-drift-3 \${durations[2]}s ease-in-out infinite\`,
      },
    ],
    [colors, size, durations]
  );

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: size,
        height: size,
        background: "#0a0a0a",
      }}
    >
      <style>{keyframesCSS}</style>
      {inView &&
        blobs.map((blob, i) => (
          <div
            key={i}
            className="absolute rounded-full [mix-blend-mode:screen] will-change-transform"
            style={{
              top: blob.top,
              left: blob.left,
              width: blob.width,
              height: blob.height,
              background: \`radial-gradient(circle, \${blob.color}88 0%, \${blob.color}00 70%)\`,
              filter: \`blur(${blur}px)\`,
              animation: blob.animation,
            }}
          />
        ))}
    </div>
  );
};
// Usage:
// <AuroraBackground colors={["\${colors[0]}", "\${colors[1]}", "\${colors[2]}"]} speed={${speed}} blur={${blur}} size={${size}} />`;


const AuroraBackgroundPage = () => {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [color3, setColor3] = useState("#14b8a6");
  const [speed, setSpeed] = useState(1);
  const [blur, setBlur] = useState(80);
  const [size, setSize] = useState(400);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  const colors: [string, string, string] = [color1, color2, color3];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Backgrounds
        </p>
        <h1 className="text-2xl font-bold text-foreground">Aurora Background</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Smooth drifting gradient blobs that blend together for an ambient aurora / northern-lights effect.
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
            <AuroraBackground
              key={previewKey}
              colors={colors}
              speed={speed}
              blur={blur}
              size={size}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(colors, speed, blur, size)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color 1</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color1} onChange={(e) => { setColor1(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color1}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color 2</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color2} onChange={(e) => { setColor2(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color2}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color 3</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color3} onChange={(e) => { setColor3(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color3}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}x</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => { setSpeed(v); resetPreview(); }} min={0.5} max={3} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Blur <span className="text-primary ml-1">{blur}px</span></Label>
              <Slider value={[blur]} onValueChange={([v]) => { setBlur(v); resetPreview(); }} min={40} max={120} step={5} />
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

export default AuroraBackgroundPage;
