export async function fetchLog() {
  const res = await fetch('/api/logs');
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function fetchPlan() {
  const res = await fetch('/api/plan');
  if (!res.ok) throw new Error('Failed to fetch plan');
  return res.json();
}

export async function postAdaptiveTimer(payload: { recentBlocks: number; recentBreaks: number }) {
  const res = await fetch('/api/adaptive-timer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Adaptive timer request failed');
  return res.json();
}

export async function postLog(entry: { date: string; startTime: string; endTime: string; blocks: number }) {
  const res = await fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  if (!res.ok) throw new Error('Failed to post log');
  return res.json();
}
