import { useRef, useState } from "react";

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
  { title: "Attack on Titan", images: [{ src: "", label: "Eren — Survey Corps", rotate: -8, tx: -260, ty: -60 }, { src: "", label: "The Colossal Titan", rotate: 4, tx: 20, ty: -100 }, { src: "", label: "Wall Maria", rotate: 10, tx: 200, ty: -30 }] },
  { title: "Code Geass", images: [{ src: "", label: "Lelouch", rotate: -6, tx: -240, ty: -50 }, { src: "", label: "Knightmare", rotate: 5, tx: 30, ty: -90 }, { src: "", label: "Zero", rotate: 12, tx: 210, ty: -20 }] },
  { title: "Steins Gate", images: [{ src: "", label: "Okabe", rotate: -10, tx: -250, ty: -70 }, { src: "", label: "The Lab", rotate: 3, tx: 10, ty: -110 }, { src: "", label: "Divergence", rotate: 9, tx: 205, ty: -40 }] },
  { title: "Kengan Ashura", images: [{ src: "", label: "Ohma", rotate: -7, tx: -245, ty: -55 }, { src: "", label: "The Arena", rotate: 6, tx: 25, ty: -95 }, { src: "", label: "Fighters", rotate: 11, tx: 195, ty: -25 }] },
  { title: "Erased", images: [{ src: "", label: "Satoru", rotate: -9, tx: -255, ty: -65 }, { src: "", label: "Revival", rotate: 4, tx: 15, ty: -105 }, { src: "", label: "Mystery", rotate: 8, tx: 200, ty: -35 }] },
  { title: "Parasyte", images: [{ src: "", label: "Shinichi", rotate: -8, tx: -250, ty: -60 }, { src: "", label: "Migi", rotate: 5, tx: 20, ty: -95 }, { src: "", label: "Parasite", rotate: 11, tx: 200, ty: -30 }] },
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
      className={`relative flex items-center justify-center p-12 overflow-visible ${className}`}
      style={{ minHeight: 520 }}
    >
      {items.map((show, si) => {
        const isActive = activeIndex === si;
        const colors = BG_COLORS[show.title] || ["#111", "#222", "#333"];
        return show.images.map((img, ii) => (
          <div
            key={`${si}-${ii}`}
            className="absolute rounded-[14px] overflow-hidden pointer-events-none z-[5]"
            style={{
              left: "50%",
              top: rowCenterY > 0 ? rowCenterY : "50%",
              width: 200,
              height: 130,
              background: colors[ii],
              opacity: isActive ? 1 : 0,
              transform: `translate(calc(-50% + ${img.tx}px), calc(-50% + ${img.ty}px)) rotate(${img.rotate}deg) scale(${isActive ? 1 : 0.85})`,
              transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.2,0.64,1), top 0.2s ease",
            }}
          >
            {img.src ? (
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover block"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] tracking-widest uppercase text-white/35">
                {img.label}
              </div>
            )}
          </div>
        ));
      })}

      <div className="flex flex-col items-center gap-1.5 relative z-10">
        {items.map((show, si) => (
          <div
            key={si}
            ref={(el) => { itemRefs.current[si] = el; }}
            onMouseEnter={() => handleEnter(si)}
            onMouseLeave={handleLeave}
            className="font-bold tracking-[0.04em] uppercase cursor-default select-none whitespace-nowrap leading-tight"
            style={{
              fontSize: "clamp(22px, 5vw, 44px)",
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
