import { useState } from "react";
import Loader1 from "@/components/animations/Loader1";
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
  size: number,
  color: string,
  dotCount: number,
  speed: number,
  trail: boolean,
) =>
  `import { useId } from "react";

interface Loader1Props {
  size?: number;
  color?: string;
  dotCount?: number;
  speed?: number;
  trail?: boolean;
  className?: string;
}

const Loader1 = ({
  size = ${size},
  color = "${color}",
  dotCount = ${dotCount},
  speed = ${speed},
  trail = ${trail},
  className = "",
}: Loader1Props) => {
  const uid = useId().replace(/:/g, "");
  const orbitClass = \`ak-loader1-\${uid}\`;
  const dotSize = Math.max(6, Math.round(size * 0.18));
  const radius = (size - dotSize) / 2;

  return (
    <div
      className={\`relative inline-block \${className}\`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <style>{\`
        @keyframes \${orbitClass}-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .\${orbitClass} {
          position: absolute;
          inset: 0;
          animation: \${orbitClass}-spin \${speed}s linear infinite;
        }
      \`}</style>
      {[...Array(dotCount)].map((_, i) => {
        const angle = (i / dotCount) * 360;
        const delay = -((i / dotCount) * speed);
        return (
          <div
            key={i}
            className={orbitClass}
            style={{ animationDelay: \`\${delay}s\` }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: dotSize,
                height: dotSize,
                marginTop: -dotSize / 2,
                marginLeft: -dotSize / 2,
                borderRadius: "9999px",
                background: color,
                transform: \`rotate(\${angle}deg) translateX(\${radius}px)\`,
                boxShadow: trail ? \`0 0 \${dotSize * 1.4}px \${color}\` : "none",
                opacity: 0.9 - i * (0.4 / Math.max(dotCount - 1, 1)),
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Loader1;`;

const propsData = [
  { name: "size", type: "number", default: "64", description: "Diameter of the loader in pixels" },
  { name: "color", type: "string", default: '"#f97316"', description: "Dot color (any CSS color)" },
  { name: "dotCount", type: "number", default: "3", description: "Number of orbiting dots" },
  { name: "speed", type: "number", default: "1.4", description: "Full rotation duration in seconds" },
  { name: "trail", type: "boolean", default: "true", description: "Soft glow halo around each dot" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes" },
];

const Loader1Page = () => {
  const [size, setSize] = useState(64);
  const [color, setColor] = useState("#f97316");
  const [dotCount, setDotCount] = useState(3);
  const [speed, setSpeed] = useState(1.4);
  const [trail, setTrail] = useState(true);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [loaderKey, setLoaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Loaders</p>
        <h1 className="text-2xl font-bold text-foreground">Loader 1 — Orbit Dots</h1>
        <p className="text-sm text-muted-foreground mt-1">Inline circular spinner with orbiting dots and optional glow trail. Pure CSS, infinitely smooth.</p>
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
            <Loader1 key={loaderKey} size={size} color={color} dotCount={dotCount} speed={speed} trail={trail} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(size, color, dotCount, speed, trail)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size <span className="text-primary ml-1">{size}px</span></Label>
              <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={24} max={128} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Dot Count <span className="text-primary ml-1">{dotCount}</span></Label>
              <Slider value={[dotCount]} onValueChange={([v]) => setDotCount(v)} min={2} max={6} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}s</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={0.6} max={3} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Glow Trail</Label>
              <div className="flex items-center gap-3 h-8">
                <Switch checked={trail} onCheckedChange={setTrail} />
                <span className="text-xs text-muted-foreground">{trail ? "On" : "Off"}</span>
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

export default Loader1Page;
