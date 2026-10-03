import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ThreatTimelineChart() {
  const timelineData = [
    { time: '00:00', threats: 12, critical: 1, baseline: 10 },
    { time: '03:00', threats: 8, critical: 0, baseline: 8 },
    { time: '06:00', threats: 19, critical: 2, baseline: 15 },
    { time: '09:00', threats: 45, critical: 6, baseline: 25 },
    { time: '12:00', threats: 62, critical: 9, baseline: 30 },
    { time: '15:00', threats: 84, critical: 14, baseline: 35 },
    { time: '18:00', threats: 53, critical: 7, baseline: 28 },
    { time: '21:00', threats: 38, critical: 4, baseline: 20 },
    { time: 'Now', threats: 49, critical: 5, baseline: 22 }
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Threats Over Time</h3>
          <p className="text-[11px] text-slate-500">24-hour threat velocity & critical incidents</p>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="flex items-center space-x-1 text-cyan-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>Total Threats</span>
          </span>
          <span className="flex items-center space-x-1 text-rose-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Critical</span>
          </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '12px',
                color: '#0f172a',
                fontSize: '12px',
                fontFamily: 'monospace',
                boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="threats"
              stroke="#0284c7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#threatGrad)"
            />
            <Area
              type="monotone"
              dataKey="critical"
              stroke="#e11d48"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#criticalGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
