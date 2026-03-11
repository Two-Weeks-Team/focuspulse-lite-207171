"use client";
import { useEffect, useState } from "react";
import { useTimerStore } from '@/components/TimerCard'; // re‑use store

export default function ProgressBar() {
  const { mode, secondsLeft } = useTimerStore();
  const total = mode === 'focus' ? 1500 : 300;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(((total - secondsLeft) / total) * 100);
  }, [secondsLeft, total]);

  const barColor = mode === 'focus' ? 'bg-primary' : 'bg-accent';

  return (
    <div className="w-full h-4 bg-muted rounded-full overflow-hidden shadow-sm">
      <div
        className={`${barColor} h-full transition-all duration-300 ease-out`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}
