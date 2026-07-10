import { useState } from "react";
import TiltHoverCard from "@/components/animations/TiltHoverCard";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (maxTilt: number, scale: number, perspective: number, shadow: boolean) =>
  `import { useState, useRef } from "react";

interface TiltHoverCardProps {
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  shadow?: boolean;
}

const TiltHoverCard = ({
  maxTilt = ${maxTilt},
  scale = ${scale},
  perspective = ${perspective},
  shadow = ${shadow},
}: TiltHoverCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) scale(1)");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * maxTilt;
    const tiltY = (x - 0.5) * maxTilt;
    setTransform(\`rotateX(\${tiltX}deg) rotateY(\${tiltY}deg) scale(${scale})\`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setTransform("rotateX(0deg) rotateY(0deg) scale(1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="inline-block"
      style={{ perspective: \`${perspective}px\` }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-80 h-[400px] rounded-[20px] overflow-hidden cursor-pointer will-change-transform"
        style={{
          background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          transform,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          boxShadow: shadow && isHovered
            ? "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.15)"
            : "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* Content */}
        <div className="relative z-[1] h-full flex flex-col justify-end p-7">
          {/* Decorative circles */}
          <div className="absolute top-10 right-[30px] w-20 h-20 rounded-full border-2 border-indigo-500/30 opacity-60" />
          <div className="absolute top-[70px] right-[50px] w-10 h-10 rounded-full bg-indigo-500/15" />
          <div className="absolute top-[30px] left-[30px] w-[60px] h-[3px] rounded-sm" style={{
            background: "linear-gradient(90deg, rgba(99,102,241,0.6), transparent)",
          }} />

          {/* Text content */}
          <div className="text-[11px] tracking-[3px] uppercase text-indigo-400/70 mb-2">
            Interactive
          </div>
          <div className="text-[28px] font-extrabold text-white leading-tight mb-3">
            Tilt Hover
            <br />
            Card
          </div>
          <div className="text-[13px] text-white/50 leading-relaxed">
            Move your cursor over this card to see the 3D tilt effect with parallax depth.
          </div>
        </div>

        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: \`radial-gradient(circle at \${glare.x}% \${glare.y}%, rgba(255,255,255,\${glare.opacity}), transparent 60%)\`,
            transition: isHovered ? "none" : "opacity 0.5s ease",
          }}
        />

        {/* Border glow */}
        <div
          className="absolute inset-0 rounded-[20px] pointer-events-none z-[3]"
          style={{
            border: \`1px solid rgba(99,102,241,\${isHovered ? 0.4 : 0.15})\`,
            transition: "border-color 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};
// Usage:
// <TiltHoverCard maxTilt={${maxTilt}} scale={${scale}} perspective={${perspective}} shadow={${shadow}} />`;

const propsData = [
  { name: "maxTilt", type: "number", default: "15", description: "Maximum tilt angle in degrees (5–25)" },
  { name: "scale", type: "number", default: "1.05", description: "Scale factor on hover (1.0–1.15)" },
  { name: "perspective", type: "number", default: "1000", description: "CSS perspective value in px (500–1500)" },
  { name: "shadow", type: "boolean", default: "true", description: "Enable enhanced shadow on hover" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];


const TiltHoverCardPage = () => {
  const [maxTilt, setMaxTilt] = useState(15);
  const [scale, setScale] = useState(1.05);
  const [perspective, setPerspective] = useState(1000);
  const [shadow, setShadow] = useState(true);
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Tilt Hover Card</h1>
        <p className="text-sm text-muted-foreground mt-1">A card that tilts in 3D following the cursor with a parallax depth effect and glare overlay.</p>
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
            <TiltHoverCard maxTilt={maxTilt} scale={scale} perspective={perspective} shadow={shadow} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(maxTilt, scale, perspective, shadow)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Max Tilt: {maxTilt}°</Label>
              <Slider min={5} max={25} step={1} value={[maxTilt]} onValueChange={([v]) => setMaxTilt(v)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Scale: {scale.toFixed(2)}</Label>
              <Slider min={1} max={1.15} step={0.01} value={[scale]} onValueChange={([v]) => setScale(v)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Perspective: {perspective}px</Label>
              <Slider min={500} max={1500} step={50} value={[perspective]} onValueChange={([v]) => setPerspective(v)} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={shadow} onCheckedChange={setShadow} />
              <Label className="text-xs text-muted-foreground">Enhanced Shadow</Label>
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

export default TiltHoverCardPage;
