import React, { useState } from 'react';
import { Lock, Sliders, ShieldCheck, Database, Key } from 'lucide-react';
import DifferentialPrivacySim from '../components/Privacy/DifferentialPrivacySim.jsx';
import HomomorphicEncryptionSim from '../components/Privacy/HomomorphicEncryptionSim.jsx';
import DataSiloVisualizer from '../components/Privacy/DataSiloVisualizer.jsx';

export default function PrivacySecurity() {
  const [activeTab, setActiveTab] = useState('dp');

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Header & Tab Navigation */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              Privacy-Preserving Technologies
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              Dual-Shield Privacy
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Privacy & Cryptographic Defense Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Explore the privacy mechanisms implemented in HealthShield AI: Statistical Differential Privacy (noise addition to prevent model inversion) and Homomorphic Encryption (ciphertext aggregation).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab('dp')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'dp'
                ? 'bg-white text-cyan-800 border border-slate-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Differential Privacy</span>
          </button>

          <button
            onClick={() => setActiveTab('he')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'he'
                ? 'bg-white text-purple-800 border border-slate-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Homomorphic Encryption</span>
          </button>

          <button
            onClick={() => setActiveTab('silo')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'silo'
                ? 'bg-white text-emerald-800 border border-slate-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Silo Architecture</span>
          </button>
        </div>
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'dp' && <DifferentialPrivacySim />}
      {activeTab === 'he' && <HomomorphicEncryptionSim />}
      {activeTab === 'silo' && <DataSiloVisualizer />}
    </div>
  );
}
