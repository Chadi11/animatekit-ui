import { useState } from "react";
import ScrollSnapList from "@/components/animations/ScrollSnapList";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = () =>
  `import { useEffect, useRef, useState } from "react";

interface SeriesItem {
  title: string;
  color: string;
  image: string;
  year: string;
  character: string;
}

interface ScrollSnapListProps {
  items?: SeriesItem[];
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
    dot.style.top = \`\${fraction * lineH}px\`;
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
    <div className={className} style={{
      display: "flex", width: "100%", height: 540,
      overflow: "hidden", background: "#0a0a0a", borderRadius: 16,
    }}>
      {/* LEFT: snap-scroll list */}
      <div ref={listRef} className="sl-left" style={{
        flex: "0 0 44%", overflowY: "scroll", scrollbarWidth: "none",
        paddingTop: 220, paddingBottom: 220, paddingLeft: 36, paddingRight: 20,
      }}>
        <style>{\`.sl-left::-webkit-scrollbar{display:none}\`}</style>
        {items.map((item, i) => (
          <div key={i} onClick={() => scrollToItem(i)} style={{
            height: ITEM_H, display: "flex", flexDirection: "column",
            justifyContent: "center", gap: 3, cursor: "pointer", userSelect: "none",
          }}>
            <div style={{
              fontSize: "clamp(14px, 2.5vw, 24px)", fontWeight: 700,
              letterSpacing: "-0.02em", textTransform: "uppercase", lineHeight: 1.1,
              transition: "color 0.35s ease",
              color: activeIndex === i ? item.color : "rgba(255,255,255,0.18)",
            }}>{item.title}</div>
            <div style={{
              fontSize: 11, letterSpacing: "2px", transition: "color 0.35s ease",
              color: activeIndex === i ? \`\${item.color}70\` : "rgba(255,255,255,0.07)",
            }}>{item.year}</div>
          </div>
        ))}
      </div>

      {/* CENTER: line + dot */}
      <div style={{
        flex: "0 0 20px", alignSelf: "stretch",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", margin: "40px 0",
      }}>
        <div ref={lineRef} style={{
          position: "absolute", top: 0, bottom: 0,
          width: 2, borderRadius: 2, background: "rgba(255,255,255,0.08)",
        }}>
          <div style={{
            position: "absolute", top: 0, width: "100%",
            height: \`\${(activeIndex / (items.length - 1)) * 100}%\`,
            background: active.color, borderRadius: 2,
            transition: "height 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s ease",
          }} />
        </div>
        <div ref={dotRef} style={{
          position: "absolute", left: "50%", top: 0,
          transform: "translate(-50%, -50%)",
          width: 10, height: 10, borderRadius: "50%",
          background: active.color, border: "2px solid #0a0a0a",
          boxShadow: \`0 0 10px 2px \${active.color}70\`,
          transition: "top 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s ease, box-shadow 0.4s ease",
          zIndex: 2,
        }} />
      </div>

      {/* RIGHT: 9:16 card */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "28px 28px 28px 8px", position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: \`\${active.color}0d\`, transition: "background 0.5s ease",
        }} />
        <div style={{
          position: "relative", zIndex: 1, height: "100%", aspectRatio: "9/16",
          maxHeight: 484, borderRadius: 14, overflow: "hidden",
          border: \`1.5px solid \${active.color}35\`, background: "#111",
          transition: "border-color 0.5s ease", display: "flex", flexDirection: "column",
        }}>
          {active.image ? (
            <img src={active.image} alt={active.title} style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              opacity: imgVisible ? 1 : 0, transition: "opacity 0.25s ease",
            }} />
          ) : (
            <div style={{
              width: "100%", height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "flex-end", padding: "0 0 28px",
              opacity: imgVisible ? 1 : 0, transition: "opacity 0.25s ease",
              background: \`linear-gradient(180deg, #0f0f0f 0%, \${active.color}18 100%)\`,
            }}>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)", fontSize: 96, fontWeight: 900,
                color: \`\${active.color}15\`, letterSpacing: -4,
                userSelect: "none", transition: "color 0.4s ease", lineHeight: 1,
              }}>{active.title.charAt(0)}</div>
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{
                  fontSize: 10, letterSpacing: "3px", textTransform: "uppercase",
                  color: \`\${active.color}60\`, marginBottom: 4, transition: "color 0.4s ease",
                }}>Character</div>
                <div style={{
                  fontSize: 14, fontWeight: 600, letterSpacing: "0.5px",
                  color: active.color, transition: "color 0.4s ease",
                }}>{active.character}</div>
              </div>
            </div>
          )}
        </div>
        <div style={{
          position: "absolute", bottom: 20, right: 16,
          display: "flex", flexDirection: "column", gap: 5, zIndex: 2,
        }}>
          {items.map((item, i) => (
            <div key={i} onClick={() => scrollToItem(i)} style={{
              width: 4, height: activeIndex === i ? 20 : 4, borderRadius: 2,
              background: activeIndex === i ? item.color : "rgba(255,255,255,0.15)",
              transition: "height 0.3s ease, background 0.3s ease", cursor: "pointer",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollSnapList;

// Usage:
// <ScrollSnapList />
// Pass custom items with image URLs via the items prop.`;

const propsData = [
  { name: "items", type: "SeriesItem[]", default: "DEFAULT_ITEMS", description: "Array of series items with title, color, image, year, and character" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes for the container" },
];


const ScrollSnapListPage = () => {
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Scroll Snap List</h1>
        <p className="text-sm text-muted-foreground mt-1">A split-panel layout with a scrollable snap list, animated progress line, and 9:16 info card.</p>
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
            <ScrollSnapList />
          </PreviewFrame>
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

export default ScrollSnapListPage;
