import { useState } from "react";
import VideoText from "@/components/animations/VideoText";
import PreviewFrame from "@/components/PreviewFrame";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code } from "lucide-react";

const DEFAULT_VIDEO = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4";

const generateCode = (
  text: string,
  videoSrc: string,
  fontSize: number,
  fontWeight: number,
  letterSpacing: number
) => `import { useRef, useState } from "react";

interface VideoTextProps {
  text?: string;
  videoSrc?: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  fallbackGradient?: string;
  className?: string;
}

const VideoText = ({
  text = "${text}",
  videoSrc = "${videoSrc}",
  fontSize = ${fontSize},
  fontWeight = ${fontWeight},
  letterSpacing = ${letterSpacing},
  fallbackGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  className = "",
}: VideoTextProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div
      className={\`relative inline-block overflow-hidden leading-none \${className}\`}
    >
      {!videoFailed && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay muted loop playsInline
          onError={() => setVideoFailed(true)}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
      )}

      <div
        className="relative z-[1] mix-blend-screen bg-black"
        style={{ padding: "0.1em 0.05em" }}
      >
        <span
          className="block whitespace-nowrap leading-none font-['Space_Grotesk',sans-serif]"
          style={{
            fontSize, fontWeight, letterSpacing,
            color: "#fff",
            ...(videoFailed
              ? {
                  background: fallbackGradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }
              : {}),
          }}
        >{text}</span>
      </div>
    </div>
  );
};

export default VideoText;

// Usage:
// <VideoText text="${text}" fontSize={${fontSize}} />`;

const VideoTextPage = () => {
  const [text, setText] = useState("EXPLORE");
  const [videoSrc, setVideoSrc] = useState(DEFAULT_VIDEO);
  const [fontSize, setFontSize] = useState(120);
  const [fontWeight, setFontWeight] = useState(900);
  const [letterSpacing, setLetterSpacing] = useState(-2);
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Text Animations
        </p>
        <h1 className="text-2xl font-bold text-foreground">Video Text</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Large display text with a video background visible through the letter shapes.
        </p>
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
            <div style={{ background: "#000", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "0.75rem" }}>
              <VideoText
                text={text}
                videoSrc={videoSrc}
                fontSize={fontSize}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
              />
            </div>
          </PreviewFrame>
        ) : (
          <CodeBlock code={generateCode(text, videoSrc, fontSize, fontWeight, letterSpacing)} language="React / TypeScript" />
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Content</Label>
              <Input value={text} onChange={(e) => setText(e.target.value)} className="bg-background font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Video URL</Label>
              <Input value={videoSrc} onChange={(e) => setVideoSrc(e.target.value)} className="bg-background font-mono text-sm" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size <span className="text-primary ml-1">{fontSize}px</span></Label>
              <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={48} max={200} step={4} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Weight <span className="text-primary ml-1">{fontWeight}</span></Label>
              <Slider value={[fontWeight]} onValueChange={([v]) => setFontWeight(v)} min={400} max={900} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Letter Spacing <span className="text-primary ml-1">{letterSpacing}px</span></Label>
              <Slider value={[letterSpacing]} onValueChange={([v]) => setLetterSpacing(v)} min={-10} max={20} step={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTextPage;
