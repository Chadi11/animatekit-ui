import { useState } from "react";
import SparklesText3 from "@/components/animations/SparklesText3";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  text: string,
  sparkleColor: string,
  sparkleCount: number,
  fontSize: number,
  speed: number,
  minSize: number,
  maxSize: number
) =>
  `import { useState, useEffect, useRef, useCallback } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
}

interface SparklesText3Props {
  text?: string;
  sparkleColor?: string;
  sparkleCount?: number;
  fontSize?: number;
  textColor?: string;
  speed?: number;
  minSize?: number;
  maxSize?: number;
}

const SparklesText3 = ({
  text = "${text}",
  sparkleColor = "${sparkleColor}",
  sparkleCount = ${sparkleCount},
  fontSize = ${fontSize},
  textColor = "currentColor",
  speed = ${speed},
  minSize = ${minSize},
  maxSize = ${maxSize},
}: SparklesText3Props) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const counter = useRef(0);

  const createSparkle = useCallback((): Sparkle => {
    return {
      id: counter.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (maxSize - minSize) + minSize,
      rotation: Math.random() * 360,
      color: sparkleColor,
    };
  }, [sparkleColor, minSize, maxSize]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSparkle = createSparkle();
      setSparkles((prev) => {
        const filtered = prev.length >= sparkleCount * 2 ? prev.slice(-sparkleCount) : prev;
        return [...filtered, newSparkle];
      });
    }, speed / sparkleCount);
    return () => clearInterval(interval);
  }, [createSparkle, sparkleCount, speed]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setSparkles((prev) => (prev.length > sparkleCount * 3 ? prev.slice(-sparkleCount * 2) : prev));
    }, speed * 2);
    return () => clearInterval(cleanup);
  }, [sparkleCount, speed]);

  return (
    <span
      className="relative inline-block font-bold font-['Space_Grotesk',sans-serif]"
      style={{ fontSize, color: textColor }}
    >
      <span className="absolute -inset-[30%] pointer-events-none z-[2] overflow-visible">
        {sparkles.map((s) => (
          <svg
            key={s.id}
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill={s.color}
            className="absolute pointer-events-none drop-shadow-[0_0_4px_currentColor]"
            style={{
              left: \`\${s.x}%\`,
              top: \`\${s.y}%\`,
              transform: \`rotate(\${s.rotation}deg)\`,
              animation: \`sparkle-pop ${speed}ms ease-in-out forwards\`,
            }}
          >
            <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
          </svg>
        ))}
      </span>
      <span className="relative z-[1]">{text}</span>
    </span>
  );
};
// Usage:
// <SparklesText3 text="${text}" sparkleColor="${sparkleColor}" fontSize={${fontSize}} />`;


const SparklesText3Page = () => {
  const [text, setText] = useState("Big Sparkles");
  const [sparkleColor, setSparkleColor] = useState("#fbbf24");
  const [sparkleCount, setSparkleCount] = useState(8);
  const [fontSize, setFontSize] = useState(48);
  const [speed, setSpeed] = useState(900);
  const [minSize, setMinSize] = useState(12);
  const [maxSize, setMaxSize] = useState(28);
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Text Animations</p>
        <h1 className="text-2xl font-bold text-foreground">Sparkles Text 3</h1>
        <p className="text-sm text-muted-foreground mt-1">Large star sparkles variant with dramatic, eye-catching particle effects.</p>
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
            <SparklesText3
              text={text}
              sparkleColor={sparkleColor}
              sparkleCount={sparkleCount}
              fontSize={fontSize}
              speed={speed}
              minSize={minSize}
              maxSize={maxSize}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, sparkleColor, sparkleCount, fontSize, speed, minSize, maxSize)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Content</Label>
              <Input value={text} onChange={(e) => setText(e.target.value)} className="bg-background font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Sparkle Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={sparkleColor} onChange={(e) => setSparkleColor(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" />
                <Input value={sparkleColor} onChange={(e) => setSparkleColor(e.target.value)} className="bg-background font-mono text-sm flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Sparkle Count <span className="text-primary ml-1">{sparkleCount}</span></Label>
              <Slider value={[sparkleCount]} onValueChange={([v]) => setSparkleCount(v)} min={3} max={20} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={24} max={120} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}ms</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={400} max={1500} step={50} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Min Size <span className="text-primary ml-1">{minSize}px</span></Label>
              <Slider value={[minSize]} onValueChange={([v]) => setMinSize(v)} min={8} max={20} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Max Size <span className="text-primary ml-1">{maxSize}px</span></Label>
              <Slider value={[maxSize]} onValueChange={([v]) => setMaxSize(v)} min={20} max={50} step={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparklesText3Page;
