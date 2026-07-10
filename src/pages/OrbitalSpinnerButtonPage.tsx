import { useState } from "react";
import OrbitalSpinnerButton from "@/components/animations/OrbitalSpinnerButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, bgColor: string, spinnerColor: string, duration: number) =>
  `import { useState } from "react";

interface OrbitalSpinnerButtonProps {
  label?: string;
  bgColor?: string;
  spinnerColor?: string;
  textColor?: string;
  duration?: number;
  onClick?: () => void;
  className?: string;
}

const OrbitalSpinnerButton = ({
  label = "${label}",
  bgColor = "${bgColor}",
  spinnerColor = "${spinnerColor}",
  textColor = "#F5EBDC",
  duration = ${duration},
  onClick,
  className = "",
}: OrbitalSpinnerButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (isLoading) return;
    setIsLoading(true);
    onClick?.();
    setTimeout(() => setIsLoading(false), duration);
  };

  return (
    <div className={\`relative inline-flex \${className}\`}>
      <button
        onClick={handleClick}
        className="relative px-10 py-4 rounded-[14px] font-bold text-base border-none outline-none select-none overflow-visible shadow-lg"
        style={{
          color: textColor,
          backgroundColor: bgColor,
          cursor: isLoading ? "wait" : "pointer",
          opacity: isLoading ? 0.85 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <span
          className="flex items-center gap-2 relative z-[1]"
          style={{
            opacity: isLoading ? 0.3 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {label}
        </span>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-[2]">
            <div className="relative w-10 h-10">
              <div
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: spinnerColor }}
              />
              {[0, 120, 240].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-[5px] h-[5px] rounded-full opacity-0"
                  style={{
                    backgroundColor: spinnerColor,
                    animation: "orbitalSpin 1.2s linear infinite",
                    animationDelay: \`\${i * 0.4}s\`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </button>

      <style>{\`
        @keyframes orbitalSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(16px) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(16px) rotate(-360deg); opacity: 1; }
        }
      \`}</style>
    </div>
  );
};

export default OrbitalSpinnerButton;

// Usage:
// <OrbitalSpinnerButton label="${label}" bgColor="${bgColor}" spinnerColor="${spinnerColor}" duration={${duration}} />`;

const propsData = [
  { name: "label", type: "string", default: '"Process"', description: "Button text" },
  { name: "bgColor", type: "string", default: '"#D62700"', description: "Background color" },
  { name: "spinnerColor", type: "string", default: '"#F5EBDC"', description: "Color of orbiting dots" },
  { name: "textColor", type: "string", default: '"#F5EBDC"', description: "Text color" },
  { name: "duration", type: "number", default: "3000", description: "Loading duration in ms (1000–5000)" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const OrbitalSpinnerButtonPage = () => {
  const [label, setLabel] = useState("Process");
  const [bgColor, setBgColor] = useState("#D62700");
  const [spinnerColor, setSpinnerColor] = useState("#F5EBDC");
  const [duration, setDuration] = useState(3000);
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Orbital Spinner</h1>
        <p className="text-sm text-muted-foreground mt-1">A button that shows orbiting dots as a loading spinner on click.</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame>
            <OrbitalSpinnerButton label={label} bgColor={bgColor} spinnerColor={spinnerColor} duration={duration} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, bgColor, spinnerColor, duration)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-xs flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Spinner Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={spinnerColor} onChange={(e) => setSpinnerColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={spinnerColor} onChange={(e) => setSpinnerColor(e.target.value)} className="h-8 text-xs flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Duration: {duration}ms</Label>
              <Slider value={[duration]} onValueChange={(v) => setDuration(v[0])} min={1000} max={5000} step={500} className="mt-2" />
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

export default OrbitalSpinnerButtonPage;
