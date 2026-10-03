import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Cpu,
  Database,
  ShieldAlert,
  ArrowRight,
  Activity,
  Wifi,
  ShieldCheck,
  Lock,
  Layers
} from 'lucide-react';
import { subscribeToHospitals } from '../services/hospitalService.js';
import { formatNumber } from '../utils/formatters.js';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeToHospitals(setHospitals);
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              Institutional Network
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
              5 Federated Clients
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Simulated Healthcare Institutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Each hospital operates as an autonomous edge client in the federated network. Raw electronic health records (EHR) and biomedical device telemetry remain securely quarantined inside local hospital subnets.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-semibold text-emerald-800 shadow-sm">
          <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>All 5 Clients Synced (FedAvg Protocol)</span>
        </div>
      </div>

      {/* 5 Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital, idx) => {
          const colorVariants = [
            'border-slate-200 hover:border-cyan-500 hover:shadow-md',
            'border-slate-200 hover:border-blue-500 hover:shadow-md',
            'border-slate-200 hover:border-purple-500 hover:shadow-md',
            'border-slate-200 hover:border-pink-500 hover:shadow-md',
            'border-slate-200 hover:border-amber-500 hover:shadow-md'
          ];
          const borderStyle = colorVariants[idx % colorVariants.length];

          return (
            <div
              key={hospital.id}
              onClick={() => navigate(`/hospitals/${hospital.id}`)}
              className={`p-6 rounded-3xl bg-white border ${borderStyle} shadow-sm transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group`}
            >
              <div>
                {/* Header: Code & Online Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-cyan-800 border border-slate-200 font-bold">
                    {hospital.hospitalCode}
                  </span>
                  <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{hospital.status}</span>
                  </div>
                </div>

                {/* Hospital Name & Location */}
                <div className="mt-4">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-cyan-700 transition-colors tracking-tight">
                    {hospital.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono flex items-center space-x-1 font-medium">
                    <span>📍</span>
                    <span>{hospital.location}</span>
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                    <span className="text-slate-500 text-[10px] uppercase block font-semibold">IoMT Devices</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block flex items-center space-x-1.5">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span>{hospital.deviceCount}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                    <span className="text-slate-500 text-[10px] uppercase block font-semibold">Flow Records</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block flex items-center space-x-1.5">
                      <Database className="w-4 h-4 text-purple-600" />
                      <span>{formatNumber(hospital.dataRecords)}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-sm">
                    <span className="text-rose-700 text-[10px] uppercase block font-semibold">Threats Detected</span>
                    <span className="text-lg font-black text-rose-700 mt-0.5 block flex items-center space-x-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>{hospital.threatCount}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-sm">
                    <span className="text-emerald-700 text-[10px] uppercase block font-semibold">Local Accuracy</span>
                    <span className="text-lg font-black text-emerald-700 mt-0.5 block flex items-center space-x-1.5">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>{hospital.localModelAccuracy || 96.5}%</span>
                    </span>
                  </div>
                </div>

                {/* Subnet & Privacy Tag */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600 font-medium">
                  <span>Subnet: <strong className="text-slate-900">{hospital.ipSubnet}</strong></span>
                  <span className="text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    ε={hospital.privacyBudgetUsed || 1.0}
                  </span>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-cyan-700 group-hover:text-cyan-600">
                <span>View Node Security Profile</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
