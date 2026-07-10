import { useState } from "react";
import RollingText from "@/components/animations/RollingText";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  texts: string[],
  interval: number,
  duration: number,
  stagger: number,
  fontSize: number,
  color: string
) => `import { useMemo, useState, useEffect, useRef, useCallback } from "react";

interface RollingTextProps {
  texts: string[];
  interval?: number;
  duration?: number;
  stagger?: number;
  fontSize?: number;
  color?: string;
}

const RollingText = ({
  texts,
  interval = ${interval},
  duration = ${duration},
  stagger = ${stagger},
  fontSize = ${fontSize},
  color = "${color}",
}: RollingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayText, setDisplayText] = useState(texts[0] || "");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const longestText = useMemo(
    () => texts.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [texts]
  );

  const maxLen = longestText.length;
  const nextIndex = (currentIndex + 1) % texts.length;
  const nextText = texts[nextIndex] || "";

  const triggerFlip = useCallback(() => {
    setIsFlipping(true);
    const totalDuration = (duration + stagger * maxLen) * 1000;
    setTimeout(() => {
      setDisplayText(texts[(currentIndex + 1) % texts.length] || "");
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setIsFlipping(false);
    }, totalDuration);
  }, [currentIndex, duration, stagger, maxLen, texts]);

  useEffect(() => {
    if (texts.length < 2) return;
    timerRef.current = setInterval(triggerFlip, interval);
    return () => clearInterval(timerRef.current);
  }, [triggerFlip, interval, texts.length]);

  return (
    <span
      className="relative inline-block font-bold text-center"
      style={{
        fontSize,
        color,
        fontFamily: "'Space Grotesk', sans-serif",
        perspective: "500px",
      }}
    >
      {/* Sizer */}
      <span className="invisible whitespace-pre">{longestText}</span>

      {/* Characters */}
      <span className="absolute inset-0 whitespace-pre flex justify-center">
        <span>
          {Array.from({ length: maxLen }).map((_, i) => {
            const currentChar = displayText[i] ?? "\\u00A0";
            const nextChar = nextText[i] ?? "\\u00A0";
            const same = currentChar === nextChar;
            const delay = i * stagger;

            return (
              <span
                key={i}
                className="inline-block relative align-top overflow-hidden"
                style={{
                  width: "0.55em",
                  height: "1.4em",
                  perspective: "200px",
                }}
              >
                {/* Outgoing */}
                <span
                  className="block absolute inset-0 text-center [backface-visibility:hidden]"
                  style={{
                    transformOrigin: "center bottom",
                    transition: isFlipping && !same
                      ? \`transform ${duration}s ease-in \${delay}s, opacity ${duration}s ease-in \${delay}s\`
                      : "none",
                    transform: isFlipping && !same ? "rotateX(90deg)" : "rotateX(0deg)",
                    opacity: isFlipping && !same ? 0 : 1,
                  }}
                >
                  {currentChar}
                </span>

                {/* Incoming */}
                <span
                  className="block absolute inset-0 text-center [backface-visibility:hidden]"
                  style={{
                    transformOrigin: "center top",
                    transition: isFlipping && !same
                      ? \`transform ${duration}s ease-out \${delay + duration * 0.5}s, opacity ${duration}s ease-out \${delay + duration * 0.5}s\`
                      : "none",
                    transform: isFlipping && !same ? "rotateX(0deg)" : "rotateX(-90deg)",
                    opacity: isFlipping && !same ? 1 : 0,
                  }}
                >
                  {nextChar}
                </span>
              </span>
            );
          })}
        </span>
      </span>
    </span>
  );
};
// Usage:
// <RollingText texts={\${JSON.stringify(texts)}} interval={${interval}} duration={${duration}} stagger={${stagger}} fontSize={${fontSize}} color="${color}" />`;


const RollingTextPage = () => {
  const [textsRaw, setTextsRaw] = useState("Rolling\nFlipping\nCascade\nDisplay");
  const [interval, setInterval_] = useState(3000);
  const [duration, setDuration] = useState(0.4);
  const [stagger, setStagger] = useState(0.05);
  const [fontSize, setFontSize] = useState(42);
  const [color, setColor] = useState("#f97316");
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
        <h1 className="text-2xl font-bold text-foreground">Rolling Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Slot machine / departure board style animation where each character flips independently with staggered 3D rotation.
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
            <RollingText
              key={previewKey}
              texts={texts}
              interval={interval}
              duration={duration}
              stagger={stagger}
              fontSize={fontSize}
              color={color}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(texts, interval, duration, stagger, fontSize, color)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs text-muted-foreground">Texts (one per line)</Label>
              <Textarea value={textsRaw} onChange={(e) => { setTextsRaw(e.target.value); resetPreview(); }} className="bg-background font-mono text-sm" rows={4} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Interval <span className="text-primary ml-1">{interval}ms</span></Label>
              <Slider value={[interval]} onValueChange={([v]) => { setInterval_(v); resetPreview(); }} min={1000} max={6000} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Flip Duration <span className="text-primary ml-1">{duration}s</span></Label>
              <Slider value={[duration * 100]} onValueChange={([v]) => { setDuration(v / 100); resetPreview(); }} min={10} max={100} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Stagger <span className="text-primary ml-1">{stagger}s</span></Label>
              <Slider value={[stagger * 100]} onValueChange={([v]) => { setStagger(v / 100); resetPreview(); }} min={1} max={20} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={16} max={72} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
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

export default RollingTextPage;
