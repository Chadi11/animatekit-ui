import { useState } from "react";
import GradientText from "@/components/animations/GradientText";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  text: string,
  speed: number,
  startColor: string,
  endColor: string,
  angle: number,
  fontSize: number
) => `import { useMemo } from "react";

interface GradientTextProps {
  text: string;
  speed?: number;
  startColor?: string;
  endColor?: string;
  angle?: number;
  fontSize?: number;
}

const GradientText = ({
  text,
  speed = ${speed},
  startColor = "${startColor}",
  endColor = "${endColor}",
  angle = ${angle},
  fontSize = ${fontSize},
}: GradientTextProps) => {
  const gradient = useMemo(
    () =>
      \`linear-gradient(${angle}deg, ${startColor}, ${endColor}, ${startColor})\`,
    [angle, startColor, endColor]
  );

  return (
    <span
      className="inline-block font-bold font-['Space_Grotesk',sans-serif] bg-clip-text"
      style={{
        fontSize,
        background: gradient,
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: \`gradient-flow ${speed}s ease infinite\`,
      }}
    >
      {text}
    </span>
  );
};
// Usage:
// <GradientText text="${text}" speed={${speed}} startColor="${startColor}" endColor="${endColor}" />`;


const GradientTextPage = () => {
  const [text, setText] = useState("Gradient Text Effect");
  const [speed, setSpeed] = useState(3);
  const [startColor, setStartColor] = useState("#f97316");
  const [endColor, setEndColor] = useState("#818cf8");
  const [angle, setAngle] = useState(90);
  const [fontSize, setFontSize] = useState(42);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Gradient Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Flowing multi-color gradient that shifts across text continuously.
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
            <GradientText
              key={previewKey}
              text={text}
              speed={speed}
              startColor={startColor}
              endColor={endColor}
              angle={angle}
              fontSize={fontSize}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, speed, startColor, endColor, angle, fontSize)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}s</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => { setSpeed(v); resetPreview(); }} min={1} max={8} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={16} max={72} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Angle <span className="text-primary ml-1">{angle}°</span></Label>
              <Slider value={[angle]} onValueChange={([v]) => { setAngle(v); resetPreview(); }} min={0} max={360} step={15} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Start Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={startColor} onChange={(e) => { setStartColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{startColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">End Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={endColor} onChange={(e) => { setEndColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{endColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientTextPage;
