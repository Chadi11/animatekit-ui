import { useState } from "react";
import GlareCard from "@/components/animations/GlareCard";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (glareSize: number, tiltAmount: number, trigger: string, width: number, height: number) =>
  `import { useState, useEffect, useRef, useCallback } from "react";

interface GlareCardProps {
  children?: React.ReactNode;
  glareColor?: string;
  glareSize?: number;
  tiltAmount?: number;
  trigger?: "hover" | "view" | "both";
  width?: number;
  height?: number;
}

const GlareCard = ({
  children,
  glareColor = "rgba(255,255,255,0.15)",
  glareSize = ${glareSize},
  tiltAmount = ${tiltAmount},
  trigger = "${trigger}",
  width = ${width},
  height = ${height},
}: GlareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [autoAngle, setAutoAngle] = useState(0);
  const animRef = useRef<number>(0);

  const isAutoMode = trigger === "view" || trigger === "both";
  const isHoverMode = trigger === "hover" || trigger === "both";

  useEffect(() => {
    if (!isAutoMode) return;
    const start = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - start) * 0.001;
      setAutoAngle(elapsed * 0.8);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isAutoMode]);

  const autoTilt = isAutoMode && !(isHoverMode && isHovering)
    ? {
        x: Math.sin(autoAngle) * tiltAmount * 0.4,
        y: Math.cos(autoAngle * 0.7) * tiltAmount * 0.4,
      }
    : { x: 0, y: 0 };

  const autoGlare = isAutoMode && !(isHoverMode && isHovering)
    ? {
        x: 50 + Math.sin(autoAngle) * 35,
        y: 50 + Math.cos(autoAngle * 0.7) * 35,
      }
    : { x: 50, y: 50 };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isHoverMode) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({
        x: (y - 0.5) * -tiltAmount * 2,
        y: (x - 0.5) * tiltAmount * 2,
      });
      setGlarePos({ x: x * 100, y: y * 100 });
      setIsHovering(true);
    },
    [isHoverMode, tiltAmount]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isHoverMode) return;
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  }, [isHoverMode]);

  const activeTilt = isHoverMode && isHovering ? tilt : autoTilt;
  const activeGlare = isHoverMode && isHovering ? glarePos : autoGlare;
  const showGlare = isHovering || isAutoMode;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ width, height, perspective: 800 }}
    >
      <div
        className="w-full h-full rounded-xl relative overflow-hidden border border-white/[0.12] will-change-transform"
        style={{
          background: "linear-gradient(135deg, hsl(0 0% 14%), hsl(0 0% 9%))",
          transform: \`rotateX(\${activeTilt.x}deg) rotateY(\${activeTilt.y}deg)\`,
          transition: isHovering
            ? "transform 0.1s ease-out"
            : "transform 0.5s ease-out",
        }}
      >
        <div className="relative z-[1] w-full h-full flex items-center justify-center">
          {children}
        </div>

        {showGlare && (
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: \`radial-gradient(${glareSize}px circle at \${activeGlare.x}% \${activeGlare.y}%, \${glareColor}, transparent)\`,
              transition: isHovering ? "none" : "background 0.3s ease-out",
            }}
          />
        )}
      </div>
    </div>
  );
};
// Usage:
// <GlareCard glareSize={${glareSize}} tiltAmount={${tiltAmount}} trigger="${trigger}" width={${width}} height={${height}}>
//   <div style={{ padding: 24, color: "white" }}>
//     <h3>Glare Card</h3>
//     <p>Hover to see the effect</p>
//   </div>
// </GlareCard>`;

const triggers = ["hover", "view", "both"] as const;

const propsData = [
  { name: "children", type: "ReactNode", default: "—", description: "Card content" },
  { name: "glareColor", type: "string", default: '"rgba(255,255,255,0.15)"', description: "Color of the glare effect" },
  { name: "glareSize", type: "number", default: "200", description: "Size of the radial glare in px" },
  { name: "tiltAmount", type: "number", default: "8", description: "Maximum tilt angle in degrees" },
  { name: "trigger", type: '"hover" | "view" | "both"', default: '"both"', description: "What triggers the glare and tilt effect" },
  { name: "width", type: "number", default: "320", description: "Card width in px" },
  { name: "height", type: "number", default: "200", description: "Card height in px" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const GlareCardPage = () => {
  const [glareSize, setGlareSize] = useState(200);
  const [tiltAmount, setTiltAmount] = useState(8);
  const [trigger, setTrigger] = useState<"hover" | "view" | "both">("both");
  const [cardWidth, setCardWidth] = useState(320);
  const [cardHeight, setCardHeight] = useState(200);
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Cards</p>
        <h1 className="text-2xl font-bold text-foreground">Glare Card</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A card with mouse-tracking radial glare and 3D perspective tilt. Supports hover, auto-sweep, or both modes.
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5">
            <Eye className="h-3.5 w-3.5" /> Preview
          </ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5">
            <Code className="h-3.5 w-3.5" /> Code
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame>
            <GlareCard glareSize={glareSize} tiltAmount={tiltAmount} trigger={trigger} width={cardWidth} height={cardHeight}>
              <div style={{ padding: 24, color: "white", textAlign: "center" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Glare Card</h3>
                <p style={{ fontSize: 13, opacity: 0.7 }}>Hover over this card to see the glare and tilt effect in action.</p>
              </div>
            </GlareCard>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(glareSize, tiltAmount, trigger, cardWidth, cardHeight)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Trigger Mode</Label>
              <ToggleGroup type="single" value={trigger} onValueChange={(v) => v && setTrigger(v as typeof trigger)} className="justify-start">
                {triggers.map((t) => (
                  <ToggleGroupItem key={t} value={t} className="capitalize text-xs px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                    {t}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Glare Size <span className="text-primary ml-1">{glareSize}px</span></Label>
              <Slider value={[glareSize]} onValueChange={([v]) => setGlareSize(v)} min={100} max={400} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tilt Amount <span className="text-primary ml-1">{tiltAmount}°</span></Label>
              <Slider value={[tiltAmount]} onValueChange={([v]) => setTiltAmount(v)} min={0} max={15} step={1} />
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

export default GlareCardPage;
