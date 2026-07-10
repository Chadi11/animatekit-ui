import { useState } from "react";
import RippleWaveButton from "@/components/animations/RippleWaveButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, bgColor: string, rippleColor: string) =>
  `import { useState } from "react";
import { Waves } from "lucide-react";

interface RippleWaveButtonProps {
  label?: string;
  bgColor?: string;
  rippleColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const RippleWaveButton = ({
  label = "${label}",
  bgColor = "${bgColor}",
  rippleColor = "${rippleColor}",
  textColor = "#F5EBDC",
  onClick,
  className = "",
}: RippleWaveButtonProps) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    onClick?.();
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <div className={\`relative inline-flex \${className}\`}>
      <button
        onClick={createRipple}
        className="relative px-10 py-4 rounded-[14px] font-bold text-base border-none cursor-pointer outline-none select-none overflow-hidden shadow-lg"
        style={{ color: textColor, backgroundColor: bgColor }}
      >
        <span className="flex items-center gap-2 relative z-[1]">
          <Waves className="w-5 h-5" />
          {label}
        </span>

        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute w-0 h-0 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: rippleColor,
              opacity: 0.4,
              animation: "rippleWaveExpand 1s ease-out forwards",
            }}
          />
        ))}
      </button>

      <style>{\`
        @keyframes rippleWaveExpand {
          0% { width: 0; height: 0; opacity: 0.5; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
      \`}</style>
    </div>
  );
};

export default RippleWaveButton;

// Usage:
// <RippleWaveButton label="${label}" bgColor="${bgColor}" rippleColor="${rippleColor}" />`;

const propsData = [
  { name: "label", type: "string", default: '"Click Wave"', description: "Button text" },
  { name: "bgColor", type: "string", default: '"#D62700"', description: "Background color" },
  { name: "rippleColor", type: "string", default: '"#F5EBDC"', description: "Color of the ripple circles" },
  { name: "textColor", type: "string", default: '"#F5EBDC"', description: "Text color" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const RippleWaveButtonPage = () => {
  const [label, setLabel] = useState("Click Wave");
  const [bgColor, setBgColor] = useState("#D62700");
  const [rippleColor, setRippleColor] = useState("#F5EBDC");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Ripple Wave</h1>
        <p className="text-sm text-muted-foreground mt-1">A button that spawns expanding ripple circles from the click position.</p>
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
            <RippleWaveButton label={label} bgColor={bgColor} rippleColor={rippleColor} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, bgColor, rippleColor)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Ripple Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={rippleColor} onChange={(e) => setRippleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={rippleColor} onChange={(e) => setRippleColor(e.target.value)} className="h-8 text-xs flex-1" />
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

export default RippleWaveButtonPage;
