import { useState } from "react";
import Preloader7 from "@/components/animations/Preloader7";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (countDuration: number, bgColor: string, accentColor: string) =>
  `import { useState, useEffect, useRef } from "react";

interface Preloader7Props {
  onComplete?: () => void;
  bgColor?: string;
  accentColor?: string;
  countDuration?: number;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader7 = ({
  onComplete,
  bgColor = "${bgColor}",
  accentColor = "${accentColor}",
  countDuration = ${countDuration},
  landingContent,
  contained = false,
}: Preloader7Props) => {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<"count" | "split" | "done">("count");
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (phase !== "count") return;
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / countDuration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(ease * 100);
      setPercent(val);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPercent(100);
        setTimeout(() => {
          setPhase("split");
          setTimeout(() => {
            setPhase("done");
            onComplete?.();
          }, 900);
        }, 300);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, countDuration, onComplete]);

  const isSplit = phase === "split";
  const isDone  = phase === "done";

  const panelClasses = "absolute top-0 bottom-0 z-20 overflow-hidden";
  const panelTransition = (side: "left" | "right") => ({
    background: bgColor,
    transform: isSplit
      ? \`translateX(\${side === "left" ? "-100%" : "100%"})\`
      : "translateX(0)",
    transition: isSplit
      ? "transform 0.75s cubic-bezier(0.76,0,0.24,1)"
      : "none",
  });

  const lineOpacity = phase === "count" ? 0.12 : 0;

  return (
    <div className={\`\${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden\`}>
      {/* Landing page */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[1]"
        style={{
          background: "#ffffff",
          opacity: isDone || isSplit ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {!isDone && (
        <>
          {/* Left panel */}
          <div className="\${panelClasses} left-0 w-1/2" style={panelTransition("left")}>
            <div className="absolute inset-0 flex items-center justify-end pr-7 overflow-hidden">
              <span className="font-black leading-none tabular-nums select-none inline-block" style={{
                fontSize: "clamp(72px, 18vw, 160px)",
                color: \`${accentColor}08\`,
                letterSpacing: "-6px",
                transform: "scaleX(-1)",
              }}>
                {String(percent).padStart(3, "0")}
              </span>
            </div>
            <div className="absolute bottom-9 right-7 text-[13px] font-medium tracking-[2px] tabular-nums" style={{
              color: \`${accentColor}30\`,
            }}>
              {percent}
            </div>
            <div className="absolute bottom-0 left-0 h-0.5" style={{
              width: \`\${percent}%\`,
              background: \`${accentColor}20\`,
            }} />
          </div>

          {/* Right panel */}
          <div className="\${panelClasses} left-1/2 w-1/2" style={panelTransition("right")}>
            <div className="absolute inset-0 flex items-center justify-start pl-7 overflow-hidden">
              <span className="font-black leading-none tabular-nums select-none" style={{
                fontSize: "clamp(72px, 18vw, 160px)",
                color: \`${accentColor}08\`,
                letterSpacing: "-6px",
              }}>
                {String(percent).padStart(3, "0")}
              </span>
            </div>
            <div className="absolute bottom-9 left-7 text-[13px] font-medium tracking-[2px] tabular-nums" style={{
              color: \`${accentColor}30\`,
            }}>
              {percent}%
            </div>
            <div className="absolute bottom-0 right-0 h-0.5" style={{
              width: \`\${percent}%\`,
              background: \`${accentColor}20\`,
            }} />
          </div>

          {/* Center divider */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px z-30" style={{
            background: \`${accentColor}15\`,
            opacity: lineOpacity,
            transition: "opacity 0.3s ease",
          }} />

          {/* Center label */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] flex flex-col items-center gap-2 pointer-events-none"
            style={{
              opacity: isSplit ? 0 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            <span className="font-extrabold leading-none tabular-nums" style={{
              fontSize: "clamp(36px, 8vw, 72px)",
              color: accentColor,
              letterSpacing: "-2px",
            }}>
              {percent}%
            </span>
            <span className="text-[11px] tracking-[4px] uppercase" style={{
              color: \`${accentColor}30\`,
            }}>
              Loading
            </span>
          </div>
        </>
      )}
    </div>
  );
};`;

const propsData = [
  { name: "onComplete", type: "() => void", default: "—", description: "Called when the preloader animation finishes" },
  { name: "countDuration", type: "number", default: "2800", description: "Duration of the 0→100% count in ms" },
  { name: "bgColor", type: "string", default: '"#111111"', description: "Background color of the split panels" },
  { name: "accentColor", type: "string", default: '"#ffffff"', description: "Color of the percentage text and accents" },
  { name: "landingContent", type: "ReactNode", default: "—", description: "Custom content shown after reveal" },
];


const Preloader7Page = () => {
  const [countDuration, setCountDuration] = useState(2800);
  const [bgColor, setBgColor] = useState("#111111");
  const [accentColor, setAccentColor] = useState("#ffffff");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [preloaderKey, setPreloaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Preloaders</p>
        <h1 className="text-2xl font-bold text-foreground">Preloader 7</h1>
        <p className="text-sm text-muted-foreground mt-1">Split halves with a mirrored percentage counter that splits apart on completion.</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame onReload={() => setPreloaderKey((k) => k + 1)}>
            <div style={{ position: "relative", width: 480, height: 320, overflow: "hidden", borderRadius: 8 }}>
              <Preloader7 key={preloaderKey} countDuration={countDuration} bgColor={bgColor} accentColor={accentColor} contained />
            </div>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(countDuration, bgColor, accentColor)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Count Duration (ms) <span className="text-primary ml-1">{countDuration}</span></Label>
              <Slider value={[countDuration]} onValueChange={([v]) => setCountDuration(v)} min={1000} max={5000} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Accent Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <PropsTable props={propsData} />
      </div>
    </div>
  );
};

export default Preloader7Page;
