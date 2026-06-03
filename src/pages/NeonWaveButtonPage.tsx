import { useState } from "react";
import NeonWaveButton from "@/components/animations/NeonWaveButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, bgColor: string, waveColor: string) =>
  `import { Sparkles } from "lucide-react";

interface NeonWaveButtonProps {
  label?: string;
  bgColor?: string;
  waveColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const NeonWaveButton = ({
  label = "${label}",
  bgColor = "${bgColor}",
  waveColor = "${waveColor}",
  textColor = "#F5EBDC",
  onClick,
  className = "",
}: NeonWaveButtonProps) => {
  return (
    <div className={\`relative inline-flex \${className}\`}>
      <button
        onClick={onClick}
        className="relative px-10 py-4 rounded-[14px] font-bold text-base border-none cursor-pointer outline-none select-none overflow-hidden"
        style={{
          color: textColor,
          backgroundColor: bgColor,
          boxShadow: \`0 0 20px \${bgColor}66, 0 0 40px \${bgColor}33\`,
          transition: "box-shadow 0.3s ease",
        }}
      >
        <span className="flex items-center gap-2 relative z-[1]">
          <Sparkles className="w-5 h-5" />
          {label}
        </span>

        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: \`linear-gradient(90deg, transparent, \${waveColor}88, transparent)\`,
            animation: "neonWaveSweep 2s ease-in-out infinite",
          }}
        />

        <div
          className="absolute -inset-0.5 rounded-2xl pointer-events-none -z-[1]"
          style={{
            background: \`linear-gradient(90deg, transparent, \${waveColor}44, transparent)\`,
            animation: "neonWaveSweep 2s ease-in-out infinite",
            filter: "blur(8px)",
          }}
        />
      </button>

      <style>{\`
        @keyframes neonWaveSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      \`}</style>
    </div>
  );
};

export default NeonWaveButton;

// Usage:
// <NeonWaveButton label="${label}" bgColor="${bgColor}" waveColor="${waveColor}" />`;

const propsData = [
  { name: "label", type: "string", default: '"Get Started"', description: "Button text" },
  { name: "bgColor", type: "string", default: '"#D62700"', description: "Background color" },
  { name: "waveColor", type: "string", default: '"#FF8733"', description: "Color of the sweeping wave" },
  { name: "textColor", type: "string", default: '"#F5EBDC"', description: "Text color" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const NeonWaveButtonPage = () => {
  const [label, setLabel] = useState("Get Started");
  const [bgColor, setBgColor] = useState("#D62700");
  const [waveColor, setWaveColor] = useState("#FF8733");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Neon Wave</h1>
        <p className="text-sm text-muted-foreground mt-1">A button with a sweeping gradient wave and neon glow effect.</p>
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
            <NeonWaveButton label={label} bgColor={bgColor} waveColor={waveColor} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, bgColor, waveColor)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Wave Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={waveColor} onChange={(e) => setWaveColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={waveColor} onChange={(e) => setWaveColor(e.target.value)} className="h-8 text-xs flex-1" />
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

export default NeonWaveButtonPage;
