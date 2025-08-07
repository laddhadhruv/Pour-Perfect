import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  max?: number;
  step?: 0.5 | 1;
}

export const StarRating = ({ value = 0, onChange, max = 5, step = 0.5 }: StarRatingProps) => {
  const handleClick = (index: number, isHalf: boolean) => {
    const newVal = isHalf ? index + 0.5 : index + 1;
    onChange(newVal === value ? 0 : newVal);
  };

  const items = Array.from({ length: max }, (_, i) => {
    const diff = (value ?? 0) - i;
    const full = diff >= 1;
    const half = !full && diff >= 0.5;
    return (
      <div key={i} className="relative h-8 w-8">
        {/* Left half */}
        <button
          type="button"
          className={cn("absolute left-0 top-0 h-full w-1/2 text-accent", step === 0.5 ? "block" : "hidden")}
          onClick={() => handleClick(i, true)}
          aria-label={`Rate ${i + 0.5} stars`}
        >
          {half ? <StarHalf className="h-8 w-8 fill-current" /> : full ? (
            <Star className="h-8 w-8 fill-current" />
          ) : (
            <Star className="h-8 w-8 opacity-40" />
          )}
        </button>
        {/* Right half / full */}
        <button
          type="button"
          className="absolute right-0 top-0 h-full w-full text-accent"
          onClick={() => handleClick(i, false)}
          aria-label={`Rate ${i + 1} stars`}
        >
          {full ? (
            <Star className="h-8 w-8 fill-current" />
          ) : half ? (
            <StarHalf className="h-8 w-8 fill-current" />
          ) : (
            <Star className="h-8 w-8 opacity-40" />
          )}
        </button>
      </div>
    );
  });

  return <div className="flex items-center gap-1">{items}</div>;
};
