import { useState } from "react";
import Loader2 from "@/components/animations/Loader2";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  barCount: number,
  color: string,
  height: number,
  width: number,
  gap: number,
  speed: number,
  rounded: boolean,
) =>
  `import { useId } from "react";

interface Loader2Props {
  barCount?: number;
  color?: string;
  height?: number;
  width?: number;
  gap?: number;
  speed?: number;
  rounded?: boolean;
  className?: string;
}

const Loader2 = ({
  barCount = ${barCount},
  color = "${color}",
  height = ${height},
  width = ${width},
  gap = ${gap},
  speed = ${speed},
  rounded = ${rounded},
  className = "",
}: Loader2Props) => {
  const uid = useId().replace(/:/g, "");
  const barClass = \`ak-loader2-\${uid}\`;

  return (
    <div
      className={\`inline-flex items-center \${className}\`}
      style={{ gap, height }}
      role="status"
      aria-label="Loading"
    >
      <style>{\`
        @keyframes \${barClass}-pulse {
          0%, 100% { transform: scaleY(0.3); }
          50%      { transform: scaleY(1); }
        }
        .\${barClass} {
          animation: \${barClass}-pulse \${speed}s ease-in-out infinite;
          transform-origin: center;
        }
      \`}</style>
      {[...Array(barCount)].map((_, i) => (
        <div
          key={i}
          className={barClass}
          style={{
            width,
            height: "100%",
            background: color,
            borderRadius: rounded ? 9999 : 2,
            animationDelay: \`\${(i / barCount) * speed * 0.6}s\`,
          }}
        />
      ))}
    </div>
  );
};

export default Loader2;`;

const propsData = [
  { name: "barCount", type: "number", default: "5", description: "Number of vertical bars" },
  { name: "color", type: "string", default: '"#f97316"', description: "Bar color (any CSS color)" },
  { name: "height", type: "number", default: "40", description: "Height of the loader in pixels" },
  { name: "width", type: "number", default: "6", description: "Width of each bar in pixels" },
  { name: "gap", type: "number", default: "4", description: "Spacing between bars in pixels" },
  { name: "speed", type: "number", default: "1", description: "Pulse cycle duration in seconds" },
  { name: "rounded", type: "boolean", default: "true", description: "Pill-shaped vs square bar ends" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes" },
];

const Loader2Page = () => {
  const [barCount, setBarCount] = useState(5);
  const [color, setColor] = useState("#f97316");
  const [height, setHeight] = useState(40);
  const [width, setWidth] = useState(6);
  const [gap, setGap] = useState(4);
  const [speed, setSpeed] = useState(1);
  const [rounded, setRounded] = useState(true);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [loaderKey, setLoaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Loaders</p>
        <h1 className="text-2xl font-bold text-foreground">Loader 2 — Pulse Bars</h1>
        <p className="text-sm text-muted-foreground mt-1">Equalizer-style bars that pulse in a wave. Perfect for processing, audio, or live data states.</p>
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
            <Loader2 key={loaderKey} barCount={barCount} color={color} height={height} width={width} gap={gap} speed={speed} rounded={rounded} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(barCount, color, height, width, gap, speed, rounded)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Bar Count <span className="text-primary ml-1">{barCount}</span></Label>
              <Slider value={[barCount]} onValueChange={([v]) => setBarCount(v)} min={3} max={8} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Height <span className="text-primary ml-1">{height}px</span></Label>
              <Slider value={[height]} onValueChange={([v]) => setHeight(v)} min={16} max={80} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Bar Width <span className="text-primary ml-1">{width}px</span></Label>
              <Slider value={[width]} onValueChange={([v]) => setWidth(v)} min={3} max={14} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Gap <span className="text-primary ml-1">{gap}px</span></Label>
              <Slider value={[gap]} onValueChange={([v]) => setGap(v)} min={2} max={12} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}s</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={0.4} max={2} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Rounded Ends</Label>
              <div className="flex items-center gap-3 h-8">
                <Switch checked={rounded} onCheckedChange={setRounded} />
                <span className="text-xs text-muted-foreground">{rounded ? "Pill" : "Square"}</span>
              </div>
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

export default Loader2Page;
