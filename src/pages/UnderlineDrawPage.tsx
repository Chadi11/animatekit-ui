import { useState } from "react";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import UnderlineDraw from "@/components/animations/UnderlineDraw";

const UnderlineDrawPage = () => {
  const [text, setText] = useState("Emphasize this");
  const [underlineColor, setUnderlineColor] = useState("#f59e0b");
  const [textColor, setTextColor] = useState("#1e293b");
  const [duration, setDuration] = useState(0.8);
  const [delay, setDelay] = useState(0.2);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [roughness, setRoughness] = useState(2);
  const [fontSize, setFontSize] = useState(48);

  const componentCode = `import UnderlineDraw from "@/components/animations/UnderlineDraw";

<UnderlineDraw
  text="${text}"
  underlineColor="${underlineColor}"
  textColor="${textColor}"
  duration={${duration}}
  delay={${delay}}
  strokeWidth={${strokeWidth}}
  roughness={${roughness}}
  fontSize={${fontSize}}
  repeat={true}
/>`;

  const implementationCode = `import { useEffect, useRef, useState, useMemo } from "react";

interface UnderlineDrawProps {
  text: string;
  underlineColor?: string;
  textColor?: string;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  fontSize?: number;
  roughness?: number;
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

function generateUnderlinePath(
  width: number,
  roughness: number,
  seed: number
): string {
  const rand = seededRandom(seed);
  const steps = Math.max(8, Math.floor(width / 15));
  const overshoot = width * 0.02;

  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const x = -overshoot + i * (width + overshoot * 2) / steps;
    const y = rand() * roughness * 2;
    points.push([x, y]);
  }

  let d = \`M \${points[0][0]},\${points[0][1]}\`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2 + rand() * roughness;
    const cpy = (prev[1] + curr[1]) / 2 + rand() * roughness;
    d += \` Q \${cpx},\${cpy} \${curr[0]},\${curr[1]}\`;
  }

  return d;
}

const UnderlineDraw = ({
  text,
  underlineColor = "#f59e0b",
  textColor = "#1e293b",
  duration = 0.8,
  delay = 0.2,
  strokeWidth = 3,
  fontSize = 32,
  roughness = 2,
  repeat = false,
  className = "",
}: UnderlineDrawProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(false);
  const [pathLength, setPathLength] = useState(0);

  const seed = useMemo(() => Math.floor(Math.random() * 10000), []);

  const svgWidth = 200;
  const underlinePath = useMemo(
    () => generateUnderlinePath(svgWidth, roughness, seed),
    [roughness, seed]
  );

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [underlinePath]);

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

  return (
    <span
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        fontSize,
        fontWeight: 700,
        fontFamily: "'Space Grotesk', sans-serif",
        color: textColor,
      }}
    >
      <svg
        style={{
          position: "absolute",
          bottom: "-8%",
          left: "-2%",
          width: "104%",
          height: "30%",
          pointerEvents: "none",
          overflow: "visible",
        }}
        viewBox={\`0 0 \${svgWidth} 20\`}
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d={underlinePath}
          stroke={underlineColor}
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
      <span style={{ position: "relative", zIndex: 1 }}>{text}</span>
    </span>
  );
};

export default UnderlineDraw;`;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Underline Draw</h1>
          <p className="text-muted-foreground">
            Animated hand-drawn underline that sketches beneath text with organic imperfection. Perfect for emphasizing text with a natural, marker-style underline effect.
          </p>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <PreviewFrame>
              <UnderlineDraw
                text={text}
                underlineColor={underlineColor}
                textColor={textColor}
                duration={duration}
                delay={delay}
                strokeWidth={strokeWidth}
                roughness={roughness}
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
                    <Label htmlFor="underlineColor">Underline Color</Label>
                    <Input
                      id="underlineColor"
                      type="color"
                      value={underlineColor}
                      onChange={(e) => setUnderlineColor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                    />
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

export default UnderlineDrawPage;
