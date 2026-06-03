import { useRef, useState } from "react";

interface VideoText2Props {
  text?: string;
  videoSrc?: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  fallbackGradient?: string;
  className?: string;
}

const DEFAULT_VIDEO = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4";

const VideoText2 = ({
  text = "EXPLORE",
  videoSrc = DEFAULT_VIDEO,
  fontSize = 120,
  fontWeight = 900,
  letterSpacing = -2,
  fallbackGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  className = "",
}: VideoText2Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  if (videoFailed) {
    return (
      <span
        className={`inline-block leading-none bg-clip-text ${className}`}
        style={{
          fontSize, fontWeight, letterSpacing,
          fontFamily: "'Space Grotesk', sans-serif",
          background: fallbackGradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <div className={`relative inline-block overflow-hidden leading-none ${className}`}>
      {/* Video layer */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay muted loop playsInline
        onError={() => setVideoFailed(true)}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* White bg + black text, blend mode lighten */}
      <div className="relative z-[1] [mix-blend-mode:lighten] bg-white p-[0.1em_0.05em]">
        <span
          className="block whitespace-nowrap leading-none text-black"
          style={{
            fontSize, fontWeight, letterSpacing,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default VideoText2;
export type { VideoText2Props };
