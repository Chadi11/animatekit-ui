import { useState } from "react";
import ParticleBurstButton from "@/components/animations/ParticleBurstButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, trigger: string, size: string) =>
  `import { useState, useEffect, useRef, useCallback } from "react";

interface ParticleBurstButtonProps {
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

const COLORS = ["#ffd700", "#ff8c00", "#ff4500", "#ffffff", "#ffb347"];
const PARTICLE_COUNT = 16;

interface Particle {
  id: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  opacity: number;
  burstAngle?: number;
  burstDist?: number;
}

const ParticleBurstButton = ({
  label = "${label}",
  onClick,
  trigger = "${trigger}",
  size = "${size}",
}: ParticleBurstButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [bursting, setBursting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [burstParticles, setBurstParticles] = useState<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const btnRef = useRef<HTMLDivElement>(null);
  const s = SIZES[size];

  const makeParticles = (): Particle[] =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      progress: i / PARTICLE_COUNT,
      speed: 0.003 + Math.random() * 0.004,
      size: 2 + Math.random() * 2.5,
      color: COLORS[i % COLORS.length],
      opacity: 0.6 + Math.random() * 0.4,
    }));

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); setParticles([]); return; }
    const pts = makeParticles();
    setParticles(pts);
    const tick = () => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          progress: (p.progress + p.speed) % 1,
          opacity: 0.5 + 0.5 * Math.sin(p.progress * Math.PI * 6),
        }))
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  const getPoint = (p: number, w: number, h: number) => {
    const perim = 2 * (w + h);
    const pos = p * perim;
    if (pos < w) return { x: pos, y: 0 };
    if (pos < w + h) return { x: w, y: pos - w };
    if (pos < 2 * w + h) return { x: w - (pos - w - h), y: h };
    return { x: 0, y: h - (pos - 2 * w - h) };
  };

  const handleClick = useCallback(() => {
    setBursting(true);
    onClick?.();
    const burst = particles.map((p) => ({
      ...p,
      burstAngle: Math.random() * Math.PI * 2,
      burstDist: 30 + Math.random() * 40,
    }));
    setBurstParticles(burst);
    setTimeout(() => { setBursting(false); setBurstParticles([]); }, 700);
  }, [particles, onClick]);

  const W = 200; const H = 54;

  return (
    <div
      ref={btnRef}
      className="relative inline-flex"
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      <svg
        className="absolute -inset-[3px] pointer-events-none z-[2] overflow-visible"
        style={{ width: "calc(100% + 6px)", height: "calc(100% + 6px)" }}
        viewBox={\`0 0 \${W + 6} \${H + 6}\`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="p-glow">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect x={3} y={3} width={W} height={H} rx={s.borderRadius}
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

        {!bursting && particles.map((p) => {
          const pt = getPoint(p.progress, W, H);
          return (
            <circle key={p.id} cx={pt.x + 3} cy={pt.y + 3} r={p.size / 2}
              fill={p.color} opacity={p.opacity} filter="url(#p-glow)" />
          );
        })}

        {bursting && burstParticles.map((p) => {
          const pt = getPoint(p.progress, W, H);
          return (
            <circle key={\`burst-\${p.id}\`} cx={pt.x + 3} cy={pt.y + 3} r={p.size / 2}
              fill={p.color} opacity={p.opacity} filter="url(#p-glow)"
              style={{
                transform: \`translate(\${Math.cos(p.burstAngle!) * p.burstDist!}px, \${Math.sin(p.burstAngle!) * p.burstDist!}px)\`,
                transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                opacity: 0,
              }}
            />
          );
        })}
      </svg>

      <button
        onClick={handleClick}
        className="relative z-[1] font-semibold border-none cursor-pointer tracking-wide outline-none select-none"
        style={{
          fontSize: s.fontSize,
          padding: \`\${s.paddingY}px \${s.paddingX}px\`,
          borderRadius: s.borderRadius,
          background: bursting ? "rgba(255,180,0,0.08)" : "rgba(8,8,12,0.95)",
          color: bursting ? "#ffd700" : "rgba(255,255,255,0.88)",
          transition: "background 0.2s ease, color 0.2s ease, transform 0.1s ease",
          transform: bursting ? "scale(0.96)" : "scale(1)",
        }}
      >
        {label}
      </button>
    </div>
  );
};`;

const triggers = ["hover", "view"] as const;
const sizes = ["sm", "md", "lg"] as const;

const propsData = [
  { name: "label", type: "string", default: '"Click Me"', description: "Button text" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "trigger", type: '"hover" | "view"', default: '"view"', description: "When particles orbit" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const ParticleBurstButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [trigger, setTrigger] = useState<"hover" | "view">("view");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Particle Burst Button</h1>
        <p className="text-sm text-muted-foreground mt-1">Particles orbit the perimeter and burst outward on click.</p>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame><ParticleBurstButton label={label} trigger={trigger} size={size} /></PreviewFrame>
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
      <div className="px-4 sm:px-6 md:px-8 pb-8"><PropsTable props={propsData} /></div>
    </div>
  );
};

export default ParticleBurstButtonPage;