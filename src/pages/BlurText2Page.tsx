import { useState } from "react";
import BlurText2 from "@/components/animations/BlurText2";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  text: string,
  animateBy: string,
  direction: string,
  delay: number,
  blurIntensity: number,
  color: string
) => `import { useState, useEffect, useRef, useCallback } from "react";

interface BlurText2Props {
  text: string;
  animateBy?: "word" | "letter";
  direction?: "left" | "right";
  delay?: number;
  blurIntensity?: number;
  color?: string;
}

const BlurText2 = ({
  text,
  animateBy = "${animateBy}",
  direction = "${direction}",
  delay = ${delay},
  blurIntensity = ${blurIntensity},
  color = "${color}",
}: BlurText2Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const units =
    animateBy === "word"
      ? text.split(/(\s+)/)
      : text.split("");

  const nonSpaceUnits = units.filter((u) => !/^\s+$/.test(u));
  const totalUnits = nonSpaceUnits.length;

  const startCycle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let idx = direction === "left" ? 0 : totalUnits - 1;

    intervalRef.current = setInterval(() => {
      setActiveIndex(idx);
      if (direction === "left") {
        idx++;
        if (idx >= totalUnits) idx = 0;
      } else {
        idx--;
        if (idx < 0) idx = totalUnits - 1;
      }
    }, delay);
  }, [delay, direction, totalUnits]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      startCycle();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveIndex(-1);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [inView, startCycle]);

  let nonSpaceIdx = 0;

  return (
    <span
      ref={ref}
      className="inline-flex flex-wrap font-mono text-4xl font-bold tracking-wider"
      style={{ color }}
    >
      {units.map((unit, i) => {
        if (/^\s+$/.test(unit)) {
          return (
            <span key={i} className="inline-block w-[0.3em]" />
          );
        }

        const currentIdx = nonSpaceIdx;
        nonSpaceIdx++;

        const dist = Math.abs(currentIdx - activeIndex);
        const blur = dist <= 2 ? blurIntensity * Math.max(0, 1 - dist / 3) : 0;

        return (
          <span
            key={i}
            className="inline-block"
            style={{
              filter: \`blur(\${blur}px)\`,
              opacity: blur > 0 ? 0.6 + 0.4 * (1 - blur / blurIntensity) : 1,
              transition: \`filter \${delay * 1.5}ms ease, opacity \${delay * 1.5}ms ease\`,
            }}
          >
            {unit}
          </span>
        );
      })}
    </span>
  );
};
// Usage:
// <BlurText2 text="${text}" animateBy="${animateBy}" direction="${direction}" delay={${delay}} blurIntensity={${blurIntensity}} />`;


const BlurText2Page = () => {
  const [text, setText] = useState("BLUR WAVE CYCLE");
  const [animateBy, setAnimateBy] = useState("letter");
  const [direction, setDirection] = useState("left");
  const [delay, setDelay] = useState(80);
  const [blurIntensity, setBlurIntensity] = useState(8);
  const [color, setColor] = useState("#f97316");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Blur Text 2</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A looping blur wave sweeps across the text — an ambient, breathing effect.
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
            <BlurText2
              key={previewKey}
              text={text}
              animateBy={animateBy as "word" | "letter"}
              direction={direction as "left" | "right"}
              delay={delay}
              blurIntensity={blurIntensity}
              color={color}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, animateBy, direction, delay, blurIntensity, color)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Delay <span className="text-primary ml-1">{delay}ms</span></Label>
              <Slider value={[delay]} onValueChange={([v]) => { setDelay(v); resetPreview(); }} min={20} max={200} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Animate By</Label>
              <ToggleGroup type="single" value={animateBy} onValueChange={(v) => { if (v) { setAnimateBy(v); resetPreview(); } }} className="justify-start">
                <ToggleGroupItem value="letter" className="text-xs px-3 py-1">Letter</ToggleGroupItem>
                <ToggleGroupItem value="word" className="text-xs px-3 py-1">Word</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Direction</Label>
              <ToggleGroup type="single" value={direction} onValueChange={(v) => { if (v) { setDirection(v); resetPreview(); } }} className="justify-start">
                <ToggleGroupItem value="left" className="text-xs px-3 py-1">Left → Right</ToggleGroupItem>
                <ToggleGroupItem value="right" className="text-xs px-3 py-1">Right → Left</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Blur Intensity <span className="text-primary ml-1">{blurIntensity}px</span></Label>
              <Slider value={[blurIntensity]} onValueChange={([v]) => { setBlurIntensity(v); resetPreview(); }} min={2} max={20} step={1} />
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

export default BlurText2Page;
