import { useState } from "react";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import CircleDraw from "@/components/animations/CircleDraw";

const CircleDrawPage = () => {
  const [text, setText] = useState("Circle me");
  const [circleColor, setCircleColor] = useState("#ec4899");
  const [textColor, setTextColor] = useState("#1e293b");
  const [duration, setDuration] = useState(1.2);
  const [delay, setDelay] = useState(0.2);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [roughness, setRoughness] = useState(2);
  const [padding, setPadding] = useState(20);
  const [fontSize, setFontSize] = useState(48);

  const componentCode = `import CircleDraw from "@/components/animations/CircleDraw";

<CircleDraw
  text="${text}"
  circleColor="${circleColor}"
  textColor="${textColor}"
  duration={${duration}}
  delay={${delay}}
  strokeWidth={${strokeWidth}}
  roughness={${roughness}}
  padding={${padding}}
  fontSize={${fontSize}}
  repeat={true}
/>`;

  const implementationCode = `import { useEffect, useRef, useState, useMemo } from "react";

interface CircleDrawProps {
  text: string;
  circleColor?: string;
  textColor?: string;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  fontSize?: number;
  roughness?: number;
  padding?: number;
  repeat?: boolean;
  className?: string;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280 - 0.5;
  };
}

function generateCirclePath(
  width: number,
  height: number,
  roughness: number,
  seed: number
): string {
  const rand = seededRandom(seed);
  const segments = 32;
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = width / 2;
  const radiusY = height / 2;

  const points: [number, number][] = [];
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radiusX + rand() * roughness * 3;
    const y = centerY + Math.sin(angle) * radiusY + rand() * roughness * 3;
    points.push([x, y]);
  }

  let d = \`M \${points[0][0]},\${points[0][1]}\`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2 + rand() * roughness * 2;
    const cpy = (prev[1] + curr[1]) / 2 + rand() * roughness * 2;
    d += \` Q \${cpx},\${cpy} \${curr[0]},\${curr[1]}\`;
  }

  d += " Z";
  return d;
}

const CircleDraw = ({
  text,
  circleColor = "#ec4899",
  textColor = "#1e293b",
  duration = 1.2,
  delay = 0.2,
  strokeWidth = 3,
  fontSize = 32,
  roughness = 2,
  padding = 20,
  repeat = false,
  className = "",
}: CircleDrawProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 100, height: 50 });

  const seed = useMemo(() => Math.floor(Math.random() * 10000), []);

  const circlePath = useMemo(
    () => generateCirclePath(dimensions.width + padding * 2, dimensions.height + padding * 2, roughness, seed),
    [dimensions, padding, roughness, seed]
  );

  useEffect(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  }, [text, fontSize]);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [circlePath]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setActive(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  const svgWidth = dimensions.width + padding * 2;
  const svgHeight = dimensions.height + padding * 2;

  return (
    <span
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        padding: \`\${padding}px\`,
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
        viewBox={\`0 0 \${svgWidth} \${svgHeight}\`}
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d={circlePath}
          stroke={circleColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: active ? 0 : pathLength,
            transition: \`stroke-dashoffset \${duration}s cubic-bezier(0.4, 0, 0.2, 1) \${delay}s\`,
          }}
        />
      </svg>
      <span
        ref={textRef}
        style={{
          position: "relative",
          zIndex: 1,
          fontSize,
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          color: textColor,
          display: "inline-block",
        }}
      >
        {text}
      </span>
    </span>
  );
};

export default CircleDraw;`;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Circle Draw</h1>
          <p className="text-muted-foreground">
            Hand-drawn circle animation that encircles text with a sketchy, imperfect stroke. Ideal for highlighting key phrases with an organic, attention-grabbing circle effect.
          </p>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <PreviewFrame>
              <CircleDraw
                text={text}
                circleColor={circleColor}
                textColor={textColor}
                duration={duration}
                delay={delay}
                strokeWidth={strokeWidth}
                roughness={roughness}
                padding={padding}
                fontSize={fontSize}
                repeat={true}
              />
            </PreviewFrame>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="text">Text</Label>
                  <Input
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="circleColor">Circle Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={circleColor} onChange={(e) => setCircleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                      <Input id="circleColor" value={circleColor} onChange={(e) => setCircleColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                      <Input id="textColor" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 text-xs font-mono flex-1" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Stroke Width: {strokeWidth}px</Label>
                  <Slider
                    value={[strokeWidth]}
                    onValueChange={([v]) => setStrokeWidth(v)}
                    min={1}
                    max={8}
                    step={0.5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Roughness: {roughness}</Label>
                  <Slider
                    value={[roughness]}
                    onValueChange={([v]) => setRoughness(v)}
                    min={0}
                    max={5}
                    step={0.5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Padding: {padding}px</Label>
                  <Slider
                    value={[padding]}
                    onValueChange={([v]) => setPadding(v)}
                    min={10}
                    max={60}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Size: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={([v]) => setFontSize(v)}
                    min={16}
                    max={96}
                    step={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration: {duration}s</Label>
                  <Slider
                    value={[duration]}
                    onValueChange={([v]) => setDuration(v)}
                    min={0.2}
                    max={3}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Delay: {delay}s</Label>
                  <Slider
                    value={[delay]}
                    onValueChange={([v]) => setDelay(v)}
                    min={0}
                    max={2}
                    step={0.1}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <CodeBlock code={componentCode} language="tsx" />
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-2">Full Implementation</h3>
              <CodeBlock code={implementationCode} language="tsx" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CircleDrawPage;
