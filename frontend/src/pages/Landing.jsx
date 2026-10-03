import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  Lock,
  Sparkles,
  Server,
  Building2,
  Activity,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Database,
  FileCode2,
  Layers,
  Zap,
  BookOpen,
  UserCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { DEMO_USERS } from '../services/authService.js';

export default function Landing() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async (roleKey) => {
    try {
      const demoUser = DEMO_USERS[roleKey];
      await login(demoUser.email, 'password123');
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ------------------------------------------------------------- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-sm group-hover:shadow-md transition-all">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
                <img src="/healthshield_logo.svg" alt="HealthShield Logo" className="w-full h-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  HealthShield
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono -mt-0.5 hidden sm:block">
                Privacy-Preserving IoMT SecOps
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
            <a href="#overview" className="hover:text-cyan-700 transition-colors">Overview</a>
            <a href="#pillars" className="hover:text-cyan-700 transition-colors">Privacy Pillars</a>
            <a href="#pipeline" className="hover:text-cyan-700 transition-colors">FedAvg Pipeline</a>
            <a href="#evaluation" className="hover:text-cyan-700 transition-colors">Demo Profiles</a>
            <a href="#academic" className="hover:text-cyan-700 transition-colors">Academic Basis</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono shadow-sm hover:shadow-md transition-all flex items-center space-x-1.5"
                >
                  <span>Launch Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="overview" className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-cyan-50/40 via-white to-slate-50">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-cyan-200/30 to-blue-200/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-xs font-mono font-semibold text-cyan-900 shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
            <span>Final Year Academic Engineering Project • IoMT Cyber Defense</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Privacy-Preserving Cyber Threat Detection in{' '}
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Healthcare Systems
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Collaborative Intrusion Detection for Internet of Medical Things (IoMT) devices—such as smart infusion pumps, PACS imaging servers, and MRI consoles. Powered by <strong>Decentralized Federated Learning (FedAvg)</strong>, <strong>Differential Privacy</strong>, and <strong>Groq AI</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2.5 font-mono"
            >
              <span>Launch SecOps Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#evaluation"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-cyan-400 text-sm font-semibold shadow-sm transition-all flex items-center space-x-2 font-mono"
            >
              <Zap className="w-4 h-4 text-cyan-600" />
              <span>1-Click Demo Profiles</span>
            </a>

            <Link
              to="/register"
              className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
            >
              Create Account
            </Link>
          </div>

          {/* Live Protection Interactive Preview Card */}
          <div className="mt-12 p-6 rounded-3xl bg-white border border-slate-200 shadow-xl max-w-4xl mx-auto text-left relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-slate-800">
                  HEALTHSHIELD FEDERATED MESH (5 ACTIVE HOSPITAL NODES)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Zero Clinical Data Leaked (100% HIPAA/GDPR)
                </span>
              </div>
            </div>

            {/* 4 Live Stats in Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Hospital Nodes</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">5 Clients</span>
                <span className="text-[10px] text-cyan-600 font-medium">Decentralized Silos</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">IoMT Endpoints</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">248 Devices</span>
                <span className="text-[10px] text-blue-600 font-medium">Pumps, MRI, PACS</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Threat Accuracy</span>
                <span className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5 block">96.8%</span>
                <span className="text-[10px] text-emerald-700 font-medium">FedAvg Convergence</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Privacy Budget (ε)</span>
                <span className="text-xl font-extrabold text-purple-600 font-mono mt-0.5 block">ε = 1.0</span>
                <span className="text-[10px] text-purple-700 font-medium">Laplace Noise Calibrated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. THE PROBLEM VS THE HEALTHSHIELD SOLUTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700">
            Architectural Paradigm Shift
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Why Centralized AI Fails Healthcare Networks
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Traditional threat detection models require gathering all patient records in one cloud database—violating strict medical privacy mandates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vulnerable Centralized Way */}
          <div className="p-6 sm:p-8 rounded-3xl bg-red-50/50 border border-red-200/80 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-red-700 font-bold text-sm uppercase font-mono">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Traditional Centralized IDS (High Risk)</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Hospitals upload raw network logs, patient vitals, and device telemetry to a central third-party cloud.
            </p>

            <ul className="space-y-2 text-xs font-mono text-slate-700 pt-2 border-t border-red-200/60">
              <li className="flex items-center space-x-2 text-red-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Violates HIPAA & GDPR compliance laws</span>
              </li>
              <li className="flex items-center space-x-2 text-red-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Single point of data breach for patient records</span>
              </li>
              <li className="flex items-center space-x-2 text-red-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Massive bandwidth consumption transmitting raw telemetry</span>
              </li>
            </ul>
          </div>

          {/* Privacy-Preserving Federated Way */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-emerald-800 font-bold text-sm uppercase font-mono">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>HealthShield Federated Framework (Privacy Preserved)</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Clinical telemetry stays inside each hospital firewall. Only sanitized, encrypted mathematical weight gradients ($\Delta W$) are shared.
            </p>

            <ul className="space-y-2 text-xs font-mono text-slate-700 pt-2 border-t border-emerald-200/60">
              <li className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% HIPAA & GDPR patient data compliance</span>
              </li>
              <li className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Differential Privacy noise prevents model inversion attacks</span>
              </li>
              <li className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Minimal communication payload (&lt;140 KB per round)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. THE 4 CORE TECHNOLOGICAL PILLARS */}
      {/* ------------------------------------------------------------- */}
      <section id="pillars" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700">
              Core Technical Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Four Pillars of HealthShield AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              Combining decentralized machine learning, rigorous cryptographic guarantees, and ultra-fast generative AI reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">1. Federated Averaging (FedAvg)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hospitals train neural weights locally on private network logs. Gradients are aggregated globally using weighted FedAvg:
              </p>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-cyan-800 text-center font-semibold">
                W_(t+1) = Σ (n_k / N) · W_k
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">2. Differential Privacy (DP)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adds mathematically calibrated Laplace noise governed by privacy budget $\epsilon$, guaranteeing patient record unlinkability:
              </p>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-purple-800 text-center font-semibold">
                W' = W + Lap(Δf / ε)
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">3. Homomorphic Encryption</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paillier cryptosystem enables the central coordinator to sum model weights directly in the encrypted ciphertext domain:
              </p>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-emerald-800 text-center font-semibold">
                Enc(W_A) · Enc(W_B) = Enc(W_A+W_B)
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">4. Groq AI Threat Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Groq Llama-3.3-70B translates raw packet anomalies into actionable root causes, confidence scores, and clinical mitigations:
              </p>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-blue-800 text-center font-semibold">
                JSON Telemetry → Incident Report
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. INTERACTIVE FEDAVG PIPELINE OVERVIEW */}
      {/* ------------------------------------------------------------- */}
      <section id="pipeline" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700">
            Simulation Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            7-Step Decentralized Convergence Cycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Experience the automated federated round execution in the live simulation visualizer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {[
            { num: 1, title: 'Local Training', desc: '5 hospitals train on private IoMT logs' },
            { num: 2, title: 'Weight Extract', desc: 'Extract ΔW gradient matrices' },
            { num: 3, title: 'Privacy Shield', desc: 'Inject calibrated Laplace noise (ε)' },
            { num: 4, title: 'Cipher Mask', desc: 'Paillier Homomorphic Encryption' },
            { num: 5, title: 'FedAvg Fusion', desc: 'Central weighted mean aggregation' },
            { num: 6, title: 'Distribution', desc: 'Broadcast updated global model' },
            { num: 7, title: 'Convergence', desc: 'Accuracy reaches 96.8% global fidelity' }
          ].map((step) => (
            <div key={step.num} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 font-mono font-bold text-xs flex items-center justify-center">
                {step.num}
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-mono">{step.title}</h4>
              <p className="text-[11px] text-slate-500 leading-snug">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. 1-CLICK DEMO EVALUATION PROFILES */}
      {/* ------------------------------------------------------------- */}
      <section id="evaluation" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 to-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700">
              Viva & Project Demonstration Mode
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              1-Click Evaluation Profiles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              Select any pre-configured role below to log straight into the SecOps console and evaluate features instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Admin */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                  👩‍⚕️
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-mono">Administrator</h3>
                  <span className="text-[10px] text-blue-700 font-mono">admin@healthshield.ai</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full global oversight across all 5 hospitals, federated simulation triggers, and HIPAA audit trails.
              </p>
              <button
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <span>Login as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Security Analyst */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-2xl">
                  👨‍💻
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-mono">Security Analyst</h3>
                  <span className="text-[10px] text-cyan-700 font-mono">analyst@healthshield.ai</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time packet inspection, Groq AI threat classification, incident response, and active alerts.
              </p>
              <button
                onClick={() => handleQuickDemoLogin('ANALYST')}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <span>Login as Analyst</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hospital User */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">
                  🩺
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-mono">Hospital User</h3>
                  <span className="text-[10px] text-purple-700 font-mono">elena@metrogeneral.org</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Local node monitoring for Metropolitan General, inspecting local IoMT devices and privacy budgets.
              </p>
              <button
                onClick={() => handleQuickDemoLogin('HOSPITAL_USER')}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <span>Login as Hospital Node</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. ACADEMIC CITATION & FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer id="academic" className="bg-slate-900 text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white font-black text-base">
              <span>HealthShield AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Final Year Engineering College Project demonstrating Privacy-Preserving Cyber Threat Detection in Healthcare IoMT Systems using Federated Learning & Differential Privacy.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Base Paper: <em>"Advancing Federated Learning Frameworks for Cyber Threat Detection in Healthcare"</em>
            </div>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold uppercase text-[11px] mb-3">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-cyan-400 transition-colors">Register Account</Link></li>
              <li><a href="#pillars" className="hover:text-cyan-400 transition-colors">Differential Privacy</a></li>
              <li><a href="#pipeline" className="hover:text-cyan-400 transition-colors">FedAvg Algorithm</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold uppercase text-[11px] mb-3">SecOps Modules</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-500">Threat Detection AI</span></li>
              <li><span className="text-slate-500">Paillier Homomorphic Mask</span></li>
              <li><span className="text-slate-500">IoMT Device Inventory</span></li>
              <li><span className="text-slate-500">HIPAA Compliance Audit</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <span>© 2026 HealthShield AI • College Final Year Demonstration Platform</span>
          <span>Educational Simulation • Strictly Privacy Compliant</span>
        </div>
      </footer>
    </div>
  );
}
