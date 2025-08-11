import { useRef, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  max?: number;
  step?: 0.5 | 1;
}

export const StarRating = ({ value = 0, onChange, max = 5, step = 0.5 }: StarRatingProps) => {
  const [hover, setHover] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const display = hover ?? value ?? 0;
  const percent = `${Math.max(0, Math.min(1, display / max)) * 100}%`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const raw = ratio * max;
    const rounded = Math.max(step, Math.min(max, Math.round(raw / step) * step));
    setHover(rounded);
  };

  const handleLeave = () => setHover(undefined);

  const handleClick = () => {
    onChange(display);
  };

  const Stars = ({ filled }: { filled?: boolean }) => (
    <div className={cn("flex items-center gap-1", filled ? "text-accent" : "text-muted-foreground/40")}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} className={cn("h-8 w-8", filled && "fill-current")} />
      ))}
    </div>
  );

  return (
    <div className="inline-flex items-center">
      <div
        ref={containerRef}
        className="relative select-none"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        onDoubleClick={() => onChange(undefined)}
        role="slider"
        aria-label="Star rating"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={display}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onChange(Math.max(0, (value ?? 0) - step));
          if (e.key === "ArrowRight") onChange(Math.min(max, (value ?? 0) + step));
          if (e.key === "Escape") onChange(undefined);
        }}
      >
        {/* Base (outline) layer */}
        <Stars />
        {/* Filled overlay clipped by width */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: percent }}>
          <Stars filled />
        </div>
      </div>
    </div>
  );
};