import { ReactNode, useState, useCallback } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewFrameProps {
  children: ReactNode;
  onReload?: () => void;
}

const PreviewFrame = ({ children, onReload }: PreviewFrameProps) => {
  const [internalKey, setInternalKey] = useState(0);

  const handleReload = useCallback(() => {
    if (onReload) {
      onReload();
    }
    // Always bump internal key to remount children
    setInternalKey((k) => k + 1);
  }, [onReload]);

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card shadow-2xl shadow-black/30">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500/60" />
        </div>
        <div className="flex-1 flex justify-center min-w-0">
          <div className="px-4 py-1 rounded-md bg-background/50 text-[10px] font-mono text-muted-foreground min-w-0 sm:min-w-[200px] max-w-full text-center truncate">
            animatekit.dev/preview
          </div>
        </div>
        <div className="w-12 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReload}
            className="h-6 w-6"
            title="Replay animation"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div
        key={internalKey}
        className="relative overflow-hidden flex items-center justify-center min-h-[220px] sm:min-h-[320px] p-4 sm:p-8 md:p-12"
        style={{ background: "hsl(var(--preview-bg))" }}
      >
        {children}
      </div>
    </div>
  );
};

export default PreviewFrame;
