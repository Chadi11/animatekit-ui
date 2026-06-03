import { useState } from "react";
import NeonFlickerButton from "@/components/animations/NeonFlickerButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, trigger: string, size: string, color: string) =>
  `import { useState, useEffect, useRef } from "react";

interface NeonFlickerButtonProps {
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

const NeonFlickerButton = ({
  label = "${label}",
  onClick,
  trigger = "${trigger}",
  size = "${size}",
  color = "${color}",
}: NeonFlickerButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [glow, setGlow] = useState(0);
  const [surging, setSurging] = useState(false);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const s = SIZES[size];

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); setGlow(0); return; }
    let lastFlicker = 0;
    let currentGlow = 0.7;
    let flickerInterval = 120;

    const tick = (now: number) => {
      if (!timeRef.current) timeRef.current = now;
      const elapsed = now - lastFlicker;
      if (elapsed > flickerInterval) {
        lastFlicker = now;
        const r = Math.random();
        if (r < 0.08) { currentGlow = 0.05; flickerInterval = 40 + Math.random() * 60; }
        else if (r < 0.15) { currentGlow = 0.3 + Math.random() * 0.3; flickerInterval = 30 + Math.random() * 40; }
        else if (r < 0.25) { currentGlow = 0.9 + Math.random() * 0.1; flickerInterval = 80 + Math.random() * 120; }
        else { currentGlow = 0.65 + Math.random() * 0.2; flickerInterval = 100 + Math.random() * 200; }
        setGlow(currentGlow);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); timeRef.current = 0; };
  }, [active]);

  const handleClick = () => {
    setSurging(true);
    setGlow(0);
    onClick?.();
    setTimeout(() => { setGlow(1); }, 80);
    setTimeout(() => { setGlow(0.8); setSurging(false); }, 250);
  };

  const glowPx = glow * 18;
  const spread = glow * 6;
  const opacity = active ? 0.3 + glow * 0.7 : 0.18;
  const textGlow = active ? \`0 0 \${glow * 10}px ${color}\` : "none";

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      <button
        onClick={handleClick}
        className="relative z-[1] font-semibold cursor-pointer tracking-wide outline-none select-none"
        style={{
          fontSize: s.fontSize,
          padding: \`\${s.paddingY}px \${s.paddingX}px\`,
          borderRadius: s.borderRadius,
          border: \`1.5px solid ${color}\`,
          borderColor: \`rgba(\${hexToRgb(color)}, \${opacity})\`,
          background: active ? \`rgba(\${hexToRgb(color)}, \${glow * 0.07})\` : "rgba(8,8,12,0.95)",
          color: active ? color : "rgba(255,255,255,0.8)",
          transform: surging ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.1s ease",
          boxShadow: active
            ? \`0 0 \${glowPx}px \${spread}px rgba(\${hexToRgb(color)}, \${glow * 0.4}),
               inset 0 0 \${glowPx / 2}px rgba(\${hexToRgb(color)}, \${glow * 0.15})\`
            : "none",
          textShadow: textGlow,
        }}
      >
        {label}
      </button>
    </div>
  );
};

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return \`\${r},\${g},\${b}\`;
}`;

const triggers = ["hover", "view"] as const;
const sizes = ["sm", "md", "lg"] as const;

const propsData = [
  { name: "label", type: "string", default: '"Click Me"', description: "Button text" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "trigger", type: '"hover" | "view"', default: '"view"', description: "When the flicker animation activates" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "color", type: "string", default: '"#00f0ff"', description: "Neon glow color" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const NeonFlickerButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [trigger, setTrigger] = useState<"hover" | "view">("view");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [color, setColor] = useState("#00f0ff");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Neon Flicker Button</h1>
        <p className="text-sm text-muted-foreground mt-1">A button with a flickering neon tube glow effect.</p>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame><NeonFlickerButton label={label} trigger={trigger} size={size} color={color} /></PreviewFrame>
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

export default NeonFlickerButtonPage;