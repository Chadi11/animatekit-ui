import { NavLink } from "@/components/NavLink";

import { Type, Layers, Square, Loader, LoaderCircle, MousePointerClick, GalleryHorizontal, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Category {
  name: string;
  icon: React.ElementType;
  items: { name: string; path: string }[];
}

const categories: Category[] = [
  {
    name: "Text Animations",
    icon: Type,
    items: [
      { name: "Decrypted Text", path: "/text-animations/decrypted-text" },
      { name: "Blur Text", path: "/text-animations/blur-text" },
      { name: "Blur Text 2", path: "/text-animations/blur-text-2" },
      { name: "Circular Text", path: "/text-animations/circular-text" },
      { name: "Circular Text 2", path: "/text-animations/circular-text-2" },
      { name: "Shiny Text", path: "/text-animations/shiny-text" },
      { name: "Curved Loop", path: "/text-animations/curved-loop" },
      { name: "Curved Loop 2", path: "/text-animations/curved-loop-2" },
      { name: "Fuzzy Text", path: "/text-animations/fuzzy-text" },
      { name: "Scroll Text", path: "/text-animations/scroll-text" },
      { name: "Scroll Text 2", path: "/text-animations/scroll-text-2" },
      { name: "Gradient Text", path: "/text-animations/gradient-text" },
      { name: "Counting Number", path: "/text-animations/counting-number" },
      { name: "Morphing Text 2", path: "/text-animations/morphing-text-2" },
      { name: "Rotating Text", path: "/text-animations/rotating-text" },
      { name: "Rotating Text 2", path: "/text-animations/rotating-text-2" },
      { name: "Rolling Text", path: "/text-animations/rolling-text" },
      { name: "Highlight Text", path: "/text-animations/highlight-text" },
      { name: "Highlight Text Draw", path: "/text-animations/highlight-text-draw" },
      { name: "Underline Draw", path: "/text-animations/underline-draw" },
      { name: "Circle Draw", path: "/text-animations/circle-draw" },
      { name: "Video Text", path: "/text-animations/video-text" },
      { name: "Video Text 2", path: "/text-animations/video-text-2" },
      { name: "Typing Text", path: "/text-animations/typing-text" },
      { name: "Typing Text 2", path: "/text-animations/typing-text-2" },
      { name: "Sparkles Text", path: "/text-animations/sparkles-text" },
      { name: "Sparkles Text 2", path: "/text-animations/sparkles-text-2" },
      { name: "Sparkles Text 3", path: "/text-animations/sparkles-text-3" },
    ],
  },
  {
    name: "Backgrounds",
    icon: Layers,
    items: [
      { name: "Ripple Effect", path: "/backgrounds/ripple-effect" },
      { name: "Ripple Effect 2", path: "/backgrounds/ripple-effect-2" },
      { name: "Aurora Background", path: "/backgrounds/aurora-background" },
      { name: "Particles Float", path: "/backgrounds/particles-float" },
      { name: "Venom Lines", path: "/backgrounds/venom-lines" },
      { name: "Liquid Venom", path: "/backgrounds/liquid-venom" },
      { name: "Aurora Flow", path: "/backgrounds/aurora-flow" },
    ],
  },
  {
    name: "Cards",
    icon: Square,
    items: [
      { name: "Glare Card", path: "/cards/glare-card" },
      { name: "Flash Sweep Card", path: "/cards/flash-sweep-card" },
      { name: "Tooltip Card", path: "/cards/tooltip-card" },
      { name: "Card Stack", path: "/cards/card-stack" },
    ],
  },
  {
    name: "Preloaders",
    icon: Loader,
    items: [
      { name: "Preloader 1", path: "/preloaders/preloader-1" },
      { name: "Preloader 2", path: "/preloaders/preloader-2" },
      { name: "Preloader 3", path: "/preloaders/preloader-3" },
      { name: "Preloader 4", path: "/preloaders/preloader-4" },
      { name: "Preloader 5", path: "/preloaders/preloader-5" },
      { name: "Preloader 6", path: "/preloaders/preloader-6" },
      { name: "Preloader 7", path: "/preloaders/preloader-7" },
      { name: "Preloader 8", path: "/preloaders/preloader-8" },
    ],
  },
  {
    name: "Loaders",
    icon: LoaderCircle,
    items: [
      { name: "Loader 1 — Orbit Dots", path: "/loaders/loader-1" },
      { name: "Loader 2 — Pulse Bars", path: "/loaders/loader-2" },
      { name: "Loader 3 — Ring Spinner", path: "/loaders/loader-3" },
      { name: "Loader 3D — Bouncing Orbs", path: "/loaders/loader-3d" },
      { name: "Loader 4 — Flower Trace", path: "/loaders/loader-4" },
      { name: "Loader 5 — Squash Bounce", path: "/loaders/loader-5" },
    ],
  },
  {
    name: "Buttons",
    icon: MousePointerClick,
    items: [
      { name: "Breathing Glow", path: "/buttons/breathing-glow" },
      { name: "Laser Trace", path: "/buttons/laser-trace" },
      { name: "Magnetic Fill", path: "/buttons/magnetic-fill" },
      { name: "Rainbow Orbit", path: "/buttons/rainbow-orbit" },
      { name: "Neon Flicker", path: "/buttons/neon-flicker" },
      { name: "Particle Burst", path: "/buttons/particle-burst" },
      { name: "Shockwave Ripple", path: "/buttons/shockwave-ripple" },
      { name: "Typewriter Border", path: "/buttons/typewriter-border" },
      { name: "Text Flip", path: "/buttons/text-flip" },
      { name: "Ripple Flip", path: "/buttons/ripple-flip" },
      { name: "Magnetic Button", path: "/buttons/magnetic-button" },
      { name: "Particle Burst 2", path: "/buttons/particle-burst-2" },
      { name: "Flip Button", path: "/buttons/flip-button" },
      { name: "Neon Wave", path: "/buttons/neon-wave" },
      { name: "Ripple Wave", path: "/buttons/ripple-wave" },
      { name: "Slice Reveal", path: "/buttons/slice-reveal" },
      { name: "Bounce Pop", path: "/buttons/bounce-pop" },
      { name: "Orbital Spinner", path: "/buttons/orbital-spinner" },
    ],
  },
  {
    name: "Interactive",
    icon: GalleryHorizontal,
    items: [
      { name: "Motion Trail Image", path: "/interactive/motion-trail-image" },
      { name: "Hover Reveal List", path: "/interactive/hover-reveal-list" },
      { name: "Scroll Snap List", path: "/interactive/scroll-snap-list" },
      { name: "Tilt Hover Card", path: "/interactive/tilt-hover-card" },
      { name: "Image Follow Card", path: "/interactive/image-follow-card" },
      { name: "Circular Progress", path: "/interactive/circular-progress" },
      { name: "Spotlight Card", path: "/interactive/spotlight-card" },
      { name: "Magnetic Bento", path: "/interactive/magnetic-bento" },
      { name: "Liquid Reveal", path: "/interactive/liquid-reveal" },
      { name: "Marquee 3D", path: "/interactive/marquee-3d" },
      { name: "Cursor Attractor Field", path: "/interactive/cursor-attractor-field" },
    ],
  },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const [openCategories, setOpenCategories] = useState<string[]>(
    categories.map((c) => c.name)
  );

  const toggle = (name: string) => {
    setOpenCategories((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Brand */}
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          <span className="text-primary">Animate</span>Kit
        </h1>
        <p className="text-[10px] text-sidebar-foreground mt-0.5 font-mono uppercase tracking-widest">
          Component Library
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {categories.map((cat) => {
          const isOpen = openCategories.includes(cat.name);
          return (
            <div key={cat.name} className="mb-1">
              <button
                onClick={() => toggle(cat.name)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              >
                <cat.icon className="h-3.5 w-3.5" />
                <span className="flex-1 text-left">{cat.name}</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                  {cat.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onNavigate}
                      className="block px-2 py-1.5 rounded text-xs text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="text-primary bg-sidebar-accent font-medium"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

    </div>
  );
};

const ComponentSidebar = () => {
  return (
    <aside className="hidden md:flex w-64 h-screen border-r border-sidebar-border flex-col shrink-0 sticky top-0">
      <SidebarContent />
    </aside>
  );
};

export const MobileNavBar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur border-b border-border">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="p-2 -ml-2 rounded-md text-foreground hover:bg-sidebar-accent transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <h1 className="text-base font-bold text-foreground tracking-tight">
        <span className="text-primary">Animate</span>Kit
      </h1>

      <a
        href="/"
        className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        Home
      </a>
    </header>
  );
};

export default ComponentSidebar;
