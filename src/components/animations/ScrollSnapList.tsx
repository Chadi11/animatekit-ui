import { useEffect, useRef, useState } from "react";

interface SeriesItem {
  title: string;
  color: string;
  image: string;
  year: string;
  character: string;
}

interface ScrollSnapListProps {
  items?: SeriesItem[];
  bgColor?: string;
  cardBgColor?: string;
  className?: string;
}

const DEFAULT_ITEMS: SeriesItem[] = [
  { title: "Breaking Bad", color: "#22c55e", image: "", year: "2008–2013", character: "Walter White" },
  { title: "Game of Thrones", color: "#f59e0b", image: "", year: "2011–2019", character: "Jon Snow" },
  { title: "Dexter", color: "#ef4444", image: "", year: "2006–2013", character: "Dexter Morgan" },
  { title: "Dark", color: "#8b5cf6", image: "", year: "2017–2020", character: "Jonas Kahnwald" },
  { title: "Fargo", color: "#38bdf8", image: "", year: "2014–present", character: "Lorne Malvo" },
  { title: "Banshee", color: "#f97316", image: "", year: "2013–2016", character: "Lucas Hood" },
];

const ScrollSnapList = ({
  items = DEFAULT_ITEMS,
  bgColor = "#0a0a0a",
  cardBgColor = "#111111",
  className = "",
}: ScrollSnapListProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const ITEM_H = 90;

  const scrollToItem = (idx: number) => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: idx * ITEM_H, behavior: "smooth" });
  };

  const updateDot = (idx: number) => {
    const line = lineRef.current;
    const dot = dotRef.current;
    if (!line || !dot) return;
    const lineH = line.offsetHeight;
    const fraction = idx / (items.length - 1);
    dot.style.top = `${fraction * lineH}px`;
  };

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let ticking = false;
    let snapTimer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = list.scrollTop;
          const idx = Math.round(scrollTop / ITEM_H);
          const clamped = Math.max(0, Math.min(idx, items.length - 1));
          if (clamped !== activeRef.current) {
            activeRef.current = clamped;
            setActiveIndex(clamped);
            setImgVisible(false);
            setTimeout(() => setImgVisible(true), 200);
            updateDot(clamped);
          }
          ticking = false;
        });
        ticking = true;
      }
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        const idx = Math.round(list.scrollTop / ITEM_H);
        list.scrollTo({ top: idx * ITEM_H, behavior: "smooth" });
      }, 120);
    };

    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      list.removeEventListener("scroll", onScroll);
      clearTimeout(snapTimer);
    };
  }, [items.length]);

  useEffect(() => {
    setTimeout(() => updateDot(0), 100);
  }, []);

  const active = items[activeIndex];

  return (
    <div
      className={`flex w-full overflow-hidden rounded-2xl ${className}`}
      style={{ height: 540, background: bgColor }}
    >
      {/* LEFT: snap-scroll list */}
      <div
        ref={listRef}
        className="sl-left flex-shrink-0 overflow-y-scroll [scrollbar-width:none]"
        style={{ flex: "0 0 44%", paddingTop: 220, paddingBottom: 220, paddingLeft: 36, paddingRight: 20 }}
      >
        <style>{`.sl-left::-webkit-scrollbar{display:none}`}</style>
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => scrollToItem(i)}
            className="flex flex-col justify-center gap-[3px] cursor-pointer select-none"
            style={{ height: ITEM_H }}
          >
            <div className="font-bold uppercase leading-tight tracking-tight" style={{
              fontSize: "clamp(14px, 2.5vw, 24px)",
              transition: "color 0.35s ease",
              color: activeIndex === i ? item.color : "rgba(255,255,255,0.18)",
            }}>
              {item.title}
            </div>
            <div className="text-[11px] tracking-[2px]" style={{
              transition: "color 0.35s ease",
              color: activeIndex === i ? `${item.color}70` : "rgba(255,255,255,0.07)",
            }}>
              {item.year}
            </div>
          </div>
        ))}
      </div>

      {/* CENTER: line + dot */}
      <div className="flex-shrink-0 self-stretch flex items-center justify-center relative my-10" style={{ flex: "0 0 20px" }}>
        <div
          ref={lineRef}
          className="absolute top-0 bottom-0 rounded-sm"
          style={{ width: 2, background: "rgba(255,255,255,0.08)" }}
        >
          <div className="absolute top-0 w-full rounded-sm" style={{
            height: `${(activeIndex / (items.length - 1)) * 100}%`,
            background: active.color,
            transition: "height 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s ease",
          }} />
        </div>
        <div
          ref={dotRef}
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full z-[2]"
          style={{
            width: 10, height: 10,
            background: active.color,
            border: `2px solid ${bgColor}`,
            boxShadow: `0 0 10px 2px ${active.color}70`,
            transition: "top 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s ease, box-shadow 0.4s ease",
          }}
        />
      </div>

      {/* RIGHT: 9:16 card */}
      <div className="flex-1 flex items-center justify-center relative" style={{ padding: "28px 28px 28px 8px" }}>
        <div className="absolute inset-0" style={{
          background: `${active.color}0d`,
          transition: "background 0.5s ease",
        }} />
        <div className="relative z-[1] h-full flex flex-col overflow-hidden" style={{
          aspectRatio: "9/16",
          maxHeight: 484,
          borderRadius: 14,
          border: `1.5px solid ${active.color}35`,
          background: cardBgColor,
          transition: "border-color 0.5s ease",
        }}>
          {active.image ? (
            <img
              src={active.image}
              alt={active.title}
              className="w-full h-full object-cover block"
              style={{
                opacity: imgVisible ? 1 : 0,
                transition: "opacity 0.25s ease",
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-end pb-7" style={{
              opacity: imgVisible ? 1 : 0,
              transition: "opacity 0.25s ease",
              background: `linear-gradient(180deg, ${cardBgColor} 0%, ${active.color}18 100%)`,
            }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[96px] font-black leading-none select-none" style={{
                color: `${active.color}15`,
                letterSpacing: -4,
                transition: "color 0.4s ease",
              }}>
                {active.title.charAt(0)}
              </div>
              <div className="relative z-[1] text-center">
                <div className="text-[10px] tracking-[3px] uppercase mb-1" style={{
                  color: `${active.color}60`,
                  transition: "color 0.4s ease",
                }}>
                  Character
                </div>
                <div className="text-sm font-semibold tracking-wide" style={{
                  color: active.color,
                  transition: "color 0.4s ease",
                }}>
                  {active.character}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-5 right-4 flex flex-col gap-[5px] z-[2]">
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => scrollToItem(i)}
              className="rounded-sm cursor-pointer"
              style={{
                width: 4,
                height: activeIndex === i ? 20 : 4,
                background: activeIndex === i ? item.color : "rgba(255,255,255,0.15)",
                transition: "height 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollSnapList;
