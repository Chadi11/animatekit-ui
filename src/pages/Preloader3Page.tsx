import { useState } from "react";
import Preloader3 from "@/components/animations/Preloader3";
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

interface Preloader3Props {
  onComplete?: () => void;
  greetings?: { text: string; lang: string }[];
  intervalMs?: number;
  bgColor?: string;
  accentColor?: string;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const COLS = 6;

const Preloader3 = ({
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
}: Preloader3Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"greet" | "wipe" | "done">("greet");
  const [visibleLetters, setVisibleLetters] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => {
    if (phase !== "greet") return;
    clear();
    setVisibleLetters(0);
    const word = greetings[currentIndex].text;
    word.split("").forEach((_, i) => {
      const t = setTimeout(() => setVisibleLetters(i + 1), i * 65 + 100);
      timers.current.push(t);
    });
    return clear;
  }, [currentIndex, phase]);

  useEffect(() => {
    if (phase !== "greet") return;
    const word = greetings[currentIndex].text;
    const letterDone = word.length * 65 + 100;
    const hold = Math.max(intervalMs - letterDone, 260);
    const t = setTimeout(() => {
      if (currentIndex < greetings.length - 1) {
        setCurrentIndex((p) => p + 1);
      } else {
        const t2 = setTimeout(() => {
          setPhase("wipe");
          const t3 = setTimeout(() => { setPhase("done"); onComplete?.(); }, 1200);
          timers.current.push(t3);
        }, 380);
        timers.current.push(t2);
      }
    }, letterDone + hold);
    timers.current.push(t);
    return clear;
  }, [currentIndex, phase]);

  const isWiping = phase === "wipe";
  const isDone   = phase === "done";
  const word     = greetings[currentIndex]?.text ?? "";
  const lang     = greetings[currentIndex]?.lang ?? "en";

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

      {/* Column wipe */}
      {!isDone && [...Array(COLS)].map((_, i) => {
        const colW = 100 / COLS;
        return (
          <div
            key={i}
            className="absolute top-0 bottom-0 z-50"
            style={{
              left: \`\${i * colW}%\`,
              width: \`\${colW + 0.1}%\`,
              background: bgColor,
              transform: isWiping ? "translateY(-105%)" : "translateY(0)",
              transition: isWiping
                ? \`transform 0.75s cubic-bezier(0.76,0,0.24,1) \${i * 60}ms\`
                : "none",
              clipPath: \`polygon(0% 0%, 100% 0%, 100% calc(100% - \${i * 8}px), 0% calc(100% - \${(i + 1) * 8}px))\`,
            }}
          />
        );
      })}

      {/* Greeting text */}
      {!isDone && (
        <div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4 pointer-events-none"
          style={{
            opacity: isWiping ? 0 : 1,
            transition: "opacity 0.25s ease",
          }}
        >
          <div
            className="flex items-baseline flex-wrap justify-center"
            style={{
              fontFamily:
                lang === "ar" ? "Arial, sans-serif"
                : lang === "zh" || lang === "ja" ? "system-ui, sans-serif"
                : "inherit",
            }}
          >
            {word.split("").map((char, i) => (
              <span
                key={\`\${currentIndex}-\${i}\`}
                className="inline-block font-extrabold leading-none"
                style={{
                  fontSize: "clamp(52px, 11vw, 96px)",
                  color: accentColor,
                  letterSpacing: "-1px",
                  opacity: i < visibleLetters ? 1 : 0,
                  transform: i < visibleLetters ? "translateY(0)" : "translateY(18px)",
                  transition: "opacity 0.22s ease, transform 0.22s ease",
                }}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="text-[11px] tracking-[4px] uppercase" style={{
            color: \`${accentColor}40\`,
            opacity: visibleLetters >= word.length ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}>
            {lang}
          </div>
          <div className="absolute bottom-9 right-10 text-xs tracking-[2px] tabular-nums" style={{
            color: \`${accentColor}25\`,
          }}>
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="mx-1.5" style={{ color: \`${accentColor}15\` }}>/</span>
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
  { name: "intervalMs", type: "number", default: "750", description: "Time between greeting transitions in ms" },
  { name: "bgColor", type: "string", default: '"#111111"', description: "Background color of diagonal columns" },
  { name: "accentColor", type: "string", default: '"#ffffff"', description: "Color of the greeting text and accents" },
  { name: "landingContent", type: "ReactNode", default: "—", description: "Custom content shown after reveal" },
];


const Preloader3Page = () => {
  const [intervalMs, setIntervalMs] = useState(750);
  const [bgColor, setBgColor] = useState("#111111");
  const [accentColor, setAccentColor] = useState("#ffffff");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [preloaderKey, setPreloaderKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Preloaders</p>
        <h1 className="text-2xl font-bold text-foreground">Preloader 3</h1>
        <p className="text-sm text-muted-foreground mt-1">Diagonal curtain wipe with letter-by-letter text reveal.</p>
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
              <Preloader3 key={preloaderKey} intervalMs={intervalMs} bgColor={bgColor} accentColor={accentColor} contained />
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

export default Preloader3Page;
