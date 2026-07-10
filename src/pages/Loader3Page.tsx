import { useState } from "react";
import Loader3 from "@/components/animations/Loader3";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  size: number,
  color: string,
  trackColor: string,
  thickness: number,
  speed: number,
) =>
  `import { useId } from "react";

interface Loader3Props {
  size?: number;
  color?: string;
  trackColor?: string;
  thickness?: number;
  speed?: number;
  className?: string;
}

const Loader3 = ({
  size = ${size},
  color = "${color}",
  trackColor = "${trackColor}",
  thickness = ${thickness},
  speed = ${speed},
  className = "",
}: Loader3Props) => {
  const uid = useId().replace(/:/g, "");
  const cls = \`ak-loader3-\${uid}\`;

  return (
    <div
      className={\`inline-block \${className}\`}
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
    >
      <style>{\`
        @keyframes \${cls}-spin {
          to { transform: rotate(360deg); }
        }
        .\${cls} {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          border: \${thickness}px solid \${trackColor};
          border-top-color: \${color};
          animation: \${cls}-spin \${speed}s linear infinite;
          box-sizing: border-box;
        }
      \`}</style>
      <div className={cls} />
    </div>
  );
};

export default Loader3;`;

const propsData = [
  { name: "size", type: "number", default: "56", description: "Diameter of the spinner in pixels" },
  { name: "color", type: "string", default: '"#f97316"', description: "Active arc color" },
  { name: "trackColor", type: "string", default: '"rgba(0,0,0,0.08)"', description: "Background ring color" },
  { name: "thickness", type: "number", default: "5", description: "Ring thickness in pixels" },
  { name: "speed", type: "number", default: "0.9", description: "Full rotation duration in seconds" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes" },
];

const Loader3Page = () => {
  const [size, setSize] = useState(56);
  const [color, setColor] = useState("#f97316");
  const [trackColor, setTrackColor] = useState("rgba(0,0,0,0.08)");
  const [thickness, setThickness] = useState(5);
  const [speed, setSpeed] = useState(0.9);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [loaderKey, setLoaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Loaders</p>
        <h1 className="text-2xl font-bold text-foreground">Loader 3 — Ring Spinner</h1>
        <p className="text-sm text-muted-foreground mt-1">The classic arc spinner. Ultra-light pure CSS, perfect for buttons, forms, and async states.</p>
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
            <Loader3 key={loaderKey} size={size} color={color} trackColor={trackColor} thickness={thickness} speed={speed} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(size, color, trackColor, thickness, speed)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size <span className="text-primary ml-1">{size}px</span></Label>
              <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={24} max={120} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Thickness <span className="text-primary ml-1">{thickness}px</span></Label>
              <Slider value={[thickness]} onValueChange={([v]) => setThickness(v)} min={2} max={14} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Arc Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Track Color</Label>
              <Input value={trackColor} onChange={(e) => setTrackColor(e.target.value)} className="h-8 text-xs font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}s</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={0.4} max={2.5} step={0.1} />
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

export default Loader3Page;
