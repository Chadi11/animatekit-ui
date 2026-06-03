import { useState } from "react";
import TypingText2 from "@/components/animations/TypingText2";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const generateCode = (text: string, speed: number, delay: number, loop: boolean, fontSize: number, color: string, cursorChar: string, cursorBlinkSpeed: number) =>
`import { useState, useEffect, useCallback } from "react";

interface TypingText2Props {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  fontSize?: number;
  color?: string;
  cursorChar?: string;
  cursorBlinkSpeed?: number;
}

const TypingText2 = ({
  text,
  speed = ${speed},
  delay = ${delay},
  loop = ${loop},
  fontSize = ${fontSize},
  color = "${color}",
  cursorChar = "${cursorChar}",
  cursorBlinkSpeed = ${cursorBlinkSpeed},
}: TypingText2Props) => {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);

  const reset = useCallback(() => {
    setDisplayedCount(0);
    setIsErasing(false);
    setIsWaiting(true);
  }, []);

  useEffect(() => {
    if (!isWaiting) return;
    const timer = setTimeout(() => setIsWaiting(false), delay);
    return () => clearTimeout(timer);
  }, [delay, isWaiting]);

  useEffect(() => {
    if (isWaiting) return;

    if (!isErasing) {
      if (displayedCount >= text.length) {
        if (loop) {
          const timer = setTimeout(() => setIsErasing(true), 1200);
          return () => clearTimeout(timer);
        }
        return;
      }
      const timer = setInterval(() => {
        setDisplayedCount((c) => c + 1);
      }, speed);
      return () => clearInterval(timer);
    } else {
      if (displayedCount <= 0) {
        const timer = setTimeout(() => reset(), 500);
        return () => clearTimeout(timer);
      }
      const timer = setInterval(() => {
        setDisplayedCount((c) => c - 1);
      }, speed / 2);
      return () => clearInterval(timer);
    }
  }, [isWaiting, isErasing, displayedCount, text.length, speed, loop, reset]);

  const blinkKeyframes = \`@keyframes typing-cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }\`;

  return (
    <>
      <style>{blinkKeyframes}</style>
      <span
        className="inline-block font-bold min-h-[1.2em] whitespace-pre-wrap"
        style={{ fontSize, color }}
      >
        {text.slice(0, displayedCount)}
        <span className="font-normal" style={{
          animation: \`typing-cursor-blink ${cursorBlinkSpeed}ms step-end infinite\`,
        }}>
          {cursorChar}
        </span>
      </span>
    </>
  );
};
// Usage:
// <TypingText2 text="${text}" speed={${speed}} cursorChar="${cursorChar}" loop={${loop}} />`;


const TypingText2Page = () => {
  const [text, setText] = useState("Hello, World!");
  const [speed, setSpeed] = useState(80);
  const [delay, setDelay] = useState(200);
  const [loop, setLoop] = useState(false);
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#e2e8f0");
  const [cursorChar, setCursorChar] = useState("|");
  const [cursorBlinkSpeed, setCursorBlinkSpeed] = useState(500);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewKey, setPreviewKey] = useState(0);
  const resetPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Text Animations</p>
        <h1 className="text-2xl font-bold text-foreground">Typing Text 2</h1>
        <p className="text-sm text-muted-foreground mt-1">A typewriter effect with a blinking cursor that follows the text.</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "preview" | "code")} className="bg-secondary rounded-lg p-1 w-fit">
          <ToggleGroupItem value="preview" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5">
            <Eye className="h-3.5 w-3.5" /> Preview
          </ToggleGroupItem>
          <ToggleGroupItem value="code" className="data-[state=on]:bg-background data-[state=on]:text-foreground px-4 py-1.5 text-xs rounded-md gap-1.5">
            <Code className="h-3.5 w-3.5" /> Code
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6">
        {view === "preview" ? (
          <PreviewFrame>
            <TypingText2 key={previewKey} text={text} speed={speed} delay={delay} loop={loop} fontSize={fontSize} color={color} cursorChar={cursorChar} cursorBlinkSpeed={cursorBlinkSpeed} />
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, speed, delay, loop, fontSize, color, cursorChar, cursorBlinkSpeed)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Content</Label>
              <Input value={text} onChange={(e) => { setText(e.target.value); resetPreview(); }} className="bg-background font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Speed <span className="text-primary ml-1">{speed}ms</span></Label>
              <Slider value={[speed]} onValueChange={([v]) => { setSpeed(v); resetPreview(); }} min={20} max={200} step={10} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Initial Delay <span className="text-primary ml-1">{delay}ms</span></Label>
              <Slider value={[delay]} onValueChange={([v]) => { setDelay(v); resetPreview(); }} min={0} max={2000} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => { setFontSize(v); resetPreview(); }} min={16} max={64} step={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => { setColor(e.target.value); resetPreview(); }} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
                <span className="text-xs font-mono text-muted-foreground">{color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Loop</Label>
              <div className="flex items-center gap-2">
                <Switch checked={loop} onCheckedChange={(v) => { setLoop(v); resetPreview(); }} />
                <span className="text-xs text-muted-foreground">{loop ? "On" : "Off"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Cursor Character</Label>
              <Input value={cursorChar} onChange={(e) => { setCursorChar(e.target.value); resetPreview(); }} className="bg-background font-mono text-sm w-20" maxLength={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Cursor Blink Speed <span className="text-primary ml-1">{cursorBlinkSpeed}ms</span></Label>
              <Slider value={[cursorBlinkSpeed]} onValueChange={([v]) => { setCursorBlinkSpeed(v); resetPreview(); }} min={200} max={1000} step={50} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingText2Page;
