import { useState, useEffect, useRef, useCallback } from "react";

interface Preloader6Props {
  onComplete?: () => void;
  bgColor?: string;
  blobColor?: string;
  landingContent?: React.ReactNode;
  contained?: boolean;
}

const BLOB_PATHS = [
  "M160,60 C220,20 300,40 320,100 C340,160 310,230 260,250 C210,270 140,260 100,220 C60,180 50,120 80,80 C100,56 130,80 160,60 Z",
  "M140,50 C200,10 310,30 340,110 C365,180 330,260 260,270 C190,280 110,250 80,190 C50,130 60,70 100,50 C118,40 125,63 140,50 Z",
  "M170,70 C240,30 320,60 330,130 C340,200 290,260 220,265 C150,270 90,230 75,165 C60,100 80,50 130,50 C152,50 155,85 170,70 Z",
  "M150,55 C225,15 315,50 335,120 C355,190 310,265 240,268 C170,271 95,240 75,175 C55,110 70,55 120,48 C140,45 138,68 150,55 Z",
  "M160,60 C220,20 300,40 320,100 C340,160 310,230 260,250 C210,270 140,260 100,220 C60,180 50,120 80,80 C100,56 130,80 160,60 Z",
];

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerpPath(a: string, b: string, t: number): string {
  const numsA = a.match(/-?\d+\.?\d*/g)!.map(Number);
  const numsB = b.match(/-?\d+\.?\d*/g)!.map(Number);
  let i = 0;
  return a.replace(/-?\d+\.?\d*/g, () => {
    const val = numsA[i] + (numsB[i] - numsA[i]) * t;
    i++;
    return val.toFixed(1);
  });
}

const Preloader6 = ({
  onComplete,
  bgColor = "#0d0d0d",
  blobColor = "#1a1a1a",
  landingContent,
  contained = false,
}: Preloader6Props) => {
  const [phase, setPhase] = useState<"morph" | "fall" | "done">("morph");
  const [blobPath, setBlobPath] = useState(BLOB_PATHS[0]);
  const [fallY, setFallY] = useState(0);
  const [fallScale, setFallScale] = useState(1);
  const [dotPhase, setDotPhase] = useState(0);
  const rafRef = useRef<number>(0);
  const morphStartRef = useRef<number>(0);
  const dotRafRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (phase !== "morph") return;
    const tick = (now: number) => {
      setDotPhase((now * 0.003) % (Math.PI * 2));
      dotRafRef.current = requestAnimationFrame(tick);
    };
    dotRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(dotRafRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== "morph") return;
    morphStartRef.current = performance.now();
    const segDur = 700;
    const tick = (now: number) => {
      const elapsed = now - morphStartRef.current;
      const totalMorphTime = (BLOB_PATHS.length - 1) * segDur;
      if (elapsed >= totalMorphTime) {
        setPhase("fall");
        return;
      }
      const seg = Math.floor(elapsed / segDur);
      const t = easeInOutCubic((elapsed % segDur) / segDur);
      const pathA = BLOB_PATHS[Math.min(seg, BLOB_PATHS.length - 2)];
      const pathB = BLOB_PATHS[Math.min(seg + 1, BLOB_PATHS.length - 1)];
      setBlobPath(lerpPath(pathA, pathB, t));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  const handleFallComplete = useCallback(() => {
    setPhase("done");
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    if (phase !== "fall") return;
    const start = performance.now();
    const dur = 800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = p * p * p;
      const squeezeX = 1 - ease * 0.4;
      const drop = ease * 160;
      setFallY(drop);
      setFallScale(squeezeX);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        handleFallComplete();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, handleFallComplete]);

  const isDone = phase === "done";
  const isFalling = phase === "fall";

  return (
    <div className={`${contained ? "absolute" : "fixed"} inset-0 z-[100] overflow-hidden`}>
      {!isDone && (
        <div className="absolute inset-0 z-10" style={{ background: bgColor }} />
      )}
      <div
        className="absolute inset-0 flex items-center justify-center z-[1]"
        style={{
          background: "#ffffff",
          opacity: isDone || isFalling ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {landingContent ?? (
          <h1 className="m-0 text-[28px] font-medium text-[#111] tracking-tight">
            Your landing page
          </h1>
        )}
      </div>
      {!isDone && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 400 320" className="w-full h-full overflow-visible">
            <path
              d={blobPath}
              fill={blobColor}
              style={{
                transform: `translateY(${fallY}px) scaleX(${fallScale}) scaleY(${isFalling ? 1 + (fallY / 160) * 0.3 : 1})`,
                transformOrigin: "200px 160px",
              }}
            />
          </svg>
        </div>
      )}
      {phase === "morph" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[5px] h-[5px] rounded-full" style={{
              background: "rgba(255,255,255,0.35)",
              transform: `scale(${0.6 + 0.4 * Math.max(0, Math.sin(dotPhase - i * 0.9))})`,
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Preloader6;
