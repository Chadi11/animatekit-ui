import { useState } from "react";
import FlashSweepCard from "@/components/animations/FlashSweepCard";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (sweepWidth: number, sweepDuration: number, sweepAngle: number, sweepColor: string, trigger: string, intervalMs: number, width: number, height: number) =>
  `import { useState, useEffect, useRef, useCallback } from "react";

interface FlashSweepCardProps {
  children?: React.ReactNode;
  sweepColor?: string;
  sweepWidth?: number;
  sweepDuration?: number;
  sweepAngle?: number;
  trigger?: "hover" | "view" | "both";
  intervalMs?: number;
  width?: number;
  height?: number;
}

const FlashSweepCard = ({
  children,
  sweepColor = "${sweepColor}",
  sweepWidth = ${sweepWidth},
  sweepDuration = ${sweepDuration},
  sweepAngle = ${sweepAngle},
  trigger = "${trigger}",
  intervalMs = ${intervalMs},
  width = ${width},
  height = ${height},
}: FlashSweepCardProps) => {
  const sweepingRef = useRef(false);
  const [progress, setProgress] = useState(-1);
  const animRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  const isAutoMode = trigger === "view" || trigger === "both";
  const isHoverMode = trigger === "hover" || trigger === "both";

  const runSweep = useCallback(() => {
    if (sweepingRef.current) return;
    sweepingRef.current = true;
    setProgress(0);
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / sweepDuration, 1);
      setProgress(p);
      if (p < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        sweepingRef.current = false;
        setProgress(-1);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, [sweepDuration]);

  useEffect(() => {
    if (!isAutoMode) return;
    const schedule = () => {
      intervalRef.current = setTimeout(() => {
        runSweep();
        schedule();
      }, intervalMs);
    };
    intervalRef.current = setTimeout(() => {
      runSweep();
      schedule();
    }, 800);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, [isAutoMode, intervalMs, runSweep]);

  const handleMouseEnter = useCallback(() => {
    if (!isHoverMode) return;
    runSweep();
  }, [isHoverMode, runSweep]);

  const totalTravel = width + sweepWidth * 2;
  const beamCenterPx = -sweepWidth + progress * totalTravel;
  const beamCenterPct = (beamCenterPx / width) * 100;
  const beamHalfPct = (sweepWidth / width) * 100;

  const angleRad = ((sweepAngle - 90) * Math.PI) / 180;
  const skewDeg = (Math.atan(Math.cos(angleRad) / Math.sin(angleRad)) * 180) / Math.PI;

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ width, height, perspective: 600 }}
    >
      <div className="w-full h-full rounded-xl relative overflow-hidden border border-white/[0.12] will-change-transform"
        style={{ background: "linear-gradient(135deg, hsl(0 0% 14%), hsl(0 0% 9%))" }}
      >
        <div className="relative z-[1] w-full h-full">
          {children ?? (
            <>
              <div className="absolute top-4 right-4 text-[11px] px-2.5 py-[3px] rounded-full border border-white/15 text-white/50 tracking-wide uppercase">
                Hover Me
              </div>
              <div className="absolute bottom-5 left-5">
                <h3 className="m-0 text-lg font-medium text-white tracking-tight">
                  Flash Sweep
                </h3>
                <p className="m-0 mt-1 text-[13px] text-white/45">
                  A blade of light, corner to corner
                </p>
              </div>
            </>
          )}
        </div>

        {progress >= 0 && (
          <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: \`\${beamCenterPct - beamHalfPct}%\`,
                width: \`\${beamHalfPct * 2}%\`,
                transform: \`skewX(\${skewDeg}deg)\`,
                transformOrigin: "center",
                background: \`linear-gradient(
                  to right,
                  transparent 0%,
                  \${sweepColor.replace(/[\d.]+\)$/, "0.0)")} 10%,
                  ${sweepColor} 50%,
                  \${sweepColor.replace(/[\d.]+\)$/, "0.0)")} 90%,
                  transparent 100%
                )\`,
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none z-[3] rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]" />
      </div>
    </div>
  );
};
// Usage:
// <FlashSweepCard sweepWidth={${sweepWidth}} sweepDuration={${sweepDuration}} sweepAngle={${sweepAngle}} trigger="${trigger}" intervalMs={${intervalMs}} width={${width}} height={${height}}>
//   <div style={{ padding: 24, color: "white" }}>
//     <h3>Flash Sweep</h3>
//     <p>A blade of light</p>
//   </div>
// </FlashSweepCard>`;

const triggers = ["hover", "view", "both"] as const;

const propsData = [
  { name: "children", type: "ReactNode", default: "—", description: "Card content" },
  { name: "sweepColor", type: "string", default: '"rgba(255,255,255,0.55)"', description: "Color of the sweep beam" },
  { name: "sweepWidth", type: "number", default: "80", description: "Width of the light beam in px" },
  { name: "sweepDuration", type: "number", default: "600", description: "Duration of one sweep in ms" },
  { name: "sweepAngle", type: "number", default: "120", description: "Angle of the sweep beam in degrees" },
  { name: "trigger", type: '"hover" | "view" | "both"', default: '"both"', description: "What triggers the sweep animation" },
  { name: "intervalMs", type: "number", default: "3000", description: "Auto-sweep interval in ms (view/both modes)" },
  { name: "width", type: "number", default: "320", description: "Card width in px" },
  { name: "height", type: "number", default: "200", description: "Card height in px" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const FlashSweepCardPage = () => {
  const [sweepWidth, setSweepWidth] = useState(160);
  const [sweepDuration, setSweepDuration] = useState(1200);
  const [sweepAngle, setSweepAngle] = useState(150);
  const [sweepColor, setSweepColor] = useState("rgba(255,255,255,0.55)");
  const [trigger, setTrigger] = useState<"hover" | "view" | "both">("both");
  const [intervalMs, setIntervalMs] = useState(1000);
  const [cardWidth, setCardWidth] = useState(320);
  const [cardHeight, setCardHeight] = useState(200);
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Cards</p>
        <h1 className="text-2xl font-bold text-foreground">Flash Sweep Card</h1>
        <p className="text-sm text-muted-foreground mt-1">A card with a skewed light beam that sweeps across on hover or at intervals.</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame>
            <FlashSweepCard sweepColor={sweepColor} sweepWidth={sweepWidth} sweepDuration={sweepDuration} sweepAngle={sweepAngle} trigger={trigger} intervalMs={intervalMs} width={cardWidth} height={cardHeight} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(sweepWidth, sweepDuration, sweepAngle, sweepColor, trigger, intervalMs, cardWidth, cardHeight)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Trigger Mode</Label>
              <ToggleGroup type="single" value={trigger} onValueChange={(v) => v && setTrigger(v as typeof trigger)} className="justify-start">
                {triggers.map((t) => (<ToggleGroupItem key={t} value={t} className="capitalize text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{t}</ToggleGroupItem>))}
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Sweep Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={sweepColor} onChange={(e) => setSweepColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={sweepColor} onChange={(e) => setSweepColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Sweep Width <span className="text-primary ml-1">{sweepWidth}px</span></Label>
              <Slider value={[sweepWidth]} onValueChange={([v]) => setSweepWidth(v)} min={40} max={300} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Duration (ms) <span className="text-primary ml-1">{sweepDuration}</span></Label>
              <Slider value={[sweepDuration]} onValueChange={([v]) => setSweepDuration(v)} min={200} max={2000} step={50} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Interval (s) <span className="text-primary ml-1">{(intervalMs / 1000).toFixed(1)}</span></Label>
              <Slider value={[intervalMs]} onValueChange={([v]) => setIntervalMs(v)} min={1000} max={8000} step={500} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Angle <span className="text-primary ml-1">{sweepAngle}°</span></Label>
              <Slider value={[sweepAngle]} onValueChange={([v]) => setSweepAngle(v)} min={45} max={170} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Width <span className="text-primary ml-1">{cardWidth}px</span></Label>
              <Slider value={[cardWidth]} onValueChange={([v]) => setCardWidth(v)} min={200} max={500} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Height <span className="text-primary ml-1">{cardHeight}px</span></Label>
              <Slider value={[cardHeight]} onValueChange={([v]) => setCardHeight(v)} min={120} max={400} step={10} />
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

export default FlashSweepCardPage;
