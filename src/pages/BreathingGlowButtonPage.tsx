import { useState } from "react";
import BreathingGlowButton from "@/components/animations/BreathingGlowButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, trigger: string, size: string) =>
  `import { useState, useEffect, useRef } from "react";

interface BreathingGlowButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8, borderWidth: 2 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10, borderWidth: 2 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12, borderWidth: 2 },
};

const BreathingGlowButton = ({
  label = "${label}",
  onClick,
  trigger = "${trigger}",
  size = "${size}",
}: BreathingGlowButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [clicked, setClicked] = useState(false);
  const [hue, setHue] = useState(0);
  const [breathe, setBreathe] = useState(1);
  const [ripple, setRipple] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const s = SIZES[size];

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      setHue(0);
      setBreathe(1);
      return;
    }

    const hueSpeed = clicked ? 3 : 0.6;
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = (now - startRef.current) * 0.001;
      setHue((h) => (h + hueSpeed) % 360);
      const breatheSpeed = clicked ? 8 : 2;
      setBreathe(0.5 + 0.5 * Math.sin(elapsed * breatheSpeed));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [active, clicked]);

  const handleClick = () => {
    setClicked(true);
    setRipple(true);
    onClick?.();
    setTimeout(() => setRipple(false), 700);
    setTimeout(() => setClicked(false), 700);
  };

  const glowColor = \`hsl(\${hue}, 100%, 60%)\`;
  const glowSize = active ? 4 + breathe * 10 : 0;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      {ripple && (
        <div
          className="absolute pointer-events-none z-0"
          style={{
            inset: -s.borderWidth - 2,
            borderRadius: s.borderRadius + s.borderWidth + 2,
            border: \`2px solid \${glowColor}\`,
            animation: "glow-ripple 0.65s ease-out forwards",
          }}
        />
      )}

      <div
        className="absolute z-0"
        style={{
          inset: -s.borderWidth,
          borderRadius: s.borderRadius + s.borderWidth,
          background: active
            ? \`linear-gradient(135deg, hsl(\${hue}, 100%, 55%), hsl(\${(hue + 120) % 360}, 100%, 55%))\`
            : "transparent",
          border: active ? "none" : \`\${s.borderWidth}px solid rgba(255,255,255,0.14)\`,
          boxShadow: active
            ? \`0 0 \${glowSize}px \${glowSize / 2}px hsl(\${hue}, 100%, 50%)\`
            : "none",
          transition: active ? "box-shadow 0.05s ease" : "opacity 0.4s ease",
          opacity: active ? 1 : 0.6,
        }}
      />

      <button
        onClick={handleClick}
        className="relative z-[1] border-none cursor-pointer tracking-wide outline-none select-none backdrop-blur-sm"
        style={{
          fontSize: s.fontSize,
          fontWeight: 600,
          padding: \`\${s.paddingY}px \${s.paddingX}px\`,
          borderRadius: s.borderRadius,
          background: clicked
            ? \`hsl(\${hue}, 60%, 10%)\`
            : "rgba(8,8,12,0.94)",
          color: active
            ? \`hsl(\${hue}, 60%, 85%)\`
            : "rgba(255,255,255,0.85)",
          transition: "background 0.2s ease, color 0.3s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{\`
        @keyframes glow-ripple {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      \`}</style>
    </div>
  );
};
// Usage:
// <BreathingGlowButton label="${label}" trigger="${trigger}" size="${size}" onClick={() => console.log("clicked")} />`;

const triggers = ["hover", "view"] as const;
const sizes = ["sm", "md", "lg"] as const;

const propsData = [
  { name: "label", type: "string", default: '"Click Me"', description: "Button text" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "trigger", type: '"hover" | "view"', default: '"view"', description: "When the glow animation activates" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const BreathingGlowButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [trigger, setTrigger] = useState<"hover" | "view">("view");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Breathing Glow Button</h1>
        <p className="text-sm text-muted-foreground mt-1">A button with a hue-cycling border glow and breathing intensity effect.</p>
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
            <BreathingGlowButton label={label} trigger={trigger} size={size} />
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

export default BreathingGlowButtonPage;
