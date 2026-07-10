import { useState } from "react";
import SparklesText2 from "@/components/animations/SparklesText2";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (text: string, colors: string[], fontSize: number, density: number, speed: number) =>
  `import { useState, useEffect, useRef, useCallback } from "react";

interface GlitterDot {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface SparklesText2Props {
  text?: string;
  colors?: string[];
  fontSize?: number;
  density?: number;
  speed?: number;
}

const SparklesText2 = ({
  text = "${text}",
  colors = ["#fbbf24", "#f472b6", "#60a5fa"],
  fontSize = ${fontSize},
  density = ${density},
  speed = ${speed},
}: SparklesText2Props) => {
  const [dots, setDots] = useState<GlitterDot[]>([]);
  const counter = useRef(0);
  const colorIdx = useRef(0);

  const createDot = useCallback((): GlitterDot => {
    const color = colors[colorIdx.current % colors.length];
    colorIdx.current++;
    return {
      id: counter.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 2,
      color,
    };
  }, [colors]);

  useEffect(() => {
    const interval = setInterval(() => {
      const batch = Array.from({ length: Math.ceil(density / 5) }, () => createDot());
      setDots((prev) => {
        const trimmed = prev.length > density * 4 ? prev.slice(-density * 2) : prev;
        return [...trimmed, ...batch];
      });
    }, speed / density * 3);
    return () => clearInterval(interval);
  }, [createDot, density, speed]);

  const gradientStyle = \`linear-gradient(135deg, \${colors[0] || "#fbbf24"}, \${colors[1] || "#f472b6"}, \${colors[2] || "#60a5fa"})\`;

  return (
    <span
      className="relative inline-block font-bold font-['Space_Grotesk',sans-serif]"
      style={{ fontSize }}
    >
      <span className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
        {dots.map((d) => (
          <span
            key={d.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: \`\${d.x}%\`,
              top: \`\${d.y}%\`,
              width: d.size,
              height: d.size,
              backgroundColor: d.color,
              animation: \`glitter-flash ${speed}ms ease-in-out forwards\`,
            }}
          />
        ))}
      </span>

      <span className="invisible">{text}</span>
      
      <span
        className="absolute inset-0 flex items-center justify-center z-[1] bg-clip-text"
        style={{
          background: gradientStyle,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {text}
      </span>
    </span>
  );
};
// Usage:
// <SparklesText2 text="${text}" fontSize={${fontSize}} />`;


const SparklesText2Page = () => {
  const [text, setText] = useState("Glitter");
  const [color1, setColor1] = useState("#fbbf24");
  const [color2, setColor2] = useState("#f472b6");
  const [color3, setColor3] = useState("#60a5fa");
  const [fontSize, setFontSize] = useState(48);
  const [density, setDensity] = useState(15);
  const [speed, setSpeed] = useState(500);
  const [view, setView] = useState<"preview" | "code">("preview");

  const colors = [color1, color2, color3];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Text Animations</p>
        <h1 className="text-2xl font-bold text-foreground">Sparkles Text 2</h1>
        <p className="text-sm text-muted-foreground mt-1">Inline glitter effect with multi-color sparkle dots pulsing on gradient text.</p>
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
            <SparklesText2 text={text} colors={colors} fontSize={fontSize} density={density} speed={speed} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, colors, fontSize, density, speed)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Colors</Label>
              <div className="flex gap-2">
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" />
                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" />
                <input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={24} max={120} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Density <span className="text-primary ml-1">{density}</span></Label>
              <Slider value={[density]} onValueChange={([v]) => setDensity(v)} min={5} max={40} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}ms</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={200} max={1200} step={50} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparklesText2Page;
