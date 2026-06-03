import { useEffect, useRef, useState } from "react";

interface LiquidVenomProps {
  speed?: number;
  flashIntensity?: number;
  width?: number;
  height?: number;
  className?: string;
}

const LiquidVenom = ({
  speed = 0.3,
  flashIntensity = 0.8,
  width = 400,
  height = 400,
  className = "",
}: LiquidVenomProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bez = (t: number, x0: number, y0: number, cx1: number, cy1: number, cx2: number, cy2: number, x3: number, y3: number) => {
      const m = 1 - t;
      return { x: m*m*m*x0+3*m*m*t*cx1+3*m*t*t*cx2+t*t*t*x3, y: m*m*m*y0+3*m*m*t*cy1+3*m*t*t*cy2+t*t*t*y3 };
    };

    const bezTan = (t: number, x0: number, y0: number, cx1: number, cy1: number, cx2: number, cy2: number, x3: number, y3: number) => {
      const m = 1 - t;
      return { tx: 3*m*m*(cx1-x0)+6*m*t*(cx2-cx1)+3*t*t*(x3-cx2), ty: 3*m*m*(cy1-y0)+6*m*t*(cy2-cy1)+3*t*t*(y3-cy2) };
    };

    const buildRibbon = (x0: number, y0: number, cx1: number, cy1: number, cx2: number, cy2: number, x3: number, y3: number, halfThick: number, N = 100) => {
      const top: {x:number;y:number}[] = [];
      const bot: {x:number;y:number}[] = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const taper = 0.18 + 0.82 * Math.pow(Math.sin(t * Math.PI), 0.42);
        const hw = halfThick * taper;
        const { x, y } = bez(t, x0,y0,cx1,cy1,cx2,cy2,x3,y3);
        const { tx, ty } = bezTan(t, x0,y0,cx1,cy1,cx2,cy2,x3,y3);
        const len = Math.sqrt(tx*tx+ty*ty)||1;
        const nx = -ty/len, ny = tx/len;
        top.push({ x: x+nx*hw, y: y+ny*hw });
        bot.push({ x: x-nx*hw, y: y-ny*hw });
      }
      return { top, bot };
    };

    const tracePath = (top: {x:number;y:number}[], bot: {x:number;y:number}[], N: number) => {
      ctx.beginPath();
      ctx.moveTo(top[0].x, top[0].y);
      for (let i = 1; i <= N; i++) ctx.lineTo(top[i].x, top[i].y);
      for (let i = N; i >= 0; i--) ctx.lineTo(bot[i].x, bot[i].y);
      ctx.closePath();
    };

    const drawRibbon = (
      time: number,
      x0: number, y0: number, cx1: number, cy1: number, cx2: number, cy2: number, x3: number, y3: number,
      halfThick: number, flashPhase: number, flashSpd: number, rimSide: 1 | -1
    ) => {
      const N = 100;
      const { top, bot } = buildRibbon(x0,y0,cx1,cy1,cx2,cy2,x3,y3,halfThick,N);
      const mid = bez(0.5,x0,y0,cx1,cy1,cx2,cy2,x3,y3);
      const tan = bezTan(0.5,x0,y0,cx1,cy1,cx2,cy2,x3,y3);
      const tl = Math.sqrt(tan.tx*tan.tx+tan.ty*tan.ty)||1;
      const nx05 = -tan.ty/tl * rimSide;
      const ny05 = tan.tx/tl * rimSide;

      tracePath(top, bot, N);
      const g0x = mid.x + nx05*halfThick, g0y = mid.y + ny05*halfThick;
      const g1x = mid.x - nx05*halfThick, g1y = mid.y - ny05*halfThick;
      const baseGrad = ctx.createLinearGradient(g0x,g0y,g1x,g1y);
      baseGrad.addColorStop(0, "#1a1a1c"); baseGrad.addColorStop(0.25,"#232325");
      baseGrad.addColorStop(0.5, "#2a2a2c"); baseGrad.addColorStop(0.75,"#212123");
      baseGrad.addColorStop(1, "#131315");
      ctx.fillStyle = baseGrad; ctx.fill();

      ctx.save(); tracePath(top, bot, N); ctx.clip();
      const depthGrad = ctx.createRadialGradient(mid.x,mid.y,0,mid.x,mid.y,halfThick*2.5);
      depthGrad.addColorStop(0,"rgba(0,0,0,0)"); depthGrad.addColorStop(0.55,"rgba(0,0,0,0.05)");
      depthGrad.addColorStop(1,"rgba(0,0,0,0.42)");
      ctx.fillStyle = depthGrad; ctx.fillRect(0,0,width,height);

      const ts = time * flashSpd;
      const flashT = (Math.sin(ts + flashPhase) + 1) / 2;
      const flashAlpha = flashIntensity * Math.pow(Math.sin(flashT * Math.PI), 2.0);

      if (flashAlpha > 0.004) {
        const fSpread = 0.20;
        const flashTopPts: {x:number;y:number}[] = [];
        const flashBotPts: {x:number;y:number}[] = [];
        for (let i = 0; i <= N; i++) {
          const t = i / N;
          const dist = Math.abs(t - flashT);
          const win = Math.exp(-(dist*dist)/(2*fSpread*fSpread));
          const { tx: ftx, ty: fty } = bezTan(t,x0,y0,cx1,cy1,cx2,cy2,x3,y3);
          const fl = Math.sqrt(ftx*ftx+fty*fty)||1;
          const fnx = (-fty/fl) * rimSide; const fny = (ftx/fl) * rimSide;
          const taper = 0.18 + 0.82*Math.pow(Math.sin(t*Math.PI),0.42);
          const hw = halfThick * taper;
          const { x: bx, y: by } = bez(t,x0,y0,cx1,cy1,cx2,cy2,x3,y3);
          const ex = bx + fnx*hw, ey = by + fny*hw;
          const bandW = hw * 0.30 * win;
          flashTopPts.push({ x: ex, y: ey });
          flashBotPts.push({ x: ex - fnx*bandW, y: ey - fny*bandW });
        }
        ctx.beginPath();
        ctx.moveTo(flashTopPts[0].x, flashTopPts[0].y);
        for (let i = 1; i <= N; i++) ctx.lineTo(flashTopPts[i].x, flashTopPts[i].y);
        for (let i = N; i >= 0; i--) ctx.lineTo(flashBotPts[i].x, flashBotPts[i].y);
        ctx.closePath();
        const fPt = bez(flashT,x0,y0,cx1,cy1,cx2,cy2,x3,y3);
        const fTan = bezTan(flashT,x0,y0,cx1,cy1,cx2,cy2,x3,y3);
        const fTl = Math.sqrt(fTan.tx*fTan.tx+fTan.ty*fTan.ty)||1;
        const fLen = halfThick * 4.0;
        const flashGrad = ctx.createLinearGradient(
          fPt.x-(fTan.tx/fTl)*fLen, fPt.y-(fTan.ty/fTl)*fLen,
          fPt.x+(fTan.tx/fTl)*fLen, fPt.y+(fTan.ty/fTl)*fLen
        );
        flashGrad.addColorStop(0,"rgba(255,255,255,0)");
        flashGrad.addColorStop(0.30,`rgba(255,255,255,${(flashAlpha*0.15).toFixed(3)})`);
        flashGrad.addColorStop(0.50,`rgba(255,255,255,${(flashAlpha*0.60).toFixed(3)})`);
        flashGrad.addColorStop(0.70,`rgba(255,255,255,${(flashAlpha*0.15).toFixed(3)})`);
        flashGrad.addColorStop(1,"rgba(255,255,255,0)");
        ctx.fillStyle = flashGrad; ctx.fill();
      }
      ctx.restore();

      const rimEdge = rimSide === 1 ? top : bot;
      ctx.beginPath(); ctx.moveTo(rimEdge[0].x, rimEdge[0].y);
      for (let i = 1; i <= N; i++) ctx.lineTo(rimEdge[i].x, rimEdge[i].y);
      ctx.strokeStyle = "rgba(255,255,255,0.09)"; ctx.lineWidth = 0.9; ctx.stroke();
      tracePath(top, bot, N);
      ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 1.0; ctx.stroke();
    };

    const drawVignette = () => {
      const vg = ctx.createRadialGradient(width*0.5,height*0.5,height*0.12,width*0.5,height*0.5,height*0.82);
      vg.addColorStop(0,"rgba(0,0,0,0)"); vg.addColorStop(1,"rgba(0,0,0,0.75)");
      ctx.fillStyle = vg; ctx.fillRect(0,0,width,height);
    };

    const animate = (timestamp: number) => {
      const raw = timestamp * 0.001;
      const t = raw * speed;
      ctx.fillStyle = "#070708"; ctx.fillRect(0,0,width,height);
      const W = width, H = height;
      const r1y0=H*(0.28+Math.sin(t*0.11)*0.06), r1y3=H*(0.70+Math.sin(t*0.09+1.5)*0.06);
      const r1cp1x=W*(0.30+Math.sin(t*0.13+0.8)*0.05), r1cp1y=H*(0.16+Math.sin(t*0.10+2.1)*0.09);
      const r1cp2x=W*(0.70+Math.cos(t*0.12+1.2)*0.05), r1cp2y=H*(0.84+Math.cos(t*0.08+0.3)*0.09);
      const r1thick=H*(0.074+Math.sin(t*0.07)*0.007);
      const r2y0=H*(0.74+Math.sin(t*0.10+3.2)*0.06), r2y3=H*(0.26+Math.sin(t*0.12+1.8)*0.06);
      const r2cp1x=W*(0.28+Math.sin(t*0.09+4.1)*0.05), r2cp1y=H*(0.88+Math.sin(t*0.11+0.5)*0.08);
      const r2cp2x=W*(0.72+Math.cos(t*0.13+2.7)*0.05), r2cp2y=H*(0.12+Math.cos(t*0.09+3.5)*0.08);
      const r2thick=H*(0.054+Math.sin(t*0.08+2.0)*0.006);
      drawRibbon(raw, 0,r2y0, r2cp1x,r2cp1y, r2cp2x,r2cp2y, W,r2y3, r2thick, Math.PI*1.3, 0.48, -1);
      drawRibbon(raw, 0,r1y0, r1cp1x,r1cp1y, r1cp2x,r1cp2y, W,r1y3, r1thick, 0.0, 0.62, 1);
      drawVignette();
      animRef.current = requestAnimationFrame(animate);
    };

    ctx.fillStyle = "#070708"; ctx.fillRect(0,0,width,height);
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [inView, speed, flashIntensity, width, height]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#070708] ${className}`}
      style={{ width, height }}
    >
      <canvas ref={canvasRef} width={width} height={height} className="block" />
    </div>
  );
};

export default LiquidVenom;
