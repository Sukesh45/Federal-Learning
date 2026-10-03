import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Sparkles,
  Play,
  RotateCcw,
  Zap,
  Server,
  Building2,
  Cpu,
  Layers,
  FileText
} from 'lucide-react';
import ThreatResultCard from '../components/Threats/ThreatResultCard.jsx';
import SecurityReportModal from '../components/Reports/SecurityReportModal.jsx';
import { analyzeThreatAPI } from '../services/apiService.js';
import { saveThreatEvent } from '../services/threatService.js';
import { subscribeToHospitals } from '../services/hospitalService.js';
import { DEMO_PRESET_THREATS, ATTACK_TYPES, INITIAL_HOSPITALS } from '../utils/constants.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ThreatDetection() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [formData, setFormData] = useState({
    sourceIp: '185.220.101.5',
    destIp: '192.168.10.45',
    protocol: 'TCP',
    sourcePort: 44120,
    destPort: 8080,
    packets: 34200,
    bytes: 2450000,
    duration: 12,
    hospitalId: 'hosp-a',
    hospitalName: 'Hospital A (Metropolitan General)',
    affectedDevice: 'Smart Infusion Pump Gateway #12',
    description: 'Suspicious volumetric flow burst detected during night shift telemetry capture.'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToHospitals((list) => {
      if (list && list.length > 0) {
        setHospitals(list);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const activeHospitalList = (hospitals && hospitals.length > 0) ? hospitals : INITIAL_HOSPITALS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'hospitalId') {
      const h = activeHospitalList.find(item => item.id === value) || activeHospitalList[0];
      setFormData(prev => ({
        ...prev,
        hospitalId: value,
        hospitalName: h ? h.name : 'Hospital A'
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectPreset = (preset) => {
    setFormData({
      sourceIp: preset.sourceIp,
      destIp: preset.destIp,
      protocol: preset.protocol,
      sourcePort: preset.sourcePort,
      destPort: preset.destPort,
      packets: preset.packets,
      bytes: preset.bytes,
      duration: preset.duration,
      hospitalId: preset.hospitalId,
      hospitalName: preset.hospitalName,
      affectedDevice: preset.affectedDevice,
      description: preset.description
    });
    setAnalysisResult(null);
    addToast('Preset Loaded', `Loaded preset event: "${preset.label}"`, 'info');
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeThreatAPI(formData);
      setAnalysisResult(result);
      if (result.severity === 'Critical' || result.severity === 'High') {
        addToast(
          `🚨 ${result.severity} Threat Classified!`,
          `${result.attackType} detected on ${formData.affectedDevice || formData.destIp}.`,
          'critical'
        );
      } else {
        addToast('Analysis Complete', `Event classified as ${result.attackType} (${result.confidence}% confidence).`, 'success');
      }
    } catch (err) {
      addToast('Analysis Failed', err.message || 'Groq AI analysis error.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveThreat = async (fullThreatData) => {
    await saveThreatEvent(fullThreatData, user);
    addToast('Saved to Firestore', 'Threat record stored and active security alert dispatched.', 'success');
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              AI Intelligence Engine
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
              Groq Llama-3.3-70B / GPT-OSS 120B
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Cyber Threat Detection & Classification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Feed raw network flow features and IoMT equipment telemetry into the Groq AI intelligence layer. AI evaluates packet velocities, ports, and flow payloads to generate classification, confidence score, indicators, and clinical mitigations.
          </p>
        </div>
      </div>

      {/* Preset Quick Attack Scenarios Carousel */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-600">
          <span className="uppercase tracking-wider font-bold text-slate-800">⚡ Fast Evaluation Presets:</span>
          <span className="text-slate-500">Click any preset to auto-populate telemetry</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DEMO_PRESET_THREATS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyan-500 text-left transition-all group shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-700 block mb-1">
                  {p.label.split(' ')[0]} {p.label.split(' ')[1]}
                </span>
                <p className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 line-clamp-2 leading-snug">
                  {p.label}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-2 block truncate font-medium">
                {p.destIp}:{p.destPort} • {p.protocol}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Form & Result View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Network Telemetry Input Form */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center space-x-2">
            <Server className="w-4 h-4 text-cyan-700" />
            <span>Network Telemetry Input Parameters</span>
          </h3>

          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* IP Address Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Source IP Address
                </label>
                <input
                  type="text"
                  required
                  name="sourceIp"
                  value={formData.sourceIp}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="192.168.1.45"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Destination IP (Target)
                </label>
                <input
                  type="text"
                  required
                  name="destIp"
                  value={formData.destIp}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-cyan-300 focus:border-cyan-600 rounded-xl text-xs text-cyan-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="10.0.0.15"
                />
              </div>
            </div>

            {/* Ports & Protocol Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Protocol
                </label>
                <select
                  name="protocol"
                  value={formData.protocol}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-600"
                >
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                  <option value="ICMP">ICMP</option>
                  <option value="HTTP">HTTP/S</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Source Port
                </label>
                <input
                  type="number"
                  name="sourcePort"
                  value={formData.sourcePort}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="44120"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Dest Port
                </label>
                <input
                  type="number"
                  name="destPort"
                  value={formData.destPort}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="8080"
                />
              </div>
            </div>

            {/* Packet, Bytes, Duration Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Packets
                </label>
                <input
                  type="number"
                  name="packets"
                  value={formData.packets}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="34200"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Bytes
                </label>
                <input
                  type="number"
                  name="bytes"
                  value={formData.bytes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="2450000"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Duration (s)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="12.0"
                />
              </div>
            </div>

            {/* Hospital & Affected Device */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Target Hospital Node
                </label>
                <select
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-600"
                >
                  {activeHospitalList.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Affected IoMT Device
                </label>
                <input
                  type="text"
                  name="affectedDevice"
                  value={formData.affectedDevice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="Smart Infusion Pump Gateway #12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Groq AI Analyzing Threat Signatures...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Threat with Groq AI</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Result Card or Placeholder */}
        <div className="lg:col-span-6">
          {analysisResult ? (
            <ThreatResultCard
              result={analysisResult}
              networkEvent={formData}
              onSave={handleSaveThreat}
              onReset={handleReset}
              onOpenReport={() => setIsReportOpen(true)}
            />
          ) : (
            <div className="h-full min-h-[420px] p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-cyan-700 shadow-sm">
                <ShieldAlert className="w-12 h-12 animate-pulse text-cyan-600" />
              </div>
              <div className="max-w-sm">
                <h4 className="text-base font-bold text-slate-900">AI Threat Evaluation Awaiting</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Enter network telemetry on the left or choose a preset attack scenario, then click <strong className="text-cyan-800">"Analyze Threat with Groq AI"</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Report Modal */}
      <SecurityReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportScope={{
          hospitalName: formData.hospitalName,
          totalThreats: 1,
          criticalThreats: analysisResult?.severity === 'Critical' ? 1 : 0,
          highThreats: analysisResult?.severity === 'High' ? 1 : 0,
          topAttackTypes: [analysisResult?.attackType || 'DoS'],
          federatedRounds: 25,
          privacyMethod: 'Differential Privacy (ε=1.0) + Paillier Homomorphic Encryption',
          currentAccuracy: '96.8%'
        }}
      />
    </div>
  );
}
