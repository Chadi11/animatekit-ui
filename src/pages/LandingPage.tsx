import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, MousePointerClick, Type } from "lucide-react";
import MotionTrailImage from "@/components/animations/MotionTrailImage";
import HoverRevealList from "@/components/animations/HoverRevealList";
import Preloader8 from "@/components/animations/Preloader8";
import Preloader2 from "@/components/animations/Preloader2";
import VenomLines from "@/components/animations/VenomLines";
import RippleEffect2 from "@/components/animations/RippleEffect2";

/* ── Inline SVG Icons ── */
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ── Preview Card wrapper ── */
const PreviewCard = ({
  label,
  children,
  dark,
  darkMode,
}: {
  label: string;
  children: React.ReactNode;
  dark?: boolean;
  darkMode: boolean;
}) => {
  const bg = dark ? "bg-[#0c0c0f]" : darkMode ? "bg-gray-800" : "bg-gray-50";
  const border = darkMode ? "border-gray-700" : "border-gray-200";
  const headerBorder = darkMode ? "border-gray-700" : "border-gray-100";
  const labelColor = darkMode ? "text-gray-400" : "text-gray-400";

  return (
    <div className={`rounded-2xl border ${border} overflow-hidden ${bg}`}>
      <div className={`px-4 py-3 border-b ${headerBorder} flex items-center gap-2`}>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-orange-400" />
        </div>
        <span className={`text-xs font-medium ${labelColor} ml-2`}>{label}</span>
      </div>
      <div className="h-64 overflow-hidden flex items-center justify-center relative">
        {children}
      </div>
    </div>
  );
};

/* ── Landing Page ── */
const LandingPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [p8Key, setP8Key] = useState(0);
  const [p2Key, setP2Key] = useState(0);

  const handleP8Complete = useCallback(() => {
    setTimeout(() => setP8Key((k) => k + 1), 1500);
  }, []);
  const handleP2Complete = useCallback(() => {
    setTimeout(() => setP2Key((k) => k + 1), 1500);
  }, []);

  const rootBg = darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-900";
  const cardBg = darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200";
  const mutedText = darkMode ? "text-gray-400" : "text-gray-500";
  const subtleText = darkMode ? "text-gray-300" : "text-gray-700";
  const pillBg = darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500";
  const iconHover = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50";

  return (
    <div className={`min-h-screen ${rootBg} transition-colors duration-300`}>
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-orange-500">Animate</span>Kit
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com/Chadi11" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${iconHover} transition-colors`}>
            <GitHubIcon />
          </a>
          <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${iconHover} transition-colors`}>
            <XIcon />
          </a>
          <a href="https://www.instagram.com/?hl=en" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${iconHover} transition-colors`}>
            <InstagramIcon />
          </a>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${iconHover} transition-colors`} aria-label="Toggle dark mode">
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* ── "New" Badge ── */}
      <div className="flex justify-center pt-6 md:pt-8">
        <button
          onClick={() => navigate("/backgrounds/ripple-effect-2")}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"} transition-colors text-sm`}
        >
          <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold">New</span>
          <span className={subtleText}>Ripple Effect 2</span>
          <ArrowRightIcon />
        </button>
      </div>

      {/* ── Hero ── */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-10 pb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          lightweight Open-Source React &
          <br />
          Tailwind CSS <span className="text-orange-500">Animated UI</span> Components
        </h1>
        <p className={`text-lg ${mutedText} max-w-2xl mx-auto mb-8 leading-relaxed`}>
          A free, open-source React UI kit with{" "}
          <strong className={subtleText}>82+ Tailwind CSS animated components</strong>.
          Browse, customize, and copy-paste interactive animations — buttons, text effects,
          preloaders, cards, and more. No dependencies, no lock-in.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/text-animations/decrypted-text")}
            className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            Get Started
          </button>
          <a
            href="https://github.com/Chadi11"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"} font-semibold text-sm transition-colors`}
          >
            <GitHubIcon />
            Star on GitHub
          </a>
        </div>

        {/* Tech badges */}
        <div className="flex items-center justify-center gap-3 mt-10 text-xs font-medium tracking-wide uppercase flex-wrap">
          {["React", "TypeScript", "Tailwind CSS", "Copy & Paste"].map((t) => (
            <span key={t} className={`px-3 py-1 rounded-full ${pillBg}`}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── Stats Cards ── */}
      <section className="max-w-4xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <p className="text-3xl font-extrabold mb-1">100% Free</p>
            <p className={`text-sm ${mutedText}`}>
              Fully open-source under MIT. Use in personal and commercial projects with zero cost.
            </p>
          </div>
          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <p className="text-3xl font-extrabold mb-1">82+ Components</p>
            <p className={`text-sm ${mutedText}`}>
              Interactive animated UI elements — buttons, text effects, preloaders, cards, and more coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* ── Category Cards ── */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Preloaders",
              desc: "Eye-catching loading screens with multilingual greetings and smooth transitions.",
              path: "/preloaders/preloader-1",
              icon: Loader,
            },
            {
              title: "Buttons",
              desc: "Magnetic, neon, ripple, and particle-burst button animations that delight users.",
              path: "/buttons/magnetic-button",
              icon: MousePointerClick,
            },
            {
              title: "Text Animations",
              desc: "Typing, decryption, blur, highlight, and morphing text effects for impactful copy.",
              path: "/text-animations/decrypted-text",
              icon: Type,
            },
          ].map((cat) => (
            <button
              key={cat.title}
              onClick={() => navigate(cat.path)}
              className={`rounded-2xl border p-6 text-left ${cardBg} hover:shadow-md transition-shadow group`}
            >
              <cat.icon className="w-7 h-7 text-orange-500 mb-3" />
              <p className="font-bold text-lg mb-1">{cat.title}</p>
              <p className={`text-sm ${mutedText} mb-4`}>{cat.desc}</p>
              <span className="inline-flex items-center gap-1 text-orange-500 text-sm font-semibold group-hover:gap-2 transition-all">
                Explore <ArrowRightIcon />
              </span>
            </button>
          ))}
        </div>
      </section>


      {/* ── 6 Preview Boxes ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          See Tailwind CSS Animated Components in Action
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PreviewCard label="Motion Trail Image" darkMode={darkMode}>
            <MotionTrailImage imageWidth={120} trailLength={4} />
          </PreviewCard>

          <PreviewCard label="Hover Reveal List" dark darkMode={darkMode}>
            <div className="w-full h-full flex items-center justify-center" style={{ transform: "scale(0.75)", transformOrigin: "center center" }}>
              <HoverRevealList />
            </div>
          </PreviewCard>

          <PreviewCard label="Preloader 8" darkMode={darkMode}>
            <Preloader8 key={p8Key} contained onComplete={handleP8Complete} />
          </PreviewCard>

          <PreviewCard label="Preloader 2" darkMode={darkMode}>
            <Preloader2 key={p2Key} contained onComplete={handleP2Complete} />
          </PreviewCard>

          <PreviewCard label="Venom Lines" dark darkMode={darkMode}>
            <VenomLines width={400} height={256} lineCount={10} speed={0.8} />
          </PreviewCard>

          <PreviewCard label="Ripple Effect 2" darkMode={darkMode}>
            <RippleEffect2 size={220} count={4} duration={3} />
          </PreviewCard>
        </div>
      </section>

      {/* ── Bottom Attribution ── */}
      <section className="pb-12 text-center">
        <p className={`text-sm ${mutedText}`}>
          Created by{" "}
          <a
            href="https://x.com/chaditech"
            target="_blank"
            rel="noopener noreferrer"
            className={`${subtleText} font-semibold hover:text-orange-500 transition-colors underline underline-offset-2`}
          >
            Chadi Baraou
          </a>
          {" — Source code available on "}
          <a
            href="https://github.com/Chadi11"
            target="_blank"
            rel="noopener noreferrer"
            className={`${subtleText} font-semibold hover:text-orange-500 transition-colors underline underline-offset-2`}
          >
            GitHub
          </a>
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
