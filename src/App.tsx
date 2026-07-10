import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ComponentSidebar, { MobileNavBar } from "@/components/ComponentSidebar";
import LandingPage from "./pages/LandingPage";
import DecryptedTextPage from "./pages/DecryptedTextPage";
import BlurTextPage from "./pages/BlurTextPage";
import BlurText2Page from "./pages/BlurText2Page";
import CircularTextPage from "./pages/CircularTextPage";
import CircularText2Page from "./pages/CircularText2Page";
import ShinyTextPage from "./pages/ShinyTextPage";
import CurvedLoopPage from "./pages/CurvedLoopPage";
import CurvedLoop2Page from "./pages/CurvedLoop2Page";
import FuzzyTextPage from "./pages/FuzzyTextPage";
import ScrollTextPage from "./pages/ScrollTextPage";
import GradientTextPage from "./pages/GradientTextPage";
import CountingNumberPage from "./pages/CountingNumberPage";
import MorphingText2Page from "./pages/MorphingText2Page";
import Preloader8Page from "./pages/Preloader8Page";
import ImageFollowCardPage from "./pages/ImageFollowCardPage";
import AnimatedCircularProgressPage from "./pages/AnimatedCircularProgressPage";
import ScrollText2Page from "./pages/ScrollText2Page";
import RotatingTextPage from "./pages/RotatingTextPage";
import RotatingText2Page from "./pages/RotatingText2Page";
import RollingTextPage from "./pages/RollingTextPage";
import HighlightTextPage from "./pages/HighlightTextPage";
import HighlightTextDrawPage from "./pages/HighlightTextDrawPage";
import UnderlineDrawPage from "./pages/UnderlineDrawPage";
import CircleDrawPage from "./pages/CircleDrawPage";
import VideoTextPage from "./pages/VideoTextPage";
import VideoText2Page from "./pages/VideoText2Page";
import TypingTextPage from "./pages/TypingTextPage";
import TypingText2Page from "./pages/TypingText2Page";
import SparklesTextPage from "./pages/SparklesTextPage";
import SparklesText2Page from "./pages/SparklesText2Page";
import SparklesText3Page from "./pages/SparklesText3Page";
import RippleEffectPage from "./pages/RippleEffectPage";
import RippleEffect2Page from "./pages/RippleEffect2Page";
import AuroraBackgroundPage from "./pages/AuroraBackgroundPage";
import ParticlesFloatPage from "./pages/ParticlesFloatPage";
import VenomLinesPage from "./pages/VenomLinesPage";
import LiquidVenomPage from "./pages/LiquidVenomPage";
import AuroraFlowPage from "./pages/AuroraFlowPage";
import GlareCardPage from "./pages/GlareCardPage";
import FlashSweepCardPage from "./pages/FlashSweepCardPage";
import TooltipCardPage from "./pages/TooltipCardPage";
import CardStackPage from "./pages/CardStackPage";
import Preloader1Page from "./pages/Preloader1Page";
import Preloader2Page from "./pages/Preloader2Page";
import Preloader3Page from "./pages/Preloader3Page";
import Preloader4Page from "./pages/Preloader4Page";
import Preloader5Page from "./pages/Preloader5Page";
import Preloader6Page from "./pages/Preloader6Page";
import Preloader7Page from "./pages/Preloader7Page";
import Loader1Page from "./pages/Loader1Page";
import Loader2Page from "./pages/Loader2Page";
import Loader3Page from "./pages/Loader3Page";
import Loader3DPage from "./pages/Loader3DPage";
import Loader4Page from "./pages/Loader4Page";
import Loader5Page from "./pages/Loader5Page";
import SpotlightCardPage from "./pages/SpotlightCardPage";
import BreathingGlowButtonPage from "./pages/BreathingGlowButtonPage";
import LaserTraceButtonPage from "./pages/LaserTraceButtonPage";
import MagneticFillButtonPage from "./pages/MagneticFillButtonPage";
import RainbowOrbitButtonPage from "./pages/RainbowOrbitButtonPage";
import NeonFlickerButtonPage from "./pages/NeonFlickerButtonPage";
import ParticleBurstButtonPage from "./pages/ParticleBurstButtonPage";
import ShockwaveRippleButtonPage from "./pages/ShockwaveRippleButtonPage";
import TypewriterBorderButtonPage from "./pages/TypewriterBorderButtonPage";
import TextFlipButtonPage from "./pages/TextFlipButtonPage";
import RippleFlipButtonPage from "./pages/RippleFlipButtonPage";
import MagneticButtonPage from "./pages/MagneticButtonPage";
import ParticleBurstButton2Page from "./pages/ParticleBurstButton2Page";
import FlipButtonPage from "./pages/FlipButtonPage";
import NeonWaveButtonPage from "./pages/NeonWaveButtonPage";
import RippleWaveButtonPage from "./pages/RippleWaveButtonPage";
import SliceRevealButtonPage from "./pages/SliceRevealButtonPage";
import BouncePopButtonPage from "./pages/BouncePopButtonPage";
import OrbitalSpinnerButtonPage from "./pages/OrbitalSpinnerButtonPage";
import MotionTrailImagePage from "./pages/MotionTrailImagePage";
import HoverRevealListPage from "./pages/HoverRevealListPage";
import ScrollSnapListPage from "./pages/ScrollSnapListPage";
import TiltHoverCardPage from "./pages/TiltHoverCardPage";
import MagneticBentoPage from "./pages/MagneticBentoPage";
import LiquidRevealPage from "./pages/LiquidRevealPage";
import Marquee3DPage from "./pages/Marquee3DPage";
import CursorAttractorFieldPage from "./pages/CursorAttractorFieldPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const SidebarLayout = () => (
  <div className="flex min-h-screen w-full bg-background">
    <ComponentSidebar />
    <div className="flex-1 min-w-0 flex flex-col">
      <MobileNavBar />
      <Outlet />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<SidebarLayout />}>
            <Route path="/text-animations/decrypted-text" element={<DecryptedTextPage />} />
            <Route path="/text-animations/blur-text" element={<BlurTextPage />} />
            <Route path="/text-animations/blur-text-2" element={<BlurText2Page />} />
            <Route path="/text-animations/circular-text" element={<CircularTextPage />} />
            <Route path="/text-animations/circular-text-2" element={<CircularText2Page />} />
            <Route path="/text-animations/shiny-text" element={<ShinyTextPage />} />
            <Route path="/text-animations/curved-loop" element={<CurvedLoopPage />} />
            <Route path="/text-animations/curved-loop-2" element={<CurvedLoop2Page />} />
            <Route path="/text-animations/fuzzy-text" element={<FuzzyTextPage />} />
            <Route path="/text-animations/scroll-text" element={<ScrollTextPage />} />
            <Route path="/text-animations/gradient-text" element={<GradientTextPage />} />
            <Route path="/text-animations/counting-number" element={<CountingNumberPage />} />
            <Route path="/text-animations/morphing-text-2" element={<MorphingText2Page />} />
            <Route path="/text-animations/scroll-text-2" element={<ScrollText2Page />} />
            <Route path="/text-animations/rotating-text" element={<RotatingTextPage />} />
            <Route path="/text-animations/rotating-text-2" element={<RotatingText2Page />} />
            <Route path="/text-animations/rolling-text" element={<RollingTextPage />} />
            <Route path="/text-animations/highlight-text" element={<HighlightTextPage />} />
            <Route path="/text-animations/highlight-text-draw" element={<HighlightTextDrawPage />} />
            <Route path="/text-animations/underline-draw" element={<UnderlineDrawPage />} />
            <Route path="/text-animations/circle-draw" element={<CircleDrawPage />} />
            <Route path="/text-animations/video-text" element={<VideoTextPage />} />
            <Route path="/text-animations/video-text-2" element={<VideoText2Page />} />
            <Route path="/text-animations/typing-text" element={<TypingTextPage />} />
            <Route path="/text-animations/typing-text-2" element={<TypingText2Page />} />
            <Route path="/text-animations/sparkles-text" element={<SparklesTextPage />} />
            <Route path="/text-animations/sparkles-text-2" element={<SparklesText2Page />} />
            <Route path="/text-animations/sparkles-text-3" element={<SparklesText3Page />} />
            <Route path="/backgrounds/ripple-effect" element={<RippleEffectPage />} />
            <Route path="/backgrounds/ripple-effect-2" element={<RippleEffect2Page />} />
            <Route path="/backgrounds/aurora-background" element={<AuroraBackgroundPage />} />
            <Route path="/backgrounds/particles-float" element={<ParticlesFloatPage />} />
            <Route path="/backgrounds/venom-lines" element={<VenomLinesPage />} />
            <Route path="/backgrounds/liquid-venom" element={<LiquidVenomPage />} />
            <Route path="/backgrounds/aurora-flow" element={<AuroraFlowPage />} />
            <Route path="/cards/glare-card" element={<GlareCardPage />} />
            <Route path="/cards/flash-sweep-card" element={<FlashSweepCardPage />} />
            <Route path="/cards/tooltip-card" element={<TooltipCardPage />} />
            <Route path="/cards/card-stack" element={<CardStackPage />} />
            <Route path="/preloaders/preloader-1" element={<Preloader1Page />} />
            <Route path="/preloaders/preloader-2" element={<Preloader2Page />} />
            <Route path="/preloaders/preloader-3" element={<Preloader3Page />} />
            <Route path="/preloaders/preloader-4" element={<Preloader4Page />} />
            <Route path="/preloaders/preloader-5" element={<Preloader5Page />} />
            <Route path="/preloaders/preloader-6" element={<Preloader6Page />} />
            <Route path="/preloaders/preloader-7" element={<Preloader7Page />} />
            <Route path="/preloaders/preloader-8" element={<Preloader8Page />} />
            <Route path="/loaders/loader-1" element={<Loader1Page />} />
            <Route path="/loaders/loader-2" element={<Loader2Page />} />
            <Route path="/loaders/loader-3" element={<Loader3Page />} />
            <Route path="/loaders/loader-3d" element={<Loader3DPage />} />
            <Route path="/loaders/loader-4" element={<Loader4Page />} />
            <Route path="/loaders/loader-5" element={<Loader5Page />} />
            <Route path="/buttons/breathing-glow" element={<BreathingGlowButtonPage />} />
            <Route path="/buttons/laser-trace" element={<LaserTraceButtonPage />} />
            <Route path="/buttons/magnetic-fill" element={<MagneticFillButtonPage />} />
            <Route path="/buttons/rainbow-orbit" element={<RainbowOrbitButtonPage />} />
            <Route path="/buttons/neon-flicker" element={<NeonFlickerButtonPage />} />
            <Route path="/buttons/particle-burst" element={<ParticleBurstButtonPage />} />
            <Route path="/buttons/shockwave-ripple" element={<ShockwaveRippleButtonPage />} />
            <Route path="/buttons/typewriter-border" element={<TypewriterBorderButtonPage />} />
            <Route path="/buttons/text-flip" element={<TextFlipButtonPage />} />
            <Route path="/buttons/ripple-flip" element={<RippleFlipButtonPage />} />
            <Route path="/buttons/magnetic-button" element={<MagneticButtonPage />} />
            <Route path="/buttons/particle-burst-2" element={<ParticleBurstButton2Page />} />
            <Route path="/buttons/flip-button" element={<FlipButtonPage />} />
            <Route path="/buttons/neon-wave" element={<NeonWaveButtonPage />} />
            <Route path="/buttons/ripple-wave" element={<RippleWaveButtonPage />} />
            <Route path="/buttons/slice-reveal" element={<SliceRevealButtonPage />} />
            <Route path="/buttons/bounce-pop" element={<BouncePopButtonPage />} />
            <Route path="/buttons/orbital-spinner" element={<OrbitalSpinnerButtonPage />} />
            <Route path="/interactive/motion-trail-image" element={<MotionTrailImagePage />} />
            <Route path="/interactive/hover-reveal-list" element={<HoverRevealListPage />} />
            <Route path="/interactive/scroll-snap-list" element={<ScrollSnapListPage />} />
            <Route path="/interactive/tilt-hover-card" element={<TiltHoverCardPage />} />
            <Route path="/interactive/image-follow-card" element={<ImageFollowCardPage />} />
            <Route path="/interactive/circular-progress" element={<AnimatedCircularProgressPage />} />
            <Route path="/interactive/spotlight-card" element={<SpotlightCardPage />} />
            <Route path="/interactive/magnetic-bento" element={<MagneticBentoPage />} />
            <Route path="/interactive/liquid-reveal" element={<LiquidRevealPage />} />
            <Route path="/interactive/marquee-3d" element={<Marquee3DPage />} />
            <Route path="/interactive/cursor-attractor-field" element={<CursorAttractorFieldPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
