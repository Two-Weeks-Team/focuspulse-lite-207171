"use client";
import { useEffect, useState } from "react";
import { fetchPlan } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function InsightPanel() {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated AI insight – reuse plan endpoint for demo
    fetchPlan()
      .then((data) => {
        const items = data.planItems?.slice(0, 3) ?? [];
        setInsight(`You have ${items.length} high‑priority items today. Keep a steady rhythm for maximum focus.`);
      })
      .catch(() => setInsight(''))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="bg-card rounded-lg shadow-soft p-4">
      <h3 className="text-xl font-medium text-primary mb-2">Today’s Insight</h3>
      {insight ? (
        <p className="text-foreground">{insight}</p>
      ) : (
        <p className="text-muted">No insight available.</p>
      )}
    </section>
  );
}
