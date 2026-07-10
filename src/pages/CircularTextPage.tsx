import { useState } from "react";
import CircularText from "@/components/animations/CircularText";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  text: string,
  radius: number,
  speed: number,
  direction: string,
  color: string,
  fontSize: number
) => `import { useMemo } from "react";

interface CircularTextProps {
  text: string;
  radius?: number;
  speed?: number;
  direction?: "clockwise" | "counter-clockwise";
  color?: string;
  fontSize?: number;
}

const CircularText = ({
  text,
  radius = ${radius},
  speed = ${speed},
  direction = "${direction}",
  color = "${color}",
  fontSize = ${fontSize},
}: CircularTextProps) => {
  const chars = useMemo(() => text.split(""), [text]);
  const angleStep = 360 / chars.length;
  const size = radius * 2 + fontSize * 2;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full"
        style={{
          animation: \`spin ${speed}s linear infinite\`,
          animationDirection: direction === "counter-clockwise" ? "reverse" : "normal",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 font-['JetBrains_Mono',monospace] font-bold"
            style={{
              fontSize,
              color,
              transform: \`translate(-50%, -50%) rotate(\${angleStep * i}deg) translateY(-${radius}px)\`,
              transformOrigin: "center center",
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};
// Usage:
// <CircularText text="${text}" radius={${radius}} speed={${speed}} direction="${direction}" />`;


const CircularTextPage = () => {
  const [text, setText] = useState("CIRCULAR TEXT · SPIN · ");
  const [radius, setRadius] = useState(100);
  const [speed, setSpeed] = useState(8);
  const [direction, setDirection] = useState("clockwise");
  const [color, setColor] = useState("#f97316");
  const [fontSize, setFontSize] = useState(14);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Circular Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Text arranged in a circle that rotates continuously.
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5">
            <Eye className="h-3.5 w-3.5" /> Preview
          </ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5">
            <Code className="h-3.5 w-3.5" /> Code
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame>
            <CircularText
              key={previewKey}
              text={text}
              radius={radius}
              speed={speed}
              direction={direction as "clockwise" | "counter-clockwise"}
              color={color}
              fontSize={fontSize}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, radius, speed, direction, color, fontSize)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Content</Label>
              <Input value={text} onChange={(e) => { setText(e.target.value); resetPreview(); }} className="bg-background font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Radius <span className="text-primary ml-1">{radius}px</span></Label>
              <Slider value={[radius]} onValueChange={([v]) => { setRadius(v); resetPreview(); }} min={50} max={200} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}s</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => { setSpeed(v); resetPreview(); }} min={2} max={20} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={10} max={28} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Direction</Label>
              <ToggleGroup type="single" value={direction} onValueChange={(v) => { if (v) { setDirection(v); resetPreview(); } }} className="justify-start">
                <ToggleGroupItem value="clockwise" className="text-xs px-3 py-1">Clockwise</ToggleGroupItem>
                <ToggleGroupItem value="counter-clockwise" className="text-xs px-3 py-1">Counter-clockwise</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTextPage;
