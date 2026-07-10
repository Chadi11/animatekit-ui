import { useState } from "react";
import LaserTraceButton from "@/components/animations/LaserTraceButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, trigger: string, size: string) =>
  `import { useState, useEffect, useRef, useCallback } from "react";

interface LaserTraceButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const LaserTraceButton = ({
  label = "${label}",
  onClick,
  trigger = "${trigger}",
  size = "${size}",
}: LaserTraceButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [clicked, setClicked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);
  const s = SIZES[size];

  const SPEED_NORMAL = 0.004;
  const SPEED_FAST = 0.016;

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); return; }
    const speed = clicked ? SPEED_FAST : SPEED_NORMAL;
    const tick = () => {
      progressRef.current = (progressRef.current + speed) % 1;
      setProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, clicked]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      setBurstPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setClicked(true);
    onClick?.();
    setTimeout(() => {
      setClicked(false);
      setBurstPos(null);
    }, 700);
  }, [onClick]);

  const getLaserPoint = (p: number, w: number, h: number, r: number) => {
    const perimeter = 2 * (w + h);
    const pos = p * perimeter;
    if (pos < w) return { x: pos, y: 0 };
    if (pos < w + h) return { x: w, y: pos - w };
    if (pos < 2 * w + h) return { x: w - (pos - w - h), y: h };
    return { x: 0, y: h - (pos - 2 * w - h) };
  };

  const TAIL = 18;
  const tailPoints = Array.from({ length: TAIL }, (_, i) => {
    const p = ((progress - i * 0.012) + 1) % 1;
    return p;
  });

  const W = 200; const H = 60;

  return (
    <div
      ref={btnRef}
      className="relative inline-flex"
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      <svg
        className="absolute -inset-0.5 pointer-events-none z-[2] overflow-visible"
        style={{ width: "calc(100% + 4px)", height: "calc(100% + 4px)" }}
        viewBox={\`0 0 \${W + 4} \${H + 4}\`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="laser-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect
          x={2} y={2} width={W} height={H}
          rx={s.borderRadius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />

        {active && tailPoints.map((tp, i) => {
          const pt = getLaserPoint(tp, W, H, s.borderRadius);
          const opacity = (1 - i / TAIL) * 0.6;
          const r = (1 - i / TAIL) * 2.5;
          return (
            <circle
              key={i}
              cx={pt.x + 2} cy={pt.y + 2}
              r={r}
              fill={clicked ? \`rgba(255,255,255,\${opacity})\` : \`rgba(0,200,255,\${opacity})\`}
              filter="url(#laser-glow)"
            />
          );
        })}

        {active && (() => {
          const pt = getLaserPoint(progress, W, H, s.borderRadius);
          return (
            <circle
              cx={pt.x + 2} cy={pt.y + 2} r={3.5}
              fill={clicked ? "#ffffff" : "#00e5ff"}
              filter="url(#laser-glow)"
            />
          );
        })()}
      </svg>

      {burstPos && (
        <div
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none z-10"
          style={{
            left: burstPos.x,
            top: burstPos.y,
            background: "#00e5ff",
            transform: "translate(-50%, -50%)",
            animation: "laser-burst 0.6s ease-out forwards",
            boxShadow: "0 0 12px 4px rgba(0,229,255,0.6)",
          }}
        />
      )}

      <button
        onClick={handleClick}
        className="relative z-[1] font-semibold border-none cursor-pointer tracking-wide outline-none select-none"
        style={{
          fontSize: s.fontSize,
          padding: \`\${s.paddingY}px \${s.paddingX}px\`,
          borderRadius: s.borderRadius,
          background: clicked ? "rgba(0,229,255,0.08)" : "rgba(8,8,12,0.95)",
          color: clicked ? "#00e5ff" : "rgba(255,255,255,0.88)",
          transition: "background 0.2s ease, color 0.2s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{\`
        @keyframes laser-burst {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(8); opacity: 0; }
        }
      \`}</style>
    </div>
  );
};`;

const triggers = ["hover", "view"] as const;
const sizes = ["sm", "md", "lg"] as const;

const propsData = [
  { name: "label", type: "string", default: '"Click Me"', description: "Button text" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "trigger", type: '"hover" | "view"', default: '"view"', description: "When the laser animation activates" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const LaserTraceButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [trigger, setTrigger] = useState<"hover" | "view">("view");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Laser Trace Button</h1>
        <p className="text-sm text-muted-foreground mt-1">A button with an SVG laser dot that traces the perimeter with a glowing tail.</p>
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
            <LaserTraceButton label={label} trigger={trigger} size={size} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, trigger, size)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Trigger</Label>
              <ToggleGroup type="single" value={trigger} onValueChange={(v) => v && setTrigger(v as typeof trigger)} className="justify-start">
                {triggers.map((t) => (<ToggleGroupItem key={t} value={t} className="capitalize text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{t}</ToggleGroupItem>))}
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size</Label>
              <ToggleGroup type="single" value={size} onValueChange={(v) => v && setSize(v as typeof size)} className="justify-start">
                {sizes.map((s) => (<ToggleGroupItem key={s} value={s} className="uppercase text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{s}</ToggleGroupItem>))}
              </ToggleGroup>
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

export default LaserTraceButtonPage;
