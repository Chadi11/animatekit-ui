import { useState } from "react";
import Preloader1 from "@/components/animations/Preloader1";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (intervalMs: number, stripColor: string, stripCount: number) =>
  `import { useState, useEffect } from "react";

interface Preloader1Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  stripColor?: string;
  stripCount?: number;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const Preloader1 = ({
  onComplete,
  greetings = [
    { text: "Hello",     lang: "en" },
    { text: "你好",       lang: "zh" },
    { text: "مرحبًا",    lang: "ar" },
    { text: "Hola",      lang: "es" },
    { text: "こんにちは",  lang: "ja" },
  ],
  intervalMs = ${intervalMs},
  stripColor = "${stripColor}",
  stripCount = ${stripCount},
  landingContent,
  contained = false,
}: Preloader1Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (currentIndex < greetings.length - 1) {
      const t = setTimeout(() => setCurrentIndex((p) => p + 1), intervalMs);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setIsRevealing(true);
        setTimeout(() => {
          setIsDone(true);
          onComplete?.();
        }, 1400);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [currentIndex, greetings.length, intervalMs, onComplete]);

  return (
    <div
      className={\`\${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden\`}
    >
      {/* Landing content */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[1]"
        style={{
          background: "#ffffff",
          opacity: isDone ? 1 : isRevealing ? 1 : 0,
          transition: "opacity 0.4s ease 0.2s",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>

      {/* Strip overlay */}
      {!isDone && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {[...Array(stripCount)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                backgroundColor: stripColor,
                clipPath: \`polygon(\${i * (100 / stripCount)}% 0%, \${(i + 1) * (100 / stripCount)}% 0%, \${(i + 1) * (100 / stripCount)}% 100%, \${i * (100 / stripCount)}% 100%)\`,
                transform: isRevealing ? "translateY(-100%)" : "translateY(0)",
                transition: "transform 0.7s cubic-bezier(0.76,0,0.24,1)",
                transitionDelay: isRevealing ? \`\${i * 80}ms\` : "0ms",
              }}
            />
          ))}
        </div>
      )}

      {/* Greeting text */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none"
          style={{
            opacity: isRevealing ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          {greetings.map((greeting, index) => (
            <div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: index === currentIndex ? 1 : 0,
                transform:
                  index === currentIndex ? "scale(1) translateY(0)"
                  : index < currentIndex  ? "scale(0.9) translateY(-16px)"
                  : "scale(1.1) translateY(16px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                fontFamily:
                  greeting.lang === "ar" ? "Arial, sans-serif"
                  : greeting.lang === "zh" || greeting.lang === "ja" ? "system-ui, sans-serif"
                  : "inherit",
              }}
            >
              <h1 className="font-black m-0 text-white"
                style={{
                  fontSize: "clamp(48px, 10vw, 96px)",
                  letterSpacing: "-2px",
                  textShadow: "0 4px 30px rgba(0,0,0,0.1)",
                }}
              >
                {greeting.text}
              </h1>
            </div>
          ))}
          {/* Progress dots */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            {greetings.map((_, i) => (
              <div key={i} className="h-1.5 rounded-sm" style={{
                width: i === currentIndex ? 40 : 8,
                background: i === currentIndex ? "#fff" : "rgba(255,255,255,0.3)",
                transition: "width 0.3s ease, background 0.3s ease",
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
// Usage:
// const App = () => {
//   const [loaded, setLoaded] = useState(false);
//   return <>{!loaded && <Preloader1 onComplete={() => setLoaded(true)} />}</>
// };`;

const propsData = [
  { name: "onComplete", type: "() => void", default: "—", description: "Called when the preloader animation finishes" },
  { name: "greetings", type: "{ text: string; lang: string }[]", default: "5 greetings", description: "Array of greeting objects to cycle through" },
  { name: "intervalMs", type: "number", default: "700", description: "Time between greeting transitions in ms" },
  { name: "stripColor", type: "string", default: '"#f97316"', description: "Background color of the wipe strips" },
  { name: "stripCount", type: "number", default: "8", description: "Number of vertical strips for the wipe reveal" },
  { name: "landingContent", type: "ReactNode", default: "—", description: "Custom content shown after reveal" },
];


const Preloader1Page = () => {
  const [intervalMs, setIntervalMs] = useState(700);
  const [stripColor, setStripColor] = useState("#f97316");
  const [stripCount, setStripCount] = useState(8);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [preloaderKey, setPreloaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Preloaders</p>
        <h1 className="text-2xl font-bold text-foreground">Preloader 1</h1>
        <p className="text-sm text-muted-foreground mt-1">Strip wipe reveal with cycling greetings in multiple languages.</p>
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
              <Preloader1 key={preloaderKey} intervalMs={intervalMs} stripColor={stripColor} stripCount={stripCount} contained />
            </div>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(intervalMs, stripColor, stripCount)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Strip Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={stripColor} onChange={(e) => setStripColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={stripColor} onChange={(e) => setStripColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Strip Count <span className="text-primary ml-1">{stripCount}</span></Label>
              <Slider value={[stripCount]} onValueChange={([v]) => setStripCount(v)} min={4} max={12} step={1} />
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

export default Preloader1Page;
