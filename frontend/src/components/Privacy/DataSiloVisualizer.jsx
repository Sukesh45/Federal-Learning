import React from 'react';
import { ShieldX, ShieldCheck, Database, Building2, Cloud, ArrowRight, Lock, AlertTriangle } from 'lucide-react';

export default function DataSiloVisualizer() {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
      <div className="mb-5">
        <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
          Architectural Paradigm Comparison
        </span>
        <h3 className="text-lg font-black text-slate-900 mt-0.5">
          Centralized Machine Learning vs. Privacy-Preserving Federated Learning
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Centralized ML (Vulnerable) */}
        <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4">
          <div className="flex items-center space-x-2 text-rose-700 font-mono font-bold text-xs uppercase">
            <ShieldX className="w-4 h-4 text-rose-600" />
            <span>Traditional Centralized Architecture (High Risk)</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-rose-200 text-xs space-y-2 text-slate-700">
            <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
              <span>Hospital A, B, C, D, E</span>
              <span className="text-rose-600 font-bold">Raw PHI & Packet Logs</span>
              <span>Central Cloud</span>
            </div>
            <div className="w-full bg-rose-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-full animate-pulse" />
            </div>
            <p className="text-[11px] text-rose-700">
              ⚠️ Violates HIPAA / GDPR. Raw patient records and sensitive IoMT traffic are physically transmitted and stored on a third-party central server, creating a single point of data breach.
            </p>
          </div>

          <ul className="text-xs space-y-1.5 text-slate-700 font-mono">
            <li className="text-rose-700">✕ High risk of patient identity deanonymization</li>
            <li className="text-rose-700">✕ High compliance and legal regulatory penalties</li>
            <li className="text-rose-700">✕ Massive network bandwidth consumption</li>
          </ul>
        </div>

        {/* HealthShield Federated Architecture (Privacy Preserving) */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-800 font-mono font-bold text-xs uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>HealthShield Federated Framework (Privacy Shielded)</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-emerald-200 text-xs space-y-2 text-slate-700">
            <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
              <span>Local Hospital Node</span>
              <span className="text-cyan-700 font-bold">Encrypted Weight Matrix (ΔW)</span>
              <span>FedAvg Fusion</span>
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full" />
            </div>
            <p className="text-[11px] text-emerald-800">
              ✓ Clinical data never leaves the hospital firewall. Hospitals collaborate to train a unified cyber threat classifier using only perturbed, encrypted mathematical gradients.
            </p>
          </div>

          <ul className="text-xs space-y-1.5 text-slate-700 font-mono">
            <li className="text-emerald-700">✓ Complete HIPAA & GDPR patient data compliance</li>
            <li className="text-emerald-700">✓ Differential Privacy noise bounding against inversion</li>
            <li className="text-emerald-700">✓ Low communication overhead (&lt;140 KB per round)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
