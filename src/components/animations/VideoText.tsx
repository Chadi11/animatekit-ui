import { useRef, useState } from "react";

interface VideoTextProps {
  text?: string;
  videoSrc?: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  fallbackGradient?: string;
  className?: string;
}

const DEFAULT_VIDEO = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4";

const VideoText = ({
  text = "EXPLORE",
  videoSrc = DEFAULT_VIDEO,
  fontSize = 120,
  fontWeight = 900,
  letterSpacing = -2,
  fallbackGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  className = "",
}: VideoTextProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div
      className={`relative inline-block overflow-hidden leading-none ${className}`}
    >
      {!videoFailed && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
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
            fontSize,
            fontWeight,
            letterSpacing,
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
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default VideoText;
export type { VideoTextProps };
