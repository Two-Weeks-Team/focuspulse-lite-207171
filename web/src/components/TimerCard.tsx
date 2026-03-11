"use client";
import { useCallback, useEffect, useState } from "react";
import { create } from 'zustand';
import { clsx } from 'clsx';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { postLog } from '@/lib/api';

// Global store for timer
interface TimerState {
  running: boolean;
  mode: 'focus' | 'break';
  secondsLeft: number;
  blockCount: number;
  startTimestamp: number | null;
  setRunning: (run: boolean) => void;
  toggleMode: () => void;
  tick: () => void;
  reset: () => void;
  incrementBlock: () => void;
}

const useTimerStore = create<TimerState>((set, get) => ({
  running: false,
  mode: 'focus',
  secondsLeft: 1500, // 25min
  blockCount: 0,
  startTimestamp: null,
  setRunning: (run) => set({ running: run, startTimestamp: run ? Date.now() : null }),
  toggleMode: () => {
    const { mode } = get();
    const newMode = mode === 'focus' ? 'break' : 'focus';
    const newSeconds = newMode === 'focus' ? 1500 : 300; // 5min break
    set({ mode: newMode, secondsLeft: newSeconds, running: false, startTimestamp: null });
  },
  tick: () => {
    const { secondsLeft, running, mode } = get();
    if (!running) return;
    if (secondsLeft > 0) {
      set({ secondsLeft: secondsLeft - 1 });
    } else {
      // Cycle complete
      if (mode === 'focus') {
        get().incrementBlock();
      }
      get().toggleMode();
    }
  },
  reset: () => set({ running: false, mode: 'focus', secondsLeft: 1500, startTimestamp: null }),
  incrementBlock: () => set((s) => ({ blockCount: s.blockCount + 1 }))
}));

export default function TimerCard() {
  const {
    running,
    mode,
    secondsLeft,
    blockCount,
    setRunning,
    tick,
    reset,
    incrementBlock
  } = useTimerStore();

  const [mood, setMood] = useState<string>('');
  const [showMoodPicker, setShowMoodPicker] = useState(true);

  // Tick every second
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [running, tick]);

  // Capture mood – simple 3‑second auto‑hide after selection
  const handleMoodSelect = (emoji: string) => {
    setMood(emoji);
    setShowMoodPicker(false);
  };

  const handleStartStop = () => {
    if (running) {
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  const handleReset = () => {
    reset();
    setMood('');
    setShowMoodPicker(true);
    setRunning(false);
  };

  // When a focus block finishes, persist a log entry
  useEffect(() => {
    if (mode === 'break' && !running && secondsLeft === 300) {
      // Just entered break after a completed focus block
      const now = new Date();
      const entry = {
        date: now.toISOString().split('T')[0],
        startTime: new Date(now.getTime() - 1500 * 1000).toISOString(),
        endTime: now.toISOString(),
        blocks: blockCount
      };
      postLog(entry).catch(() => {/* ignore for demo */});
    }
  }, [mode, running, blockCount, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <section className="p-6 bg-card rounded-lg shadow-soft">
      <h3 className="text-2xl font-medium mb-4 text-primary">Focus Pulse</h3>
      {showMoodPicker && (
        <div className="mb-4 flex justify-center space-x-2">
          {["😊", "🙂", "😐", "🙁", "😡"].map((e) => (
            <button
              key={e}
              onClick={() => handleMoodSelect(e)}
              className="text-2xl hover:scale-110 transition-transform"
            >
              {e}
            </button>
          ))}
        </div>
      )}
      <div className="text-5xl font-mono text-center mb-4">
        {minutes}:{secs}
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleStartStop}
          className={clsx(
            "px-4 py-2 rounded-md text-white",
            running ? "bg-warning" : "bg-primary"
          )}
        >
          {running ? <Pause className="inline-block mr-2" /> : <Play className="inline-block mr-2" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-md bg-muted text-foreground"
        >
          <RefreshCw className="inline-block mr-1" /> Reset
        </button>
      </div>
      <p className="mt-3 text-sm text-muted">
        Completed blocks: <span className="font-medium text-success">{blockCount}</span>
      </p>
    </section>
  );
}
