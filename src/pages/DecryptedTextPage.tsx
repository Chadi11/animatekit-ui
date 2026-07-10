import { useState } from "react";
import DecryptedText from "@/components/animations/DecryptedText";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (
  text: string,
  speed: number,
  trigger: string,
  characterSet: string,
  color: string
) => `import { useState, useEffect, useCallback, useRef } from "react";

const DEFAULT_CHARS = "${characterSet}";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  trigger?: "view" | "hover" | "both";
  characterSet?: string;
  color?: string;
  className?: string;
}

const DecryptedText = ({
  text,
  speed = ${speed},
  trigger = "${trigger}",
  characterSet = DEFAULT_CHARS,
  color = "${color}",
  className = "",
}: DecryptedTextProps) => {
  const [displayed, setDisplayed] = useState<string[]>(() =>
    trigger === "hover" ? text.split("") : text.split("").map(() => " ")
  );
  const [hasAnimated, setHasAnimated] = useState(false);
  const isAnimatingRef = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animate = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setHasAnimated(true);

    const resolved = new Array(text.length).fill(false);
    text.split("").forEach((char, i) => {
      if (char === " ") resolved[i] = true;
    });
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayed(
        text.split("").map((char, i) => {
          if (char === " ") return " ";
          if (resolved[i]) return char;
          if (iteration > i + Math.random() * 8) {
            resolved[i] = true;
            return char;
          }
          return characterSet[Math.floor(Math.random() * characterSet.length)];
        })
      );

      iteration += 1;

      if (resolved.every(Boolean)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        isAnimatingRef.current = false;
      }
    }, speed);
  }, [text, speed, characterSet]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    isAnimatingRef.current = false;
    setHasAnimated(false);
    setDisplayed(
      trigger === "hover" ? text.split("") : text.split("").map(() => " ")
    );
  }, [text, speed, characterSet, trigger]);

  useEffect(() => {
    if (trigger !== "view" && trigger !== "both") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) animate();
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trigger, animate, hasAnimated]);

  useEffect(() => {
    if ((trigger === "view" || trigger === "both") && !hasAnimated) {
      const timeout = setTimeout(() => animate(), 300);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  const handleMouseEnter = () => {
    if (trigger === "hover" || trigger === "both") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      isAnimatingRef.current = false;
      setDisplayed(text.split("").map(() => " "));
      setTimeout(() => animate(), 50);
    }
  };

  return (
    <span
      ref={ref}
      onMouseEnter={handleMouseEnter}
      className={\`font-mono text-4xl font-bold tracking-wider inline-block cursor-default \${className}\`}
      style={{ color }}
    >
      {displayed.map((char, i) => (
        <span
          key={i}
          className={\`inline-block transition-opacity duration-100 \${
            char === text[i] ? "opacity-100" : "opacity-70"
          }\`}
          style={{ minWidth: char === " " ? "0.3em" : undefined }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default DecryptedText;

// Usage:
// <DecryptedText text="${text}" speed={${speed}} trigger="${trigger}" />`;

const DecryptedTextPage = () => {
  const [text, setText] = useState("HELLO WORLD");
  const [speed, setSpeed] = useState(50);
  const [trigger, setTrigger] = useState("view");
  const [color, setColor] = useState("#f97316");
  const [charSet, setCharSet] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()");
  const [view, setView] = useState<"preview" | "code">("preview");

  // Key to force re-render on setting change
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Decrypted Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Characters scramble and decrypt into the final text — like a hacking terminal effect.
        </p>
      </div>

      {/* Toggle */}
      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as "preview" | "code")}
          className="bg-secondary rounded-lg p-1 w-fit"
        >
          <ToggleGroupItem
            value="preview"
            className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </ToggleGroupItem>
          <ToggleGroupItem
            value="code"
            className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5"
          >
            <Code className="h-3.5 w-3.5" />
            Code
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Preview / Code */}
      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame>
            <DecryptedText
              key={previewKey}
              text={text}
              speed={speed}
              trigger={trigger as "view" | "hover" | "both"}
              characterSet={charSet}
              color={color}
            />
          </PreviewFrame>
        ) : (
          <CodeBlock
            code={generateCode(text, speed, trigger, charSet, color)}
            language="React / TypeScript"
          />
        )}
      </div>

      {/* Controls */}
      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">
            Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Content</Label>
              <Input
                value={text}
                onChange={(e) => { setText(e.target.value); resetPreview(); }}
                className="bg-background font-mono text-sm"
              />
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Speed <span className="text-primary ml-1">{speed}ms</span>
              </Label>
              <Slider
                value={[speed]}
                onValueChange={([v]) => { setSpeed(v); resetPreview(); }}
                min={10}
                max={150}
                step={5}
              />
            </div>

            {/* Trigger */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Trigger</Label>
              <ToggleGroup
                type="single"
                value={trigger}
                onValueChange={(v) => { if (v) { setTrigger(v); resetPreview(); } }}
                className="justify-start"
              >
                <ToggleGroupItem value="view" className="text-xs px-3 py-1">On View</ToggleGroupItem>
                <ToggleGroupItem value="hover" className="text-xs px-3 py-1">On Hover</ToggleGroupItem>
                <ToggleGroupItem value="both" className="text-xs px-3 py-1">Both</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => { setColor(e.target.value); resetPreview(); }}
                  className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>

            {/* Character set */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs text-muted-foreground">Character Set</Label>
              <Input
                value={charSet}
                onChange={(e) => { setCharSet(e.target.value); resetPreview(); }}
                className="bg-background font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecryptedTextPage;
