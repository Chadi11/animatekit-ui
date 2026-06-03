import { useState } from "react";
import BouncePopButton from "@/components/animations/BouncePopButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, likedLabel: string, bgColor: string, activeColor: string) =>
  `import { useState } from "react";
import { Heart } from "lucide-react";

interface BouncePopButtonProps {
  label?: string;
  likedLabel?: string;
  bgColor?: string;
  activeColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

const BouncePopButton = ({
  label = "${label}",
  likedLabel = "${likedLabel}",
  bgColor = "${bgColor}",
  activeColor = "${activeColor}",
  textColor = "#F5EBDC",
  onClick,
  className = "",
}: BouncePopButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setLiked(!liked);
    onClick?.();
    setTimeout(() => setIsPressed(false), 300);
  };

  return (
    <div className={\`relative inline-flex \${className}\`}>
      <button
        onClick={handleClick}
        className="relative px-10 py-4 rounded-2xl font-bold text-base border-none cursor-pointer outline-none select-none overflow-visible shadow-lg"
        style={{
          color: textColor,
          backgroundColor: liked ? activeColor : bgColor,
          transform: isPressed ? "scale(0.85)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background-color 0.3s ease",
        }}
      >
        <span className="flex items-center gap-2 relative z-[1]">
          <Heart
            className="w-5 h-5"
            style={{
              fill: liked ? textColor : "none",
              transition: "fill 0.3s ease",
            }}
          />
          {liked ? likedLabel : label}
        </span>

        {isPressed && (
          <>
            <div
              className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full pointer-events-none"
              style={{
                border: \`3px solid \${activeColor}\`,
                animation: "popOut 0.5s ease-out forwards",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-[60px] h-[60px] rounded-full pointer-events-none opacity-0"
              style={{
                border: \`2px solid \${bgColor}\`,
                animation: "popOut 0.5s ease-out 0.1s forwards",
              }}
            />
          </>
        )}
      </button>

      <style>{\`
        @keyframes popOut {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      \`}</style>
    </div>
  );
};

export default BouncePopButton;

// Usage:
// <BouncePopButton label="${label}" likedLabel="${likedLabel}" bgColor="${bgColor}" activeColor="${activeColor}" />`;

const propsData = [
  { name: "label", type: "string", default: '"Love It"', description: "Default button text" },
  { name: "likedLabel", type: "string", default: '"Loved!"', description: "Text when liked/active" },
  { name: "bgColor", type: "string", default: '"#D62700"', description: "Default background color" },
  { name: "activeColor", type: "string", default: '"#FF8733"', description: "Background when liked" },
  { name: "textColor", type: "string", default: '"#F5EBDC"', description: "Text color" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const BouncePopButtonPage = () => {
  const [label, setLabel] = useState("Love It");
  const [likedLabel, setLikedLabel] = useState("Loved!");
  const [bgColor, setBgColor] = useState("#D62700");
  const [activeColor, setActiveColor] = useState("#FF8733");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Bounce Pop</h1>
        <p className="text-sm text-muted-foreground mt-1">A bouncy button with pop circles on click that toggles a liked state.</p>
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
            <BouncePopButton label={label} likedLabel={likedLabel} bgColor={bgColor} activeColor={activeColor} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, likedLabel, bgColor, activeColor)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Liked Label</Label>
              <Input value={likedLabel} onChange={(e) => setLikedLabel(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-xs flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Active Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={activeColor} onChange={(e) => setActiveColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={activeColor} onChange={(e) => setActiveColor(e.target.value)} className="h-8 text-xs flex-1" />
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

export default BouncePopButtonPage;
