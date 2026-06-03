import { useState } from "react";
import CountingNumber from "@/components/animations/CountingNumber";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  target: number,
  start: number,
  duration: number,
  decimals: number,
  prefix: string,
  suffix: string,
  fontSize: number,
  color: string
) => `import { useState, useEffect, useRef } from "react";

interface CountingNumberProps {
  target: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const CountingNumber = ({
  target,
  start = ${start},
  duration = ${duration},
  decimals = ${decimals},
  prefix = "${prefix}",
  suffix = "${suffix}",
  fontSize = ${fontSize},
  color = "${color}",
}: CountingNumberProps) => {
  const [display, setDisplay] = useState(start.toFixed(decimals));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = start + (target - start) * eased;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, start, duration, decimals]);

  return (
    <span
      className="inline-block font-bold font-['Space_Grotesk',sans-serif] tabular-nums"
      style={{ fontSize, color }}
    >
      {prefix}{display}{suffix}
    </span>
  );
};
// Usage:
// <CountingNumber target={${target}} duration={${duration}} prefix="${prefix}" suffix="${suffix}" />`;


const CountingNumberPage = () => {
  const [target, setTarget] = useState(1234);
  const [start, setStart] = useState(0);
  const [duration, setDuration] = useState(2000);
  const [decimals, setDecimals] = useState(0);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#f97316");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Counting Number</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Smooth animated counter that counts from a start value to a target with easing.
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
            <CountingNumber
              key={previewKey}
              target={target}
              start={start}
              duration={duration}
              decimals={decimals}
              prefix={prefix}
              suffix={suffix}
              fontSize={fontSize}
              color={color}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(target, start, duration, decimals, prefix, suffix, fontSize, color)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Target Number</Label>
              <Input type="number" value={target} onChange={(e) => { setTarget(Number(e.target.value)); resetPreview(); }} className="bg-background font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Start Number</Label>
              <Input type="number" value={start} onChange={(e) => { setStart(Number(e.target.value)); resetPreview(); }} className="bg-background font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Duration <span className="text-primary ml-1">{(duration / 1000).toFixed(1)}s</span></Label>
              <Slider value={[duration]} onValueChange={([v]) => { setDuration(v); resetPreview(); }} min={500} max={5000} step={250} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Decimal Places <span className="text-primary ml-1">{decimals}</span></Label>
              <Slider value={[decimals]} onValueChange={([v]) => { setDecimals(v); resetPreview(); }} min={0} max={3} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={16} max={72} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Prefix</Label>
              <Input value={prefix} onChange={(e) => { setPrefix(e.target.value); resetPreview(); }} placeholder='e.g. $' className="bg-background font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Suffix</Label>
              <Input value={suffix} onChange={(e) => { setSuffix(e.target.value); resetPreview(); }} placeholder='e.g. %, +' className="bg-background font-mono text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountingNumberPage;
