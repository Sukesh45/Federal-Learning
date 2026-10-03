import React from 'react';
import {
  Info,
  ShieldCheck,
  Target,
  Sparkles,
  Layers,
  Building2,
  Database,
  Cpu,
  Lock,
  Bot,
  GraduationCap
} from 'lucide-react';

export default function About() {
  const objectives = [
    { num: '01', title: 'Detect Suspicious IoMT Cyber Activity', desc: 'Identify volumetric DoS floods, port scans, SMB ransomware propagation, and PHI data exfiltration.' },
    { num: '02', title: 'Demonstrate Federated Learning', desc: 'Simulate decentralized FedAvg model training across 5 simulated hospital edge clients.' },
    { num: '03', title: 'Simulate Privacy Preservation', desc: 'Demonstrate Differential Privacy Laplace noise addition and Homomorphic Encryption ciphertext aggregation.' },
    { num: '04', title: 'AI-Assisted Threat Explanations', desc: 'Use Groq AI to explain complex network telemetry and provide clinical defense recommendations.' },
    { num: '05', title: 'Centralized SecOps Visualization', desc: 'Provide interactive real-time dashboards, charts, and IoMT device health metrics.' },
    { num: '06', title: 'Maintain Hospital-Level Data Siloing', desc: 'Keep raw clinical datasets and device logs localized to each simulated hospital.' },
    { num: '07', title: 'Automated Security Alerting', desc: 'Generate real-time incident notifications for High and Critical severity cyber threats.' },
    { num: '08', title: 'Empirical Benchmark Experiments', desc: 'Compare 4 privacy-preserving architectures across accuracy, F1-score, latency, and overhead.' }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto font-sans">
      {/* Page Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-cyan-900 to-indigo-950 text-white relative overflow-hidden shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-cyan-200 border border-white/20">
            About HealthShield AI
          </span>
          <span className="text-xs font-mono text-cyan-100">College Final Year Project</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Privacy-Preserving Cyber Threat Detection in Healthcare Systems
        </h1>

        <p className="text-xs sm:text-sm text-cyan-100/90 max-w-3xl leading-relaxed">
          A full-stack cybersecurity monitoring and educational demonstration platform designed to showcase the power of decentralized Federated Learning, Differential Privacy, Homomorphic Encryption, and Groq AI threat intelligence in healthcare/IoMT environments.
        </p>
      </div>

      {/* Problem Statement & Proposed Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-rose-700 font-mono uppercase tracking-wider flex items-center space-x-2">
            <span>🚨 The Problem Statement</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Modern hospitals deploy thousands of Internet of Medical Things (IoMT) endpoints—including infusion pumps, dialysis units, and vital monitors—that frequently lack native endpoint detection capabilities. Cyberattacks targeting these devices directly jeopardize patient safety, clinical availability, and patient health privacy.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Meanwhile, healthcare regulations (HIPAA, GDPR) strictly prohibit centralizing raw patient traffic or clinical records to a single third-party cloud for machine learning training.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-emerald-700 font-mono uppercase tracking-wider flex items-center space-x-2">
            <span>🛡️ The Proposed Solution</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            HealthShield AI bridges this gap through a <strong>Federated Learning Framework</strong>. Rather than sharing sensitive clinical network captures, each hospital edge node trains a local threat classifier and shares only sanitized, mathematically perturbed weight vectors ($\Delta W$).
          </p>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Combined with Differential Privacy ($\epsilon$-budget) and Homomorphic Encryption, the system achieves 96.8% collaborative threat detection accuracy with zero patient data leakage.
          </p>
        </div>
      </div>

      {/* 8 Core Objectives Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-800 uppercase tracking-wider">
          <Target className="w-4 h-4 text-cyan-700" />
          <span>Project Objectives & Key Results</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {objectives.map((obj) => (
            <div
              key={obj.num}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-cyan-400 transition-all flex items-start space-x-3.5"
            >
              <span className="text-base font-black font-mono text-cyan-800 flex-shrink-0">
                {obj.num}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{obj.title}</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{obj.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Showcase */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
          Technology Stack Architecture
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-cyan-800 font-bold block">Frontend UI</span>
            <span className="text-slate-600 text-[11px] mt-0.5 block font-medium">React 18 + Vite + Tailwind CSS</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-purple-800 font-bold block">AI Intelligence</span>
            <span className="text-slate-600 text-[11px] mt-0.5 block font-medium">Groq Cloud API (Llama 3.3 70B)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-emerald-800 font-bold block">Database & Auth</span>
            <span className="text-slate-600 text-[11px] mt-0.5 block font-medium">Firebase Firestore & Web SDK</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-amber-800 font-bold block">Visual Analytics</span>
            <span className="text-slate-600 text-[11px] mt-0.5 block font-medium">Recharts + Lucide Icons</span>
          </div>
        </div>
      </div>
    </div>
  );
}
