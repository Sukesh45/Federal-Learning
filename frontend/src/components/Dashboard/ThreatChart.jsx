import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ATTACK_COLORS = {
  'Normal': '#10b981',
  'DoS': '#f97316',
  'DDoS': '#ef4444',
  'Port Scan': '#f59e0b',
  'Brute Force': '#eab308',
  'Malware': '#dc2626',
  'Botnet': '#8b5cf6',
  'Unauthorized Access': '#ec4899',
  'Data Exfiltration': '#b91c1c',
  'Suspicious Traffic': '#06b6d4'
};

export default function ThreatChart({ threats = [] }) {
  // Aggregate threats by attackType
  const counts = {};
  threats.forEach(t => {
    const type = t.attackType || 'Normal';
    counts[type] = (counts[type] || 0) + 1;
  });

  // Ensure default distribution if few items
  const defaultDistribution = [
    { name: 'Normal', value: 840 },
    { name: 'DoS', value: 142 },
    { name: 'DDoS', value: 68 },
    { name: 'Port Scan', value: 185 },
    { name: 'Brute Force', value: 92 },
    { name: 'Malware', value: 45 },
    { name: 'Data Exfiltration', value: 28 }
  ];

  const data = Object.keys(counts).length > 0
    ? Object.keys(counts).map(key => ({ name: key, value: counts[key] }))
    : defaultDistribution;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Threat Distribution</h3>
          <p className="text-[11px] text-slate-500">Classified IoMT telemetry attacks</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold">
          Real-time
        </span>
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-[11px] text-slate-600 font-mono font-medium">{value}</span>}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={ATTACK_COLORS[entry.name] || '#3b82f6'}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
