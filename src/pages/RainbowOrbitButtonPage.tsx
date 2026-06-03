import { useState } from "react";
import RainbowOrbitButton from "@/components/animations/RainbowOrbitButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, trigger: string, size: string) =>
  `import { useState, useEffect, useRef } from "react";

interface RainbowOrbitButtonProps {
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

const RainbowOrbitButton = ({
  label = "${label}",
  onClick,
  trigger = "${trigger}",
  size = "${size}",
}: RainbowOrbitButtonProps) => {
  const [active, setActive] = useState(trigger === "view");
  const [clicked, setClicked] = useState(false);
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number>(0);
  const angleRef = useRef(0);
  const s = SIZES[size];

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); return; }
    const speed = clicked ? 4 : 1.2;
    const tick = () => {
      angleRef.current = (angleRef.current + speed) % 360;
      setAngle(angleRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, clicked]);

  const handleClick = () => {
    setClicked(true);
    onClick?.();
    setTimeout(() => setClicked(false), 600);
  };

  const rainbow = \`conic-gradient(from \${angle}deg, #ff0080, #ff8c00, #ffe000, #40e0d0, #0080ff, #8000ff, #ff0080)\`;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
    >
      {/* Rainbow border layer */}
      <div className="absolute z-0" style={{
        inset: -s.borderWidth,
        borderRadius: s.borderRadius + s.borderWidth,
        background: active ? rainbow : "transparent",
        border: active ? "none" : \`\${s.borderWidth}px solid rgba(255,255,255,0.15)\`,
        transition: "opacity 0.3s ease",
        filter: clicked ? \`blur(1px) brightness(2)\` : active ? "blur(0.5px)" : "none",
      }} />

      {/* Flash ring on click */}
      {clicked && (
        <div className="absolute z-0 pointer-events-none" style={{
          inset: -s.borderWidth - 4,
          borderRadius: s.borderRadius + s.borderWidth + 4,
          border: "2px solid rgba(255,255,255,0.7)",
          animation: "pulse-ring 0.6s ease-out forwards",
        }} />
      )}

      {/* Button face */}
      <button
        onClick={handleClick}
        className="relative z-[1] border-none cursor-pointer tracking-wide outline-none select-none backdrop-blur-sm"
        style={{
          fontSize: s.fontSize,
          fontWeight: 600,
          padding: \`\${s.paddingY}px \${s.paddingX}px\`,
          borderRadius: s.borderRadius,
          background: clicked
            ? "rgba(255,255,255,0.15)"
            : "rgba(10,10,10,0.92)",
          color: clicked ? "#ffffff" : "rgba(255,255,255,0.9)",
          transition: "background 0.2s ease, color 0.2s ease, transform 0.1s ease",
          transform: clicked ? "scale(0.97)" : "scale(1)",
        }}
      >
        {label}
      </button>

      <style>{\`
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
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
  { name: "trigger", type: '"hover" | "view"', default: '"view"', description: "When the rainbow animation activates" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const RainbowOrbitButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [trigger, setTrigger] = useState<"hover" | "view">("view");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Rainbow Orbit Button</h1>
        <p className="text-sm text-muted-foreground mt-1">A button with a rotating conic-gradient rainbow border effect.</p>
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
            <RainbowOrbitButton label={label} trigger={trigger} size={size} />
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

export default RainbowOrbitButtonPage;
