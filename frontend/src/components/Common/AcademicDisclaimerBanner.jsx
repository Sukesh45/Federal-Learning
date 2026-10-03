import React, { useState } from 'react';
import { ShieldAlert, X, Info } from 'lucide-react';

export default function AcademicDisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 border-b border-blue-200/80 px-4 py-2.5 text-xs text-slate-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <Info className="w-4 h-4 text-cyan-700 flex-shrink-0" />
          <p className="truncate sm:whitespace-normal leading-relaxed text-[11px] text-slate-700">
            <span className="font-bold text-cyan-900 mr-1">College Final Year Academic Demonstration:</span>
            HealthShield AI demonstrates privacy-preserving federated learning & IoMT cyber threat analysis. Federated training, Differential Privacy, and Homomorphic Encryption are educational simulations.
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5 rounded hover:bg-slate-200/60 transition-colors flex-shrink-0"
          title="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
