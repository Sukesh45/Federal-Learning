import React from 'react';
import {
  FileCode2,
  BookOpen,
  Cpu,
  Lock,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  GraduationCap,
  ExternalLink
} from 'lucide-react';

export default function BasePaper() {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto font-sans">
      {/* Paper Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-cyan-900 to-indigo-950 text-white relative overflow-hidden shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-cyan-200 border border-white/20">
            Academic Foundation & Research Basis
          </span>
          <span className="text-xs font-mono text-cyan-100">Final Year Engineering Project</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
          Advancing Federated Learning Frameworks for Privacy-Preserving Cyber Threat Detection in Healthcare Systems
        </h1>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10 text-xs font-mono text-cyan-100">
          <div><strong className="text-cyan-300">Domain:</strong> Healthcare Cybersecurity & IoMT Safety</div>
          <div><strong className="text-purple-200">Core Paradigm:</strong> Federated Averaging (FedAvg) + Differential Privacy</div>
          <div><strong className="text-emerald-300">AI Layer:</strong> Groq Llama-3.3-70B</div>
        </div>
      </div>

      {/* Abstract Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-cyan-700" />
          <span>Executive Abstract</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          The proliferation of Internet of Medical Things (IoMT) devices—such as smart infusion pumps, vital telemetry monitors, and PACS imaging servers—has exponentially widened the attack surface in modern clinical infrastructures. Traditional centralized intrusion detection systems (IDS) require transmitting raw network flow telemetry and protected health information (PHI) to a central cloud aggregator, violating strict healthcare regulations including HIPAA and GDPR.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          This project implements a web-based educational framework demonstrating <strong>Privacy-Preserving Cyber Threat Detection</strong>. By simulating a 5-hospital decentralized cluster, the system employs <strong>Federated Averaging (FedAvg)</strong> to train collaborative intrusion classifiers without centralizing sensitive telemetry. To defend against gradient inversion and membership inference attacks, the framework incorporates <strong>Differential Privacy ($\epsilon$-calibrated Laplace noise)</strong> and demonstrates <strong>Homomorphic Encryption (Paillier Additive Cryptosystem)</strong>.
        </p>
      </div>

      {/* Key Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-cyan-800 font-mono font-bold text-xs uppercase">
            <Cpu className="w-4 h-4 text-cyan-700" />
            <span>1. Federated Learning (FedAvg)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hospitals train neural network weights on localized IoMT logs. Rather than exporting clinical data, each hospital sends only weight vectors ($\Delta W$). The central aggregator computes the federated mean:
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-cyan-900 font-bold text-center">
            W_(t+1) = ∑ [ (n_k / N) · W_k^(t+1) ]
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-purple-800 font-mono font-bold text-xs uppercase">
            <Lock className="w-4 h-4 text-purple-700" />
            <span>2. Differential Privacy (DP)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Guarantees that the presence or absence of an individual patient's medical device record does not meaningfully alter model output, bounding leakage risk via Privacy Budget $\epsilon$:
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-purple-900 font-bold text-center">
            P[M(D) ∈ S] ≤ e^ε · P[M(D') ∈ S] + δ
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-emerald-800 font-mono font-bold text-xs uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>3. Homomorphic Encryption</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Allows the cloud server to aggregate encrypted model weights directly in the ciphertext domain without holding the private decryption key:
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-emerald-900 font-bold text-center">
            Enc(m₁) ⊗ Enc(m₂) mod N² = Enc(m₁ + m₂)
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-amber-800 font-mono font-bold text-xs uppercase">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>4. Groq AI Threat Intelligence</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Groq Llama-3.3-70B acts as the high-speed analysis and explanation layer, converting raw flow anomalies into actionable indicators, clinical risk impacts, and mitigation guides.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-amber-900 font-bold text-center">
            JSON Telemetry → Structured Incident Report
          </div>
        </div>
      </div>

      {/* Demonstration Scope & Educational Disclaimer */}
      <div className="p-6 rounded-3xl bg-cyan-50/60 border border-cyan-200 text-xs font-mono space-y-3 shadow-sm">
        <div className="flex items-center space-x-2 text-cyan-900 font-bold uppercase">
          <GraduationCap className="w-5 h-5 text-cyan-700" />
          <span>Technologies Demonstrated in this College Project</span>
        </div>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside font-medium">
          <li>5-Hospital decentralized federated learning workflow simulation</li>
          <li>Differential Privacy mathematical Laplace & Gaussian noise perturbation</li>
          <li>Additive Paillier Homomorphic Encryption conceptual aggregation pipeline</li>
          <li>Groq Cloud AI inference for IoMT cyber threat classification & explanations</li>
          <li>Real-time Firestore-backed alerting, telemetry indexing, and audit trail logging</li>
        </ul>
        <p className="text-[11px] text-slate-500 pt-2 border-t border-cyan-200">
          Disclaimer: This application is a college-level demonstration platform and educational simulation. It does not replace certified real-world healthcare intrusion prevention appliances.
        </p>
      </div>
    </div>
  );
}
