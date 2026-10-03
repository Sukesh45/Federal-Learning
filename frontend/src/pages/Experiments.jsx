import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Play,
  Activity,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Lock,
  Layers,
  Sparkles,
  BarChart3,
  Clock,
  HardDrive
} from 'lucide-react';
import { subscribeToExperiments, runComparativeExperimentSimulation } from '../services/experimentService.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import confetti from 'canvas-confetti';

export default function Experiments() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [experiments, setExperiments] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [customEpsilon, setCustomEpsilon] = useState(1.0);
  const [rounds, setRounds] = useState(25);

  useEffect(() => {
    const unsub = subscribeToExperiments(setExperiments);
    return () => unsub();
  }, []);

  const handleRunExperiments = async () => {
    setIsRunning(true);
    try {
      addToast('Benchmark Suite Started', 'Simulating 4 architecture configurations...', 'info');
      await runComparativeExperimentSimulation({
        customEpsilon,
        rounds,
        customName: `Run #${Date.now().toString().slice(-4)}`
      }, user);

      confetti({ particleCount: 50, spread: 60 });
      addToast('Benchmark Completed', '4 architectural benchmark runs generated and saved.', 'success');
    } catch (err) {
      addToast('Error', err.message, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  // Get latest 4 benchmark configurations for comparison charts
  const latestFour = experiments.slice(0, 4);

  const accuracyData = latestFour.map(exp => ({
    name: exp.privacyMethod.split('(')[0].trim(),
    fullName: exp.experimentName,
    accuracy: exp.accuracy,
    f1Score: exp.f1Score,
    precision: exp.precision,
    recall: exp.recall,
    latency: exp.latency,
    overhead: exp.communicationOverhead
  }));

  const barColors = ['#0284c7', '#2563eb', '#7c3aed', '#059669'];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              Empirical Benchmarks
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
              Simulated Demo Metrics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Comparative Architecture Experiments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Evaluates the trade-offs between Baseline Federated Learning (FedAvg), Differential Privacy (DP-FedAvg), Homomorphic Encryption (HE-FedAvg), and the Proposed Hybrid Architecture across IoMT intrusion detection accuracy, latency, and communication overhead.
          </p>
        </div>

        {/* Run Simulation Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunExperiments}
            disabled={isRunning}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Simulating Benchmarks...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Simulation Suite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestFour.map((exp, idx) => {
          const colors = [
            'text-cyan-800',
            'text-blue-800',
            'text-purple-800',
            'text-emerald-800'
          ];
          const colorClass = colors[idx % colors.length];

          return (
            <div
              key={exp.id || idx}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-cyan-400 hover:shadow-md transition-all"
            >
              <div>
                <span className={`text-[10px] font-mono font-bold uppercase block ${colorClass}`}>
                  Configuration #{idx + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                  {exp.experimentName.split('-')[0]}
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {exp.privacyDescription}
                </p>

                {/* Key Metrics Mini Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[9px] uppercase block font-semibold">Accuracy</span>
                    <span className="text-base font-black text-slate-900 block">{exp.accuracy}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[9px] uppercase block font-semibold">F1-Score</span>
                    <span className="text-base font-black text-cyan-800 block">{exp.f1Score}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[9px] uppercase block font-semibold">Latency</span>
                    <span className="text-xs font-bold text-slate-800 block">{exp.latency} ms</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[9px] uppercase block font-semibold">Overhead</span>
                    <span className="text-xs font-bold text-slate-800 block">{exp.communicationOverhead} KB</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500 flex items-center justify-between font-medium">
                <span>Privacy Risk:</span>
                <span className="text-cyan-800 font-bold">{exp.privacyLeakageRisk.split('(')[0]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Accuracy & F1-Score Comparison Bar Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">
                  Accuracy & F1-Score Comparison
                </h3>
                <p className="text-[11px] text-slate-500">
                  Performance across 4 federated architectures
                </p>
              </div>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" domain={[85, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={32} />
                  <Bar dataKey="accuracy" name="Accuracy (%)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="f1Score" name="F1-Score (%)" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Latency & Overhead Comparison */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">
                  Communication Overhead (KB) & Latency (ms)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Computational cost of cryptographic homomorphic encryption
                </p>
              </div>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={32} />
                  <Bar dataKey="latency" name="Inference Latency (ms)" fill="#d97706" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overhead" name="Overhead (KB/round)" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
