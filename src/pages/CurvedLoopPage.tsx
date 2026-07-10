import { useState } from "react";
import CurvedLoop from "@/components/animations/CurvedLoop";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  text: string,
  speed: number,
  direction: string,
  amplitude: number,
  color: string,
  fontSize: number
) => `import { useState, useEffect, useRef } from "react";

interface CurvedLoopProps {
  text: string;
  speed?: number;
  direction?: "forward" | "reverse";
  amplitude?: number;
  color?: string;
  fontSize?: number;
}

const CurvedLoop = ({
  text,
  speed = ${speed},
  direction = "${direction}",
  amplitude = ${amplitude},
  color = "${color}",
  fontSize = ${fontSize},
}: CurvedLoopProps) => {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const pathId = useRef(\`curved-path-\${Math.random().toString(36).slice(2, 9)}\`).current;

  const width = 600;
  const height = amplitude * 2 + fontSize * 2;
  const midY = height / 2;

  // Generate a sine-wave path
  const pathD = (() => {
    const points: string[] = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = midY + Math.sin((i / segments) * Math.PI * 2) * amplitude;
      points.push(\`\${i === 0 ? "M" : "L"} \${x} \${y}\`);
    }
    return points.join(" ");
  })();

  // Duplicate text to fill the path for seamless looping
  const repeatedText = (text + "   ").repeat(6);

  useEffect(() => {
    const step = direction === "forward" ? 1 : -1;
    const pixelsPerSecond = 60 / speed;

    const animate = (time: number) => {
      if (lastTimeRef.current) {
        const delta = (time - lastTimeRef.current) / 1000;
        setOffset((prev) => {
          let next = prev + step * delta * pixelsPerSecond;
          if (next > 100) next -= 100;
          if (next < 0) next += 100;
          return next;
        });
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, direction]);

  return (
    <div className="inline-block">
      <svg
        width={width}
        height={height}
        viewBox={\`0 0 \${width} \${height}\`}
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        <text
          fill={color}
          fontSize={fontSize}
          fontWeight={700}
          fontFamily="'Space Grotesk', sans-serif"
        >
          <textPath
            href={\`#\${pathId}\`}
            startOffset={\`\${offset}%\`}
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};
// Usage:
// <CurvedLoop text="${text}" speed={${speed}} direction="${direction}" amplitude={${amplitude}} />`;


const CurvedLoopPage = () => {
  const [text, setText] = useState("Curved Loop Text");
  const [speed, setSpeed] = useState(5);
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");
  const [amplitude, setAmplitude] = useState(40);
  const [color, setColor] = useState("#f97316");
  const [fontSize, setFontSize] = useState(24);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Curved Loop</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Text that scrolls continuously along a curved SVG path.
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
            <CurvedLoop
              key={previewKey}
              text={text}
              speed={speed}
              direction={direction}
              amplitude={amplitude}
              color={color}
              fontSize={fontSize}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, speed, direction, amplitude, color, fontSize)} language="React / TypeScript" />
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
              <Slider value={[speed]} onValueChange={([v]) => { setSpeed(v); resetPreview(); }} min={2} max={15} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Amplitude <span className="text-primary ml-1">{amplitude}px</span></Label>
              <Slider value={[amplitude]} onValueChange={([v]) => { setAmplitude(v); resetPreview(); }} min={10} max={80} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={14} max={48} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Direction</Label>
              <div className="flex items-center gap-3">
                <Switch checked={direction === "reverse"} onCheckedChange={(c) => { setDirection(c ? "reverse" : "forward"); resetPreview(); }} />
                <span className="text-xs font-mono text-muted-foreground">{direction}</span>
              </div>
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

export default CurvedLoopPage;
