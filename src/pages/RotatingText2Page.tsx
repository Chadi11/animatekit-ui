import { useState } from "react";
import RotatingText2 from "@/components/animations/RotatingText2";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
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

interface RotatingText2Props {
  texts: string[];
  interval?: number;
  duration?: number;
  fontSize?: number;
  color?: string;
  className?: string;
}

const RotatingText2 = ({
  texts,
  interval = ${interval},
  duration = ${duration},
  fontSize = ${fontSize},
  color = "${color}",
  className = "",
}: RotatingText2Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b), "");

  const rotate = useCallback(() => {
    setPhase("exit");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setPhase("enter");
      setTimeout(() => {
        setPhase("idle");
      }, duration * 1000);
    }, duration * 1000);
  }, [duration, texts.length]);

  useEffect(() => {
    if (texts.length < 2) return;
    timerRef.current = setInterval(rotate, interval);
    return () => clearInterval(timerRef.current);
  }, [rotate, interval, texts.length]);

  const getTransform = () => {
    if (phase === "exit") return "translateY(-100%)";
    if (phase === "enter") return "translateY(0%)";
    return "translateY(0%)";
  };

  return (
    <span
      className={\`relative inline-flex overflow-hidden font-bold \${className}\`}
      style={{
        fontSize,
        color,
        height: \`\${fontSize * 1.3}px\`,
        lineHeight: \`\${fontSize * 1.3}px\`,
      }}
    >
      {/* Invisible sizer — determines container width */}
      <span className="invisible whitespace-nowrap">{longestText}</span>

      {/* Visible text — absolute so it doesn't affect width */}
      <span
        className="absolute left-0 top-0 inline-block whitespace-nowrap"
        style={{
          transition: phase !== "idle"
            ? \`transform \${duration}s cubic-bezier(0.4, 0, 0.2, 1), opacity \${duration}s ease\`
            : "none",
          transform: getTransform(),
          opacity: phase === "exit" ? 0 : 1,
        }}
      >
        {texts[currentIndex]}
      </span>
    </span>
  );
};

// Usage:
// <RotatingText2 texts={${JSON.stringify(texts)}} interval={${interval}} duration={${duration}} />`;

const propsData = [
  { name: "texts", type: "string[]", default: "[]", description: "Array of strings to rotate through" },
  { name: "interval", type: "number", default: "2500", description: "Time between rotations in ms" },
  { name: "duration", type: "number", default: "0.5", description: "Transition duration in seconds" },
  { name: "fontSize", type: "number", default: "42", description: "Font size in pixels" },
  { name: "color", type: "string", default: '"#f97316"', description: "Text color" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const RotatingText2Page = () => {
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
        <h1 className="text-2xl font-bold text-foreground">Rotating Text 2</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A clean vertical rotation where each word slides out upward and the next slides in from below.
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
              <span className="text-muted-foreground font-bold" style={{ fontSize }}>
                We are
              </span>
              <RotatingText2
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

      <div className="px-4 sm:px-6 md:px-8 pb-6">
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
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="h-8 text-xs font-mono flex-1" />
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

export default RotatingText2Page;
