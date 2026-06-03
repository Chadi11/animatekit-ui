import { useState } from "react";
import RotatingText from "@/components/animations/RotatingText";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  texts: string[],
  interval: number,
  duration: number,
  color: string,
  fontSize: number
) => `import { useState, useEffect, useRef, useCallback } from "react";

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  duration?: number;
  fontSize?: number;
  color?: string;
}

const RotatingText = ({
  texts,
  interval = ${interval},
  duration = ${duration},
  fontSize = ${fontSize},
  color = "${color}",
}: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const nextIndex = (currentIndex + 1) % texts.length;

  const rotate = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setDisplayIndex((prev) => (prev + 1) % texts.length);
      setIsAnimating(false);
    }, duration * 1000);
  }, [duration, texts.length]);

  useEffect(() => {
    if (texts.length < 2) return;
    timerRef.current = setInterval(rotate, interval);
    return () => clearInterval(timerRef.current);
  }, [rotate, interval, texts.length]);

  return (
    <span
      className="relative inline-flex overflow-hidden font-bold"
      style={{
        fontSize,
        color,
        fontFamily: "'Space Grotesk', sans-serif",
        height: \`\${fontSize * 1.3}px\`,
        lineHeight: \`\${fontSize * 1.3}px\`,
      }}
    >
      {/* Outgoing */}
      <span
        className="inline-block absolute left-0 top-0 w-full"
        style={{
          transition: \`transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out\`,
          transform: isAnimating ? "translateY(-100%)" : "translateY(0)",
          opacity: isAnimating ? 0 : 1,
        }}
      >
        {texts[displayIndex]}
      </span>

      {/* Incoming */}
      <span
        className="inline-block absolute left-0 top-0 w-full"
        style={{
          transition: \`transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out\`,
          transform: isAnimating ? "translateY(0)" : "translateY(100%)",
          opacity: isAnimating ? 1 : 0,
        }}
      >
        {texts[nextIndex]}
      </span>

      {/* Invisible sizer */}
      <span className="invisible whitespace-nowrap">
        {texts.reduce((a, b) => (a.length > b.length ? a : b), "")}
      </span>
    </span>
  );
};
// Usage:
// <RotatingText texts={\${JSON.stringify(texts)}} interval={${interval}} duration={${duration}} />`;


const RotatingTextPage = () => {
  const [textsRaw, setTextsRaw] = useState("Innovative\nCreative\nPowerful\nElegant");
  const [interval, setInterval_] = useState(2500);
  const [duration, setDuration] = useState(0.5);
  const [color, setColor] = useState("#f97316");
  const [fontSize, setFontSize] = useState(42);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  const texts = textsRaw.split("\n").filter((t) => t.trim());

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Rotating Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vertically rotating text that slides through an array of strings with smooth transitions.
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
            <div key={previewKey} className="flex items-center gap-3">
              <span className="text-muted-foreground font-bold" style={{ fontSize, fontFamily: "'Space Grotesk', sans-serif" }}>
                We are
              </span>
              <RotatingText
                texts={texts}
                interval={interval}
                duration={duration}
                color={color}
                fontSize={fontSize}
              />
            </div>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(texts, interval, duration, color, fontSize)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Texts (one per line)</Label>
              <Textarea value={textsRaw} onChange={(e) => { setTextsRaw(e.target.value); resetPreview(); }} className="bg-background font-mono text-sm" rows={4} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Interval <span className="text-primary ml-1">{interval}ms</span></Label>
              <Slider value={[interval]} onValueChange={([v]) => { setInterval_(v); resetPreview(); }} min={1000} max={5000} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Transition Duration <span className="text-primary ml-1">{duration}s</span></Label>
              <Slider value={[duration]} onValueChange={([v]) => { setDuration(v); resetPreview(); }} min={0.2} max={1.5} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={16} max={64} step={2} />
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

export default RotatingTextPage;
