import { useState } from "react";
import MagneticBento from "@/components/animations/MagneticBento";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  magnetStrength: number,
  liftScale: number,
  parallaxDepth: number,
  glowColor: string,
  borderColor: string,
  surfaceColor: string,
  showGlobalSpotlight: boolean,
) =>
  `import { useRef, useCallback } from "react";
import { Sparkles, Zap, Layers, Globe, Cpu, Shield } from "lucide-react";

interface MagneticBentoProps {
  magnetStrength?: number;
  liftScale?: number;
  parallaxDepth?: number;
  glowColor?: string;
  borderColor?: string;
  surfaceColor?: string;
  showGlobalSpotlight?: boolean;
  className?: string;
}

const TILES = [
  { title: "Lightning Fast", desc: "Sub-100ms interactions, every time.", icon: Zap, span: "md:col-span-2 md:row-span-2" },
  { title: "Composable", desc: "Stackable primitives.", icon: Layers, span: "md:col-span-2" },
  { title: "Global", desc: "Edge-deployed worldwide.", icon: Globe, span: "" },
  { title: "Powerful", desc: "GPU-accelerated.", icon: Cpu, span: "" },
  { title: "Secure", desc: "End-to-end encrypted.", icon: Shield, span: "md:col-span-2" },
  { title: "Delightful", desc: "Crafted micro-interactions.", icon: Sparkles, span: "" },
];

const MagneticBento = ({
  magnetStrength = ${magnetStrength},
  liftScale = ${liftScale},
  parallaxDepth = ${parallaxDepth},
  glowColor = "${glowColor}",
  borderColor = "${borderColor}",
  surfaceColor = "${surfaceColor}",
  showGlobalSpotlight = ${showGlobalSpotlight},
  className = "",
}: MagneticBentoProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoveredIdx = useRef<number>(-1);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    if (!grid) return;
    const gRect = grid.getBoundingClientRect();
    const gx = e.clientX - gRect.left;
    const gy = e.clientY - gRect.top;
    grid.style.setProperty("--gx", \`\${gx}px\`);
    grid.style.setProperty("--gy", \`\${gy}px\`);

    tileRefs.current.forEach((tile, i) => {
      if (!tile) return;
      const r = tile.getBoundingClientRect();
      const cx = r.left + r.width / 2 - gRect.left;
      const cy = r.top + r.height / 2 - gRect.top;
      const dx = gx - cx;
      const dy = gy - cy;
      const dist = Math.hypot(dx, dy);
      tile.style.setProperty("--mx", \`\${e.clientX - r.left}px\`);
      tile.style.setProperty("--my", \`\${e.clientY - r.top}px\`);

      if (i === hoveredIdx.current) {
        tile.style.transform = \`translate3d(\${dx * magnetStrength}px, \${dy * magnetStrength}px, 0) scale(\${liftScale})\`;
        tile.style.zIndex = "2";
      } else {
        const falloff = Math.max(0, 1 - dist / 600);
        const pushX = -(dx / (dist || 1)) * parallaxDepth * falloff;
        const pushY = -(dy / (dist || 1)) * parallaxDepth * falloff;
        tile.style.transform = \`translate3d(\${pushX}px, \${pushY}px, 0) scale(1)\`;
        tile.style.zIndex = "1";
      }
    });
  }, [magnetStrength, liftScale, parallaxDepth]);

  const handleLeave = useCallback(() => {
    hoveredIdx.current = -1;
    tileRefs.current.forEach((tile) => {
      if (!tile) return;
      tile.style.transform = "translate3d(0,0,0) scale(1)";
      tile.style.zIndex = "1";
    });
    const grid = gridRef.current;
    if (grid) grid.style.setProperty("--g-opacity", "0");
  }, []);

  const handleEnter = useCallback(() => {
    const grid = gridRef.current;
    if (grid) grid.style.setProperty("--g-opacity", "1");
  }, []);

  return (
    <div
      ref={gridRef}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={\`relative grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] gap-3 p-3 rounded-3xl \${className}\`}
      style={{
        background: surfaceColor,
        border: \`1px solid \${borderColor}\`,
        "--gx": "50%",
        "--gy": "50%",
        "--g-opacity": "0",
      } as React.CSSProperties}
    >
      {showGlobalSpotlight && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: "var(--g-opacity)",
            background: \`radial-gradient(500px circle at var(--gx) var(--gy), \${glowColor}22, transparent 60%)\`,
          }}
        />
      )}

      {TILES.map((tile, i) => {
        const Icon = tile.icon;
        return (
          <div
            key={i}
            ref={(el) => { tileRefs.current[i] = el; }}
            onMouseEnter={() => { hoveredIdx.current = i; }}
            className={\`group relative overflow-hidden rounded-2xl p-5 cursor-pointer \${tile.span}\`}
            style={{
              background: surfaceColor,
              border: \`1px solid \${borderColor}\`,
              transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease, border-color 0.3s ease",
              willChange: "transform",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = glowColor;
              (e.currentTarget as HTMLDivElement).style.boxShadow = \`0 20px 60px -10px \${glowColor}40, 0 0 30px \${glowColor}20\`;
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = borderColor;
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: \`radial-gradient(220px circle at var(--mx) var(--my), \${glowColor}25, transparent 60%)\`,
              }}
            />
            <div className="relative z-[1] h-full flex flex-col justify-between">
              <Icon className="w-5 h-5" style={{ color: glowColor }} />
              <div>
                <div className="text-sm font-bold text-white tracking-tight">{tile.title}</div>
                <div className="text-[11px] text-white/50 mt-0.5 leading-snug">{tile.desc}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MagneticBento;`;

const propsData = [
  { name: "magnetStrength", type: "number", default: "0.25", description: "How strongly the hovered tile is pulled toward the cursor (0–0.6)" },
  { name: "liftScale", type: "number", default: "1.04", description: "Scale applied to the hovered tile" },
  { name: "parallaxDepth", type: "number", default: "14", description: "Pixel distance neighbor tiles drift away from the cursor" },
  { name: "glowColor", type: "string", default: '"#f97316"', description: "Accent color for icons, border highlight, and global spotlight" },
  { name: "borderColor", type: "string", default: '"#27272a"', description: "Default tile border color" },
  { name: "surfaceColor", type: "string", default: '"#0b0b0f"', description: "Background of the grid and tiles" },
  { name: "showGlobalSpotlight", type: "boolean", default: "true", description: "Soft radial highlight that follows the cursor across the grid" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes for sizing/layout" },
];

const MagneticBentoPage = () => {
  const [magnetStrength, setMagnetStrength] = useState(0.25);
  const [liftScale, setLiftScale] = useState(1.04);
  const [parallaxDepth, setParallaxDepth] = useState(14);
  const [glowColor, setGlowColor] = useState("#f97316");
  const [borderColor, setBorderColor] = useState("#27272a");
  const [surfaceColor, setSurfaceColor] = useState("#0b0b0f");
  const [showGlobalSpotlight, setShowGlobalSpotlight] = useState(true);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [key, setKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Magnetic Bento</h1>
        <p className="text-sm text-muted-foreground mt-1">An "alive" bento grid: tiles magnetize to the cursor, neighbors push away, and a global spotlight tracks across the surface.</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame onReload={() => setKey((k) => k + 1)}>
            <MagneticBento
              key={key}
              magnetStrength={magnetStrength}
              liftScale={liftScale}
              parallaxDepth={parallaxDepth}
              glowColor={glowColor}
              borderColor={borderColor}
              surfaceColor={surfaceColor}
              showGlobalSpotlight={showGlobalSpotlight}
              className="w-full max-w-[760px]"
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(magnetStrength, liftScale, parallaxDepth, glowColor, borderColor, surfaceColor, showGlobalSpotlight)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Magnet Strength <span className="text-primary ml-1">{magnetStrength.toFixed(2)}</span></Label>
              <Slider value={[magnetStrength]} onValueChange={([v]) => setMagnetStrength(v)} min={0} max={0.6} step={0.01} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Lift Scale <span className="text-primary ml-1">{liftScale.toFixed(2)}</span></Label>
              <Slider value={[liftScale]} onValueChange={([v]) => setLiftScale(v)} min={1} max={1.12} step={0.01} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Parallax Depth <span className="text-primary ml-1">{parallaxDepth}px</span></Label>
              <Slider value={[parallaxDepth]} onValueChange={([v]) => setParallaxDepth(v)} min={0} max={40} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Glow Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={glowColor} onChange={(e) => setGlowColor(e.target.value)} className="w-10 h-8 rounded border border-border bg-transparent cursor-pointer" />
                <Input value={glowColor} onChange={(e) => setGlowColor(e.target.value)} className="h-8 text-xs font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Surface Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={surfaceColor} onChange={(e) => setSurfaceColor(e.target.value)} className="w-10 h-8 rounded border border-border bg-transparent cursor-pointer" />
                <Input value={surfaceColor} onChange={(e) => setSurfaceColor(e.target.value)} className="h-8 text-xs font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Border Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-10 h-8 rounded border border-border bg-transparent cursor-pointer" />
                <Input value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-8 text-xs font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Global Spotlight</Label>
              <div className="flex items-center gap-3 h-8">
                <Switch checked={showGlobalSpotlight} onCheckedChange={setShowGlobalSpotlight} />
                <span className="text-xs text-muted-foreground">{showGlobalSpotlight ? "On" : "Off"}</span>
              </div>
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

export default MagneticBentoPage;
