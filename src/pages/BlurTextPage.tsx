import { useState } from "react";
import BlurText from "@/components/animations/BlurText";
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
  color: string
) => `import { useState, useEffect, useRef } from "react";

interface BlurTextProps {
  text: string;
  animateBy?: "word" | "letter";
  direction?: "top" | "bottom";
  delay?: number;
  color?: string;
}

const BlurText = ({
  text,
  animateBy = "${animateBy}",
  direction = "${direction}",
  delay = ${delay},
  color = "${color}",
}: BlurTextProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const units =
    animateBy === "word"
      ? text.split(/(\s+)/)
      : text.split("");

  const translateY = direction === "bottom" ? "20px" : "-20px";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

        const unitIndex =
          animateBy === "word"
            ? units.slice(0, i).filter((u) => !/^\s+$/.test(u)).length
            : i;

        return (
          <span
            key={i}
            className="inline-block"
            style={{
              filter: inView ? "blur(0px)" : "blur(10px)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : \`translateY(\${translateY})\`,
              transition: \`filter 0.4s ease, opacity 0.4s ease, transform 0.4s ease\`,
              transitionDelay: inView ? \`\${unitIndex * delay}ms\` : "0ms",
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
// <BlurText text="${text}" animateBy="${animateBy}" direction="${direction}" delay={${delay}} />`;


const BlurTextPage = () => {
  const [text, setText] = useState("BLUR INTO FOCUS");
  const [animateBy, setAnimateBy] = useState("word");
  const [direction, setDirection] = useState("bottom");
  const [delay, setDelay] = useState(50);
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
        <h1 className="text-2xl font-bold text-foreground">Blur Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Text starts blurred and animates into focus with a stagger — word by word or letter by letter.
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as "preview" | "code")}
          className="bg-secondary rounded-lg p-1 w-fit"
        >
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
            <BlurText
              key={previewKey}
              text={text}
              animateBy={animateBy as "word" | "letter"}
              direction={direction as "top" | "bottom"}
              delay={delay}
              color={color}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, animateBy, direction, delay, color)} language="React / TypeScript" />
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
                <ToggleGroupItem value="word" className="text-xs px-3 py-1">Word</ToggleGroupItem>
                <ToggleGroupItem value="letter" className="text-xs px-3 py-1">Letter</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Direction</Label>
              <ToggleGroup type="single" value={direction} onValueChange={(v) => { if (v) { setDirection(v); resetPreview(); } }} className="justify-start">
                <ToggleGroupItem value="bottom" className="text-xs px-3 py-1">Bottom</ToggleGroupItem>
                <ToggleGroupItem value="top" className="text-xs px-3 py-1">Top</ToggleGroupItem>
              </ToggleGroup>
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

export default BlurTextPage;
