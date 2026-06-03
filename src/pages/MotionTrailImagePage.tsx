import { useState } from "react";
import MotionTrailImage from "@/components/animations/MotionTrailImage";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (followStrength: number, smoothing: number, trailLength: number, fadeSpeed: number, imageWidth: number) =>
  `import { useState, useEffect, useRef } from "react";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=780&fit=crop";

interface MotionTrailImageProps {
  imageSrc?: string;
  followStrength?: number;
  smoothing?: number;
  trailLength?: number;
  fadeSpeed?: number;
  imageWidth?: number;
  trailSpacing?: number;
}

const MotionTrailImage = ({
  imageSrc = DEFAULT_IMAGE,
  followStrength = ${followStrength},
  smoothing = ${smoothing},
  trailLength = ${trailLength},
  fadeSpeed = ${fadeSpeed},
  imageWidth = ${imageWidth},
  trailSpacing = 1.4,
}: MotionTrailImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const trailCount = Math.max(1, Math.min(12, trailLength));
  const trailPos = useRef<{ x: number; y: number }[]>(
    Array.from({ length: trailCount }, () => ({ x: 0, y: 0 }))
  );
  const initialized = useRef(false);
  const [, forceRender] = useState(0);
  const snapshot = useRef<{ x: number; y: number }[]>([]);
  const imgH = Math.round(imageWidth * 1.3);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const initCenter = () => {
      const cx = el.offsetWidth / 2;
      const cy = el.offsetHeight / 2;
      currentPos.current = { x: cx, y: cy };
      targetPos.current = { x: cx, y: cy };
      trailPos.current.forEach((p) => { p.x = cx; p.y = cy; });
    };
    initCenter();
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = el.offsetWidth / 2;
      const cy = el.offsetHeight / 2;
      const s = followStrength / 100;
      targetPos.current = { x: cx + (mx - cx) * s, y: cy + (my - cy) * s };
      if (!initialized.current) {
        currentPos.current = { ...targetPos.current };
        trailPos.current.forEach((p) => { p.x = targetPos.current.x; p.y = targetPos.current.y; });
        initialized.current = true;
      }
    };
    el.addEventListener("mousemove", onMove);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const sm = Math.max(0.01, Math.min(0.5, smoothing));
    const tick = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, sm);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, sm);
      for (let i = 0; i < trailPos.current.length; i++) {
        const leader = i === 0 ? currentPos.current : trailPos.current[i - 1];
        const lag = Math.max(0.01, sm * (1 - i * 0.06));
        trailPos.current[i].x = lerp(trailPos.current[i].x, leader.x, lag);
        trailPos.current[i].y = lerp(trailPos.current[i].y, leader.y, lag);
      }
      snapshot.current = [
        { ...currentPos.current },
        ...trailPos.current.map((p) => ({ ...p })),
      ];
      forceRender((n) => n + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [followStrength, smoothing]);

  const fd = Math.max(0.05, Math.min(0.95, fadeSpeed));
  const sp = Math.max(0.5, Math.min(3, trailSpacing));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[520px] bg-[#0c0c0f] overflow-hidden cursor-crosshair"
    >
      {snapshot.current
        .slice(1)
        .reverse()
        .map((pos, ri) => {
          const i = trailCount - 1 - ri;
          const opacity = Math.pow(fd, (i + 1) * sp);
          const scale = 1 - i * 0.018;
          return (
            <div
              key={ri}
              className="absolute rounded-[14px] overflow-hidden pointer-events-none will-change-transform"
              style={{
                width: imageWidth,
                height: imgH,
                opacity,
                transform: \`translate(\${Math.round(pos.x - imageWidth / 2)}px, \${Math.round(pos.y - imgH / 2)}px) scale(\${scale})\`,
              }}
            >
              <img src={imageSrc} alt="" draggable={false} className="w-full h-full object-cover block" />
            </div>
          );
        })}
      {snapshot.current[0] && (
        <div
          className="absolute rounded-[14px] overflow-hidden z-10 pointer-events-none will-change-transform shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          style={{
            width: imageWidth,
            height: imgH,
            transform: \`translate(\${Math.round(snapshot.current[0].x - imageWidth / 2)}px, \${Math.round(snapshot.current[0].y - imgH / 2)}px)\`,
          }}
        >
          <img src={imageSrc} alt="Motion Trail" draggable={false} className="w-full h-full object-cover block" />
        </div>
      )}
    </div>
  );
};
// Usage:
// <MotionTrailImage followStrength={${followStrength}} smoothing={${smoothing}} trailLength={${trailLength}} fadeSpeed={${fadeSpeed}} imageWidth={${imageWidth}} />`;

const propsData = [
  { name: "imageSrc", type: "string", default: "Unsplash URL", description: "Image URL to display" },
  { name: "followStrength", type: "number", default: "50", description: "How far image follows cursor (1–100)" },
  { name: "smoothing", type: "number", default: "0.1", description: "Motion lag — lower = heavier delay (0.01–0.3)" },
  { name: "trailLength", type: "number", default: "8", description: "Number of ghost copies trailing behind (1–12)" },
  { name: "fadeSpeed", type: "number", default: "0.55", description: "Ghost opacity decay (0.05–0.9)" },
  { name: "imageWidth", type: "number", default: "280", description: "Width of the image card in px" },
  { name: "trailSpacing", type: "number", default: "1.4", description: "Spacing between ghost opacity steps (0.5–3)" },
];


const MotionTrailImagePage = () => {
  const [followStrength, setFollowStrength] = useState(50);
  const [smoothing, setSmoothing] = useState(0.1);
  const [trailLength, setTrailLength] = useState(8);
  const [fadeSpeed, setFadeSpeed] = useState(0.55);
  const [imageWidth, setImageWidth] = useState(280);
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Motion Trail Image</h1>
        <p className="text-sm text-muted-foreground mt-1">An image that follows the cursor with trailing ghost copies that fade out.</p>
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
            <MotionTrailImage
              followStrength={followStrength}
              smoothing={smoothing}
              trailLength={trailLength}
              fadeSpeed={fadeSpeed}
              imageWidth={imageWidth}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(followStrength, smoothing, trailLength, fadeSpeed, imageWidth)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Follow Strength: {followStrength}</Label>
              <Slider min={1} max={100} step={1} value={[followStrength]} onValueChange={([v]) => setFollowStrength(v)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Smoothing: {smoothing.toFixed(2)}</Label>
              <Slider min={0.01} max={0.3} step={0.01} value={[smoothing]} onValueChange={([v]) => setSmoothing(v)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Trail Length: {trailLength}</Label>
              <Slider min={1} max={12} step={1} value={[trailLength]} onValueChange={([v]) => setTrailLength(v)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Fade Speed: {fadeSpeed.toFixed(2)}</Label>
              <Slider min={0.05} max={0.9} step={0.05} value={[fadeSpeed]} onValueChange={([v]) => setFadeSpeed(v)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Image Width: {imageWidth}px</Label>
              <Slider min={150} max={500} step={10} value={[imageWidth]} onValueChange={([v]) => setImageWidth(v)} />
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

export default MotionTrailImagePage;
