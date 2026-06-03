import { useState } from "react";
import FlipButton from "@/components/animations/FlipButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (frontLabel: string, backLabel: string, frontColor: string, backColor: string) =>
  `import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface FlipButtonProps {
  frontLabel?: string;
  backLabel?: string;
  frontColor?: string;
  backColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const FlipButton = ({
  frontLabel = "${frontLabel}",
  backLabel = "${backLabel}",
  frontColor = "${frontColor}",
  backColor = "${backColor}",
  textColor = "#F5EBDC",
  onClick,
  className = "",
}: FlipButtonProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    onClick?.();
  };

  return (
    <div
      className={\`relative inline-block \${className}\`}
      style={{ perspective: 1000, width: 200, height: 60 }}
    >
      <button
        onClick={handleClick}
        className="absolute w-full h-full border-none bg-transparent cursor-pointer outline-none [transform-style:preserve-3d]"
        style={{
          transition: "transform 0.6s ease",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full flex items-center justify-center rounded-xl font-bold text-base shadow-lg [backface-visibility:hidden]"
          style={{ backgroundColor: frontColor, color: textColor }}
        >
          <span className="flex items-center gap-2">
            {frontLabel}
            <ArrowRight className="w-5 h-5" />
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full flex items-center justify-center rounded-xl font-bold text-base shadow-lg [backface-visibility:hidden]"
          style={{
            backgroundColor: backColor,
            color: textColor,
            transform: "rotateY(180deg)",
          }}
        >
          <span className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            {backLabel}
          </span>
        </div>
      </button>
    </div>
  );
};

export default FlipButton;

// Usage:
// <FlipButton frontLabel="${frontLabel}" backLabel="${backLabel}" frontColor="${frontColor}" backColor="${backColor}" />`;

const propsData = [
  { name: "frontLabel", type: "string", default: '"Submit"', description: "Text on the front face" },
  { name: "backLabel", type: "string", default: '"Success!"', description: "Text on the back face" },
  { name: "frontColor", type: "string", default: '"#D62700"', description: "Front face background color" },
  { name: "backColor", type: "string", default: '"#FF8733"', description: "Back face background color" },
  { name: "textColor", type: "string", default: '"#F5EBDC"', description: "Text color for both faces" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const FlipButtonPage = () => {
  const [frontLabel, setFrontLabel] = useState("Submit");
  const [backLabel, setBackLabel] = useState("Success!");
  const [frontColor, setFrontColor] = useState("#D62700");
  const [backColor, setBackColor] = useState("#FF8733");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Flip Button</h1>
        <p className="text-sm text-muted-foreground mt-1">A 3D flip button that reveals a success state on the back face.</p>
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
            <FlipButton frontLabel={frontLabel} backLabel={backLabel} frontColor={frontColor} backColor={backColor} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(frontLabel, backLabel, frontColor, backColor)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Front Label</Label>
              <Input value={frontLabel} onChange={(e) => setFrontLabel(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Back Label</Label>
              <Input value={backLabel} onChange={(e) => setBackLabel(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Front Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={frontColor} onChange={(e) => setFrontColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={frontColor} onChange={(e) => setFrontColor(e.target.value)} className="h-8 text-xs flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Back Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={backColor} onChange={(e) => setBackColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={backColor} onChange={(e) => setBackColor(e.target.value)} className="h-8 text-xs flex-1" />
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

export default FlipButtonPage;
