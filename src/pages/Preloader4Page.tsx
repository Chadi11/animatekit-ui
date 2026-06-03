import { useState } from "react";
import Preloader4 from "@/components/animations/Preloader4";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (intervalMs: number, bgColor: string, accentColor: string, blindCount: number) =>
  `import { useState, useEffect, useRef } from "react";

interface Preloader4Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  bgColor?: string;
  accentColor?: string;
  blindCount?: number;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader4 = ({
  onComplete,
  greetings = [
    { text: "Hello",     lang: "en" },
    { text: "你好",       lang: "zh" },
    { text: "مرحبًا",    lang: "ar" },
    { text: "Hola",      lang: "es" },
    { text: "こんにちは",  lang: "ja" },
  ],
  intervalMs = ${intervalMs},
  bgColor = "${bgColor}",
  accentColor = "${accentColor}",
  blindCount = ${blindCount},
  landingContent,
  contained = false,
}: Preloader4Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"greet" | "shutter" | "done">("greet");
  const [closedBlinds, setClosedBlinds] = useState<number[]>([]);
  const [percent, setPercent] = useState(0);
  const percentRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blindTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (phase !== "greet") return;
    const target = Math.round(((currentIndex + 1) / greetings.length) * 100);
    const step = () => {
      setPercent((p) => {
        if (p >= target) return target;
        return p + 1;
      });
    };
    percentRef.current = setInterval(step, 12);
    return () => { if (percentRef.current) clearInterval(percentRef.current); };
  }, [currentIndex, phase, greetings.length]);

  useEffect(() => {
    if (phase !== "greet") return;
    const t = setTimeout(() => {
      if (currentIndex < greetings.length - 1) {
        setCurrentIndex((p) => p + 1);
      } else {
        setPercent(100);
        setTimeout(() => {
          setPhase("shutter");
          for (let i = 0; i < blindCount; i++) {
            const bt = setTimeout(() => {
              setClosedBlinds((prev) => [...prev, i]);
            }, i * 110);
            blindTimers.current.push(bt);
          }
          const doneTimer = setTimeout(() => {
            setPhase("done");
            onComplete?.();
          }, blindCount * 110 + 600);
          blindTimers.current.push(doneTimer);
        }, 500);
      }
    }, intervalMs);
    return () => clearTimeout(t);
  }, [currentIndex, phase, greetings.length, intervalMs, blindCount, onComplete]);

  const isShuttering = phase === "shutter";
  const isDone = phase === "done";

  return (
    <div className={\`\${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden\`}>
      {/* Landing */}
      <div className="absolute inset-0 flex items-center justify-center z-[1]" style={{ background: "#ffffff" }}>
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {/* Blinds */}
      {!isDone && (
        <div className="absolute inset-0 z-50">
          {[...Array(blindCount)].map((_, i) => {
            const isClosed = closedBlinds.includes(i);
            return (
              <div
                key={i}
                className="absolute left-0 right-0 origin-top"
                style={{
                  top: \`\${(i / blindCount) * 100}%\`,
                  height: \`\${100 / blindCount}%\`,
                  background: i % 2 === 0 ? bgColor : "#1a1a1a",
                  transform: isClosed ? "scaleY(0)" : "scaleY(1)",
                  transition: isClosed
                    ? "transform 0.45s cubic-bezier(0.76,0,0.24,1)"
                    : "none",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Content */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center pointer-events-none"
          style={{
            opacity: isShuttering ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {/* Giant bg percentage */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <span className="font-black leading-none select-none tabular-nums" style={{
              fontSize: "clamp(120px, 28vw, 240px)",
              color: \`${accentColor}06\`,
              letterSpacing: "-8px",
            }}>
              {String(percent).padStart(3, "0")}
            </span>
          </div>
          {/* Greeting */}
          <div className="relative z-[2] text-center">
            {greetings.map((greeting, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-screen"
                style={{
                  position: index === 0 ? "relative" : "absolute",
                  top: index === 0 ? undefined : 0,
                  left: index === 0 ? undefined : "50%",
                  transform: index === 0
                    ? undefined
                    : index === currentIndex
                    ? "translateX(-50%) translateY(0)"
                    : index < currentIndex
                    ? "translateX(-50%) translateY(-30px)"
                    : "translateX(-50%) translateY(30px)",
                  opacity: index === currentIndex ? 1 : 0,
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  fontFamily:
                    greeting.lang === "ar" ? "Arial, sans-serif"
                    : greeting.lang === "zh" || greeting.lang === "ja" ? "system-ui, sans-serif"
                    : "inherit",
                }}
              >
                <span className="font-bold leading-none" style={{
                  fontSize: "clamp(42px, 9vw, 80px)",
                  color: accentColor,
                  letterSpacing: "-1px",
                }}>
                  {greeting.text}
                </span>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="absolute bottom-10 left-0 right-0 flex items-center justify-between px-12">
            <span className="text-[11px] tracking-[3px] uppercase" style={{ color: \`${accentColor}30\` }}>
              {greetings[currentIndex]?.lang}
            </span>
            <span className="text-xs tracking-[2px] tabular-nums" style={{ color: \`${accentColor}30\` }}>
              {percent}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};`;

const propsData = [
  { name: "onComplete", type: "() => void", default: "—", description: "Called when the preloader animation finishes" },
  { name: "greetings", type: "{ text: string; lang: string }[]", default: "5 greetings", description: "Array of greeting objects to cycle through" },
  { name: "intervalMs", type: "number", default: "700", description: "Time between greeting transitions in ms" },
  { name: "bgColor", type: "string", default: '"#0f0f0f"', description: "Background color of the blind strips" },
  { name: "accentColor", type: "string", default: '"#ffffff"', description: "Color of the greeting text and counter" },
  { name: "blindCount", type: "number", default: "6", description: "Number of horizontal blind strips" },
  { name: "landingContent", type: "ReactNode", default: "—", description: "Custom content shown after reveal" },
];


const Preloader4Page = () => {
  const [intervalMs, setIntervalMs] = useState(700);
  const [bgColor, setBgColor] = useState("#0f0f0f");
  const [accentColor, setAccentColor] = useState("#ffffff");
  const [blindCount, setBlindCount] = useState(6);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [preloaderKey, setPreloaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Preloaders</p>
        <h1 className="text-2xl font-bold text-foreground">Preloader 4</h1>
        <p className="text-sm text-muted-foreground mt-1">Horizontal blinds shutter with a morphing percentage counter.</p>
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
              <Preloader4 key={preloaderKey} intervalMs={intervalMs} bgColor={bgColor} accentColor={accentColor} blindCount={blindCount} contained />
            </div>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(intervalMs, bgColor, accentColor, blindCount)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Accent Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Blind Count <span className="text-primary ml-1">{blindCount}</span></Label>
              <Slider value={[blindCount]} onValueChange={([v]) => setBlindCount(v)} min={3} max={10} step={1} />
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

export default Preloader4Page;
