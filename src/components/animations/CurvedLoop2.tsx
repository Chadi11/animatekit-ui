import { useEffect, useRef, useState, useCallback } from "react";

interface CurvedLoop2Props {
  text: string;
  speed?: number;
  direction?: "forward" | "reverse";
  amplitude?: number;
  color?: string;
  fontSize?: number;
  className?: string;
}

const CurvedLoop2 = ({
  text,
  speed = 5,
  direction = "forward",
  amplitude = 40,
  color = "hsl(24, 95%, 53%)",
  fontSize = 24,
  className = "",
}: CurvedLoop2Props) => {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const pathId = useRef(`curved2-${Math.random().toString(36).slice(2, 9)}`).current;

  const width = 400;
  const height = amplitude * 2 + fontSize * 2;
  const midY = height / 2;

  const pathD = (() => {
    const points: string[] = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = midY + Math.sin((i / segments) * Math.PI * 2) * amplitude;
      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return points.join(" ");
  })();

  const repeatedText = (text + "   ").repeat(8);

  // Auto-scroll when not dragging
  useEffect(() => {
    const step = direction === "forward" ? 1 : -1;
    const pixelsPerSecond = 60 / speed;

    const animate = (time: number) => {
      if (!draggingRef.current && lastTimeRef.current) {
        const delta = (time - lastTimeRef.current) / 1000;
        setOffset((prev) => {
          let next = prev + step * delta * pixelsPerSecond;
          if (next > 100) next -= 100;
          if (next < 0) next += 100;
          return next;
        });
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, direction]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    draggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offset;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [offset]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const offsetDelta = (deltaX / width) * 100;
    let newOffset = dragStartOffsetRef.current + offsetDelta;
    if (newOffset > 100) newOffset -= 100;
    if (newOffset < 0) newOffset += 100;
    setOffset(newOffset);
  }, []);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`inline-block select-none ${className}`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        <text
          fill={color}
          fontSize={fontSize}
          fontWeight={700}
          fontFamily="'Space Grotesk', sans-serif"
        >
          <textPath href={`#${pathId}`} startOffset={`${offset}%`}>
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CurvedLoop2;
export type { CurvedLoop2Props };
