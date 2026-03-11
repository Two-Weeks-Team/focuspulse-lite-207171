"use client";
import { useTimerStore } from '@/components/TimerCard';

export default function StatsStrip() {
  const { blockCount } = useTimerStore();
  return (
    <div className="flex justify-around bg-muted rounded-md p-2 shadow-sm">
      <div className="text-center">
        <p className="text-sm text-muted">Today's Blocks</p>
        <p className="text-xl font-bold text-success">{blockCount}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted">Focus Mode</p>
        <p className="text-xl font-medium text-primary">25 min</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted">Break</p>
        <p className="text-xl font-medium text-accent">5 min</p>
      </div>
    </div>
  );
}
