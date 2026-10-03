import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  TrendingDown,
  Info,
  HelpCircle
} from 'lucide-react';
import { applyDifferentialPrivacyToWeights, getPrivacyAccuracyCurve } from '../../utils/privacyMath.js';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function DifferentialPrivacySim() {
  const [epsilon, setEpsilon] = useState(1.0);
  const [mechanism, setMechanism] = useState('laplace');
  const [sampleWeights, setSampleWeights] = useState([0.8420, -0.4150, 0.1290, 0.9520, -0.2800]);
  const [perturbationSeed, setPerturbationSeed] = useState(0);

  // Compute perturbed values reactively
  const perturbedResults = useMemo(() => {
    return applyDifferentialPrivacyToWeights(sampleWeights, epsilon, mechanism);
  }, [sampleWeights, epsilon, mechanism, perturbationSeed]);

  const curveData = useMemo(() => getPrivacyAccuracyCurve(), []);

  const randomizeWeights = () => {
    const newW = Array.from({ length: 5 }, () => Number((Math.random() * 2 - 1).toFixed(4)));
    setSampleWeights(newW);
    setPerturbationSeed(prev => prev + 1);
  };

  const recomputeNoise = () => {
    setPerturbationSeed(prev => prev + 1);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Educational Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
                Privacy Preservation Engine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                Educational Simulation
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Differential Privacy (DP) Noise Perturbation Simulator
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Differential Privacy prevents model inversion and membership inference attacks by injecting calibrated mathematical noise (Laplace or Gaussian) into local neural network gradients before sharing with the central aggregator.
            </p>
          </div>

          <button
            onClick={recomputeNoise}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Apply DP Noise</span>
          </button>
        </div>

        {/* Interactive Controls Bar */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Epsilon Slider */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="font-bold text-slate-900 flex items-center space-x-1.5">
                <span>Privacy Budget (ε):</span>
                <span className="text-cyan-700 text-base font-black">{epsilon.toFixed(2)}</span>
              </label>
              <span className="text-[11px] text-slate-500 font-semibold">
                {epsilon <= 0.5 ? '🛡️ Extreme Privacy' : epsilon <= 1.5 ? '⚖️ Balanced Privacy & Utility' : '⚡ High Accuracy / Lower Privacy'}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 font-medium">
              <span>0.1 (Strict Confidentiality)</span>
              <span>1.0 (Standard Healthcare Setting)</span>
              <span>5.0 (High Utility)</span>
            </div>
          </div>

          {/* Noise Mechanism Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-900 block">
              Noise Mechanism:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMechanism('laplace')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold border transition-all ${
                  mechanism === 'laplace'
                    ? 'bg-cyan-50 border-cyan-500 text-cyan-800 shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                Laplace Lap(b)
              </button>
              <button
                onClick={() => setMechanism('gaussian')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold border transition-all ${
                  mechanism === 'gaussian'
                    ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                Gaussian N(0, σ²)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Model Weights Perturbation Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-mono">
              Live Model Gradient Vector Transformation
            </h3>
            <p className="text-[11px] text-slate-500">
              Inspecting 5 sample neural network weight parameters before and after perturbation
            </p>
          </div>
          <button
            onClick={randomizeWeights}
            className="text-[11px] font-mono font-semibold text-cyan-700 hover:underline"
          >
            Randomize Weights
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Parameter ID</th>
                <th className="py-3 px-4">Original Weight (W)</th>
                <th className="py-3 px-4">Calibrated Noise (δ)</th>
                <th className="py-3 px-4">Private Shared Weight (W')</th>
                <th className="py-3 px-4">Privacy Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {perturbedResults.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-cyan-800">
                    Grad_Layer3.w[{idx}]
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-medium">
                    {item.original >= 0 ? `+${item.original.toFixed(4)}` : item.original.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    <span className={item.noise >= 0 ? 'text-amber-700' : 'text-rose-700'}>
                      {item.noise >= 0 ? `+${item.noise.toFixed(4)}` : item.noise.toFixed(4)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {item.perturbed >= 0 ? `+${item.perturbed.toFixed(4)}` : item.perturbed.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      Protected (ε={epsilon})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy vs Performance Tradeoff Curve Chart */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-mono">
              Theoretical Privacy vs. Model Accuracy Tradeoff Curve
            </h3>
            <p className="text-[11px] text-slate-500">
              Visualizing how changing the privacy budget ε impacts detection accuracy vs leakage resistance
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono font-semibold">
            <span className="text-cyan-700 flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
              <span>Threat Detection Accuracy (%)</span>
            </span>
            <span className="text-emerald-700 flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Privacy Strength (%)</span>
            </span>
          </div>
        </div>

        <div className="w-full h-64 min-h-[260px]">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={curveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="epsilon" stroke="#64748b" fontSize={11} fontFamily="monospace" label={{ value: 'Privacy Budget ε', position: 'insideBottomRight', offset: -5, fill: '#64748b' }} />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" domain={[60, 100]} />
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
              <Line type="monotone" dataKey="accuracy" stroke="#0284c7" strokeWidth={2.5} dot={{ fill: '#0284c7', r: 4 }} />
              <Line type="monotone" dataKey="privacyStrength" stroke="#059669" strokeWidth={2.5} strokeDasharray="4 4" dot={{ fill: '#059669', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
