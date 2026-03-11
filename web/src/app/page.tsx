"use client";
import { useEffect, useState } from "react";
import Hero from '@/components/Hero';
import TimerCard from '@/components/TimerCard';
import ProgressBar from '@/components/ProgressBar';
import StatsStrip from '@/components/StatsStrip';
import SessionLog from '@/components/SessionLog';
import InsightPanel from '@/components/InsightPanel';
import CollectionPanel from '@/components/CollectionPanel';
import StatePanel from '@/components/StatePanel';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example of handling a global error from any child via a simple event system could be added later.
  useEffect(() => {
    // placeholder for future init logic e.g., loading saved logs
  }, []);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <Hero />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <TimerCard />
          <ProgressBar />
          <StatsStrip />
        </div>
        <CollectionPanel />
      </div>
      <SectionWrapper title="Today’s Sessions" error={error} loading={loading}>
        <SessionLog />
      </SectionWrapper>
      <SectionWrapper title="Insight" error={error} loading={loading}>
        <InsightPanel />
      </SectionWrapper>
      <StatePanel />
    </main>
  );
}

function SectionWrapper({
  title,
  children,
  loading,
  error
}: {
  title: string;
  children: React.ReactNode;
  loading: boolean;
  error: string | null;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-medium text-primary">{title}</h2>
      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-warning">Error: {error}</p>}
      {!loading && !error && children}
    </section>
  );
}
