import { useState } from "react";
import TextFlipButton from "@/components/animations/TextFlipButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, size: string, bgColor: string, flipColor: string, textColor: string, direction: string) =>
  `import { useState } from "react";

interface TextFlipButtonProps {
  label?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  bgColor?: string;
  flipColor?: string;
  textColor?: string;
  direction?: "x" | "y";
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const TextFlipButton = ({
  label = "${label}",
  onClick,
  size = "${size}",
  bgColor = "${bgColor}",
  flipColor = "${flipColor}",
  textColor = "${textColor}",
  direction = "${direction}",
}: TextFlipButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const s = SIZES[size];

  const handleClick = () => {
    setClicked(true);
    onClick?.();
    setTimeout(() => setClicked(false), 300);
  };

  const frontRotate = direction === "x"
    ? (hovered ? "rotateX(-90deg)" : "rotateX(0deg)")
    : (hovered ? "rotateY(90deg)"  : "rotateY(0deg)");

  const backRotate = direction === "x"
    ? (hovered ? "rotateX(0deg)"  : "rotateX(90deg)")
    : (hovered ? "rotateY(0deg)"  : "rotateY(-90deg)");

  const DURATION = "0.38s";
  const EASE     = "cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <div
      className="inline-block cursor-pointer"
      style={{ perspective: 600 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <div className="relative w-full h-full" style={{
        transform: clicked ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.15s ease",
      }}>
        <div className="relative inline-block">
          {/* FRONT FACE */}
          <div
            className="flex items-center justify-center font-semibold select-none border border-white/10 [backface-visibility:hidden]"
            style={{
              padding: \`\${s.paddingY}px \${s.paddingX}px\`,
              borderRadius: s.borderRadius,
              background: bgColor,
              fontSize: s.fontSize, color: textColor,
              letterSpacing: "0.3px",
              transform: frontRotate,
              transformOrigin: direction === "x" ? "center bottom" : "right center",
              transition: \`transform \${DURATION} \${EASE}\`,
              position: "relative",
              zIndex: hovered ? 0 : 1,
            }}
          >
            {label}
          </div>
          {/* BACK FACE */}
          <div
            className="flex items-center justify-center font-semibold select-none border border-white/[0.08] [backface-visibility:hidden] absolute inset-0"
            style={{
              padding: \`\${s.paddingY}px \${s.paddingX}px\`,
              borderRadius: s.borderRadius,
              background: flipColor,
              fontSize: s.fontSize, color: textColor,
              letterSpacing: "0.3px",
              transform: backRotate,
              transformOrigin: direction === "x" ? "center top" : "left center",
              transition: \`transform \${DURATION} \${EASE}\`,
              zIndex: hovered ? 1 : 0,
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};`;

const sizes = ["sm", "md", "lg"] as const;

const propsData = [
  { name: "label", type: "string", default: '"Click Me"', description: "Button text" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "bgColor", type: "string", default: '"#0a0a0a"', description: "Front face background color" },
  { name: "flipColor", type: "string", default: '"#c2410c"', description: "Back face background color" },
  { name: "textColor", type: "string", default: '"#ffffff"', description: "Text color on both faces" },
  { name: "direction", type: '"x" | "y"', default: '"x"', description: "Flip direction: x = vertical, y = horizontal" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const TextFlipButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [flipColor, setFlipColor] = useState("#c2410c");
  const [textColor, setTextColor] = useState("#ffffff");
  const [direction, setDirection] = useState<"x" | "y">("x");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Text Flip Button</h1>
        <p className="text-sm text-muted-foreground mt-1">A 3D flip button revealing a colored back face on hover.</p>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame><TextFlipButton label={label} size={size} bgColor={bgColor} flipColor={flipColor} textColor={textColor} direction={direction} /></PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, size, bgColor, flipColor, textColor, direction)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Size</Label>
              <ToggleGroup type="single" value={size} onValueChange={(v) => v && setSize(v as typeof size)} className="justify-start">
                {sizes.map((s) => (<ToggleGroupItem key={s} value={s} className="uppercase text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{s}</ToggleGroupItem>))}
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Direction</Label>
              <ToggleGroup type="single" value={direction} onValueChange={(v) => v && setDirection(v as "x" | "y")} className="justify-start">
                <ToggleGroupItem value="x" className="text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Vertical</ToggleGroupItem>
                <ToggleGroupItem value="y" className="text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Horizontal</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Flip Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={flipColor} onChange={(e) => setFlipColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={flipColor} onChange={(e) => setFlipColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-8"><PropsTable props={propsData} /></div>
    </div>
  );
};

export default TextFlipButtonPage;