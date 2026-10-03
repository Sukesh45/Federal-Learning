import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import { SEVERITY_COLORS } from '../../utils/constants.js';
import { formatTimeAgo } from '../../utils/formatters.js';

export default function RecentThreatsList({ threats = [] }) {
  const navigate = useNavigate();
  const recent = threats.slice(0, 6);

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Live Intercepted Threats</h3>
          <p className="text-[11px] text-slate-500">Real-time IoMT anomaly detections</p>
        </div>
        <button
          onClick={() => navigate('/threat-detection')}
          className="text-[11px] font-mono font-semibold text-cyan-700 hover:text-cyan-600 flex items-center space-x-1"
        >
          <span>Detect New</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[340px] custom-scrollbar">
        {recent.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600 mb-2 opacity-80" />
            No active threats detected. Network parameters nominal.
          </div>
        ) : (
          recent.map((threat) => {
            const sev = SEVERITY_COLORS[threat.severity] || SEVERITY_COLORS.Low;
            return (
              <div
                key={threat.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-cyan-400 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2 rounded-lg ${sev.bg} border ${sev.border} flex-shrink-0`}>
                    <ShieldAlert className={`w-4 h-4 ${sev.text}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-slate-900 truncate group-hover:text-cyan-700 transition-colors">
                        {threat.attackType}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${sev.badge}`}>
                        {threat.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      {threat.affectedDevice || 'Medical Device'} • <span className="font-mono text-slate-600">{threat.sourceIp} → {threat.destIp}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 hidden sm:inline font-medium">
                    {formatTimeAgo(threat.timestamp)}
                  </span>
                  <button
                    onClick={() => navigate('/threat-detection')}
                    className="p-1.5 rounded-lg bg-white hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 border border-slate-200 shadow-sm"
                    title="Inspect Threat"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
