import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function HospitalThreatComparison({ hospitals = [] }) {
  const chartData = hospitals.map(h => ({
    name: h.name.split(' ')[0] + ' ' + (h.name.split(' ')[1] || ''),
    fullName: h.name,
    threats: Number(h.threatCount) || 0,
    devices: Number(h.deviceCount) || 0,
    records: Number(h.dataRecords) || 0
  }));

  const barColors = ['#0284c7', '#2563eb', '#7c3aed', '#db2777', '#d97706'];

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Hospital Threat Comparison</h3>
          <p className="text-[11px] text-slate-500">Threat telemetry across federated healthcare nodes</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
          5 Clients
        </span>
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs font-mono">
                      <p className="font-bold text-slate-900">{data.fullName}</p>
                      <p className="text-rose-600 mt-1 font-semibold">🚨 Threats Detected: {data.threats}</p>
                      <p className="text-blue-600 font-semibold">📟 Active IoMT Devices: {data.devices}</p>
                      <p className="text-slate-500">📊 Flow Records: {data.records.toLocaleString()}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="threats" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
