import { useState } from "react";
import ImageFollowCard from "@/components/animations/ImageFollowCard";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  imageSrc: string,
  imageWidth: number,
  imageHeight: number,
  label: string,
  sublabel: string,
  width: number,
  height: number
) => `import { useState, useEffect, useRef, useCallback } from "react";

interface ImageFollowCardProps {
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  label?: string;
  sublabel?: string;
  width?: number;
  height?: number;
}

const ImageFollowCard = ({
  imageSrc = "${imageSrc}",
  imageWidth = ${imageWidth},
  imageHeight = ${imageHeight},
  label = "${label}",
  sublabel = "${sublabel}",
  width = ${width},
  height = ${height},
}: ImageFollowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;
    if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
      currentRef.current = {
        x: lerp(currentRef.current.x, targetRef.current.x, 0.1),
        y: lerp(currentRef.current.y, targetRef.current.y, 0.1),
      };
      setPos({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      targetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    },
    [animate]
  );

  const handleMouseEnter = useCallback(() => setVisible(true), []);
  const handleMouseLeave = useCallback(() => {
    setVisible(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const imgOffsetX = 20;
  const imgOffsetY = -imageHeight / 2;

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] cursor-none select-none bg-black"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-[1]"
        style={{
          transition: "opacity 0.3s ease",
          opacity: visible ? 0.15 : 1,
        }}
      >
        <div className="text-[22px] font-bold text-white tracking-tight uppercase">
          {label}
        </div>
        <div className="text-xs text-white/40 tracking-widest uppercase">
          {sublabel}
        </div>
      </div>

      <div
        className="absolute rounded-xl overflow-hidden pointer-events-none z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        style={{
          left: pos.x + imgOffsetX,
          top: pos.y + imgOffsetY,
          width: imageWidth,
          height: imageHeight,
          opacity: visible && loaded ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        <img
          src={imageSrc}
          alt=""
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover block"
        />
      </div>

      <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] z-[2]" />
    </div>
  );
};
// Usage:
// <ImageFollowCard
//   imageSrc="${imageSrc}"
//   imageWidth={${imageWidth}}
//   imageHeight={${imageHeight}}
//   label="${label}"
//   sublabel="${sublabel}"
//   width={${width}}
//   height={${height}}
// />`;


const ImageFollowCardPage = () => {
  const [imageSrc, setImageSrc] = useState("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=780&fit=crop");
  const [imageWidth, setImageWidth] = useState(200);
  const [imageHeight, setImageHeight] = useState(260);
  const [label, setLabel] = useState("Hover Me");
  const [sublabel, setSublabel] = useState("Move your cursor around");
  const [width, setWidth] = useState(420);
  const [height, setHeight] = useState(280);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Image Follow Card</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A dark card where an image follows the cursor with smooth lerp animation.
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
            <ImageFollowCard
              key={previewKey}
              imageSrc={imageSrc}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              label={label}
              sublabel={sublabel}
              width={width}
              height={height}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(imageSrc, imageWidth, imageHeight, label, sublabel, width, height)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs text-muted-foreground">Image URL</Label>
              <Input value={imageSrc} onChange={(e) => { setImageSrc(e.target.value); resetPreview(); }} className="bg-background font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input value={label} onChange={(e) => { setLabel(e.target.value); resetPreview(); }} className="bg-background text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Sublabel</Label>
              <Input value={sublabel} onChange={(e) => { setSublabel(e.target.value); resetPreview(); }} className="bg-background text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Card Width <span className="text-primary ml-1">{width}px</span></Label>
              <Slider value={[width]} onValueChange={([v]) => { setWidth(v); resetPreview(); }} min={200} max={600} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Card Height <span className="text-primary ml-1">{height}px</span></Label>
              <Slider value={[height]} onValueChange={([v]) => { setHeight(v); resetPreview(); }} min={150} max={500} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Image Width <span className="text-primary ml-1">{imageWidth}px</span></Label>
              <Slider value={[imageWidth]} onValueChange={([v]) => { setImageWidth(v); resetPreview(); }} min={80} max={400} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Image Height <span className="text-primary ml-1">{imageHeight}px</span></Label>
              <Slider value={[imageHeight]} onValueChange={([v]) => { setImageHeight(v); resetPreview(); }} min={80} max={500} step={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageFollowCardPage;
