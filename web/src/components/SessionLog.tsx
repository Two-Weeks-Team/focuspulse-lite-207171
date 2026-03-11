"use client";
import { useEffect, useState } from "react";
import { fetchLog } from '@/lib/api';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface LogEntry {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  blocks: number;
}

export default function SessionLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLog()
      .then((data) => setLogs(data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    const headers = ['Date', 'Start', 'End', 'Blocks'];
    const rows = logs.map((l) => [l.date, l.startTime, l.endTime, l.blocks].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'focuspulse_log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <p className="text-muted">Loading session log…</p>;
  }

  if (logs.length === 0) {
    return <p className="text-muted">No sessions yet. Start a focus block to generate logs.</p>;
  }

  return (
    <section className="bg-card rounded-lg shadow-soft p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-medium text-primary">Session Log</h4>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <table className="w-full table-auto text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-2 py-1 text-left">Date</th>
            <th className="px-2 py-1 text-left">Start</th>
            <th className="px-2 py-1 text-left">End</th>
            <th className="px-2 py-1 text-center">Blocks</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-muted">
              <td className="px-2 py-1">{log.date}</td>
              <td className="px-2 py-1">{new Date(log.startTime).toLocaleTimeString()}</td>
              <td className="px-2 py-1">{new Date(log.endTime).toLocaleTimeString()}</td>
              <td className="px-2 py-1 text-center font-medium text-success">{log.blocks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
