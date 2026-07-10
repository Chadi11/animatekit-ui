import { useState } from "react";
import SpotlightCard from "@/components/animations/SpotlightCard";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code, Sparkles } from "lucide-react";

const generateCode = (
  spotlightColor: string,
  spotlightSize: number,
  borderGlow: boolean,
) =>
  `import { useRef, ReactNode } from "react";

interface SpotlightCardProps {
  spotlightColor?: string;
  spotlightSize?: number;
  borderGlow?: boolean;
  className?: string;
  children?: ReactNode;
}

const SpotlightCard = ({
  spotlightColor = "${spotlightColor}",
  spotlightSize = ${spotlightSize},
  borderGlow = ${borderGlow},
  className = "",
  children,
}: SpotlightCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", \`\${e.clientX - rect.left}px\`);
    el.style.setProperty("--my", \`\${e.clientY - rect.top}px\`);
    el.style.setProperty("--opacity", "1");
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.setProperty("--opacity", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={\`group relative overflow-hidden rounded-2xl \${className}\`}
      style={
        {
          background: "#0b0b0f",
          border: "1px solid rgba(255,255,255,0.08)",
          "--mx": "50%",
          "--my": "50%",
          "--opacity": "0",
        } as React.CSSProperties
      }
    >
      {/* Spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--opacity)",
          background: \`radial-gradient(\${spotlightSize}px circle at var(--mx) var(--my), \${spotlightColor}, transparent 70%)\`,
        }}
      />

      {/* Border glow */}
      {borderGlow && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: "var(--opacity)",
            background: \`radial-gradient(\${spotlightSize * 1.2}px circle at var(--mx) var(--my), \${spotlightColor}, transparent 60%)\`,
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: 1,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
};

export default SpotlightCard;`;

const propsData = [
  { name: "spotlightColor", type: "string", default: '"rgba(249,115,22,0.25)"', description: "Color of the cursor-following glow (supports rgba for soft blends)" },
  { name: "spotlightSize", type: "number", default: "300", description: "Radius of the spotlight in pixels" },
  { name: "borderGlow", type: "boolean", default: "true", description: "Lights up the card border in sync with the cursor" },
  { name: "className", type: "string", default: '""', description: "Additional Tailwind classes for sizing/layout" },
  { name: "children", type: "ReactNode", default: "—", description: "Card contents — drop in any markup" },
];

const SpotlightCardPage = () => {
  const [spotlightColor, setSpotlightColor] = useState("rgba(249,115,22,0.25)");
  const [spotlightSize, setSpotlightSize] = useState(300);
  const [borderGlow, setBorderGlow] = useState(true);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [cardKey, setCardKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Interactive</p>
        <h1 className="text-2xl font-bold text-foreground">Spotlight Card</h1>
        <p className="text-sm text-muted-foreground mt-1">Premium card with a soft radial glow that follows the cursor. Drop in any content via children.</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Eye className="h-3.5 w-3.5" /> Preview</ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"><Code className="h-3.5 w-3.5" /> Code</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame onReload={() => setCardKey((k) => k + 1)}>
            <SpotlightCard
              key={cardKey}
              spotlightColor={spotlightColor}
              spotlightSize={spotlightSize}
              borderGlow={borderGlow}
              className="w-[340px]"
            >
              <div className="p-7">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3" /> Featured
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">
                  Move your cursor over me
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  A soft spotlight tracks your pointer in real time. Perfect for landing-page heroes, pricing tiers, or feature grids.
                </p>
                <button className="px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors">
                  Get started →
                </button>
              </div>
            </SpotlightCard>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(spotlightColor, spotlightSize, borderGlow)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Spotlight Color</Label>
              <Input value={spotlightColor} onChange={(e) => setSpotlightColor(e.target.value)} className="h-8 text-xs font-mono" />
              <p className="text-[10px] text-muted-foreground">Tip: use rgba(...) for a soft, semi-transparent glow.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Spotlight Size <span className="text-primary ml-1">{spotlightSize}px</span></Label>
              <Slider value={[spotlightSize]} onValueChange={([v]) => setSpotlightSize(v)} min={120} max={600} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Border Glow</Label>
              <div className="flex items-center gap-3 h-8">
                <Switch checked={borderGlow} onCheckedChange={setBorderGlow} />
                <span className="text-xs text-muted-foreground">{borderGlow ? "On" : "Off"}</span>
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

export default SpotlightCardPage;
