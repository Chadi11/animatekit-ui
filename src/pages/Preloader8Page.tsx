import { useState } from "react";
import Preloader8 from "@/components/animations/Preloader8";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (duration: number, stripColor: string, stripCount: number) => `import { useState, useEffect } from "react";

interface Preloader8Props {
  onComplete?: () => void;
  duration?: number;
  stripColor?: string;
  stripCount?: number;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader8 = ({
  onComplete,
  duration = ${duration},
  stripColor = "${stripColor}",
  stripCount = ${stripCount},
  landingContent,
  contained = false,
}: Preloader8Props) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsRevealing(true);
      setTimeout(() => {
        setIsDone(true);
        onComplete?.();
      }, stripCount * 80 + 700 + 200);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, stripCount, onComplete]);

  return (
    <div
      className={\`\${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden\`}
      style={{ background: stripColor }}
    >
      <div
        className="absolute inset-0 bg-white flex items-center justify-center z-[1]"
        style={{
          opacity: isDone || isRevealing ? 1 : 0,
          transition: "opacity 0.4s ease 0.2s",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {!isDone && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {[...Array(stripCount)].map((_, i) => {
            const stripW = 100 / stripCount;
            const leftPct = i * stripW;
            const rightPct = (i + 1) * stripW;
            return (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  clipPath: \`polygon(\${leftPct}% 0%, \${rightPct}% 0%, \${rightPct}% 100%, \${leftPct}% 100%)\`,
                  transform: isRevealing ? "translateY(-100%)" : "translateY(0)",
                  transition: "transform 0.7s cubic-bezier(0.76,0,0.24,1)",
                  transitionDelay: isRevealing ? \`\${i * 80}ms\` : "0ms",
                }}
              >
                <div className="absolute inset-0" style={{ background: stripColor }} />
                {i < stripCount - 1 && (
                  <div className="absolute top-0 bottom-0 right-0 w-px bg-white/25 z-[2]" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
// Usage:
// <Preloader8 duration={${duration}} stripColor="${stripColor}" stripCount={${stripCount}} onComplete={() => console.log("done")} />`;


const Preloader8Page = () => {
  const [duration, setDuration] = useState(2200);
  const [stripColor, setStripColor] = useState("#f97316");
  const [stripCount, setStripCount] = useState(8);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Preloaders</p>
        <h1 className="text-2xl font-bold text-foreground">Preloader 8</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vertical strip reveal preloader with staggered slide-up animation.
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
            <Preloader8 key={previewKey} contained duration={duration} stripColor={stripColor} stripCount={stripCount} onComplete={resetPreview} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(duration, stripColor, stripCount)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Duration <span className="text-primary ml-1">{duration}ms</span></Label>
              <Slider value={[duration]} onValueChange={([v]) => { setDuration(v); resetPreview(); }} min={500} max={5000} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Strip Count <span className="text-primary ml-1">{stripCount}</span></Label>
              <Slider value={[stripCount]} onValueChange={([v]) => { setStripCount(v); resetPreview(); }} min={2} max={20} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Strip Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={stripColor} onChange={(e) => { setStripColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{stripColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader8Page;
