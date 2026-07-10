import { useState } from "react";
import ScrollText from "@/components/animations/ScrollText";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  text: string,
  duration: number,
  stagger: number,
  splitBy: string,
  color: string,
  fontSize: number
) => `import { useState, useEffect, useRef } from "react";

interface ScrollTextProps {
  text: string;
  duration?: number;
  stagger?: number;
  splitBy?: "word" | "character";
  color?: string;
  fontSize?: number;
}

const ScrollText = ({
  text,
  duration = ${duration},
  stagger = ${stagger},
  splitBy = "${splitBy}",
  color = "${color}",
  fontSize = ${fontSize},
}: ScrollTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const units =
    splitBy === "character"
      ? text.split("").map((ch, i) => ({ key: i, content: ch === " " ? "\u00A0" : ch }))
      : text.split(" ").map((word, i) => ({ key: i, content: word }));

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap gap-x-2 font-bold font-['Space_Grotesk',sans-serif]"
      style={{ fontSize }}
    >
      {units.map((unit) => (
        <span
          key={unit.key}
          className="inline-block"
          style={{
            color,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: \`opacity ${duration}s ease-out, transform ${duration}s ease-out\`,
            transitionDelay: \`\${unit.key * stagger}ms\`,
          }}
        >
          {unit.content}
        </span>
      ))}
    </div>
  );
};
// Usage:
// <ScrollText text="${text}" duration={${duration}} stagger={${stagger}} splitBy="${splitBy}" />`;


const ScrollTextPage = () => {
  const [text, setText] = useState("Scroll down to reveal this animated text");
  const [duration, setDuration] = useState(0.6);
  const [stagger, setStagger] = useState(80);
  const [splitBy, setSplitBy] = useState<"word" | "character">("word");
  const [color, setColor] = useState("#f97316");
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
        <h1 className="text-2xl font-bold text-foreground">Scroll Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Text that reveals word-by-word or character-by-character as you scroll into view.
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
          <div className="rounded-xl border border-border overflow-hidden bg-card shadow-2xl shadow-black/30">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background/50 text-[10px] font-mono text-muted-foreground min-w-[200px] text-center">
                  animatekit.dev/preview
                </div>
              </div>
              <div className="w-12" />
            </div>

            {/* Scrollable content */}
            <div
              key={previewKey}
              className="overflow-y-auto"
              style={{ height: 400, background: "hsl(var(--preview-bg))" }}
            >
              <div className="flex items-center justify-center h-[350px]">
                <p className="text-sm text-muted-foreground font-mono">↓ Scroll down ↓</p>
              </div>
              <div className="flex items-center justify-center min-h-[300px] p-12">
                <ScrollText
                  text={text}
                  duration={duration}
                  stagger={stagger}
                  splitBy={splitBy}
                  color={color}
                  fontSize={fontSize}
                />
              </div>
              <div className="h-[200px]" />
            </div>
          </div>
        ) : (
          <CodeBlock code={generateCode(text, duration, stagger, splitBy, color, fontSize)} language="React / TypeScript" />
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
              <Slider value={[duration]} onValueChange={([v]) => { setDuration(v); resetPreview(); }} min={0.3} max={2} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Stagger <span className="text-primary ml-1">{stagger}ms</span></Label>
              <Slider value={[stagger]} onValueChange={([v]) => { setStagger(v); resetPreview(); }} min={30} max={200} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={16} max={64} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Split By</Label>
              <div className="flex items-center gap-3">
                <Switch checked={splitBy === "character"} onCheckedChange={(c) => { setSplitBy(c ? "character" : "word"); resetPreview(); }} />
                <span className="text-xs font-mono text-muted-foreground">{splitBy}</span>
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

export default ScrollTextPage;
