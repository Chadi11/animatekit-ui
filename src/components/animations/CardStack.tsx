import { useState, useEffect, useRef, useCallback } from "react";

interface CardItem {
  id: number;
  content?: React.ReactNode;
  name?: string;
  role?: string;
  quote?: string;
  avatar?: string;
}

interface CardStackProps {
  items?: CardItem[];
  intervalMs?: number;
  cardOffset?: number;
  scaleFactor?: number;
  trigger?: "view" | "hover" | "both";
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_ITEMS: CardItem[] = [
  { id: 1, name: "Sarah Chen", role: "Product Designer", quote: "This animation library is an absolute game changer. The components are buttery smooth and drop right in.", avatar: "SC" },
  { id: 2, name: "Marcus Webb", role: "Frontend Engineer", quote: "I've tried every animation library out there. Nothing comes close to this level of polish and control.", avatar: "MW" },
  { id: 3, name: "Lena Okafor", role: "Creative Director", quote: "Our design system went from good to stunning overnight. The card effects alone are worth it.", avatar: "LO" },
  { id: 4, name: "James Rourke", role: "Startup Founder", quote: "Shipped a landing page in hours that looks like weeks of work. Clients were blown away.", avatar: "JR" },
];

const AVATAR_COLORS = [
  { bg: "hsl(210 60% 22%)", text: "#7eb8f7" },
  { bg: "hsl(155 40% 18%)", text: "#5ecfa0" },
  { bg: "hsl(280 40% 22%)", text: "#c084fc" },
  { bg: "hsl(30 50% 20%)", text: "#fbbf24" },
];

const CardStack = ({
  items = DEFAULT_ITEMS,
  intervalMs = 3000,
  cardOffset = 12,
  scaleFactor = 0.06,
  trigger = "both",
  width = 340,
  height = 220,
  className = "",
}: CardStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAutoMode = trigger === "view" || trigger === "both";
  const isHoverMode = trigger === "hover" || trigger === "both";

  const advance = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
      setIsAnimating(false);
    }, 420);
  }, [isAnimating, items.length]);

  useEffect(() => {
    if (!isAutoMode) return;
    if (isHoverMode && isHovered) return;
    intervalRef.current = setInterval(advance, intervalMs);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isAutoMode, isHoverMode, isHovered, intervalMs, advance]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (isHoverMode && !isAutoMode) advance();
  }, [isHoverMode, isAutoMode, advance]);

  const handleMouseLeave = useCallback(() => { setIsHovered(false); }, []);
  const handleClick = useCallback(() => { advance(); }, [advance]);

  const orderedItems = [];
  for (let i = items.length - 1; i >= 0; i--) {
    const idx = (activeIndex + i) % items.length;
    orderedItems.push({ item: items[idx], stackPos: i });
  }

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ width, height: height + cardOffset * (items.length - 1) + 24 }}
    >
      {orderedItems.map(({ item, stackPos }) => {
        const isTop = stackPos === 0;
        const translateY = stackPos * cardOffset;
        const scale = 1 - stackPos * scaleFactor;
        const opacity = stackPos > 3 ? 0 : 1 - stackPos * 0.08;
        const zIndex = items.length - stackPos;
        return (
          <div
            key={item.id}
            className="absolute top-0 left-1/2 overflow-hidden rounded-[14px] border border-white/[0.12]"
            style={{
              width, height,
              transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})`,
              transformOrigin: "top center", zIndex, opacity,
              transition: isAnimating
                ? "transform 0.42s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.42s ease"
                : "transform 0.3s ease, opacity 0.3s ease",
              background: "linear-gradient(145deg, hsl(0 0% 15%), hsl(0 0% 10%))",
              boxShadow: isTop
                ? "0 16px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)"
                : `0 ${4 + stackPos * 2}px ${16 + stackPos * 8}px rgba(0,0,0,0.3)`,
            }}
          >
            {item.content ?? (
              <DefaultCard item={item} index={item.id - 1} isTop={isTop} total={items.length} activeIndex={activeIndex} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const DefaultCard = ({ item, index, isTop, total, activeIndex }: { item: CardItem; index: number; isTop: boolean; total: number; activeIndex: number }) => {
  const colors = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div className="w-full h-full p-[22px_24px] box-border flex flex-col justify-between relative">
      <div className="absolute top-3.5 right-5 text-[52px] leading-none text-white/5 font-serif select-none pointer-events-none">"</div>
      <p
        className="m-0 text-sm leading-relaxed italic flex-1 flex items-center"
        style={{
          color: isTop ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)",
          transition: "color 0.3s ease",
        }}
      >
        "{item.quote}"
      </p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold tracking-wide shrink-0"
            style={{
              background: colors.bg,
              border: `1px solid ${colors.text}30`,
              color: colors.text,
            }}
          >
            {item.avatar}
          </div>
          <div>
            <p className="m-0 text-[13px] font-semibold text-white">{item.name}</p>
            <p className="m-0 text-[11px] text-white/40 mt-px">{item.role}</p>
          </div>
        </div>
        <div className="flex gap-[5px] items-center">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="h-[5px] rounded-[3px]"
              style={{
                width: i === activeIndex ? 16 : 5,
                background: i === activeIndex ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
    </div>
  );
};

export default CardStack;
