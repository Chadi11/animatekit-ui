import { useState } from "react";
import AnimatedCircularProgress from "@/components/animations/AnimatedCircularProgress";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  value: number,
  size: number,
  strokeWidth: number,
  color: string,
  trackColor: string,
  showValue: boolean,
  label: string,
  animationDuration: number,
  trigger: "mount" | "hover"
) => `import { useState, useEffect, useRef } from "react";

interface AnimatedCircularProgressProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showValue?: boolean;
  label?: string;
  animationDuration?: number;
  trigger?: "mount" | "hover";
}

const AnimatedCircularProgress = ({
  value = ${value},
  size = ${size},
  strokeWidth = ${strokeWidth},
  color = "${color}",
  trackColor = "${trackColor}",
  showValue = ${showValue},
  label,
  animationDuration = ${animationDuration},
  trigger = "mount",
}: AnimatedCircularProgressProps) => {
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(trigger === "mount");
  const rafRef = useRef<number>(0);

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circ = 2 * Math.PI * radius;

  const animate = () => {
    cancelAnimationFrame(rafRef.current);
    const startT = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startT) / animationDuration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(ease * value));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (started) animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, value, animate]);

  return (
    <div
      className="inline-flex flex-col items-center gap-2.5"
      onMouseEnter={() => trigger === "hover" && !started && setStarted(true)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={\`0 0 ${size} ${size}\`}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke={trackColor} strokeWidth={strokeWidth}
          />
          {displayed > 0 && (
            <circle
              cx={center} cy={center} r={radius}
              fill="none" stroke={color} strokeWidth={strokeWidth}
              strokeDasharray={\`\${(displayed / 100) * circ} \${circ}\`}
              strokeLinecap="round"
            />
          )}
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span
              className="font-bold leading-none tabular-nums"
              style={{
                fontSize: size * 0.24,
                color: "#1f2937",
                letterSpacing: "-1.5px",
              }}
            >
              {displayed}
            </span>
            {label && (
              <span
                className="uppercase mt-1"
                style={{
                  fontSize: size * 0.09,
                  color: "#9ca3af",
                  letterSpacing: "0.5px",
                }}
              >
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// Usage:
// <AnimatedCircularProgress value={${value}} size={${size}} strokeWidth={${strokeWidth}} color="${color}" trackColor="${trackColor}" showValue={${showValue}}\${label ? \` label="${label}"\` : ""} animationDuration={${animationDuration}} trigger="${trigger}" />`;


const AnimatedCircularProgressPage = () => {
  const [value, setValue] = useState(75);
  const [size, setSize] = useState(200);
  const [strokeWidth, setStrokeWidth] = useState(18);
  const [color, setColor] = useState("#4f46e5");
  const [trackColor, setTrackColor] = useState("#e5e7eb");
  const [showValue, setShowValue] = useState(true);
  const [label, setLabel] = useState("Progress");
  const [animationDuration, setAnimationDuration] = useState(1200);
  const [trigger, setTrigger] = useState<"mount" | "hover">("mount");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Circular Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Animated SVG circular progress bar with eased fill animation and optional hover trigger.
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
            <AnimatedCircularProgress
              key={previewKey}
              value={value}
              size={size}
              strokeWidth={strokeWidth}
              color={color}
              trackColor={trackColor}
              showValue={showValue}
              label={label || undefined}
              animationDuration={animationDuration}
              trigger={trigger}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(value, size, strokeWidth, color, trackColor, showValue, label, animationDuration, trigger)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Value <span className="text-primary ml-1">{value}%</span></Label>
              <Slider value={[value]} onValueChange={([v]) => { setValue(v); resetPreview(); }} min={0} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size <span className="text-primary ml-1">{size}px</span></Label>
              <Slider value={[size]} onValueChange={([v]) => { setSize(v); resetPreview(); }} min={80} max={400} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Stroke Width <span className="text-primary ml-1">{strokeWidth}px</span></Label>
              <Slider value={[strokeWidth]} onValueChange={([v]) => { setStrokeWidth(v); resetPreview(); }} min={4} max={40} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Animation Duration <span className="text-primary ml-1">{animationDuration}ms</span></Label>
              <Slider value={[animationDuration]} onValueChange={([v]) => { setAnimationDuration(v); resetPreview(); }} min={200} max={3000} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Track Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={trackColor} onChange={(e) => { setTrackColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{trackColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input value={label} onChange={(e) => { setLabel(e.target.value); resetPreview(); }} className="bg-background text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={showValue} onCheckedChange={(v) => { setShowValue(v); resetPreview(); }} />
                <Label className="text-xs text-muted-foreground">Show Value</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Trigger</Label>
              <ToggleGroup type="single" value={trigger} onValueChange={(v) => { if (v) { setTrigger(v as "mount" | "hover"); resetPreview(); } }} className="bg-secondary rounded-lg p-1 w-fit">
                <ToggleGroupItem value="mount" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-3 py-1 text-xs rounded-md">Mount</ToggleGroupItem>
                <ToggleGroupItem value="hover" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-3 py-1 text-xs rounded-md">Hover</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCircularProgressPage;
