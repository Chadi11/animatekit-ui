import { useState } from "react";
import CursorAttractorField from "@/components/animations/CursorAttractorField";
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
  gridSize: number,
  nodeRadius: number,
  influenceRadius: number,
  attractStrength: number,
  lineMode: boolean,
  accentColor: string,
  bgColor: string,
  nodeColor: string,
  clickShockwave: boolean,
  height: number,
) =>
  `import { useRef, useEffect, useCallback } from "react";

interface CursorAttractorFieldProps {
  gridSize?: number;
  nodeRadius?: number;
  influenceRadius?: number;
  attractStrength?: number;
  lineMode?: boolean;
  accentColor?: string;
  bgColor?: string;
  nodeColor?: string;
  clickShockwave?: boolean;
  height?: number;
  className?: string;
  children?: React.ReactNode;
}

interface Shockwave { x: number; y: number; t: number; }

const CursorAttractorField = ({
  gridSize = ${gridSize},
  nodeRadius = ${nodeRadius},
  influenceRadius = ${influenceRadius},
  attractStrength = ${attractStrength},
  lineMode = ${lineMode},
  accentColor = "${accentColor}",
  bgColor = "${bgColor}",
  nodeColor = "${nodeColor}",
  clickShockwave = ${clickShockwave},
  height = ${height},
  className = "",
  children,
}: CursorAttractorFieldProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const smoothCursorRef = useRef<{ x: number; y: number } | null>(null);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    cursorRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const handleLeave = useCallback(() => { cursorRef.current = null; }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickShockwave) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    shockwavesRef.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
  }, [clickShockwave]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; }, { threshold: 0 });
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect();
      sizeRef.current = { w: r.width, h: r.height, dpr };
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = \`\${r.width}px\`;
      canvas.style.height = \`\${r.height}px\`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const tick = () => {
      const { w, h } = sizeRef.current;
      const target = cursorRef.current;
      if (target) {
        if (!smoothCursorRef.current) smoothCursorRef.current = { ...target };
        else {
          smoothCursorRef.current.x += (target.x - smoothCursorRef.current.x) * 0.18;
          smoothCursorRef.current.y += (target.y - smoothCursorRef.current.y) * 0.18;
        }
      } else { smoothCursorRef.current = null; }

      if (visibleRef.current) {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);

        const waves = shockwavesRef.current;
        for (let i = waves.length - 1; i >= 0; i--) {
          waves[i].t += 6;
          if (waves[i].t > Math.max(w, h) * 1.2) waves.splice(i, 1);
        }

        const cols = Math.ceil(w / gridSize) + 1;
        const rows = Math.ceil(h / gridSize) + 1;
        const cursor = smoothCursorRef.current;
        const inf2 = influenceRadius * influenceRadius;

        for (let cy = 0; cy < rows; cy++) {
          for (let cx = 0; cx < cols; cx++) {
            let x = cx * gridSize;
            let y = cy * gridSize;
            let strength = 0;
            let dirX = 0, dirY = 0;
            if (cursor) {
              const dx = cursor.x - x;
              const dy = cursor.y - y;
              const d2 = dx * dx + dy * dy;
              if (d2 < inf2 && d2 > 0.01) {
                const d = Math.sqrt(d2);
                const t = 1 - d / influenceRadius;
                strength = t;
                dirX = dx / d; dirY = dy / d;
                x += dirX * t * attractStrength * gridSize * 0.7;
                y += dirY * t * attractStrength * gridSize * 0.7;
              }
            }
            for (const wv of waves) {
              const dx = x - wv.x;
              const dy = y - wv.y;
              const d = Math.sqrt(dx * dx + dy * dy);
              const ringDist = Math.abs(d - wv.t);
              if (ringDist < 40 && d > 0.01) {
                const push = (1 - ringDist / 40) * 14;
                x += (dx / d) * push;
                y += (dy / d) * push;
                strength = Math.max(strength, 0.6);
              }
            }
            if (lineMode && strength > 0.05 && cursor) {
              const len = nodeRadius * 2 + strength * gridSize * 0.55;
              ctx.strokeStyle = mixColor(nodeColor, accentColor, strength);
              ctx.lineWidth = nodeRadius * 0.9 + strength * 1.2;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(x - dirX * len * 0.5, y - dirY * len * 0.5);
              ctx.lineTo(x + dirX * len * 0.5, y + dirY * len * 0.5);
              ctx.stroke();
            } else {
              const r = nodeRadius + strength * 2.4;
              ctx.fillStyle = strength > 0.05 ? mixColor(nodeColor, accentColor, strength) : nodeColor;
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        if (cursor) {
          const grad = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, influenceRadius);
          grad.addColorStop(0, hexToRgba(accentColor, 0.18));
          grad.addColorStop(1, hexToRgba(accentColor, 0));
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [gridSize, nodeRadius, influenceRadius, attractStrength, lineMode, accentColor, bgColor, nodeColor]);

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseDown={handleClick}
      className={\`relative w-full overflow-hidden rounded-3xl \${className}\`}
      style={{ height: \`\${height}px\`, background: bgColor, cursor: "crosshair" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {children && (
        <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

function hexToRgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return \`rgba(\${r},\${g},\${b},\${a})\`;
}
function mixColor(a: string, b: string, t: number) {
  const pa = hexToRgb(a); const pb = hexToRgb(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return \`rgb(\${r},\${g},\${bl})\`;
}
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return { r: parseInt(v.slice(0, 2), 16), g: parseInt(v.slice(2, 4), 16), b: parseInt(v.slice(4, 6), 16) };
}

export default CursorAttractorField;`;

const propsData = [
  { name: "gridSize", type: "number", default: "32", description: "Spacing in pixels between grid nodes" },
  { name: "nodeRadius", type: "number", default: "1.6", description: "Base radius/thickness of each node" },
  { name: "influenceRadius", type: "number", default: "180", description: "Cursor attraction radius in pixels" },
  { name: "attractStrength", type: "number", default: "0.6", description: "How strongly nodes pull toward the cursor (0–1)" },
  { name: "lineMode", type: "boolean", default: "true", description: "Render influenced nodes as oriented lines vs. dots" },
  { name: "accentColor", type: "string", default: '"#a78bfa"', description: "Hot color used near the cursor and in the spotlight" },
  { name: "bgColor", type: "string", default: '"#08070d"', description: "Field background color" },
  { name: "nodeColor", type: "string", default: '"#3a3550"', description: "Resting color of unaffected nodes" },
  { name: "clickShockwave", type: "boolean", default: "true", description: "Click anywhere to emit an expanding shockwave" },
  { name: "height", type: "number", default: "460", description: "Field height in pixels" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes on the wrapper" },
  { name: "children", type: "ReactNode", default: "—", description: "Optional content rendered above the field (e.g., a hero headline)" },
];

const CursorAttractorFieldPage = () => {
  const [gridSize, setGridSize] = useState(32);
  const [nodeRadius, setNodeRadius] = useState(1.6);
  const [influenceRadius, setInfluenceRadius] = useState(180);
  const [attractStrength, setAttractStrength] = useState(0.6);
  const [lineMode, setLineMode] = useState(true);
  const [accentColor, setAccentColor] = useState("#a78bfa");
  const [bgColor, setBgColor] = useState("#08070d");
  const [nodeColor, setNodeColor] = useState("#3a3550");
  const [clickShockwave, setClickShockwave] = useState(true);
  const [height, setHeight] = useState(420);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [key, setKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Cursor Attractor Field</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A reactive grid background where every node bends and glows toward your cursor like iron filings near a magnet. Click to emit a shockwave through the field.
        </p>
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
            <CursorAttractorField
              key={key}
              gridSize={gridSize}
              nodeRadius={nodeRadius}
              influenceRadius={influenceRadius}
              attractStrength={attractStrength}
              lineMode={lineMode}
              accentColor={accentColor}
              bgColor={bgColor}
              nodeColor={nodeColor}
              clickShockwave={clickShockwave}
              height={height}
              className="max-w-[760px]"
            >
              <div className="text-center">
                <h2 className="text-4xl font-black text-white tracking-tight">Move the cursor</h2>
                <p className="text-white/60 text-xs font-mono uppercase tracking-widest mt-3">click to ripple</p>
              </div>
            </CursorAttractorField>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(gridSize, nodeRadius, influenceRadius, attractStrength, lineMode, accentColor, bgColor, nodeColor, clickShockwave, height)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Grid Size <span className="text-primary ml-1">{gridSize}px</span></Label>
              <Slider value={[gridSize]} onValueChange={([v]) => setGridSize(v)} min={16} max={60} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Node Radius <span className="text-primary ml-1">{nodeRadius.toFixed(1)}</span></Label>
              <Slider value={[nodeRadius]} onValueChange={([v]) => setNodeRadius(v)} min={0.6} max={4} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Influence Radius <span className="text-primary ml-1">{influenceRadius}px</span></Label>
              <Slider value={[influenceRadius]} onValueChange={([v]) => setInfluenceRadius(v)} min={80} max={320} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Attract Strength <span className="text-primary ml-1">{attractStrength.toFixed(2)}</span></Label>
              <Slider value={[attractStrength]} onValueChange={([v]) => setAttractStrength(v)} min={0} max={1} step={0.01} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Height <span className="text-primary ml-1">{height}px</span></Label>
              <Slider value={[height]} onValueChange={([v]) => setHeight(v)} min={260} max={620} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Line Mode</Label>
              <div className="flex items-center gap-3 h-8">
                <Switch checked={lineMode} onCheckedChange={setLineMode} />
                <span className="text-xs text-muted-foreground">{lineMode ? "Lines" : "Dots"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Click Shockwave</Label>
              <div className="flex items-center gap-3 h-8">
                <Switch checked={clickShockwave} onCheckedChange={setClickShockwave} />
                <span className="text-xs text-muted-foreground">{clickShockwave ? "On" : "Off"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Accent Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-8 rounded border border-border bg-transparent cursor-pointer" />
                <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-8 text-xs font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Node Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={nodeColor} onChange={(e) => setNodeColor(e.target.value)} className="w-10 h-8 rounded border border-border bg-transparent cursor-pointer" />
                <Input value={nodeColor} onChange={(e) => setNodeColor(e.target.value)} className="h-8 text-xs font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-8 rounded border border-border bg-transparent cursor-pointer" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-xs font-mono" />
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

export default CursorAttractorFieldPage;
