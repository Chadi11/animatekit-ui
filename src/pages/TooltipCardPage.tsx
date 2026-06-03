import { useState } from "react";
import TooltipCard from "@/components/animations/TooltipCard";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (tooltipWidth: number, animationDuration: number, offsetX: number, offsetY: number, trigger: string, width: number, height: number) =>
  `import { useState, useRef, useCallback } from "react";

interface TooltipCardProps {
  children?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipWidth?: number;
  offset?: { x: number; y: number };
  animationDuration?: number;
  trigger?: "hover" | "always";
  width?: number;
  height?: number;
}

const TooltipCard = ({
  children,
  tooltip,
  tooltipWidth = ${tooltipWidth},
  offset = { x: 16, y: 16 },
  animationDuration = ${animationDuration},
  trigger = "${trigger}",
  width = ${width},
  height = ${height},
}: TooltipCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(trigger === "always");
  const rafRef = useRef<number>(0);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const factor = animationDuration <= 80 ? 0.35 : animationDuration <= 150 ? 0.2 : 0.12;

  const animatePos = useCallback(() => {
    const dx = targetPos.current.x - currentPos.current.x;
    const dy = targetPos.current.y - currentPos.current.y;
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      currentPos.current = {
        x: lerp(currentPos.current.x, targetPos.current.x, factor),
        y: lerp(currentPos.current.y, targetPos.current.y, factor),
      };
      setPos({ ...currentPos.current });
      rafRef.current = requestAnimationFrame(animatePos);
    }
  }, [factor]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left + offset.x,
      y: e.clientY - rect.top + offset.y,
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animatePos);
  }, [offset, animatePos]);

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (trigger !== "always") setVisible(false);
    cancelAnimationFrame(rafRef.current);
  }, [trigger]);

  const defaultTooltip = (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
          background: "#4ade80", boxShadow: "0 0 6px #4ade80",
        }} />
        <span className="text-[11px] text-white/50 tracking-wide uppercase">
          Tooltip Card
        </span>
      </div>
      <p className="m-0 text-[13px] text-white font-medium leading-snug">
        I follow your cursor
      </p>
      <p className="m-0 text-xs text-white/40 leading-relaxed">
        Move your mouse around to see me glide
      </p>
    </div>
  );

  const defaultChildren = (
    <>
      <div className="absolute top-4 right-4 text-[11px] py-[3px] px-2.5 rounded-[20px] border border-white/15 text-white/50 tracking-wide uppercase">
        Hover Me
      </div>
      <div className="absolute bottom-5 left-5">
        <h3 className="m-0 text-lg font-medium text-white tracking-tight">
          Tooltip Card
        </h3>
        <p className="m-0 mt-1 text-[13px] text-white/45">
          Tooltip follows your cursor
        </p>
      </div>
    </>
  );

  return (
    <div
      ref={cardRef}
      className="relative select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width, height }}
    >
      <div className="w-full h-full rounded-xl relative overflow-hidden cursor-none"
        style={{
          background: "linear-gradient(135deg, hsl(0 0% 14%), hsl(0 0% 9%))",
          border: "1px solid hsl(0 0% 18%)",
        }}
      >
        <div className="relative z-[1] w-full h-full">
          {children ?? defaultChildren}
        </div>
        <div className="absolute inset-0 pointer-events-none z-[2] rounded-xl"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)" }}
        />
      </div>

      {visible && (
        <div
          className="absolute pointer-events-none z-[100]"
          style={{
            left: pos.x, top: pos.y,
            width: tooltipWidth,
            opacity: visible ? 1 : 0, transition: "opacity 0.15s ease",
          }}
        >
          <div className="rounded-[10px] px-3 py-2.5 backdrop-blur-xl"
            style={{
              background: "hsl(0 0% 10% / 0.96)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset",
            }}
          >
            {tooltip ?? defaultTooltip}
          </div>
          <div className="absolute -top-[5px] left-3.5 w-[9px] h-[9px] rounded-tl-sm border-r-0 border-b-0" style={{
            background: "hsl(0 0% 10% / 0.96)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            transform: "rotate(45deg)",
          }} />
        </div>
      )}
    </div>
  );
};
// Usage:
// <TooltipCard tooltipWidth={${tooltipWidth}} offset={{ x: ${offsetX}, y: ${offsetY} }} animationDuration={${animationDuration}} trigger="${trigger}" width={${width}} height={${height}} />`;

const smoothnessOptions = [
  { label: "Fast", value: 80 },
  { label: "Medium", value: 120 },
  { label: "Slow", value: 200 },
] as const;

const propsData = [
  { name: "children", type: "ReactNode", default: "—", description: "Card content" },
  { name: "tooltip", type: "ReactNode", default: "—", description: "Custom tooltip content" },
  { name: "tooltipWidth", type: "number", default: "200", description: "Width of the tooltip in px" },
  { name: "offset", type: "{ x: number; y: number }", default: "{ x: 16, y: 16 }", description: "Offset from cursor position" },
  { name: "animationDuration", type: "number", default: "120", description: "Controls smoothness (lower = snappier)" },
  { name: "trigger", type: '"hover" | "always"', default: '"hover"', description: "Show tooltip on hover or always" },
  { name: "width", type: "number", default: "320", description: "Card width in px" },
  { name: "height", type: "number", default: "200", description: "Card height in px" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const TooltipCardPage = () => {
  const [tooltipWidth, setTooltipWidth] = useState(200);
  const [animationDuration, setAnimationDuration] = useState(120);
  const [offsetX, setOffsetX] = useState(16);
  const [offsetY, setOffsetY] = useState(16);
  const [trigger, setTrigger] = useState<"hover" | "always">("hover");
  const [cardWidth, setCardWidth] = useState(320);
  const [cardHeight, setCardHeight] = useState(200);
  const [view, setView] = useState<"preview" | "code">("preview");

  const smoothnessLabel = animationDuration <= 80 ? "fast" : animationDuration <= 150 ? "medium" : "slow";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Cards</p>
        <h1 className="text-2xl font-bold text-foreground">Tooltip Card</h1>
        <p className="text-sm text-muted-foreground mt-1">A card with a mouse-following tooltip that glides smoothly using lerp interpolation.</p>
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
            <TooltipCard tooltipWidth={tooltipWidth} offset={{ x: offsetX, y: offsetY }} animationDuration={animationDuration} trigger={trigger} width={cardWidth} height={cardHeight} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(tooltipWidth, animationDuration, offsetX, offsetY, trigger, cardWidth, cardHeight)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Trigger</Label>
              <ToggleGroup type="single" value={trigger} onValueChange={(v) => v && setTrigger(v as typeof trigger)} className="justify-start">
                <ToggleGroupItem value="hover" className="capitalize text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">hover</ToggleGroupItem>
                <ToggleGroupItem value="always" className="capitalize text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">always</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Smoothness <span className="text-primary ml-1">{smoothnessLabel}</span></Label>
              <ToggleGroup type="single" value={String(animationDuration)} onValueChange={(v) => v && setAnimationDuration(Number(v))} className="justify-start">
                {smoothnessOptions.map((o) => (
                  <ToggleGroupItem key={o.value} value={String(o.value)} className="capitalize text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{o.label}</ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tooltip Width <span className="text-primary ml-1">{tooltipWidth}px</span></Label>
              <Slider value={[tooltipWidth]} onValueChange={([v]) => setTooltipWidth(v)} min={120} max={350} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Offset X <span className="text-primary ml-1">{offsetX}</span></Label>
              <Slider value={[offsetX]} onValueChange={([v]) => setOffsetX(v)} min={0} max={40} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Offset Y <span className="text-primary ml-1">{offsetY}</span></Label>
              <Slider value={[offsetY]} onValueChange={([v]) => setOffsetY(v)} min={0} max={40} step={2} />
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

export default TooltipCardPage;
