import { useState } from "react";
import Marquee3D from "@/components/animations/Marquee3D";
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
  speed: number,
  perspective: number,
  tiltX: number,
  cardWidth: number,
  cardHeight: number,
  gap: number,
  hoverLift: number,
  proximityRadius: number,
  pauseOnHover: boolean,
  glowColor: string,
  borderColor: string,
  surfaceColor: string,
  edgeFade: boolean,
) =>
  `import { useRef, useEffect, useCallback } from "react";
import { Sparkles, Zap, Layers, Globe, Cpu, Shield, Rocket, Wand2 } from "lucide-react";

interface Marquee3DProps {
  speed?: number;
  perspective?: number;
  tiltX?: number;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  hoverLift?: number;
  proximityRadius?: number;
  pauseOnHover?: boolean;
  glowColor?: string;
  borderColor?: string;
  surfaceColor?: string;
  edgeFade?: boolean;
  className?: string;
}

const ITEMS = [
  { title: "Linear", subtitle: "Issue tracking", icon: Zap },
  { title: "Vercel", subtitle: "Edge platform", icon: Globe },
  { title: "Stripe", subtitle: "Payments", icon: Layers },
  { title: "Raycast", subtitle: "Productivity", icon: Wand2 },
  { title: "Notion", subtitle: "Workspace", icon: Sparkles },
  { title: "Framer", subtitle: "Design", icon: Rocket },
  { title: "Figma", subtitle: "Interface", icon: Cpu },
  { title: "Arc", subtitle: "Browser", icon: Shield },
];

const Marquee3D = ({
  speed = ${speed},
  perspective = ${perspective},
  tiltX = ${tiltX},
  cardWidth = ${cardWidth},
  cardHeight = ${cardHeight},
  gap = ${gap},
  hoverLift = ${hoverLift},
  proximityRadius = ${proximityRadius},
  pauseOnHover = ${pauseOnHover},
  glowColor = "${glowColor}",
  borderColor = "${borderColor}",
  surfaceColor = "${surfaceColor}",
  edgeFade = ${edgeFade},
  className = "",
}: Marquee3DProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const offsetRef = useRef(0);
  const speedRef = useRef(speed);
  const targetSpeedRef = useRef(speed);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const visibleRef = useRef(true);

  const list = [...ITEMS, ...ITEMS];
  const single = ITEMS.length;

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    cursorRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    targetSpeedRef.current = pauseOnHover ? 0 : speed * 0.25;
  }, [pauseOnHover, speed]);

  const handleLeave = useCallback(() => {
    cursorRef.current = null;
    targetSpeedRef.current = speed;
    cardRefs.current.forEach((c) => {
      if (!c) return;
      c.style.transform = "translate3d(0,0,0) scale(1)";
      c.style.boxShadow = "none";
      c.style.borderColor = borderColor;
    });
  }, [speed, borderColor]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const tick = (ts: number) => {
      const last = lastTsRef.current || ts;
      const dt = Math.min(64, ts - last) / 1000;
      lastTsRef.current = ts;
      speedRef.current += (targetSpeedRef.current - speedRef.current) * Math.min(1, dt * 6);

      const track = trackRef.current;
      if (track && visibleRef.current) {
        const itemW = cardWidth + gap;
        const wrap = single * itemW;
        offsetRef.current -= speedRef.current * dt;
        if (offsetRef.current <= -wrap) offsetRef.current += wrap;
        track.style.transform = \`translate3d(\${offsetRef.current}px, 0, 0)\`;

        const stage = stageRef.current;
        const cursor = cursorRef.current;
        if (stage && cursor) {
          const sRect = stage.getBoundingClientRect();
          cardRefs.current.forEach((c) => {
            if (!c) return;
            const cr = c.getBoundingClientRect();
            const cx = cr.left + cr.width / 2 - sRect.left;
            const cy = cr.top + cr.height / 2 - sRect.top;
            const dx = cursor.x - cx;
            const dy = cursor.y - cy;
            const dist = Math.hypot(dx, dy);
            const t = Math.max(0, 1 - dist / proximityRadius);
            const lift = hoverLift * t;
            const scale = 1 + 0.08 * t;
            c.style.transform = \`translate3d(0,0,\${lift}px) scale(\${scale})\`;
            if (t > 0.05) {
              c.style.borderColor = glowColor;
              c.style.boxShadow = \`0 \${20 + 30 * t}px \${40 + 40 * t}px -10px \${glowColor}\${Math.floor(30 + 50 * t).toString(16).padStart(2, "0")}, 0 0 \${30 * t}px \${glowColor}40\`;
            } else {
              c.style.borderColor = borderColor;
              c.style.boxShadow = "none";
            }
          });
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [cardWidth, gap, single, hoverLift, proximityRadius, glowColor, borderColor]);

  const maskStyle = edgeFade
    ? {
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }
    : {};

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={\`relative w-full overflow-hidden rounded-3xl \${className}\`}
      style={{
        background: surfaceColor,
        border: \`1px solid \${borderColor}\`,
        perspective: \`\${perspective}px\`,
        padding: \`\${cardHeight * 0.6}px 0\`,
        ...maskStyle,
      }}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          gap: \`\${gap}px\`,
          transformStyle: "preserve-3d",
          transform: "translate3d(0,0,0)",
          willChange: "transform",
        }}
      >
        {list.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="shrink-0 relative rounded-2xl flex flex-col justify-between p-5"
              style={{
                width: \`\${cardWidth}px\`,
                height: \`\${cardHeight}px\`,
                background: surfaceColor,
                border: \`1px solid \${borderColor}\`,
                transform: \`rotateX(\${tiltX}deg)\`,
                transformOrigin: "center center",
                transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.35s ease, border-color 0.35s ease",
                willChange: "transform",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: glowColor }} />
              <div>
                <div className="text-sm font-bold text-white tracking-tight">{item.title}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{item.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marquee3D;`;

const propsData = [
  { name: "speed", type: "number", default: "60", description: "Cruise speed in pixels/second" },
  { name: "perspective", type: "number", default: "1200", description: "CSS perspective for the 3D stage" },
  { name: "tiltX", type: "number", default: "18", description: "Card rotation around X axis (degrees)" },
  { name: "cardWidth", type: "number", default: "220", description: "Card width in pixels" },
  { name: "cardHeight", type: "number", default: "130", description: "Card height in pixels" },
  { name: "gap", type: "number", default: "20", description: "Gap between cards" },
  { name: "hoverLift", type: "number", default: "80", description: "Z-translation applied to the closest card" },
  { name: "proximityRadius", type: "number", default: "200", description: "Cursor influence radius in pixels" },
  { name: "pauseOnHover", type: "boolean", default: "true", description: "Fully pause vs slow-down when hovered" },
  { name: "glowColor", type: "string", default: '"#f97316"', description: "Accent color for icons + lifted card glow" },
  { name: "borderColor", type: "string", default: '"#27272a"', description: "Default border color" },
  { name: "surfaceColor", type: "string", default: '"#0b0b0f"', description: "Background of the stage and cards" },
  { name: "edgeFade", type: "boolean", default: "true", description: "Soft mask on left/right edges" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes for sizing/layout" },
];

const Marquee3DPage = () => {
  const [speed, setSpeed] = useState(60);
  const [perspective, setPerspective] = useState(1200);
  const [tiltX, setTiltX] = useState(18);
  const [cardWidth, setCardWidth] = useState(220);
  const [cardHeight, setCardHeight] = useState(130);
  const [gap, setGap] = useState(20);
  const [hoverLift, setHoverLift] = useState(80);
  const [proximityRadius, setProximityRadius] = useState(200);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [glowColor, setGlowColor] = useState("#f97316");
  const [borderColor, setBorderColor] = useState("#27272a");
  const [surfaceColor, setSurfaceColor] = useState("#0b0b0f");
  const [edgeFade, setEdgeFade] = useState(true);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [key, setKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Marquee 3D</h1>
        <p className="text-sm text-muted-foreground mt-1">An infinite, perspective-tilted card marquee. Cursor proximity slows the reel and lifts the closest card forward in 3D.</p>
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
            <Marquee3D
              key={key}
              speed={speed}
              perspective={perspective}
              tiltX={tiltX}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              gap={gap}
              hoverLift={hoverLift}
              proximityRadius={proximityRadius}
              pauseOnHover={pauseOnHover}
              glowColor={glowColor}
              borderColor={borderColor}
              surfaceColor={surfaceColor}
              edgeFade={edgeFade}
              className="max-w-[760px]"
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(speed, perspective, tiltX, cardWidth, cardHeight, gap, hoverLift, proximityRadius, pauseOnHover, glowColor, borderColor, surfaceColor, edgeFade)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed} px/s</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={10} max={200} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Perspective <span className="text-primary ml-1">{perspective}px</span></Label>
              <Slider value={[perspective]} onValueChange={([v]) => setPerspective(v)} min={600} max={2000} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tilt X <span className="text-primary ml-1">{tiltX}°</span></Label>
              <Slider value={[tiltX]} onValueChange={([v]) => setTiltX(v)} min={0} max={35} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Hover Lift <span className="text-primary ml-1">{hoverLift}px</span></Label>
              <Slider value={[hoverLift]} onValueChange={([v]) => setHoverLift(v)} min={0} max={160} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Proximity Radius <span className="text-primary ml-1">{proximityRadius}px</span></Label>
              <Slider value={[proximityRadius]} onValueChange={([v]) => setProximityRadius(v)} min={80} max={400} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Card Width <span className="text-primary ml-1">{cardWidth}px</span></Label>
              <Slider value={[cardWidth]} onValueChange={([v]) => setCardWidth(v)} min={140} max={320} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Card Height <span className="text-primary ml-1">{cardHeight}px</span></Label>
              <Slider value={[cardHeight]} onValueChange={([v]) => setCardHeight(v)} min={90} max={200} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Gap <span className="text-primary ml-1">{gap}px</span></Label>
              <Slider value={[gap]} onValueChange={([v]) => setGap(v)} min={8} max={48} step={1} />
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
              <Label className="text-xs text-muted-foreground">Pause On Hover</Label>
              <div className="flex items-center gap-3 h-8">
                <Switch checked={pauseOnHover} onCheckedChange={setPauseOnHover} />
                <span className="text-xs text-muted-foreground">{pauseOnHover ? "Pause" : "Slow down"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Edge Fade</Label>
              <div className="flex items-center gap-3 h-8">
                <Switch checked={edgeFade} onCheckedChange={setEdgeFade} />
                <span className="text-xs text-muted-foreground">{edgeFade ? "On" : "Off"}</span>
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

export default Marquee3DPage;
