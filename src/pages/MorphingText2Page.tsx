import { useState } from "react";
import MorphingText2 from "@/components/animations/MorphingText2";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  texts: string[],
  morphDuration: number,
  pauseDuration: number,
  fontSize: number,
  color: string
) => `import { useMemo, useState, useEffect, useRef, useCallback } from "react";

interface MorphingText2Props {
  texts: string[];
  morphDuration?: number;
  pauseDuration?: number;
  fontSize?: number;
  color?: string;
}

const MorphingText2 = ({
  texts,
  morphDuration = ${morphDuration},
  pauseDuration = ${pauseDuration},
  fontSize = ${fontSize},
  color = "${color}",
}: MorphingText2Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [morphProgress, setMorphProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const longestText = useMemo(
    () => texts.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [texts]
  );

  const nextIndex = (currentIndex + 1) % texts.length;
  const currentWords = (texts[currentIndex] || "").split(" ");
  const nextWords = (texts[nextIndex] || "").split(" ");
  const maxWords = Math.max(currentWords.length, nextWords.length);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      if (isPaused) {
        if (elapsed >= pauseDuration) {
          setIsPaused(false);
          startTimeRef.current = 0;
        }
      } else {
        const progress = Math.min(elapsed / morphDuration, 1);
        setMorphProgress(progress);
        if (progress >= 1) {
          setCurrentIndex(nextIndex);
          setMorphProgress(0);
          setIsPaused(true);
          startTimeRef.current = 0;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    },
    [isPaused, pauseDuration, morphDuration, nextIndex]
  );

  useEffect(() => {
    if (texts.length < 2) return;
    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, texts.length]);

  const getWordStyle = (
    wordCurrent: string,
    wordNext: string,
    isOutgoing: boolean
  ): React.CSSProperties => {
    const same = wordCurrent === wordNext;
    if (same) return { display: "inline-block", opacity: 1, filter: "blur(0px)", transform: "scale(1)" };

    const t = morphProgress;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    if (isOutgoing) {
      return {
        display: "inline-block",
        opacity: 1 - ease,
        filter: \`blur(\${ease * 6}px)\`,
        transform: \`scale(\${1 - ease * 0.15})\`,
        transition: "none",
      };
    }
    return {
      display: "inline-block",
      opacity: ease,
      filter: \`blur(\${(1 - ease) * 6}px)\`,
      transform: \`scale(\${0.85 + ease * 0.15})\`,
      transition: "none",
    };
  };

  return (
    <span
      className="relative inline-block font-bold text-center"
      style={{ fontSize, color, fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Sizer */}
      <span className="invisible whitespace-pre">{longestText}</span>

      {/* Outgoing words */}
      <span className="absolute inset-0 whitespace-pre flex justify-center items-center" aria-hidden="true">
        <span>
          {Array.from({ length: maxWords }).map((_, i) => {
            const cw = currentWords[i] ?? "";
            const nw = nextWords[i] ?? "";
            return (
              <span key={i}>
                {i > 0 && " "}
                <span style={getWordStyle(cw, nw, true)}>{cw}</span>
              </span>
            );
          })}
        </span>
      </span>

      {/* Incoming words */}
      <span className="absolute inset-0 whitespace-pre flex justify-center items-center">
        <span>
          {Array.from({ length: maxWords }).map((_, i) => {
            const cw = currentWords[i] ?? "";
            const nw = nextWords[i] ?? "";
            return (
              <span key={i}>
                {i > 0 && " "}
                <span style={getWordStyle(cw, nw, false)}>{nw}</span>
              </span>
            );
          })}
        </span>
      </span>
    </span>
  );
};
// Usage:
// <MorphingText2 texts={\${JSON.stringify(texts)}} morphDuration={${morphDuration}} pauseDuration={${pauseDuration}} fontSize={${fontSize}} color="${color}" />`;


const MorphingText2Page = () => {
  const [textsRaw, setTextsRaw] = useState("Hello World\nSmooth Animation\nReact Component\nWord Morph");
  const [morphDuration, setMorphDuration] = useState(1500);
  const [pauseDuration, setPauseDuration] = useState(2000);
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
        <h1 className="text-2xl font-bold text-foreground">Morphing Text 2</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Word-by-word morphing with scale, blur, and opacity transitions using eased animation.
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
            <MorphingText2
              key={previewKey}
              texts={texts}
              morphDuration={morphDuration}
              pauseDuration={pauseDuration}
              fontSize={fontSize}
              color={color}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(texts, morphDuration, pauseDuration, fontSize, color)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Morph Duration <span className="text-primary ml-1">{morphDuration}ms</span></Label>
              <Slider value={[morphDuration]} onValueChange={([v]) => { setMorphDuration(v); resetPreview(); }} min={500} max={3000} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Pause Duration <span className="text-primary ml-1">{pauseDuration}ms</span></Label>
              <Slider value={[pauseDuration]} onValueChange={([v]) => { setPauseDuration(v); resetPreview(); }} min={500} max={5000} step={100} />
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

export default MorphingText2Page;
