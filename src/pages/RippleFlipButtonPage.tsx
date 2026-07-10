import { useState } from "react";
import RippleFlipButton from "@/components/animations/RippleFlipButton";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, size: string, bgColor: string, rippleColor: string, textColor: string) =>
  `import { useRef, useState, useCallback } from "react";

interface RippleFlipButtonProps {
  label?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  bgColor?: string;
  rippleColor?: string;
  textColor?: string;
  className?: string;
}

const SIZES = {
  sm: { fontSize: 13, paddingX: 20, paddingY: 10, borderRadius: 8 },
  md: { fontSize: 15, paddingX: 28, paddingY: 13, borderRadius: 10 },
  lg: { fontSize: 17, paddingX: 36, paddingY: 16, borderRadius: 12 },
};

const RippleFlipButton = ({
  label = "${label}",
  onClick,
  size = "${size}",
  bgColor = "${bgColor}",
  rippleColor = "${rippleColor}",
  textColor = "${textColor}",
  className = "",
}: RippleFlipButtonProps) => {
  const [scale, setScale] = useState(0);
  const [textFlipped, setTextFlipped] = useState(false);
  const [clicked, setClicked] = useState(false);
  const rafRef = useRef<number>(0);
  const scaleRef = useRef(0);
  const targetRef = useRef(0);
  const runningRef = useRef(false);
  const s = SIZES[size];

  const startLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    const tick = () => {
      const diff = targetRef.current - scaleRef.current;
      if (Math.abs(diff) < 0.005) {
        scaleRef.current = targetRef.current;
        setScale(targetRef.current);
        runningRef.current = false;
        return;
      }
      const speed = diff > 0 ? 0.09 : 0.07;
      scaleRef.current += diff * speed * (1 / Math.max(scaleRef.current, 0.1));
      scaleRef.current = Math.max(0, Math.min(1, scaleRef.current));
      setScale(scaleRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleMouseEnter = () => {
    targetRef.current = 1;
    startLoop();
    setTimeout(() => setTextFlipped(true), 160);
  };

  const handleMouseLeave = () => {
    targetRef.current = 0;
    startLoop();
    setTimeout(() => setTextFlipped(false), 120);
  };

  const handleClick = () => {
    setClicked(true);
    onClick?.();
    setTimeout(() => setClicked(false), 180);
  };

  const CIRCLE_SIZE = 300;

  return (
    <button
      className={\`relative inline-flex items-center justify-center font-semibold border border-white/10 cursor-pointer tracking-wide overflow-hidden outline-none select-none \${className}\`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        fontSize: s.fontSize,
        padding: \`\${s.paddingY}px \${s.paddingX}px\`,
        borderRadius: s.borderRadius,
        background: bgColor,
        color: textColor,
        transform: clicked ? "scale(0.96)" : "scale(1)",
        transition: "transform 0.15s ease",
      }}
    >
      <span
        className="absolute top-1/2 left-1/2 rounded-full pointer-events-none z-[1]"
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          background: rippleColor,
          transform: \`translate(-50%, -50%) scale(\${scale})\`,
        }}
      />
      <span className="relative z-[2] block">
        <span
          className="block"
          style={{
            transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
            transform: textFlipped ? "translateY(-120%) rotateX(90deg)" : "translateY(0%) rotateX(0deg)",
            opacity: textFlipped ? 0 : 1,
            transformOrigin: "center bottom",
          }}
        >
          {label}
        </span>
        <span
          className="flex items-center justify-center absolute inset-0"
          style={{
            transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
            transform: textFlipped ? "translateY(0%) rotateX(0deg)" : "translateY(120%) rotateX(-90deg)",
            opacity: textFlipped ? 1 : 0,
            transformOrigin: "center top",
          }}
        >
          {label}
        </span>
      </span>
    </button>
  );
};`;

const sizes = ["sm", "md", "lg"] as const;

const propsData = [
  { name: "label", type: "string", default: '"Click Me"', description: "Button text" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size preset" },
  { name: "bgColor", type: "string", default: '"#0a0a0a"', description: "Button background color" },
  { name: "rippleColor", type: "string", default: '"#c2410c"', description: "Expanding circle color" },
  { name: "textColor", type: "string", default: '"#ffffff"', description: "Text color" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const RippleFlipButtonPage = () => {
  const [label, setLabel] = useState("Click Me");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [rippleColor, setRippleColor] = useState("#c2410c");
  const [textColor, setTextColor] = useState("#ffffff");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Ripple Flip Button</h1>
        <p className="text-sm text-muted-foreground mt-1">An expanding circle fill with text flip animation on hover.</p>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame><RippleFlipButton label={label} size={size} bgColor={bgColor} rippleColor={rippleColor} textColor={textColor} /></PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, size, bgColor, rippleColor, textColor)} language="React / TypeScript" />
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
              <Label className="text-xs text-muted-foreground">Size</Label>
              <ToggleGroup type="single" value={size} onValueChange={(v) => v && setSize(v as typeof size)} className="justify-start">
                {sizes.map((s) => (<ToggleGroupItem key={s} value={s} className="uppercase text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{s}</ToggleGroupItem>))}
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Ripple Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={rippleColor} onChange={(e) => setRippleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={rippleColor} onChange={(e) => setRippleColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-8"><PropsTable props={propsData} /></div>
    </div>
  );
};

export default RippleFlipButtonPage;
