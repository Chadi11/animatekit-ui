import { useState } from "react";
import MagneticFillButton from "@/components/animations/MagneticFillButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, trigger: string, size: string) =>
  `import { useState, useEffect, useRef, useCallback } from "react";

interface MagneticFillButtonProps {
  label?: string;
  onClick?: () => void;
  trigger?: "hover" | "view";
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8, borderWidth: 1.5 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10, borderWidth: 1.5 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12, borderWidth: 1.5 },
};

type Side = "left" | "right" | "top" | "bottom";

const MagneticFillButton = ({
  label = "${label}",
  onClick,
  trigger = "${trigger}",
  size = "${size}",
}: MagneticFillButtonProps) => {
  const [fillProgress, setFillProgress] = useState(0);
  const [entrySide, setEntrySide] = useState<Side>("left");
  const [hue, setHue] = useState(200);
  const [clicked, setClicked] = useState(false);
  const [exploding, setExploding] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const fillRef = useRef(0);
  const targetRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const diff = targetRef.current - fillRef.current;
      if (Math.abs(diff) > 0.002) {
        fillRef.current += diff * 0.12;
        setFillProgress(fillRef.current);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fillRef.current = targetRef.current;
        setFillProgress(targetRef.current);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const getEntrySide = useCallback((e: React.MouseEvent<HTMLDivElement>): Side => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return "left";
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const fromLeft = x, fromRight = rect.width - x, fromTop = y, fromBottom = rect.height - y;
    const min = Math.min(fromLeft, fromRight, fromTop, fromBottom);
    if (min === fromLeft) return "left";
    if (min === fromRight) return "right";
    if (min === fromTop) return "top";
    return "bottom";
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger !== "hover") return;
    const side = getEntrySide(e);
    setEntrySide(side);
    targetRef.current = 1;
    setHue(side === "left" ? 200 : side === "right" ? 280 : side === "top" ? 160 : 240);
  }, [trigger, getEntrySide]);

  const handleMouseLeave = useCallback(() => {
    if (trigger !== "hover" || clicked) return;
    targetRef.current = 0;
  }, [trigger, clicked]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger !== "hover") return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setHue(Math.round(180 + x * 120 + y * 60));
  }, [trigger]);

  const handleClick = useCallback(() => {
    setClicked(true);
    setExploding(true);
    targetRef.current = 1;
    fillRef.current = 1;
    setFillProgress(1);
    onClick?.();
    setTimeout(() => {
      setExploding(false);
      targetRef.current = 0;
      setClicked(false);
    }, 600);
  }, [onClick]);

  const s = SIZES[size];
  const fillColor = \`hsl(\${hue}, 90%, 55%)\`;
  const gradientOrigin = { left: "to right", right: "to left", top: "to bottom", bottom: "to top" }[entrySide];

  const fillStyle = fillProgress > 0 ? {
    background: \`linear-gradient(\${gradientOrigin},
      \${fillColor} \${fillProgress * 100 - 5}%,
      transparent \${fillProgress * 100 + 5}%
    )\`,
  } : {};

  return (
    <div
      ref={btnRef}
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {exploding && (
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            inset: -4,
            borderRadius: s.borderRadius + 4,
            background: fillColor,
            animation: "mag-explode 0.55s ease-out forwards",
          }}
        />
      )}

      <div
        className="absolute z-0 overflow-hidden"
        style={{
          inset: -s.borderWidth,
          borderRadius: s.borderRadius + s.borderWidth,
          border: \`\${s.borderWidth}px solid \${
            fillProgress > 0.1 ? \`hsl(\${hue}, 70%, 55%)\` : "rgba(255,255,255,0.18)"
          }\`,
          transition: "border-color 0.3s ease",
          ...fillStyle,
        }}
      />

      <button
        onClick={handleClick}
        className="relative z-[1] font-semibold border-none cursor-pointer tracking-wide backdrop-blur-sm outline-none select-none"
        style={{
          fontSize: s.fontSize,
          padding: \`\${s.paddingY}px \${s.paddingX}px\`,
          borderRadius: s.borderRadius,
          background: fillProgress > 0.5 ? \`hsl(\${hue}, 80%, 14%)\` : "rgba(8,8,12,0.95)",
          color: fillProgress > 0.4 ? \`hsl(\${hue}, 60%, 88%)\` : "rgba(255,255,255,0.85)",
          transition: "background 0.25s ease, color 0.25s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{\`
        @keyframes mag-explode {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
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
  { name: "trigger", type: '"hover" | "view"', default: '"view"', description: "When the fill animation activates" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const MagneticFillButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [trigger, setTrigger] = useState<"hover" | "view">("view");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Magnetic Fill Button</h1>
        <p className="text-sm text-muted-foreground mt-1">A button with direction-aware fill that shifts hue based on mouse position.</p>
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
            <MagneticFillButton label={label} trigger={trigger} size={size} />
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

export default MagneticFillButtonPage;
