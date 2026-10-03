import React from 'react';
import {
  Building2,
  Server,
  Cpu,
  Lock,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function FederatedWorkflowVisualizer({
  currentStep = 0,
  activeStepData = null,
  hospitals = [],
  isSimulating = false
}) {
  const stepsList = [
    { num: 1, title: 'Local Training', desc: 'Hospitals train on local logs' },
    { num: 2, title: 'Gradient Extraction', desc: 'Extract ΔW weight updates' },
    { num: 3, title: 'Privacy Shield', desc: 'Laplace Noise / HE Masking' },
    { num: 4, title: 'Transmission', desc: 'Decentralized parameter sync' },
    { num: 5, title: 'FedAvg Aggregation', desc: 'W_global = Σ (n_k/N) * W_k' },
    { num: 6, title: 'Distribution', desc: 'Broadcast updated global model' },
    { num: 7, title: 'Evaluation', desc: 'Global threat accuracy update' }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              Federated Averaging (FedAvg) Workflow Simulation
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              5 Decentralized Clients
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-0.5">
            Decentralized Privacy-Preserving Convergence Pipeline
          </h3>
        </div>

        {isSimulating && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-mono text-cyan-800 animate-pulse font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
            <span>Simulating Step {currentStep}/7: {activeStepData?.title}</span>
          </div>
        )}
      </div>

      {/* Visual Step Progress Bar */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stepsList.map((st) => {
          const isActive = currentStep === st.num;
          const isDone = currentStep > st.num;

          return (
            <div
              key={st.num}
              className={`p-3 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? 'bg-cyan-50 border-cyan-500 shadow-sm text-cyan-900'
                  : isDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold">Step {st.num}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
                ) : null}
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1 truncate">{st.title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">{st.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main Architecture Visual Diagram */}
      <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: 5 Hospital Clients Column */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono text-cyan-800 font-bold uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-cyan-700" />
              <span>Hospital Clients (Local Data Silos)</span>
            </div>

            {hospitals.map((hosp, idx) => (
              <div
                key={hosp.id || idx}
                className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between text-xs ${
                  isSimulating && currentStep <= 3
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-800 font-mono font-bold text-xs">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 truncate block">{hosp.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{hosp.dataRecords?.toLocaleString()} IoMT logs</span>
                  </div>
                </div>

                <div className="text-right font-mono text-[10px]">
                  <span className="text-emerald-700 font-bold block">{hosp.localModelAccuracy || 96.5}% Acc</span>
                  <span className="text-slate-500">ε={hosp.privacyBudgetUsed || 1.0}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Center: Privacy Transformation Channel */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="p-3 rounded-2xl bg-purple-100 border border-purple-200 text-purple-800">
              <Lock className="w-8 h-8 mx-auto mb-1 animate-pulse text-purple-700" />
              <span className="text-xs font-mono font-bold block uppercase">Privacy Shield Layer</span>
            </div>

            <div className="space-y-2 text-xs text-slate-700 max-w-xs w-full">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px]">
                <span className="text-cyan-800 block font-bold">1. Differential Privacy</span>
                <span className="text-slate-600 text-[10px]">ΔW' = ΔW + Lap(Δf/ε)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px]">
                <span className="text-purple-800 block font-bold">2. Homomorphic Encryption</span>
                <span className="text-slate-600 text-[10px]">Enc(ΔW_A) ⊗ Enc(ΔW_B)</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
              ✓ Zero Clinical Telemetry Leaves Node
            </div>
          </div>

          {/* Right: Central FedAvg Aggregator */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-blue-900 to-indigo-950 text-white text-center space-y-4 shadow-md">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-cyan-200">
              <Server className="w-10 h-10 mx-auto animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                Central Federated Aggregator
              </span>
              <h4 className="text-base font-extrabold text-white mt-1">
                Global IoMT Threat Model
              </h4>
              <p className="text-[11px] text-cyan-100/80 font-mono mt-1">
                FedAvg Parameter Fusion
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10 w-full text-left font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-cyan-100">
                <span>Aggregation Status:</span>
                <span className="text-emerald-300 font-semibold">Active (FedAvg)</span>
              </div>
              <div className="flex justify-between text-cyan-100">
                <span>Model Architecture:</span>
                <span className="text-cyan-200">CNN-BiLSTM</span>
              </div>
              <div className="flex justify-between text-cyan-100">
                <span>Global Threat Accuracy:</span>
                <span className="text-emerald-300 font-bold">96.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
