import { useState } from "react";
import Preloader2 from "@/components/animations/Preloader2";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (intervalMs: number, bgColor: string, textColor: string) =>
  `import { useState, useEffect, useRef } from "react";

interface Preloader2Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  bgColor?: string;
  textColor?: string;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader2 = ({
  onComplete,
  greetings = [
    { text: "HELLO",     lang: "en" },
    { text: "你好",       lang: "zh" },
    { text: "مرحبًا",    lang: "ar" },
    { text: "HOLA",      lang: "es" },
    { text: "こんにちは",  lang: "ja" },
  ],
  intervalMs = ${intervalMs},
  bgColor = "${bgColor}",
  textColor = "${textColor}",
  landingContent,
  contained = false,
}: Preloader2Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"greet" | "collapse" | "done">("greet");
  const [lineGrown, setLineGrown] = useState(false);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLineGrown(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "greet") return;
    if (currentIndex < greetings.length - 1) {
      tickRef.current = setTimeout(() => setCurrentIndex((p) => p + 1), intervalMs);
    } else {
      tickRef.current = setTimeout(() => {
        setPhase("collapse");
        setTimeout(() => {
          setPhase("done");
          onComplete?.();
        }, 1100);
      }, 900);
    }
    return () => { if (tickRef.current) clearTimeout(tickRef.current); };
  }, [currentIndex, phase, greetings.length, intervalMs, onComplete]);

  const isCollapsing = phase === "collapse";
  const isDone = phase === "done";

  return (
    <div className={\`\${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden\`}>
      {/* Landing */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[1]"
        style={{
          background: "#ffffff",
          opacity: isDone || isCollapsing ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {/* Collapsing panel */}
      {!isDone && (
        <div
          className="absolute inset-0 z-50"
          style={{
            backgroundColor: bgColor,
            transformOrigin: isCollapsing ? "top center" : "bottom center",
            transform: isCollapsing ? "scaleY(0)" : "scaleY(1)",
            transition: isCollapsing ? "transform 0.85s cubic-bezier(0.76,0,0.24,1)" : "none",
          }}
        />
      )}

      {/* Greeting text */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-3 pointer-events-none"
          style={{
            opacity: isCollapsing ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          <div className="relative h-20 w-full overflow-hidden flex items-center justify-center">
            {greetings.map((greeting, index) => (
              <div
                key={index}
                className="absolute w-full flex items-center justify-center"
                style={{
                  transform:
                    index === currentIndex ? "translateY(0)"
                    : index < currentIndex  ? "translateY(-100%)"
                    : "translateY(100%)",
                  opacity: index === currentIndex ? 1 : 0,
                  transition: "transform 0.45s cubic-bezier(0.76,0,0.24,1), opacity 0.45s ease",
                  fontFamily:
                    greeting.lang === "ar" ? "Arial, sans-serif"
                    : greeting.lang === "zh" || greeting.lang === "ja" ? "system-ui, sans-serif"
                    : "Georgia, serif",
                }}
              >
                <span className="font-light uppercase leading-none" style={{
                  fontSize: "clamp(36px, 8vw, 64px)",
                  color: textColor,
                  letterSpacing: "10px",
                }}>
                  {greeting.text}
                </span>
              </div>
            ))}
          </div>
          <div className="h-px" style={{
            background: \`${textColor}30\`,
            width: lineGrown ? 80 : 0,
            transition: "width 1.2s ease",
          }} />
          <div className="text-[11px] tracking-[3px] tabular-nums" style={{
            color: \`${textColor}40\`,
          }}>
            {String(currentIndex + 1).padStart(2, "0")} / {String(greetings.length).padStart(2, "0")}
          </div>
        </div>
      )}
    </div>
  );
};`;

const propsData = [
  { name: "onComplete", type: "() => void", default: "—", description: "Called when the preloader animation finishes" },
  { name: "greetings", type: "{ text: string; lang: string }[]", default: "5 greetings", description: "Array of greeting objects to cycle through" },
  { name: "intervalMs", type: "number", default: "680", description: "Time between greeting transitions in ms" },
  { name: "bgColor", type: "string", default: '"#0a0a0a"', description: "Background color of the dark panel" },
  { name: "textColor", type: "string", default: '"#ffffff"', description: "Color of the greeting text" },
  { name: "landingContent", type: "ReactNode", default: "—", description: "Custom content shown after reveal" },
];


const Preloader2Page = () => {
  const [intervalMs, setIntervalMs] = useState(680);
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [textColor, setTextColor] = useState("#ffffff");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [preloaderKey, setPreloaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Preloaders</p>
        <h1 className="text-2xl font-bold text-foreground">Preloader 2</h1>
        <p className="text-sm text-muted-foreground mt-1">Ink panel collapse with sliding word transitions and accent line.</p>
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
              <Preloader2 key={preloaderKey} intervalMs={intervalMs} bgColor={bgColor} textColor={textColor} contained />
            </div>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(intervalMs, bgColor, textColor)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Interval (ms) <span className="text-primary ml-1">{intervalMs}</span></Label>
              <Slider value={[intervalMs]} onValueChange={([v]) => setIntervalMs(v)} min={300} max={1200} step={50} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
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

export default Preloader2Page;
