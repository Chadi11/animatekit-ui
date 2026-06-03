import { useState } from "react";
import Preloader5 from "@/components/animations/Preloader5";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (intervalMs: number, bgColor: string, accentColor: string) =>
  `import { useState, useEffect, useRef } from "react";

interface Preloader5Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  bgColor?: string;
  accentColor?: string;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader5 = ({
  onComplete,
  greetings = [
    { text: "Hello",      lang: "en" },
    { text: "你好",        lang: "zh" },
    { text: "مرحبًا",     lang: "ar" },
    { text: "Hola",       lang: "es" },
    { text: "こんにちは",   lang: "ja" },
  ],
  intervalMs = ${intervalMs},
  bgColor = "${bgColor}",
  accentColor = "${accentColor}",
  landingContent,
  contained = false,
}: Preloader5Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"greet" | "iris" | "done">("greet");
  const [irisScale, setIrisScale] = useState(1);
  const [ringProgress, setRingProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number>(0);
  const ringRafRef = useRef<number>(0);
  const ringStartRef = useRef<number>(0);

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(rafRef.current);
    cancelAnimationFrame(ringRafRef.current);
  };

  useEffect(() => {
    if (phase !== "greet") return;
    ringStartRef.current = performance.now();
    const totalTime = greetings.length * intervalMs;
    const tick = (now: number) => {
      const p = Math.min((now - ringStartRef.current) / totalTime, 1);
      setRingProgress(p);
      if (p < 1) ringRafRef.current = requestAnimationFrame(tick);
    };
    ringRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ringRafRef.current);
  }, [phase, greetings.length, intervalMs]);

  useEffect(() => {
    if (phase !== "greet") return;
    const t = setTimeout(() => {
      if (currentIndex < greetings.length - 1) {
        setCurrentIndex((p) => p + 1);
      } else {
        const t2 = setTimeout(() => {
          setRingProgress(1);
          setPhase("iris");
          const start = performance.now();
          const dur = 950;
          const animate = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            setIrisScale(1 - ease);
            if (p < 1) {
              rafRef.current = requestAnimationFrame(animate);
            } else {
              setPhase("done");
              onComplete?.();
            }
          };
          rafRef.current = requestAnimationFrame(animate);
        }, 400);
        timers.current.push(t2);
      }
    }, intervalMs);
    timers.current.push(t);
    return () => clearAll();
  }, [currentIndex, phase]);

  const isDone = phase === "done";
  const isIris = phase === "iris";
  const R = 38;
  const CIRC = 2 * Math.PI * R;
  const ringDash = ringProgress * CIRC;

  return (
    <div ref={containerRef} className={\`\${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden\`}>
      {/* Landing */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[1]"
        style={{
          background: "#ffffff",
          opacity: isDone || isIris ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {/* Iris circle */}
      {!isDone && (
        <div
          className="absolute rounded-full z-50"
          style={{
            width: 2000, height: 2000,
            top: "50%", left: "50%",
            background: bgColor,
            transform: \`translate(-50%, -50%) scale(\${irisScale})\`,
          }}
        />
      )}

      {/* Greeting content */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-6 pointer-events-none"
          style={{
            opacity: isIris ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <svg width={96} height={96} viewBox="0 0 96 96" className="absolute">
            <circle cx={48} cy={48} r={R} fill="none" stroke={\`${accentColor}12\`} strokeWidth={1} />
            <circle cx={48} cy={48} r={R} fill="none" stroke={\`${accentColor}40\`} strokeWidth={1.5}
              strokeDasharray={\`\${ringDash} \${CIRC}\`} strokeLinecap="round" transform="rotate(-90 48 48)" />
          </svg>
          <div className="relative h-[88px] w-full flex items-center justify-center">
            {greetings.map((g, i) => (
              <div key={i} className="absolute w-full flex items-center justify-center" style={{
                opacity: i === currentIndex ? 1 : 0,
                transform:
                  i === currentIndex ? "scale(1) translateY(0)"
                  : i < currentIndex  ? "scale(0.88) translateY(-14px)"
                  : "scale(1.1) translateY(14px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                fontFamily:
                  g.lang === "ar" ? "Arial, sans-serif"
                  : g.lang === "zh" || g.lang === "ja" ? "system-ui, sans-serif"
                  : "inherit",
              }}>
                <span className="font-bold leading-none" style={{
                  fontSize: "clamp(48px, 10vw, 84px)",
                  color: accentColor,
                  letterSpacing: "-2px",
                }}>
                  {g.text}
                </span>
              </div>
            ))}
          </div>
          <div className="text-[11px] tracking-[4px] uppercase -mt-2.5" style={{
            color: \`${accentColor}35\`,
          }}>
            {greetings[currentIndex]?.lang}
          </div>
          <div className="absolute bottom-9 text-[11px] tracking-[3px] tabular-nums" style={{
            color: \`${accentColor}20\`,
          }}>
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="mx-1.5" style={{ color: \`${accentColor}10\` }}>/</span>
            {String(greetings.length).padStart(2, "0")}
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
  { name: "bgColor", type: "string", default: '"#0d0d0d"', description: "Background color of the iris circle" },
  { name: "accentColor", type: "string", default: '"#ffffff"', description: "Color of the text and progress ring" },
  { name: "landingContent", type: "ReactNode", default: "—", description: "Custom content shown after reveal" },
];


const Preloader5Page = () => {
  const [intervalMs, setIntervalMs] = useState(700);
  const [bgColor, setBgColor] = useState("#0d0d0d");
  const [accentColor, setAccentColor] = useState("#ffffff");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [preloaderKey, setPreloaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Preloaders</p>
        <h1 className="text-2xl font-bold text-foreground">Preloader 5</h1>
        <p className="text-sm text-muted-foreground mt-1">Circular iris wipe with a progress ring and cross-fading greetings.</p>
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
              <Preloader5 key={preloaderKey} intervalMs={intervalMs} bgColor={bgColor} accentColor={accentColor} contained />
            </div>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(intervalMs, bgColor, accentColor)} language="React / TypeScript" />
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
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <PropsTable props={propsData} />
      </div>
    </div>
  );
};

export default Preloader5Page;
