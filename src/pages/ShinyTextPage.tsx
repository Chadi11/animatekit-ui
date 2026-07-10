import { useState } from "react";
import ShinyText from "@/components/animations/ShinyText";
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
  shineColor: string,
  baseColor: string,
  shineWidth: number,
  fontSize: number
) => `import { useMemo } from "react";

interface ShinyTextProps {
  text: string;
  speed?: number;
  shineColor?: string;
  baseColor?: string;
  shineWidth?: number;
  fontSize?: number;
}

const ShinyText = ({
  text,
  speed = ${speed},
  shineColor = "${shineColor}",
  baseColor = "${baseColor}",
  shineWidth = ${shineWidth},
  fontSize = ${fontSize},
}: ShinyTextProps) => {
  const gradient = useMemo(
    () =>
      \`linear-gradient(90deg, ${baseColor} 0%, ${baseColor} \${50 - shineWidth / 2}%, ${shineColor} 50%, ${baseColor} \${50 + shineWidth / 2}%, ${baseColor} 100%)\`,
    [baseColor, shineColor, shineWidth]
  );

  return (
    <span
      className="inline-block font-bold font-['Space_Grotesk',sans-serif] bg-clip-text"
      style={{
        fontSize,
        background: gradient,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: \`shine-sweep ${speed}s linear infinite\`,
      }}
    >
      {text}
    </span>
  );
};
// Usage:
// <ShinyText text="${text}" speed={${speed}} shineColor="${shineColor}" />`;


const ShinyTextPage = () => {
  const [text, setText] = useState("Shiny Text Effect");
  const [speed, setSpeed] = useState(3);
  const [shineColor, setShineColor] = useState("#f97316");
  const [baseColor, setBaseColor] = useState("#e2e8f0");
  const [shineWidth, setShineWidth] = useState(80);
  const [fontSize, setFontSize] = useState(32);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Shiny Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A glossy highlight that sweeps across text like a light reflection.
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
            <ShinyText
              key={previewKey}
              text={text}
              speed={speed}
              shineColor={shineColor}
              baseColor={baseColor}
              shineWidth={shineWidth}
              fontSize={fontSize}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, speed, shineColor, baseColor, shineWidth, fontSize)} language="React / TypeScript" />
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
              <Slider value={[speed]} onValueChange={([v]) => { setSpeed(v); resetPreview(); }} min={1} max={6} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={16} max={64} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Shine Width <span className="text-primary ml-1">{shineWidth}%</span></Label>
              <Slider value={[shineWidth]} onValueChange={([v]) => { setShineWidth(v); resetPreview(); }} min={10} max={100} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Shine Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={shineColor} onChange={(e) => { setShineColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{shineColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Base Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={baseColor} onChange={(e) => { setBaseColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{baseColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShinyTextPage;
