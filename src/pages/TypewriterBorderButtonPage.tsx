import { useState } from "react";
import TypewriterBorderButton from "@/components/animations/TypewriterBorderButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, trigger: string, size: string, color: string) =>
  `import { useState, useRef } from "react";

interface TypewriterBorderButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
  color?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const TypewriterBorderButton = ({
  label = "${label}",
  onClick,
  trigger = "${trigger}",
  size = "${size}",
  color = "${color}",
}: TypewriterBorderButtonProps) => {
  const [drawProgress, setDrawProgress] = useState(trigger === "view" ? 1 : 0);
  const [clicked, setClicked]           = useState(false);
  const [pulsing, setPulsing]           = useState(false);
  const rafRef     = useRef<number>(0);
  const progressRef = useRef(trigger === "view" ? 1 : 0);
  const dirRef      = useRef<"draw" | "erase">("draw");
  const s = SIZES[size];

  const DRAW_SPEED  = 0.022;
  const ERASE_SPEED = 0.028;
  const SNAP_SPEED  = 0.12;

  const animate = (speed: number, target: number) => {
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const diff = target - progressRef.current;
      if (Math.abs(diff) < 0.005) {
        progressRef.current = target;
        setDrawProgress(target);
        return;
      }
      progressRef.current += (diff > 0 ? speed : -speed);
      progressRef.current = Math.max(0, Math.min(1, progressRef.current));
      setDrawProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleMouseEnter = () => {
    if (trigger !== "hover") return;
    dirRef.current = "draw";
    animate(DRAW_SPEED, 1);
  };

  const handleMouseLeave = () => {
    if (trigger !== "hover" || clicked) return;
    dirRef.current = "erase";
    animate(ERASE_SPEED, 0);
  };

  const handleClick = () => {
    setClicked(true);
    setPulsing(true);
    animate(SNAP_SPEED, 1);
    onClick?.();
    setTimeout(() => { setPulsing(false); setClicked(false); }, 600);
  };

  const W = 200; const H = 54;
  const perimeter = 2 * (W + H);
  const drawn = drawProgress * perimeter;
  const remaining = perimeter - drawn;

  const getPenPos = (p: number) => {
    const pos = p * perimeter;
    if (pos < W) return { x: pos + 3, y: 3 };
    if (pos < W + H) return { x: W + 3, y: pos - W + 3 };
    if (pos < 2 * W + H) return { x: W - (pos - W - H) + 3, y: H + 3 };
    return { x: 3, y: H - (pos - 2 * W - H) + 3 };
  };

  const penPos = getPenPos(Math.min(drawProgress, 0.999));
  const glowIntensity = clicked ? 1 : drawProgress;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="absolute -inset-[3px] w-[calc(100%+6px)] h-[calc(100%+6px)] pointer-events-none z-[2] overflow-visible"
        viewBox={\`0 0 \${W + 6} \${H + 6}\`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="tw-glow">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect x={3} y={3} width={W} height={H} rx={s.borderRadius}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />

        {drawProgress > 0 && (
          <rect x={3} y={3} width={W} height={H} rx={s.borderRadius}
            fill="none" stroke={color}
            strokeWidth={pulsing ? 2 : 1.5}
            strokeDasharray={\`\${drawn} \${remaining}\`}
            strokeDashoffset={0}
            strokeLinecap="round"
            filter={glowIntensity > 0.3 ? "url(#tw-glow)" : undefined}
            opacity={0.5 + glowIntensity * 0.5}
          />
        )}

        {drawProgress > 0.01 && drawProgress < 0.999 && (
          <circle cx={penPos.x} cy={penPos.y} r={3} fill={color} filter="url(#tw-glow)" opacity={0.9} />
        )}

        {pulsing && (
          <rect x={3} y={3} width={W} height={H} rx={s.borderRadius}
            fill="none" stroke={color} strokeWidth={1} opacity={0}
            style={{ animation: "tw-pulse 0.55s ease-out forwards" }}
          />
        )}
      </svg>

      <button
        onClick={handleClick}
        className="relative z-[1] border-none cursor-pointer tracking-wide outline-none select-none font-semibold"
        style={{
          fontSize: s.fontSize,
          padding: \`\${s.paddingY}px \${s.paddingX}px\`,
          borderRadius: s.borderRadius,
          background: clicked ? "rgba(255,255,255,0.06)" : "rgba(8,8,12,0.96)",
          color: drawProgress > 0.5 ? "#ffffff" : "rgba(255,255,255,0.7)",
          transition: "background 0.2s ease, color 0.3s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{\`
        @keyframes tw-pulse {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.12); opacity: 0; }
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
  { name: "trigger", type: '"hover" | "view"', default: '"view"', description: "When the border draws" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "color", type: "string", default: '"#ffffff"', description: "Border draw color" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const TypewriterBorderButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [trigger, setTrigger] = useState<"hover" | "view">("view");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [color, setColor] = useState("#ffffff");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Typewriter Border Button</h1>
        <p className="text-sm text-muted-foreground mt-1">SVG border that draws itself like a typewriter with a glowing pen tip.</p>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame><TypewriterBorderButton label={label} trigger={trigger} size={size} color={color} /></PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, trigger, size, color)} language="React / TypeScript" />
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
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-8"><PropsTable props={propsData} /></div>
    </div>
  );
};

export default TypewriterBorderButtonPage;