"use client";
import { useEffect, useState } from "react";
import { fetchPlan } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Hero() {
  const [plan, setPlan] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlan()
      .then((data) => setPlan(data.planItems ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="text-center py-8">
      <h1 className="text-4xl font-bold text-primary mb-2">FocusPulse Lite</h1>
      <p className="text-lg text-foreground mb-4">The one‑click timer that keeps your workflow steady.</p>
      {loading && <LoadingSpinner />}
      {error && <p className="text-warning">Failed to load plan: {error}</p>}
      {plan.length > 0 && (
        <ul className="list-disc list-inside text-left inline-block max-w-md mx-auto mt-4">
          {plan.map((item, idx) => (
            <li key={idx} className="text-muted">{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
