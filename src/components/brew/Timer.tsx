import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Timer as TimerIcon, Square, Star } from "lucide-react";

interface TimerProps {
  seconds: number;
  onChange: (s: number) => void;
  onStop: () => void;
  bloomAtSec?: number;
  onBloomChange: (s?: number) => void;
}

export const Timer = ({ seconds, onChange, onStop, bloomAtSec, onBloomChange }: TimerProps) => {
  const [running, setRunning] = useState(false);
  const raf = useRef<number | null>(null);
  const lastTick = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;

    const acc = { current: seconds };

    const tick = (now: number) => {
      if (lastTick.current == null) lastTick.current = now;
      const delta = (now - lastTick.current) / 1000;
      lastTick.current = now;
      acc.current += delta;
      onChange(Math.max(0, acc.current));
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      lastTick.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const format = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    const ms = Math.floor((s % 1) * 10).toString();
    return `${m}:${sec}.${ms}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-lg font-mono select-none cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setRunning(true)}
        onDoubleClick={() => setRunning(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setRunning((r) => !r);
          }
        }}
        aria-pressed={running}
        title="Click to start • Double-click to pause"
      >
        <TimerIcon className="opacity-70" />
        <span aria-live="polite">{format(seconds)}</span>
      </div
      {running ? (
        <Button size="sm" variant="secondary" onClick={() => setRunning(false)} aria-label="Pause timer">
          <Pause className="size-4" /> Pause
        </Button>
      ) : (
        <Button size="sm" variant="hero" onClick={() => setRunning(true)} aria-label="Start timer">
          <Play className="size-4" /> Start
        </Button>
      )}
      <Button
        size="sm"
        variant={bloomAtSec != null ? "secondary" : "outline"}
        disabled={!running || bloomAtSec != null}
        onClick={() => {
          if (running && bloomAtSec == null) {
            onBloomChange(Math.round(seconds));
          }
        }}
        aria-pressed={bloomAtSec != null}
        aria-label={bloomAtSec != null ? `Bloom flagged at ${bloomAtSec}s` : "Flag bloom time"}
      >
        <Star className="size-4" /> Bloom
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setRunning(false);
          onStop();
        }}
        aria-label="Stop and save brew"
      >
        <Square className="size-4" /> Stop
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setRunning(false);
          onChange(0);
          onBloomChange(undefined);
        }}
        aria-label="Reset timer"
      >
        <RefreshCw className="size-4" /> Reset
      </Button>
    </div>
  );
};
