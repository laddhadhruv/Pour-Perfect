import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, RefreshCw, Timer as TimerIcon } from "lucide-react";

interface TimerProps {
  seconds: number;
  onChange: (s: number) => void;
}

export const Timer = ({ seconds, onChange }: TimerProps) => {
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
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-lg font-mono">
        <TimerIcon className="opacity-70" />
        <span aria-live="polite">{format(seconds)}</span>
      </div>
      {running ? (
        <Button variant="secondary" onClick={() => setRunning(false)} aria-label="Pause timer">
          <Pause /> Pause
        </Button>
      ) : (
        <Button variant="hero" onClick={() => setRunning(true)} aria-label="Start timer">
          <Play /> Start
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => {
          setRunning(false);
          onChange(0);
        }}
        aria-label="Reset timer"
      >
        <RefreshCw /> Reset
      </Button>
    </div>
  );
};
