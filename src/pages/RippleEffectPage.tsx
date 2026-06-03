import { useState } from "react";
import RippleEffect from "@/components/animations/RippleEffect";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Eye, Code } from "lucide-react";

const generateCode = (
  color: string,
  count: number,
  duration: number,
  size: number,
  delay: number,
  repeat: boolean
) => `import { useMemo, useState, useEffect, useRef } from "react";

interface RippleEffectProps {
  color?: string;
  count?: number;
  duration?: number;
  size?: number;
  delay?: number;
  repeat?: boolean;
}

const RippleEffect = ({
  color = "${color}",
  count = ${count},
  duration = ${duration},
  size = ${size},
  delay = ${delay},
  repeat = ${repeat},
}: RippleEffectProps) => {
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

  const keyframesCSS = useMemo(
    () => \`
@keyframes ripple-expand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}\`,
    []
  );

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ width: size, height: size }}
    >
      <style>{keyframesCSS}</style>
      {inView &&
        Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              border: \`2px solid ${color}\`,
              backgroundColor: \`${color}22\`,
              transform: "translate(-50%, -50%) scale(0)",
              opacity: 0,
              animation: \`ripple-expand ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) \${i * delay}s \${repeat ? "infinite" : "1"} forwards\`,
            }}
          />
        ))}
    </div>
  );
};
// Usage:
// <RippleEffect color="${color}" count={${count}} duration={${duration}} size={${size}} delay={${delay}} repeat={${repeat}} />`;


const RippleEffectPage = () => {
  const [color, setColor] = useState("#34d399");
  const [count, setCount] = useState(3);
  const [duration, setDuration] = useState(2);
  const [size, setSize] = useState(400);
  const [delay, setDelay] = useState(0.5);
  const [repeat, setRepeat] = useState(true);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Backgrounds
        </p>
        <h1 className="text-2xl font-bold text-foreground">Ripple Effect</h1>
        <p className="text-sm text-muted-foreground mt-1">
          An animated ripple effect typically used behind elements to emphasize them.
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
            <RippleEffect
              key={previewKey}
              color={color}
              count={count}
              duration={duration}
              size={size}
              delay={delay}
              repeat={repeat}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(color, count, duration, size, delay, repeat)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Ripple Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Ring Count <span className="text-primary ml-1">{count}</span></Label>
              <Slider value={[count]} onValueChange={([v]) => { setCount(v); resetPreview(); }} min={1} max={6} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Duration <span className="text-primary ml-1">{duration}s</span></Label>
              <Slider value={[duration]} onValueChange={([v]) => { setDuration(v); resetPreview(); }} min={0.5} max={5} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size <span className="text-primary ml-1">{size}px</span></Label>
              <Slider value={[size]} onValueChange={([v]) => { setSize(v); resetPreview(); }} min={200} max={600} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Stagger Delay <span className="text-primary ml-1">{delay}s</span></Label>
              <Slider value={[delay]} onValueChange={([v]) => { setDelay(v); resetPreview(); }} min={0.1} max={2} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Repeat</Label>
              <Switch checked={repeat} onCheckedChange={(v) => { setRepeat(v); resetPreview(); }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RippleEffectPage;
