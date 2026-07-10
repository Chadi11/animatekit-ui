import { useState } from "react";
import ParticleBurstButton2 from "@/components/animations/ParticleBurstButton2";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import PropsTable from "@/components/PropsTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (label: string, bgColor: string, borderColor: string, particleColor: string) =>
  `import { useState } from "react";
import { Star } from "lucide-react";

interface ParticleBurstButton2Props {
  label?: string;
  bgColor?: string;
  borderColor?: string;
  particleColor?: string;
  onClick?: () => void;
  className?: string;
}

const ParticleBurstButton2 = ({
  label = "${label}",
  bgColor = "${bgColor}",
  borderColor = "${borderColor}",
  particleColor = "${particleColor}",
  onClick,
  className = "",
}: ParticleBurstButton2Props) => {
  const [particles, setParticles] = useState<{ id: number; angle: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const createParticles = () => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      angle: i * 30 * (Math.PI / 180),
    }));
    setParticles(newParticles);
    onClick?.();
    setTimeout(() => setParticles([]), 800);
  };

  return (
    <div className={\`relative inline-flex \${className}\`}>
      <button
        onClick={createParticles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative rounded-xl font-bold text-[15px] cursor-pointer outline-none select-none overflow-visible"
        style={{
          padding: "14px 36px",
          color: isHovered ? "#F5EBDC" : borderColor,
          backgroundColor: isHovered ? bgColor : "transparent",
          border: \`2px solid \${borderColor}\`,
          transition: "all 0.3s ease",
        }}
      >
        <span className="flex items-center gap-2 relative z-[1]">
          <Star className="w-4 h-4" />
          {label}
        </span>

        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none"
            style={{
              backgroundColor: particleColor,
              animation: "particleBurst2 0.8s ease-out forwards",
              "--cos": \`\${Math.cos(particle.angle)}\`,
              "--sin": \`\${Math.sin(particle.angle)}\`,
            } as React.CSSProperties}
          />
        ))}
      </button>

      <style>{\`
        @keyframes particleBurst2 {
          0% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(calc(var(--cos) * 80px), calc(var(--sin) * 80px)) scale(0); opacity: 0; }
        }
      \`}</style>
    </div>
  );
};

export default ParticleBurstButton2;

// Usage:
// <ParticleBurstButton2 label="${label}" bgColor="${bgColor}" borderColor="${borderColor}" particleColor="${particleColor}" />`;

const propsData = [
  { name: "label", type: "string", default: '"Click Me"', description: "Button text" },
  { name: "bgColor", type: "string", default: '"#D62700"', description: "Hover background color" },
  { name: "borderColor", type: "string", default: '"#D62700"', description: "Border and default text color" },
  { name: "particleColor", type: "string", default: '"#D62700"', description: "Color of burst particles" },
  { name: "onClick", type: "() => void", default: "—", description: "Click handler" },
  { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
];

const ParticleBurstButton2Page = () => {
  const [label, setLabel] = useState("Click Me");
  const [bgColor, setBgColor] = useState("#D62700");
  const [borderColor, setBorderColor] = useState("#D62700");
  const [particleColor, setParticleColor] = useState("#D62700");
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Buttons</p>
        <h1 className="text-2xl font-bold text-foreground">Particle Burst 2</h1>
        <p className="text-sm text-muted-foreground mt-1">A button that spawns 12 particles bursting outward on click.</p>
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
            <ParticleBurstButton2 label={label} bgColor={bgColor} borderColor={borderColor} particleColor={particleColor} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(label, bgColor, borderColor, particleColor)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 text-xs flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Border Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-8 text-xs flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Particle Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={particleColor} onChange={(e) => setParticleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <Input value={particleColor} onChange={(e) => setParticleColor(e.target.value)} className="h-8 text-xs flex-1" />
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

export default ParticleBurstButton2Page;
