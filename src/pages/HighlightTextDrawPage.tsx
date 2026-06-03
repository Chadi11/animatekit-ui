import { useState } from "react";
import HighlightTextDraw from "@/components/animations/HighlightTextDraw";
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
  highlightColor: string,
  textColor: string,
  duration: number,
  delay: number,
  highlightHeight: number,
  fontSize: number,
  roughness: number,
  repeat: boolean
) => `import { useMemo, useState, useEffect, useRef } from "react";

interface HighlightTextDrawProps {
  text: string;
  highlightColor?: string;
  textColor?: string;
  duration?: number;
  delay?: number;
  highlightHeight?: number;
  fontSize?: number;
  roughness?: number;
  repeat?: boolean;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280 - 0.5;
  };
}

function generateMarkerShape(
  width: number,
  height: number,
  roughness: number,
  seed: number
): string {
  const rand = seededRandom(seed);
  const steps = Math.max(6, Math.floor(width / 20));

  const topPoints: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const overshoot = width * 0.04;
    const x = -overshoot + i * (width + overshoot * 2) / steps;
    const y = rand() * roughness * 3;
    topPoints.push([x, y]);
  }

  const bottomPoints: [number, number][] = [];
  for (let i = steps; i >= 0; i--) {
    const overshoot = width * 0.04;
    const x = -overshoot + i * (width + overshoot * 2) / steps;
    const y = height + rand() * roughness * 3;
    bottomPoints.push([x, y]);
  }

  let d = \`M \${topPoints[0][0]},\${topPoints[0][1]}\`;

  for (let i = 1; i < topPoints.length; i++) {
    const prev = topPoints[i - 1];
    const curr = topPoints[i];
    const cpx = (prev[0] + curr[0]) / 2 + rand() * roughness * 2;
    const cpy = (prev[1] + curr[1]) / 2 + rand() * roughness * 2;
    d += \` Q \${cpx},\${cpy} \${curr[0]},\${curr[1]}\`;
  }

  const lastTop = topPoints[topPoints.length - 1];
  const firstBottom = bottomPoints[0];
  d += \` Q \${lastTop[0] + rand() * roughness * 2},\${(lastTop[1] + firstBottom[1]) / 2} \${firstBottom[0]},\${firstBottom[1]}\`;

  for (let i = 1; i < bottomPoints.length; i++) {
    const prev = bottomPoints[i - 1];
    const curr = bottomPoints[i];
    const cpx = (prev[0] + curr[0]) / 2 + rand() * roughness * 2;
    const cpy = (prev[1] + curr[1]) / 2 + rand() * roughness * 2;
    d += \` Q \${cpx},\${cpy} \${curr[0]},\${curr[1]}\`;
  }

  const lastBottom = bottomPoints[bottomPoints.length - 1];
  d += \` Q \${lastBottom[0] + rand() * roughness * 2},\${(lastBottom[1] + topPoints[0][1]) / 2} \${topPoints[0][0]},\${topPoints[0][1]}\`;

  d += " Z";
  return d;
}

const HighlightTextDraw = ({
  text,
  highlightColor = "${highlightColor}",
  textColor = "${textColor}",
  duration = ${duration},
  delay = ${delay},
  highlightHeight = ${highlightHeight},
  fontSize = ${fontSize},
  roughness = ${roughness},
  repeat = ${repeat},
}: HighlightTextDrawProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const clipId = useMemo(() => \`marker-clip-\${Math.random().toString(36).slice(2, 8)}\`, []);

  const seed = useMemo(() => Math.floor(Math.random() * 10000), []);

  const svgWidth = 200;
  const svgHeight = 100;
  const shapeHeight = (highlightHeight / 100) * svgHeight;
  const shapeY = (svgHeight - shapeHeight) / 2;

  const markerPath = useMemo(
    () => generateMarkerShape(svgWidth, shapeHeight, roughness, seed),
    [roughness, seed, shapeHeight]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setActive(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <span
      ref={containerRef}
      className="relative inline-block font-bold font-['Space_Grotesk',sans-serif]"
      style={{ fontSize, color: textColor }}
    >
      <svg
        className="absolute bottom-0 pointer-events-none overflow-visible"
        style={{ left: "-4%", width: "108%", height: "100%" }}
        viewBox={\`0 0 \${svgWidth} \${svgHeight}\`}
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x="0"
              y="0"
              width={svgWidth}
              height={svgHeight}
              style={{
                transform: active ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: \`transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s\`,
              }}
            />
          </clipPath>
        </defs>
        <g
          clipPath={\`url(#\${clipId})\`}
          transform={\`translate(0, \${shapeY})\`}
        >
          <path
            d={markerPath}
            fill={highlightColor}
            opacity={0.5}
          />
        </g>
      </svg>
      <span className="relative z-[1]">{text}</span>
    </span>
  );
};
// Usage:
// <HighlightTextDraw text="${text}" roughness={${roughness}} />`;


const HighlightTextDrawPage = () => {
  const [text, setText] = useState("Draw Highlight");
  const [highlightColor, setHighlightColor] = useState("#93c5fd");
  const [textColor, setTextColor] = useState("#1e293b");
  const [duration, setDuration] = useState(1.2);
  const [delay, setDelay] = useState(0.2);
  const [highlightHeight, setHighlightHeight] = useState(40);
  const [fontSize, setFontSize] = useState(32);
  const [roughness, setRoughness] = useState(2);
  const [repeat, setRepeat] = useState(false);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Highlight Text Draw</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A hand-drawn marker stroke effect that mimics an imperfect human highlight.
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
            <HighlightTextDraw
              key={previewKey}
              text={text}
              highlightColor={highlightColor}
              textColor={textColor}
              duration={duration}
              delay={delay}
              highlightHeight={highlightHeight}
              fontSize={fontSize}
              roughness={roughness}
              repeat={repeat}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, highlightColor, textColor, duration, delay, highlightHeight, fontSize, roughness, repeat)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Duration <span className="text-primary ml-1">{duration}s</span></Label>
              <Slider value={[duration]} onValueChange={([v]) => { setDuration(v); resetPreview(); }} min={0.3} max={3} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Delay <span className="text-primary ml-1">{delay}s</span></Label>
              <Slider value={[delay]} onValueChange={([v]) => { setDelay(v); resetPreview(); }} min={0} max={1} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Roughness <span className="text-primary ml-1">{roughness}</span></Label>
              <Slider value={[roughness]} onValueChange={([v]) => { setRoughness(v); resetPreview(); }} min={1} max={5} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Highlight Height <span className="text-primary ml-1">{highlightHeight}%</span></Label>
              <Slider value={[highlightHeight]} onValueChange={([v]) => { setHighlightHeight(v); resetPreview(); }} min={20} max={100} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={16} max={64} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Repeat on Scroll</Label>
              <Switch checked={repeat} onCheckedChange={(v) => { setRepeat(v); resetPreview(); }} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Highlight Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={highlightColor} onChange={(e) => { setHighlightColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{highlightColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={textColor} onChange={(e) => { setTextColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{textColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightTextDrawPage;
