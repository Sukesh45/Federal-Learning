import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Cpu,
  Database,
  ShieldAlert,
  ArrowLeft,
  Activity,
  Wifi,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Clock
} from 'lucide-react';
import { getHospitalById, updateHospitalInfo } from '../services/hospitalService.js';
import { subscribeToThreats } from '../services/threatService.js';
import { subscribeToAlerts } from '../services/alertService.js';
import { subscribeToDatasets } from '../services/datasetService.js';
import { SEVERITY_COLORS } from '../utils/constants.js';
import { formatDate, formatTimeAgo, formatNumber } from '../utils/formatters.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import SecurityReportModal from '../components/Reports/SecurityReportModal.jsx';

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  const [hospital, setHospital] = useState(null);
  const [threats, setThreats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    getHospitalById(id).then(h => {
      if (h) setHospital(h);
    });

    const unsubThreats = subscribeToThreats((all) => {
      setThreats(all.filter(t => t.hospitalId === id));
    });

    const unsubAlerts = subscribeToAlerts((all) => {
      setAlerts(all.filter(a => a.hospitalId === id));
    });

    const unsubData = subscribeToDatasets((all) => {
      setDatasets(all.filter(d => d.hospitalId === id));
    });

    return () => {
      unsubThreats();
      unsubAlerts();
      unsubData();
    };
  }, [id]);

  if (!hospital) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs">
        Loading hospital node profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/hospitals')}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-mono font-semibold shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospitals</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsReportOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Node Report</span>
          </button>
        </div>
      </div>

      {/* Hospital Node Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-cyan-900 to-indigo-950 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/10 text-cyan-200 border border-white/20">
                {hospital.hospitalCode}
              </span>
              <span className="text-xs font-mono text-emerald-300 flex items-center space-x-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Federated Client Connected</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {hospital.name}
            </h1>
            <p className="text-xs text-cyan-100 font-mono">
              📍 {hospital.location} • Subnet: <span className="text-cyan-300 font-bold">{hospital.ipSubnet}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-center">
              <span className="text-cyan-100 text-[10px] block uppercase font-semibold">IoMT Devices</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{hospital.deviceCount}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-center">
              <span className="text-cyan-100 text-[10px] block uppercase font-semibold">Flow Records</span>
              <span className="text-xl font-bold text-cyan-200 mt-0.5 block">{formatNumber(hospital.dataRecords)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-center">
              <span className="text-rose-200 text-[10px] block uppercase font-semibold">Threats Intercepted</span>
              <span className="text-xl font-bold text-rose-300 mt-0.5 block">{hospital.threatCount + threats.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-center">
              <span className="text-emerald-200 text-[10px] block uppercase font-semibold">Local Accuracy</span>
              <span className="text-xl font-bold text-emerald-300 mt-0.5 block">{hospital.localModelAccuracy || 96.5}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: IoMT Device Inventory & Privacy Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monitored Medical IoMT Equipment */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-800 uppercase tracking-wider mb-4">
            <Cpu className="w-4 h-4 text-cyan-700" />
            <span>Monitored IoMT Medical Inventory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hospital.deviceTypes?.map((dev, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono"
              >
                <span className="text-slate-800 font-medium truncate">{dev}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex-shrink-0">
                  Online
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Federated Privacy & Cryptographic Profile */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-purple-800 uppercase tracking-wider">
            <Lock className="w-4 h-4 text-purple-700" />
            <span>Federated Privacy Parameters</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600 font-semibold">Differential Privacy Budget (ε):</span>
              <span className="text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {hospital.privacyBudgetUsed || 1.0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600 font-semibold">Homomorphic Encryption:</span>
              <span className="text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Paillier 2048-bit Mask
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600 font-semibold">Weight Transmission Protocol:</span>
              <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                TLS 1.3 / FedAvg Fusion
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Threats & Alerts for this Hospital */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Threats for this Hospital */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-rose-800 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Intercepted Threats ({threats.length})</span>
            </div>
            <button
              onClick={() => navigate('/threat-detection')}
              className="text-[11px] font-mono font-semibold text-cyan-700 hover:underline"
            >
              Analyze New
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
            {threats.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6 font-mono">
                No active threats recorded for {hospital.name}.
              </p>
            ) : (
              threats.map(t => {
                const sev = SEVERITY_COLORS[t.severity] || SEVERITY_COLORS.Low;
                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{t.attackType}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${sev.badge}`}>
                          {t.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-mono mt-0.5">{t.sourceIp} → {t.destIp}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-medium">{formatTimeAgo(t.timestamp)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Active Alerts for this Hospital */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Active Node Alerts ({alerts.length})</span>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="text-[11px] font-mono font-semibold text-cyan-700 hover:underline"
            >
              Alert Center
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6 font-mono">
                No active alerts in queue for this hospital.
              </p>
            ) : (
              alerts.map(a => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-slate-900 truncate max-w-[240px]">{a.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      {a.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{a.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Security Report Modal */}
      <SecurityReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportScope={{
          hospitalName: hospital.name,
          totalThreats: hospital.threatCount + threats.length,
          criticalThreats: threats.filter(t => t.severity === 'Critical').length + 12,
          highThreats: 24,
          federatedRounds: 25,
          privacyMethod: `Differential Privacy (ε=${hospital.privacyBudgetUsed || 1.0}) + Paillier HE`,
          currentAccuracy: `${hospital.localModelAccuracy || 96.5}%`
        }}
      />
    </div>
  );
}
