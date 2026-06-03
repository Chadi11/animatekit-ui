import { useState } from "react";
import LiquidReveal from "@/components/animations/LiquidReveal";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  imageSrc: string,
  lensSize: number,
  distortionStrength: number,
  desaturateOutside: number,
  lensZoom: number,
  rippleColor: string,
  width: number,
  height: number,
) =>
  `import { useRef, useCallback, useEffect, useId, useState } from "react";

interface LiquidRevealProps {
  imageSrc?: string;
  lensSize?: number;
  distortionStrength?: number;
  desaturateOutside?: number;
  lensZoom?: number;
  rippleColor?: string;
  width?: number;
  height?: number;
  className?: string;
}

interface Ripple { id: number; x: number; y: number; born: number; }

const LiquidReveal = ({
  imageSrc = "${imageSrc}",
  lensSize = ${lensSize},
  distortionStrength = ${distortionStrength},
  desaturateOutside = ${desaturateOutside},
  lensZoom = ${lensZoom},
  rippleColor = "${rippleColor}",
  width = ${width},
  height = ${height},
  className = "",
}: LiquidRevealProps) => {
  const uid = useId().replace(/:/g, "");
  const filterId = \`liquid-\${uid}\`;
  const maskId = \`lens-\${uid}\`;

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: width / 2, y: height / 2 });
  const currentRef = useRef({ x: width / 2, y: height / 2 });
  const lastMoveRef = useRef({ x: width / 2, y: height / 2, t: 0 });
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const rippleIdRef = useRef(0);

  const [pos, setPos] = useState({ x: width / 2, y: height / 2 });
  const [radius, setRadius] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tick = useCallback(() => {
    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;
    currentRef.current = {
      x: lerp(currentRef.current.x, targetRef.current.x, 0.18),
      y: lerp(currentRef.current.y, targetRef.current.y, 0.18),
    };
    setPos({ ...currentRef.current });
    const now = performance.now();
    setRipples((prev) => prev.filter((r) => now - r.born < 900));
    if (activeRef.current || Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const ensureRaf = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetRef.current = { x, y };
    const now = performance.now();
    const dt = now - lastMoveRef.current.t;
    if (dt > 0) {
      const vx = (x - lastMoveRef.current.x) / dt;
      const vy = (y - lastMoveRef.current.y) / dt;
      const speed = Math.hypot(vx, vy);
      if (speed > 1.2 && now - lastMoveRef.current.t > 80) {
        setRipples((prev) => [...prev, { id: rippleIdRef.current++, x, y, born: now }].slice(-4));
        lastMoveRef.current = { x, y, t: now };
      }
    }
    ensureRaf();
  }, [ensureRaf]);

  const handleEnter = useCallback(() => { activeRef.current = true; setRadius(lensSize / 2); ensureRaf(); }, [lensSize, ensureRaf]);
  const handleLeave = useCallback(() => { activeRef.current = false; setRadius(0); }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={\`relative overflow-hidden rounded-2xl cursor-none select-none \${className}\`}
      style={{ width, height, background: "#000" }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale={distortionStrength} />
          </filter>
          <mask id={maskId}>
            <rect width={width} height={height} fill="black" />
            <circle cx={pos.x} cy={pos.y} r={radius} fill="white" />
          </mask>
        </defs>
      </svg>

      <img
        src={imageSrc}
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover block pointer-events-none"
        style={{ filter: \`saturate(\${1 - desaturateOutside}) brightness(0.7)\` }}
      />

      <svg width={width} height={height} className="absolute inset-0 pointer-events-none">
        <g mask={\`url(#\${maskId})\`}>
          <image
            href={imageSrc}
            x={(width * (1 - lensZoom)) / 2}
            y={(height * (1 - lensZoom)) / 2}
            width={width * lensZoom}
            height={height * lensZoom}
            preserveAspectRatio="xMidYMid slice"
            filter={\`url(#\${filterId})\`}
          />
        </g>
        <circle cx={pos.x} cy={pos.y} r={radius} fill="none" stroke={rippleColor} strokeOpacity="0.35" strokeWidth="1" style={{ transition: "r 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)" }} />
        {ripples.map((r) => {
          const age = (performance.now() - r.born) / 900;
          const rr = lensSize * 0.4 + age * lensSize * 0.9;
          const op = (1 - age) * 0.5;
          return <circle key={r.id} cx={r.x} cy={r.y} r={rr} fill="none" stroke={rippleColor} strokeOpacity={op} strokeWidth={1.5} />;
        })}
      </svg>

      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: pos.x - 4, top: pos.y - 4, width: 8, height: 8,
          background: rippleColor, opacity: radius > 0 ? 0.8 : 0,
          boxShadow: \`0 0 12px \${rippleColor}\`,
          transition: "opacity 0.25s ease",
        }}
      />
    </div>
  );
};

export default LiquidReveal;`;

const propsData = [
  { name: "imageSrc", type: "string", default: "Unsplash sample", description: "Image to reveal through the liquid lens" },
  { name: "lensSize", type: "number", default: "220", description: "Diameter of the cursor lens in pixels" },
  { name: "distortionStrength", type: "number", default: "30", description: "How much the image ripples inside the lens (feDisplacementMap scale)" },
  { name: "desaturateOutside", type: "number", default: "0.7", description: "0–1, how desaturated the area outside the lens appears" },
  { name: "lensZoom", type: "number", default: "1.08", description: "Zoom multiplier of the image inside the lens" },
  { name: "rippleColor", type: "string", default: '"#ffffff"', description: "Color of the lens ring, velocity ripples, and cursor dot" },
  { name: "width", type: "number", default: "720", description: "Container width in pixels" },
  { name: "height", type: "number", default: "480", description: "Container height in pixels" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes" },
];

const LiquidRevealPage = () => {
  const [imageSrc, setImageSrc] = useState("https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200");
  const [lensSize, setLensSize] = useState(220);
  const [distortionStrength, setDistortionStrength] = useState(30);
  const [desaturateOutside, setDesaturateOutside] = useState(0.7);
  const [lensZoom, setLensZoom] = useState(1.08);
  const [rippleColor, setRippleColor] = useState("#ffffff");
  const [width, setWidth] = useState(720);
  const [height, setHeight] = useState(480);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [key, setKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Liquid Reveal</h1>
        <p className="text-sm text-muted-foreground mt-1">A cursor-driven liquid lens that distorts and reveals the image underneath, with velocity-triggered ripples.</p>
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
            <LiquidReveal
              key={key}
              imageSrc={imageSrc}
              lensSize={lensSize}
              distortionStrength={distortionStrength}
              desaturateOutside={desaturateOutside}
              lensZoom={lensZoom}
              rippleColor={rippleColor}
              width={width}
              height={height}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(imageSrc, lensSize, distortionStrength, desaturateOutside, lensZoom, rippleColor, width, height)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs text-muted-foreground">Image URL</Label>
              <Input value={imageSrc} onChange={(e) => setImageSrc(e.target.value)} className="h-8 text-xs font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Lens Size <span className="text-primary ml-1">{lensSize}px</span></Label>
              <Slider value={[lensSize]} onValueChange={([v]) => setLensSize(v)} min={100} max={400} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Distortion <span className="text-primary ml-1">{distortionStrength}</span></Label>
              <Slider value={[distortionStrength]} onValueChange={([v]) => setDistortionStrength(v)} min={0} max={80} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Desaturate Outside <span className="text-primary ml-1">{desaturateOutside.toFixed(2)}</span></Label>
              <Slider value={[desaturateOutside]} onValueChange={([v]) => setDesaturateOutside(v)} min={0} max={1} step={0.05} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Lens Zoom <span className="text-primary ml-1">{lensZoom.toFixed(2)}x</span></Label>
              <Slider value={[lensZoom]} onValueChange={([v]) => setLensZoom(v)} min={1} max={1.5} step={0.01} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Ripple Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={rippleColor} onChange={(e) => setRippleColor(e.target.value)} className="w-10 h-8 rounded border border-border bg-transparent cursor-pointer" />
                <Input value={rippleColor} onChange={(e) => setRippleColor(e.target.value)} className="h-8 text-xs font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Width <span className="text-primary ml-1">{width}px</span></Label>
              <Slider value={[width]} onValueChange={([v]) => setWidth(v)} min={400} max={960} step={20} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Height <span className="text-primary ml-1">{height}px</span></Label>
              <Slider value={[height]} onValueChange={([v]) => setHeight(v)} min={300} max={640} step={20} />
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

export default LiquidRevealPage;
