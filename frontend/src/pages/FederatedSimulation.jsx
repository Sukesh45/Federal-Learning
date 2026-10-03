import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Building2,
  Server,
  Activity,
  Zap,
  TrendingUp
} from 'lucide-react';
import FederatedWorkflowVisualizer from '../components/Federated/FederatedWorkflowVisualizer.jsx';
import { subscribeToFederatedRounds, executeFederatedSimulationRound } from '../services/federatedService.js';
import { subscribeToHospitals } from '../services/hospitalService.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import confetti from 'canvas-confetti';

export default function FederatedSimulation() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [rounds, setRounds] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  // Simulation controls
  const [roundTarget, setRoundTarget] = useState(5);
  const [privacyEnabled, setPrivacyEnabled] = useState(true);
  const [privacyMethod, setPrivacyMethod] = useState('Differential Privacy (ε=1.0) + Additive HE');
  const [epsilon, setEpsilon] = useState(1.0);

  const [isSimulating, setIsSimulating] = useState(false);
  const [currentSimStep, setCurrentSimStep] = useState(0);
  const [activeStepData, setActiveStepData] = useState(null);

  useEffect(() => {
    const unsubRounds = subscribeToFederatedRounds(setRounds);
    const unsubHosp = subscribeToHospitals(setHospitals);
    return () => {
      unsubRounds();
      unsubHosp();
    };
  }, []);

  const handleStartSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const latestRoundNum = rounds.length > 0 ? Number(rounds[rounds.length - 1].roundNumber || 0) : 0;
    const nextRoundNum = latestRoundNum + 1;

    try {
      addToast('Federated Round Started', `Initiating FedAvg Round #${nextRoundNum} across 5 hospitals.`, 'info');

      const completedRound = await executeFederatedSimulationRound({
        currentRound: nextRoundNum,
        privacyEnabled,
        privacyMethod,
        epsilon,
        hospitals,
        onStepUpdate: (stepInfo) => {
          setCurrentSimStep(stepInfo.step);
          setActiveStepData(stepInfo);
        }
      }, user);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      addToast(
        `Round #${nextRoundNum} Completed!`,
        `Global Model Accuracy converged to ${completedRound.accuracy}% (Loss: ${completedRound.loss}).`,
        'success'
      );
    } catch (err) {
      addToast('Simulation Error', err.message, 'error');
    } finally {
      setIsSimulating(false);
      setCurrentSimStep(0);
      setActiveStepData(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              Decentralized Intelligence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
              Federated Learning Workflow Simulation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Federated Learning Simulation (FedAvg)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Visualizes decentralized collaborative cyber-threat training. Five hospital edge clients independently compute gradient updates ($\Delta W$), apply Differential Privacy noise and Homomorphic Encryption masks, and dispatch weights to the central FedAvg aggregator.
          </p>
        </div>

        {/* Start Round Button */}
        <button
          onClick={handleStartSimulation}
          disabled={isSimulating}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Simulating FedAvg Round...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start Federated Round</span>
            </>
          )}
        </button>
      </div>

      {/* Simulation Configuration Controls */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <label className="block text-slate-700 font-semibold uppercase text-[10px] mb-1">
            Rounds Preset
          </label>
          <select
            value={roundTarget}
            onChange={(e) => setRoundTarget(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-slate-900 font-mono focus:outline-none"
          >
            <option value={5}>5 Rounds</option>
            <option value={10}>10 Rounds</option>
            <option value={20}>20 Rounds</option>
            <option value={50}>50 Rounds</option>
            <option value={100}>100 Rounds</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold uppercase text-[10px] mb-1">
            Participating Hospitals
          </label>
          <input
            type="text"
            readOnly
            value="5 Clients (Hospitals A - E)"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-cyan-800 font-bold font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold uppercase text-[10px] mb-1">
            Privacy Preservation Mode
          </label>
          <select
            value={privacyEnabled ? 'enabled' : 'disabled'}
            onChange={(e) => setPrivacyEnabled(e.target.value === 'enabled')}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-slate-900 font-mono focus:outline-none"
          >
            <option value="enabled">Privacy Enabled (DP + HE)</option>
            <option value="disabled">Privacy Disabled (Baseline FL)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold uppercase text-[10px] mb-1">
            Privacy Budget (ε)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="5.0"
            disabled={!privacyEnabled}
            value={epsilon}
            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-slate-900 font-mono disabled:opacity-40 focus:outline-none"
          />
        </div>
      </div>

      {/* 7-Step Interactive Visualizer Workflow */}
      <FederatedWorkflowVisualizer
        currentStep={currentSimStep}
        activeStepData={activeStepData}
        hospitals={hospitals}
        isSimulating={isSimulating}
      />

      {/* Model Convergence Charts & Round History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Convergence Chart (Accuracy & Loss) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">
                  Model Convergence History
                </h3>
                <p className="text-[11px] text-slate-500">
                  Global Threat Detection Accuracy vs. Categorical Cross-Entropy Loss
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                {rounds.length} Iterations Logged
              </span>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rounds} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="roundNumber" stroke="#64748b" fontSize={11} fontFamily="monospace" label={{ value: 'Round #', position: 'insideBottomRight', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" domain={[80, 100]} />
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
                  <Line type="monotone" dataKey="accuracy" stroke="#0284c7" name="Accuracy (%)" strokeWidth={2.5} dot={{ fill: '#0284c7', r: 4 }} />
                  <Line type="monotone" dataKey="f1Score" stroke="#059669" name="F1-Score (%)" strokeWidth={2} strokeDasharray="3 3" dot={{ fill: '#059669', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Completed Rounds History Table */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider mb-3">
              Federated Rounds Log
            </h3>

            <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar font-mono text-xs">
              {rounds.map((r, i) => (
                <div
                  key={r.id || i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-cyan-800">Round #{r.roundNumber}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                        {r.participatingHospitals} Clients
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                      Loss: {r.loss} • Overhead: {r.communicationOverhead}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-700 font-bold block">{r.accuracy}% Acc</span>
                    <span className="text-[10px] text-slate-500 font-semibold">F1: {r.f1Score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-500 font-medium">
            Educational FedAvg parameter aggregation simulation.
          </div>
        </div>
      </div>
    </div>
  );
}
