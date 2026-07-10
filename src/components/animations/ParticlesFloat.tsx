import { useEffect, useRef, useState, useMemo } from "react";

interface ParticlesFloatProps {
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  diameter: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

const ParticlesFloat = ({
  count = 30,
  color = "#ffffff",
  speed = 1,
  size = 400,
  className = "",
}: ParticlesFloatProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const particles = useMemo<Particle[]>(() => {
    const seeded: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const hash = ((i * 2654435761) >>> 0) / 4294967296;
      const hash2 = (((i + 1) * 2654435761) >>> 0) / 4294967296;
      const hash3 = (((i + 2) * 2654435761) >>> 0) / 4294967296;
      const hash4 = (((i + 3) * 2654435761) >>> 0) / 4294967296;
      seeded.push({
        x: hash * 100,
        y: 80 + hash2 * 20,
        diameter: 2 + hash3 * 4,
        duration: (6 + hash4 * 10) / speed,
        delay: hash * (8 / speed),
        opacity: 0.2 + hash2 * 0.5,
        drift: (hash3 - 0.5) * 30,
      });
    }
    return seeded;
  }, [count, speed]);

  const keyframesCSS = useMemo(
    () => `
@keyframes particle-float {
  0% { transform: translateY(0) translateX(0); opacity: var(--p-opacity); }
  80% { opacity: var(--p-opacity); }
  100% { transform: translateY(-${size}px) translateX(var(--p-drift)); opacity: 0; }
}`,
    [size]
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl bg-[#0a0a0a] ${className}`}
      style={{ width: size, height: size }}
    >
      <style>{keyframesCSS}</style>
      {inView &&
        particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-0"
            style={
              {
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.diameter,
                height: p.diameter,
                backgroundColor: color,
                "--p-opacity": p.opacity,
                "--p-drift": `${p.drift}px`,
                animation: `particle-float ${p.duration}s ease-out ${p.delay}s infinite`,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
};

export default ParticlesFloat;
