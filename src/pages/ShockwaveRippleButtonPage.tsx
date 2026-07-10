import { useState } from "react";
import ShockwaveRippleButton from "@/components/animations/ShockwaveRippleButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, trigger: string, size: string) =>
  `import { useState, useEffect, useRef, useCallback } from "react";

interface ShockwaveRippleButtonProps {
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

const RING_COLORS = ["#00e5ff", "#7c3aed", "#10b981", "#f59e0b", "#ef4444"];

interface Ring { id: number; born: number; color: string; fast: boolean; }

const ShockwaveRippleButton = ({
  label = "${label}",
  onClick,
  trigger = "${trigger}",
  size = "${size}",
}: ShockwaveRippleButtonProps) => {
  const [active, setActive]   = useState(trigger === "view");
  const [rings, setRings]     = useState<Ring[]>([]);
  const [clicked, setClicked] = useState(false);
  const ringIdRef    = useRef(0);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef       = useRef<number>(0);
  const nowRef       = useRef(0);
  const colorIdxRef  = useRef(0);
  const s = SIZES[size];

  useEffect(() => {
    const tick = (t: number) => { nowRef.current = t; rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const spawnRing = useCallback((fast = false) => {
    const id = ringIdRef.current++;
    const color = RING_COLORS[colorIdxRef.current % RING_COLORS.length];
    colorIdxRef.current++;
    setRings((prev) => [...prev.slice(-8), { id, born: nowRef.current, color, fast }]);
  }, []);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRings([]);
      return;
    }
    spawnRing();
    intervalRef.current = setInterval(() => spawnRing(), 900);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, spawnRing]);

  useEffect(() => {
    const cull = setInterval(() => {
      setRings((prev) => prev.filter((r) => {
        const age = nowRef.current - r.born;
        const dur = r.fast ? 500 : 1200;
        return age < dur;
      }));
    }, 100);
    return () => clearInterval(cull);
  }, []);

  const handleClick = useCallback(() => {
    setClicked(true);
    onClick?.();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnRing(true), i * 80);
    }
    setTimeout(() => setClicked(false), 500);
  }, [onClick, spawnRing]);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      {/* Ripple rings */}
      {rings.map((ring) => {
        const age   = nowRef.current - ring.born;
        const dur   = ring.fast ? 500 : 1200;
        const p     = Math.min(age / dur, 1);
        const ease  = 1 - Math.pow(1 - p, 3);
        const expand = ease * (ring.fast ? 28 : 20);
        const opacity = (1 - ease) * 0.8;
        return (
          <div
            key={ring.id}
            className="absolute pointer-events-none z-0"
            style={{
              inset: -(expand + 2),
              borderRadius: s.borderRadius + expand + 2,
              border: \`1.5px solid \${ring.color}\`,
              opacity,
            }}
          />
        );
      })}

      {/* Static base border */}
      <div className="absolute pointer-events-none z-0" style={{
        inset: -1.5,
        borderRadius: s.borderRadius + 1.5,
        border: "1.5px solid rgba(255,255,255,0.14)",
      }} />

      <button
        onClick={handleClick}
        className="relative z-[1] border-none cursor-pointer tracking-wide outline-none select-none"
        style={{
          fontSize: s.fontSize, fontWeight: 600,
          padding: \`\${s.paddingY}px \${s.paddingX}px\`,
          borderRadius: s.borderRadius,
          background: clicked ? "rgba(0,229,255,0.06)" : "rgba(8,8,12,0.96)",
          color: "rgba(255,255,255,0.88)",
          transition: "background 0.2s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
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
  { name: "trigger", type: '"hover" | "view"', default: '"view"', description: "When shockwave rings appear" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const ShockwaveRippleButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [trigger, setTrigger] = useState<"hover" | "view">("view");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Shockwave Ripple Button</h1>
        <p className="text-sm text-muted-foreground mt-1">Multiple expanding colored shockwave rings on hover and click.</p>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame><ShockwaveRippleButton label={label} trigger={trigger} size={size} /></PreviewFrame>
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

export default ShockwaveRippleButtonPage;