import { useState } from "react";
import MagneticButton from "@/components/animations/MagneticButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, bgColor: string, textColor: string, strength: number) =>
  `import { useState } from "react";
import { Rocket } from "lucide-react";

interface MagneticButtonProps {
  label?: string;
  bgColor?: string;
  textColor?: string;
  strength?: number;
  onClick?: () => void;
  className?: string;
}

const MagneticButton = ({
  label = "${label}",
  bgColor = "${bgColor}",
  textColor = "${textColor}",
  strength = ${strength},
  onClick,
  className = "",
}: MagneticButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <button
      className={\`relative px-10 py-4 rounded-2xl font-bold text-base border-none cursor-pointer outline-none select-none overflow-hidden \${className}\`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        color: textColor,
        backgroundColor: bgColor,
        transform: \`translate(\${position.x}px, \${position.y}px) scale(\${isHovered ? 1.05 : 1})\`,
        transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
        boxShadow: isHovered
          ? "0 10px 30px rgba(0,0,0,0.3)"
          : "0 4px 15px rgba(0,0,0,0.2)",
      }}
    >
      <span className="flex items-center gap-3 relative z-[1]">
        <Rocket
          className="w-5 h-5"
          style={{
            transition: "transform 0.3s ease",
            transform: isHovered ? "translateY(-3px) rotate(-15deg)" : "translateY(0) rotate(0deg)",
          }}
        />
        {label}
      </span>
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,135,51,0.4), transparent)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </button>
  );
};

export default MagneticButton;

// Usage:
// <MagneticButton label="${label}" bgColor="${bgColor}" textColor="${textColor}" strength={${strength}} />`;

const propsData = [
  { name: "label", type: "string", default: '"Launch Now"', description: "Button text" },
  { name: "bgColor", type: "string", default: '"#D62700"', description: "Background color" },
  { name: "textColor", type: "string", default: '"#FFFFFF"', description: "Text color" },
  { name: "strength", type: "number", default: "0.3", description: "Magnetic pull strength (0.1–0.5)" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const MagneticButtonPage = () => {
  const [label, setLabel] = useState("Launch Now");
  const [bgColor, setBgColor] = useState("#D62700");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [strength, setStrength] = useState(0.3);
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Magnetic Button</h1>
        <p className="text-sm text-muted-foreground mt-1">A button that follows the cursor with a magnetic pull effect and icon animation.</p>
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
            <MagneticButton label={label} bgColor={bgColor} textColor={textColor} strength={strength} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, bgColor, textColor, strength)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 text-xs flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Strength: {strength.toFixed(2)}</Label>
              <Slider value={[strength]} onValueChange={(v) => setStrength(v[0])} min={0.1} max={0.5} step={0.05} className="mt-2" />
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

export default MagneticButtonPage;
