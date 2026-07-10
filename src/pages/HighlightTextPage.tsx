import { useState } from "react";
import HighlightText from "@/components/animations/HighlightText";
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
  repeat: boolean
) => `import { useState, useEffect, useRef } from "react";

interface HighlightTextProps {
  text: string;
  highlightColor?: string;
  textColor?: string;
  duration?: number;
  delay?: number;
  highlightHeight?: number;
  fontSize?: number;
  repeat?: boolean;
}

const HighlightText = ({
  text,
  highlightColor = "${highlightColor}",
  textColor = "${textColor}",
  duration = ${duration},
  delay = ${delay},
  highlightHeight = ${highlightHeight},
  fontSize = ${fontSize},
  repeat = ${repeat},
}: HighlightTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
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
      ref={ref}
      className="relative inline font-bold font-['Space_Grotesk',sans-serif]"
      style={{ fontSize, color: textColor }}
    >
      <span
        className="absolute bottom-0 left-0 rounded-sm"
        style={{
          height: \`${highlightHeight}%\`,
          width: active ? "100%" : "0%",
          background: highlightColor,
          zIndex: 0,
          transition: \`width ${duration}s ease-out ${delay}s\`,
        }}
      />
      <span className="relative z-[1]">{text}</span>
    </span>
  );
};
// Usage:
// <HighlightText text="${text}" />`;


const HighlightTextPage = () => {
  const [text, setText] = useState("Highlight Me");
  const [highlightColor, setHighlightColor] = useState("#f97316");
  const [textColor, setTextColor] = useState("#1e293b");
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0.2);
  const [highlightHeight, setHighlightHeight] = useState(40);
  const [fontSize, setFontSize] = useState(32);
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
        <h1 className="text-2xl font-bold text-foreground">Highlight Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          An animated highlighter pen effect that sweeps color behind text.
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
            <HighlightText
              key={previewKey}
              text={text}
              highlightColor={highlightColor}
              textColor={textColor}
              duration={duration}
              delay={delay}
              highlightHeight={highlightHeight}
              fontSize={fontSize}
              repeat={repeat}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, highlightColor, textColor, duration, delay, highlightHeight, fontSize, repeat)} language="React / TypeScript" />
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

export default HighlightTextPage;
