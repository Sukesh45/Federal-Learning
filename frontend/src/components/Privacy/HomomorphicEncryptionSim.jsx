import React, { useState, useMemo } from 'react';
import {
  Lock,
  Unlock,
  Key,
  Server,
  Building2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { simulateHomomorphicEncryption } from '../../utils/privacyMath.js';

export default function HomomorphicEncryptionSim() {
  const [weights, setWeights] = useState([0.842, 0.791, 0.815, 0.860, 0.832]);
  const [activeStep, setActiveStep] = useState(3);

  const simulationResult = useMemo(() => {
    return simulateHomomorphicEncryption(weights);
  }, [weights]);

  const randomizeWeights = () => {
    const nextWeights = Array.from({ length: 5 }, () => Number((0.75 + Math.random() * 0.15).toFixed(3)));
    setWeights(nextWeights);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Educational Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-700 font-bold">
                Cryptographic Security Layer
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-semibold">
                Conceptual Homomorphic Encryption Demonstration
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Paillier Additive Homomorphic Encryption (HE) Aggregator
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Homomorphic Encryption allows the central server to aggregate model weight updates while they remain completely encrypted:
              <span className="font-mono text-cyan-800 font-bold ml-1">
                Enc(W_A) ⊗ Enc(W_B) = Enc(W_A + W_B)
              </span>.
              The cloud aggregator calculates the global threat model without ever learning any hospital's private parameters.
            </p>
          </div>

          <button
            onClick={randomizeWeights}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New Weights</span>
          </button>
        </div>

        {/* Cryptographic Key Parameters Box */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block font-semibold">Cryptosystem</span>
            <span className="text-purple-700 font-bold">{simulationResult.keyParameters.scheme.split(' ')[0]} HE</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block font-semibold">Public Modulus (N)</span>
            <span className="text-slate-900 font-bold">{simulationResult.keyParameters.modulus_N}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block font-semibold">Modulus Squared (N²)</span>
            <span className="text-cyan-700 font-bold">{simulationResult.keyParameters.modulus_N2}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block font-semibold">Generator (g)</span>
            <span className="text-emerald-700 font-bold">{simulationResult.keyParameters.generator_g}</span>
          </div>
        </div>
      </div>

      {/* Homomorphic Encryption Pipeline Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Local Plaintext Weights & Encryption */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-800 uppercase tracking-wider">
            <Lock className="w-4 h-4 text-cyan-700" />
            <span>1. Local Plaintext Encryption</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Each hospital encrypts its local model weight gradient using the public key $pk=(n, g)$.
          </p>

          <div className="space-y-2 mt-3 font-mono text-xs">
            {simulationResult.encryptedNodes.map((node, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{node.nodeId}</span>
                  <span className="text-cyan-700 font-semibold">W = {node.plaintextWeight}</span>
                </div>
                <div className="text-[10px] text-purple-700 flex items-center justify-between truncate">
                  <span className="font-medium">Ciphertext:</span>
                  <span className="bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-mono text-purple-800 font-semibold">
                    {node.ciphertext}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Server-Side Homomorphic Multiplication */}
        <div className="p-5 rounded-3xl bg-purple-50/50 border border-purple-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-purple-800 uppercase tracking-wider">
              <Server className="w-4 h-4 text-purple-700" />
              <span>2. Untrusted Server Aggregation</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              The aggregator computes the product of all ciphertexts modulo $N^2$. It holds <strong className="text-rose-600">zero secret keys</strong> and cannot read any hospital's parameters.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-white border border-purple-200 font-mono text-xs space-y-2 shadow-sm">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Homomorphic Operator:</div>
              <div className="text-purple-800 font-bold text-sm">
                C_agg = ∏ (C_i) mod N²
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-500 block font-semibold">Aggregated Ciphertext Output:</span>
                <span className="text-emerald-700 font-bold text-sm block mt-0.5">
                  {simulationResult.aggregatedCiphertext}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-100/70 border border-purple-200 text-[10px] font-mono text-purple-900 font-semibold">
            🔒 Mathematical Guarantee: Server processes encrypted gradients with zero plaintext visibility.
          </div>
        </div>

        {/* Step 3: Global Decryption & Model Update */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
              <Unlock className="w-4 h-4 text-emerald-700" />
              <span>3. Authorized Decryption</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              When received by the verified healthcare coordinator holding the private key $sk=(\lambda, \mu)$, the decrypted result equals the true global sum.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-3">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Decrypted Global Sum:</span>
                <span className="text-xl font-black text-slate-900">{simulationResult.decryptedSum}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Calculated Global Average:</span>
                <span className="text-xl font-black text-emerald-700">
                  {simulationResult.decryptedGlobalAverage}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] font-mono text-emerald-800 flex items-center space-x-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>Decrypted average matches true mathematical average of all 5 hospital gradients!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
