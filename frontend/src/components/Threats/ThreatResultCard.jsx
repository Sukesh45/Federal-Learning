import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Save,
  BellRing,
  RotateCcw,
  FileText,
  Bot,
  Sparkles,
  Server,
  Activity,
  Layers
} from 'lucide-react';
import { SEVERITY_COLORS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatters.js';

export default function ThreatResultCard({
  result,
  networkEvent,
  onSave,
  onReset,
  onOpenReport
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!result) return null;

  const sev = SEVERITY_COLORS[result.severity] || SEVERITY_COLORS.Low;

  const handleSaveThreat = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...networkEvent,
        ...result,
        timestamp: new Date().toISOString()
      });
      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`p-6 rounded-3xl bg-white border ${sev.border} shadow-lg transition-all duration-300 animate-fade-in`}>
      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl ${sev.bg} border ${sev.border}`}>
            <ShieldAlert className={`w-7 h-7 ${sev.text}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
                Threat Classification
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                {result.analyzedBy || 'Groq AI'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-3 mt-0.5">
              <span>{result.attackType}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold tracking-wider ${sev.badge}`}>
                {result.severity.toUpperCase()} SEVERITY
              </span>
            </h2>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 font-mono">
          <Activity className="w-5 h-5 text-cyan-600" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">AI Confidence</div>
            <div className="text-base font-black text-cyan-700">
              {result.confidence}%
            </div>
          </div>
        </div>
      </div>

      {/* Network Telemetry Summary Box */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[10px] font-semibold">Source Flow</span>
          <span className="text-slate-900 font-bold truncate block">
            {networkEvent.sourceIp}:{networkEvent.sourcePort || 'any'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] font-semibold">Destination Flow</span>
          <span className="text-cyan-700 font-bold truncate block">
            {networkEvent.destIp}:{networkEvent.destPort}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] font-semibold">Protocol / Duration</span>
          <span className="text-slate-900 font-bold block">
            {networkEvent.protocol} • {networkEvent.duration}s
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] font-semibold">Target Healthcare Node</span>
          <span className="text-purple-700 font-bold truncate block">
            {networkEvent.hospitalName || 'Hospital A'}
          </span>
        </div>
      </div>

      {/* AI Explanation Narrative */}
      <div className="mt-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-800 mb-2 font-bold">
          <Bot className="w-4 h-4 text-cyan-600" />
          <span>Groq AI Threat Explanation</span>
        </div>
        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
          {result.explanation}
        </p>
      </div>

      {/* Affected Device & Clinical Impact */}
      {result.affectedDeviceRisk && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
          <span className="font-bold font-mono text-rose-800 block mb-1">
            🏥 IoMT Clinical Device Risk Assessment:
          </span>
          {result.affectedDeviceRisk}
        </div>
      )}

      {/* Two Column Grid: Indicators & Defensive Actions */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Indicators */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
          <h4 className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Detected Attack Indicators</span>
          </h4>
          <ul className="space-y-2">
            {result.indicators?.map((ind, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2 leading-relaxed">
                <span className="text-amber-600 font-mono font-bold flex-shrink-0">•</span>
                <span>{ind}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Actions */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
          <h4 className="text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Recommended Defensive Protocols</span>
          </h4>
          <ul className="space-y-2">
            {result.recommendations?.map((rec, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-slate-500 font-medium">
          Analyzed at: {formatDate(new Date())}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze Another</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors border border-cyan-200"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={handleSaveThreat}
            disabled={isSaved || isSaving}
            className={`px-5 py-2 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-sm ${
              isSaved
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved to Firestore</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Threat & Alert'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
