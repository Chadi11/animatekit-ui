import { useState } from "react";
import FuzzyText from "@/components/animations/FuzzyText";
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
  intensity: number,
  speed: number,
  enableBlur: boolean,
  color: string,
  fontSize: number
) => `import { useState, useEffect, useRef, useCallback } from "react";

interface FuzzyTextProps {
  text: string;
  intensity?: number;
  speed?: number;
  enableBlur?: boolean;
  color?: string;
  fontSize?: number;
}

interface CharOffset {
  x: number;
  y: number;
  blur: number;
}

const FuzzyText = ({
  text,
  intensity = ${intensity},
  speed = ${speed},
  enableBlur = ${enableBlur},
  color = "${color}",
  fontSize = ${fontSize},
}: FuzzyTextProps) => {
  const [offsets, setOffsets] = useState<CharOffset[]>([]);
  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const chars = text.split("");

  const updateOffsets = useCallback(() => {
    setOffsets(
      chars.map(() => ({
        x: (Math.random() - 0.5) * 2 * intensity,
        y: (Math.random() - 0.5) * 2 * intensity,
        blur: enableBlur ? Math.random() * intensity * 0.5 : 0,
      }))
    );
  }, [chars.length, intensity, enableBlur]);

  useEffect(() => {
    const interval = 1000 / speed;
    const animate = (time: number) => {
      if (time - lastUpdateRef.current >= interval) {
        updateOffsets();
        lastUpdateRef.current = time;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, updateOffsets]);

  return (
    <span
      className="inline-flex font-bold tracking-wide"
      style={{ fontSize, color }}
      aria-label={text}
    >
      {chars.map((char, i) => {
        const o = offsets[i] || { x: 0, y: 0, blur: 0 };
        return (
          <span
            key={i}
            className="inline-block will-change-[transform,filter]"
            style={{
              transform: \`translate(\${o.x}px, \${o.y}px)\`,
              filter: o.blur > 0 ? \`blur(\${o.blur}px)\` : undefined,
              whiteSpace: char === " " ? "pre" : undefined,
            }}
            aria-hidden="true"
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};
// Usage:
// <FuzzyText text="${text}" intensity={${intensity}} speed={${speed}} enableBlur={${enableBlur}} />`;


const FuzzyTextPage = () => {
  const [text, setText] = useState("Fuzzy Text");
  const [intensity, setIntensity] = useState(2);
  const [speed, setSpeed] = useState(50);
  const [enableBlur, setEnableBlur] = useState(true);
  const [color, setColor] = useState("#f97316");
  const [fontSize, setFontSize] = useState(40);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Fuzzy Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Text that jitters and vibrates with a noisy displacement effect.
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
            <FuzzyText
              key={previewKey}
              text={text}
              intensity={intensity}
              speed={speed}
              enableBlur={enableBlur}
              color={color}
              fontSize={fontSize}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, intensity, speed, enableBlur, color, fontSize)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Intensity <span className="text-primary ml-1">{intensity}px</span></Label>
              <Slider value={[intensity]} onValueChange={([v]) => { setIntensity(v); resetPreview(); }} min={0.5} max={5} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed} fps</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => { setSpeed(v); resetPreview(); }} min={10} max={120} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={16} max={64} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Enable Blur</Label>
              <div className="flex items-center gap-3">
                <Switch checked={enableBlur} onCheckedChange={(c) => { setEnableBlur(c); resetPreview(); }} />
                <span className="text-xs font-mono text-muted-foreground">{enableBlur ? "On" : "Off"}</span>
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

export default FuzzyTextPage;
