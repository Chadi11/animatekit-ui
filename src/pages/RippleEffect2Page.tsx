import { useState } from "react";
import RippleEffect2 from "@/components/animations/RippleEffect2";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  text: string,
  color: string,
  count: number,
  duration: number,
  size: number
) => `import { useMemo, useState, useEffect, useRef } from "react";

interface RippleEffect2Props {
  text?: string;
  color?: string;
  count?: number;
  duration?: number;
  size?: number;
}

const RippleEffect2 = ({
  text = "${text}",
  color = "${color}",
  count = ${count},
  duration = ${duration},
  size = ${size},
}: RippleEffect2Props) => {
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

  const keyframesCSS = useMemo(() => \`
@keyframes ripple-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.15; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.5; }
}\`, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ width: size, height: size }}
    >
      <style>{keyframesCSS}</style>
      {inView &&
        Array.from({ length: count }).map((_, i) => {
          const ringSize = size * ((i + 1) / count);
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                width: ringSize,
                height: ringSize,
                border: \`1.5px solid ${color}\`,
                transform: "translate(-50%, -50%) scale(0.95)",
                opacity: 0.15,
                animation: \`ripple-pulse ${duration}s ease-in-out \${(i * duration) / count}s infinite\`,
              }}
            />
          );
        })}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold tracking-wide pointer-events-none whitespace-nowrap"
        style={{
          fontSize: size * 0.12,
          color,
          opacity: 0.7,
        }}
      >
        {text}
      </span>
    </div>
  );
};
// Usage:
// <RippleEffect2 text="${text}" color="${color}" count={${count}} duration={${duration}} size={${size}} />`;


const RippleEffect2Page = () => {
  const [text, setText] = useState("Ripple");
  const [color, setColor] = useState("#a0a0a0");
  const [count, setCount] = useState(5);
  const [duration, setDuration] = useState(4);
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
        <h1 className="text-2xl font-bold text-foreground">Ripple Effect 2</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Static concentric rings with a smooth slow pulsing animation and centered text.
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
            <RippleEffect2
              key={previewKey}
              text={text}
              color={color}
              count={count}
              duration={duration}
              size={size}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, color, count, duration, size)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Center Text</Label>
              <Input value={text} onChange={(e) => { setText(e.target.value); resetPreview(); }} className="h-8 text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Ring Count <span className="text-primary ml-1">{count}</span></Label>
              <Slider value={[count]} onValueChange={([v]) => { setCount(v); resetPreview(); }} min={3} max={8} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Duration <span className="text-primary ml-1">{duration}s</span></Label>
              <Slider value={[duration]} onValueChange={([v]) => { setDuration(v); resetPreview(); }} min={2} max={10} step={0.5} />
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

export default RippleEffect2Page;
