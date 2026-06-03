import { useState } from "react";
import Loader3D from "@/components/animations/Loader3D";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (color: string, shadowColor: string, size: number, speed: number) =>
  `import { useId } from "react";

interface Loader3DProps {
  color?: string;
  shadowColor?: string;
  size?: number;
  speed?: number;
  className?: string;
}

const Loader3D = ({
  color = "${color}",
  shadowColor = "${shadowColor}",
  size = ${size},
  speed = ${speed},
  className = "",
}: Loader3DProps) => {
  const uid = useId().replace(/:/g, "");
  const cls = \`ak-loader3d-\${uid}\`;
  const orbs = [0, 1, 2];
  const gap = size * 0.7;

  return (
    <div
      className={\`inline-flex items-end \${className}\`}
      role="status"
      aria-label="Loading"
      style={{ gap, height: size * 2.6 }}
    >
      <style>{\`
        @keyframes \${cls}-bounce {
          0%, 100% {
            transform: translateY(0px);
            animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0);
          }
          50% {
            transform: translateY(-\${size * 1.4}px);
            animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
          }
        }
        @keyframes \${cls}-shadow {
          0%, 100% { transform: scaleX(1); opacity: 0.35; }
          50%      { transform: scaleX(0.4); opacity: 0.1; }
        }
        .\${cls}-orb    { animation: \${cls}-bounce \${speed}s ease-in-out infinite; }
        .\${cls}-shadow { animation: \${cls}-shadow \${speed}s ease-in-out infinite; }
      \`}</style>

      {orbs.map((i) => {
        const delay = \`\${i * speed * 0.15}s\`;
        return (
          <div key={i} className="flex flex-col items-center justify-end" style={{ height: "100%" }}>
            <div
              className={\`\${cls}-orb\`}
              style={{
                width: size,
                height: size,
                borderRadius: "9999px",
                background: \`radial-gradient(circle at 30% 30%, #ffffff, \${color} 60%, \${color})\`,
                boxShadow: \`inset -\${size * 0.1}px -\${size * 0.1}px \${size * 0.2}px rgba(0,0,0,0.2)\`,
                animationDelay: delay,
              }}
            />
            <div
              className={\`\${cls}-shadow\`}
              style={{
                width: size * 1.1,
                height: size * 0.18,
                marginTop: size * 0.15,
                borderRadius: "9999px",
                background: shadowColor,
                filter: "blur(2px)",
                animationDelay: delay,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Loader3D;`;

const propsData = [
  { name: "color", type: "string", default: '"#ffffff"', description: "Orb color (hex)" },
  { name: "shadowColor", type: "string", default: '"#000000"', description: "Ground shadow color" },
  { name: "size", type: "number", default: "20", description: "Orb diameter in pixels" },
  { name: "speed", type: "number", default: "1.2", description: "Bounce cycle in seconds" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes" },
];

const Loader3DPage = () => {
  const [color, setColor] = useState("#f97316");
  const [shadowColor, setShadowColor] = useState("#000000");
  const [size, setSize] = useState(20);
  const [speed, setSpeed] = useState(1.2);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [loaderKey, setLoaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Loaders</p>
        <h1 className="text-2xl font-bold text-foreground">Loader 3D — Bouncing Orbs</h1>
        <p className="text-sm text-muted-foreground mt-1">Three glossy orbs that bounce in sequence with squashing shadows. A playful 3D-feeling loader.</p>
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
            <Loader3D key={loaderKey} color={color} shadowColor={shadowColor} size={size} speed={speed} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(color, shadowColor, size, speed)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Orb Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Shadow Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size <span className="text-primary ml-1">{size}px</span></Label>
              <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={10} max={48} step={1} />
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

export default Loader3DPage;
