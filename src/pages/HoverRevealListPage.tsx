import { useState } from "react";
import HoverRevealList from "@/components/animations/HoverRevealList";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = () =>
  `import { useRef, useState } from "react";

interface HoverImage {
  src: string;
  label: string;
  rotate: number;
  tx: number;
  ty: number;
}

interface HoverItem {
  title: string;
  images: [HoverImage, HoverImage, HoverImage];
}

interface HoverRevealListProps {
  items?: HoverItem[];
  className?: string;
}

const DEFAULT_ITEMS: HoverItem[] = [
  {
    title: "Attack on Titan",
    images: [
      { src: "", label: "Eren — Survey Corps", rotate: -8, tx: -260, ty: -60 },
      { src: "", label: "The Colossal Titan", rotate: 4, tx: 20, ty: -100 },
      { src: "", label: "Wall Maria", rotate: 10, tx: 200, ty: -30 },
    ],
  },
  {
    title: "Code Geass",
    images: [
      { src: "", label: "Lelouch", rotate: -6, tx: -240, ty: -50 },
      { src: "", label: "Knightmare", rotate: 5, tx: 30, ty: -90 },
      { src: "", label: "Zero", rotate: 12, tx: 210, ty: -20 },
    ],
  },
  {
    title: "Steins Gate",
    images: [
      { src: "", label: "Okabe", rotate: -10, tx: -250, ty: -70 },
      { src: "", label: "The Lab", rotate: 3, tx: 10, ty: -110 },
      { src: "", label: "Divergence", rotate: 9, tx: 205, ty: -40 },
    ],
  },
  {
    title: "Kengan Ashura",
    images: [
      { src: "", label: "Ohma", rotate: -7, tx: -245, ty: -55 },
      { src: "", label: "The Arena", rotate: 6, tx: 25, ty: -95 },
      { src: "", label: "Fighters", rotate: 11, tx: 195, ty: -25 },
    ],
  },
  {
    title: "Erased",
    images: [
      { src: "", label: "Satoru", rotate: -9, tx: -255, ty: -65 },
      { src: "", label: "Revival", rotate: 4, tx: 15, ty: -105 },
      { src: "", label: "Mystery", rotate: 8, tx: 200, ty: -35 },
    ],
  },
  {
    title: "Parasyte",
    images: [
      { src: "", label: "Shinichi", rotate: -8, tx: -250, ty: -60 },
      { src: "", label: "Migi", rotate: 5, tx: 20, ty: -95 },
      { src: "", label: "Parasite", rotate: 11, tx: 200, ty: -30 },
    ],
  },
];

const BG_COLORS: Record<string, string[]> = {
  "Attack on Titan": ["#3a2a1a", "#5c3d1e", "#8b5e3c"],
  "Code Geass": ["#1a1a2e", "#16213e", "#0f3460"],
  "Steins Gate": ["#1a2a1a", "#1e3a1e", "#2d5a27"],
  "Kengan Ashura": ["#2a1a1a", "#3e1e1e", "#6b2d2d"],
  "Erased": ["#1a2030", "#1e2d45", "#2a4060"],
  "Parasyte": ["#1a1a1a", "#2a1a2a", "#3d1a3d"],
};

const HoverRevealList = ({
  items = DEFAULT_ITEMS,
  className = "",
}: HoverRevealListProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowCenterY, setRowCenterY] = useState(0);

  const getRowCenterY = (idx: number): number => {
    const item = itemRefs.current[idx];
    const container = containerRef.current;
    if (!item || !container) return 0;
    const itemRect = item.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return itemRect.top - containerRect.top + itemRect.height / 2;
  };

  const handleEnter = (idx: number) => {
    setActiveIndex(idx);
    setRowCenterY(getRowCenterY(idx));
  };

  const handleLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        minHeight: 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2rem",
        overflow: "hidden",
      }}
    >
      {items.map((show, si) => {
        const isActive = activeIndex === si;
        const colors = BG_COLORS[show.title] || ["#111", "#222", "#333"];
        return show.images.map((img, ii) => (
          <div
            key={\`\${si}-\${ii}\`}
            style={{
              position: "absolute",
              left: "50%",
              top: rowCenterY > 0 ? rowCenterY : "50%",
              width: 200, height: 130,
              borderRadius: 14, overflow: "hidden",
              pointerEvents: "none", zIndex: 5,
              background: colors[ii],
              opacity: isActive ? 1 : 0,
              transform: \`translate(calc(-50% + \${img.tx}px), calc(-50% + \${img.ty}px)) rotate(\${img.rotate}deg) scale(\${isActive ? 1 : 0.85})\`,
              transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.2,0.64,1), top 0.2s ease",
            }}
          >
            {img.src ? (
              <img src={img.src} alt={img.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
              }}>
                {img.label}
              </div>
            )}
          </div>
        ));
      })}
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 6,
        position: "relative", zIndex: 10,
      }}>
        {items.map((show, si) => (
          <div
            key={si}
            ref={(el) => { itemRefs.current[si] = el; }}
            onMouseEnter={() => handleEnter(si)}
            onMouseLeave={handleLeave}
            style={{
              fontSize: "clamp(22px, 5vw, 44px)",
              fontWeight: 700, letterSpacing: "0.04em",
              textTransform: "uppercase", cursor: "default",
              userSelect: "none", lineHeight: 1.25, whiteSpace: "nowrap",
              color: activeIndex === si ? "#ffffff" : "rgba(180,178,169,0.9)",
              transition: "color 0.25s ease",
            }}
          >
            {show.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoverRevealList;

// Usage:
// <HoverRevealList />
// Pass custom items with image URLs via the items prop.`;

const propsData = [
  { name: "items", type: "HoverItem[]", default: "DEFAULT_ITEMS", description: "Array of items with title and 3 image cards" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes for the container" },
];


const HoverRevealListPage = () => {
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Hover Reveal List</h1>
        <p className="text-sm text-muted-foreground mt-1">A list of titles that reveal floating image cards on hover, positioned around the hovered row.</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <div className="rounded-xl border border-border overflow-visible bg-card shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background/50 text-[10px] font-mono text-muted-foreground min-w-[200px] text-center">
                  animatekit.dev/preview
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center min-h-[520px] py-16 px-12" style={{ background: "hsl(var(--preview-bg))" }}>
              <HoverRevealList />
            </div>
          </div>
        ) : (
          <CodeBlock code={generateCode()} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <PropsTable props={propsData} />
      </div>
    </div>
  );
};

export default HoverRevealListPage;
