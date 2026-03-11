"use client";
import { useEffect, useState } from "react";
import { fetchLog } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LogEntry {
  id: number;
  date: string;
  blocks: number;
}

export default function CollectionPanel() {
  const [recent, setRecent] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLog()
      .then((data: any) => {
        const sorted = data
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setRecent(sorted);
      })
      .catch(() => setRecent([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="bg-card rounded-lg shadow-soft p-4">
      <h4 className="text-lg font-medium text-primary mb-2">Recent Activity</h4>
      {recent.length === 0 ? (
        <p className="text-muted">No recent blocks.</p>
      ) : (
        <ul className="space-y-1">
          {recent.map((r) => (
            <li key={r.id} className="text-sm text-foreground">
              <span className="font-medium">{r.date}</span>: {r.blocks} block(s)
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
