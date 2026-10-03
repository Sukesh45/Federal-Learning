import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'cyan', glow = false }) {
  const colorMap = {
    cyan: {
      border: 'border-slate-200 hover:border-cyan-400',
      iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      text: 'text-cyan-700',
      glow: 'shadow-sm hover:shadow-md'
    },
    blue: {
      border: 'border-slate-200 hover:border-blue-400',
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      text: 'text-blue-700',
      glow: 'shadow-sm hover:shadow-md'
    },
    rose: {
      border: 'border-slate-200 hover:border-rose-400',
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      text: 'text-rose-700',
      glow: 'shadow-sm hover:shadow-md'
    },
    amber: {
      border: 'border-slate-200 hover:border-amber-400',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      text: 'text-amber-700',
      glow: 'shadow-sm hover:shadow-md'
    },
    emerald: {
      border: 'border-slate-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      text: 'text-emerald-700',
      glow: 'shadow-sm hover:shadow-md'
    },
    purple: {
      border: 'border-slate-200 hover:border-purple-400',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
      text: 'text-purple-700',
      glow: 'shadow-sm hover:shadow-md'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`p-5 rounded-2xl bg-white border ${scheme.border} transition-all duration-200 hover:-translate-y-0.5 ${
        scheme.glow
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${scheme.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-black tracking-tight text-slate-900 font-mono">
          {value}
        </div>
        {trend && (
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-[11px] text-slate-500 truncate font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
