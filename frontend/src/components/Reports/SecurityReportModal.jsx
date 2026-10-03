import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  ShieldCheck,
  Bot,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  Lock,
  Download
} from 'lucide-react';
import { generateReportAPI } from '../../services/apiService.js';
import { formatDate } from '../../utils/formatters.js';

export default function SecurityReportModal({ isOpen, onClose, reportScope = {} }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    hospitalName = 'All Participating Healthcare Centers',
    totalThreats = 1284,
    criticalThreats = 46,
    highThreats = 112,
    topAttackTypes = ['DoS', 'Port Scan', 'Malware', 'Data Exfiltration'],
    federatedRounds = 25,
    privacyMethod = 'Differential Privacy (ε=1.0) + Paillier Homomorphic Encryption',
    currentAccuracy = '96.8%'
  } = reportScope;

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      generateReportAPI({
        hospitalName,
        totalThreats,
        criticalThreats,
        highThreats,
        topAttackTypes,
        federatedRounds,
        privacyMethod,
        currentAccuracy
      }).then(data => {
        setReport(data);
        setLoading(false);
      });
    }
  }, [isOpen, hospitalName]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in overflow-hidden">
        {/* Top Modal Controls */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-cyan-800 uppercase tracking-wider">
              Executive Cybersecurity Assessment
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-100 text-cyan-800 border border-cyan-200 font-semibold">
              HIPAA & IoMT Compliance
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div id="printable-security-report" className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 custom-scrollbar bg-white">
          {/* Document Header */}
          <div className="border-b-2 border-slate-200 pb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <img src="/healthshield_logo.svg" alt="Logo" className="w-8 h-8" />
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  HealthShield AI
                </h1>
              </div>
              <p className="text-xs text-cyan-800 font-mono font-medium">
                Privacy-Preserving Cyber Threat Detection & IoMT Incident Report
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <p>Report Date: <span className="text-slate-900 font-semibold">{formatDate(new Date())}</span></p>
              <p>Scope: <span className="text-cyan-700 font-semibold">{hospitalName}</span></p>
              <p>Classification: <span className="text-rose-600 font-bold">RESTRICTED / CONFIDENTIAL</span></p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase block font-semibold">Total Threats</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">{totalThreats}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-rose-700 text-[10px] uppercase block font-semibold">Critical Incidents</span>
              <span className="text-xl font-bold text-rose-700 mt-1 block">{criticalThreats}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200">
              <span className="text-cyan-800 text-[10px] uppercase block font-semibold">Federated Rounds</span>
              <span className="text-xl font-bold text-cyan-800 mt-1 block">{federatedRounds} Rounds</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-800 text-[10px] uppercase block font-semibold">Model Accuracy</span>
              <span className="text-xl font-bold text-emerald-800 mt-1 block">{currentAccuracy}</span>
            </div>
          </div>

          {/* Privacy Protocol Section */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
            <h3 className="font-bold text-cyan-900 font-mono flex items-center space-x-2 mb-1">
              <Lock className="w-4 h-4 text-cyan-700" />
              <span>Privacy & Data Sovereignty Guarantee</span>
            </h3>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Active Privacy Mechanism: <span className="font-mono text-cyan-800 font-bold">{privacyMethod}</span>.
              Zero patient Protected Health Information (PHI) or raw network packet captures were transmitted across institutional borders. Threat intelligence was synthesized solely through federated weight aggregation.
            </p>
          </div>

          {/* Groq AI Executive Narrative */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center space-x-2">
              <Bot className="w-4 h-4 text-cyan-700" />
              <span>Executive Summary (AI Generated)</span>
            </h3>

            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-cyan-700 flex flex-col items-center space-y-2">
                <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing intelligence report with Groq AI...</span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-800">
                {report?.executiveSummary}
              </div>
            )}
          </div>

          {/* Key Findings & Recommendations */}
          {!loading && report && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold font-mono text-amber-900 uppercase tracking-wider mb-2">
                  Key Technical Findings
                </h4>
                <ul className="space-y-1.5 text-slate-700">
                  {report.keyFindings?.map((f, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold font-mono text-emerald-900 uppercase tracking-wider mb-2">
                  Strategic Remediation Roadmap
                </h4>
                <ul className="space-y-1.5 text-slate-700">
                  {report.strategicRecommendations?.map((r, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Academic / Audit Sign-off */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Verified By: HealthShield AI SecOps Orchestrator</span>
            <span>Educational Demonstration Artifact</span>
          </div>
        </div>
      </div>
    </div>
  );
}
