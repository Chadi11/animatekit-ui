import { useState } from "react";
import SliceRevealButton from "@/components/animations/SliceRevealButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, bgColor: string, sliceColor: string, textColor: string) =>
  `import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface SliceRevealButtonProps {
  label?: string;
  bgColor?: string;
  sliceColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const SliceRevealButton = ({
  label = "${label}",
  bgColor = "${bgColor}",
  sliceColor = "${sliceColor}",
  textColor = "${textColor}",
  onClick,
  className = "",
}: SliceRevealButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={\`relative inline-flex \${className}\`}>
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative py-5 px-12 rounded-xl font-bold text-lg border-none cursor-pointer outline-none select-none overflow-hidden"
        style={{
          color: textColor,
          backgroundColor: bgColor,
          transform: isHovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.3s ease",
        }}
      >
        <span className="flex items-center gap-3 relative z-[2]">
          {label}
          <ArrowUpRight
            className="w-5 h-5"
            style={{
              transition: "transform 0.3s ease",
              transform: isHovered ? "translate(2px, -2px)" : "translate(0, 0)",
            }}
          />
        </span>

        {/* Top slice */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 z-[1]"
          style={{
            backgroundColor: sliceColor,
            transform: isHovered ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.4s ease-out",
          }}
        />

        {/* Bottom slice */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 z-[1]"
          style={{
            backgroundColor: sliceColor,
            transform: isHovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.4s ease-out",
          }}
        />
      </button>
    </div>
  );
};

export default SliceRevealButton;

// Usage:
// <SliceRevealButton label="${label}" bgColor="${bgColor}" sliceColor="${sliceColor}" textColor="${textColor}" />`;

const propsData = [
  { name: "label", type: "string", default: '"Explore"', description: "Button text" },
  { name: "bgColor", type: "string", default: '"#000000"', description: "Base background color" },
  { name: "sliceColor", type: "string", default: '"#f97316"', description: "Hover slice reveal color" },
  { name: "textColor", type: "string", default: '"#D4E9E2"', description: "Text color" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const SliceRevealButtonPage = () => {
  const [label, setLabel] = useState("Explore");
  const [bgColor, setBgColor] = useState("#000000");
  const [sliceColor, setSliceColor] = useState("#f97316");
  const [textColor, setTextColor] = useState("#D4E9E2");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Slice Reveal</h1>
        <p className="text-sm text-muted-foreground mt-1">A button where top and bottom halves slide in on hover to reveal an accent color.</p>
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
            <SliceRevealButton label={label} bgColor={bgColor} sliceColor={sliceColor} textColor={textColor} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, bgColor, sliceColor, textColor)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Slice Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={sliceColor} onChange={(e) => setSliceColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={sliceColor} onChange={(e) => setSliceColor(e.target.value)} className="h-8 text-xs flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 text-xs flex-1" />
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

export default SliceRevealButtonPage;
