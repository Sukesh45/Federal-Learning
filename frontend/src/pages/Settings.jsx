import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bot,
  Database,
  Bell,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { checkBackendHealth } from '../services/apiService.js';
import { resetDatabase } from '../services/firestoreStore.js';
import { INITIAL_HOSPITALS } from '../utils/constants.js';

export default function Settings() {
  const { user, updateProfileData, switchDemoRole } = useAuth();
  const { addToast } = useNotifications();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [hospitalId, setHospitalId] = useState(user?.hospitalId || 'hosp-a');
  const [backendStatus, setBackendStatus] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    checkBackendHealth().then(setBackendStatus);
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setHospitalId(user.hospitalId || 'hosp-a');
    }
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const h = INITIAL_HOSPITALS.find(item => item.id === hospitalId) || INITIAL_HOSPITALS[0];
    updateProfileData({
      name,
      email,
      hospitalId,
      hospitalName: h.name
    });
    addToast('Profile Saved', 'User profile information updated.', 'success');
  };

  const handleResetData = async () => {
    if (confirm('Reset all demo collections back to default factory state?')) {
      setIsResetting(true);
      await resetDatabase();
      setTimeout(() => {
        setIsResetting(false);
        addToast('Database Reset', 'Initialized 5 hospitals and baseline threat telemetry.', 'success');
      }, 500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto font-sans">
      {/* Page Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              System Configuration
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
              SecOps Preferences
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Settings & Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Manage user SecOps profile, monitor AI and database connectivity, and configure application simulation settings.
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center space-x-2">
          <User className="w-4 h-4 text-cyan-700" />
          <span>Operator Profile</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                Assigned Role
              </label>
              <input
                type="text"
                readOnly
                value={user?.role || 'Security Analyst'}
                className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-cyan-800 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                Primary Hospital Node
              </label>
              <select
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
              >
                {INITIAL_HOSPITALS.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-sm"
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* AI & Backend Status */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center space-x-2">
          <Bot className="w-4 h-4 text-purple-700" />
          <span>AI & Cloud Intelligence Layer</span>
        </h3>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">AI Provider:</span>
            <span className="text-cyan-800 font-bold">{backendStatus?.aiEngine?.provider || 'Groq Cloud / Local Fallback'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Active Model:</span>
            <span className="text-purple-800 font-bold">{backendStatus?.aiEngine?.model || 'llama-3.3-70b-versatile'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Groq API Key Configured:</span>
            <span className={backendStatus?.aiEngine?.isGroqConfigured ? 'text-emerald-700 font-bold' : 'text-cyan-800 font-semibold'}>
              {backendStatus?.aiEngine?.isGroqConfigured ? '✓ Yes (Live Groq Cloud Active)' : 'ℹ️ Heuristic Mode Active (No Key Needed for Demo)'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Backend Server Status:</span>
            <span className="text-emerald-700 font-bold">✓ Operational (Port 5000)</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
          Important Disclaimer: Groq AI is used as the AI threat analysis and explanation layer in this educational application. It is not itself the federated-learning algorithm.
        </p>
      </div>

      {/* Database Reset & Demo Data Controls */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center space-x-2">
          <Database className="w-4 h-4 text-amber-700" />
          <span>Demo Data Management</span>
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          Reset all collections back to the pristine 5-hospital demo state (including sample threats, alerts, federated rounds, and benchmark experiment logs).
        </p>

        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-mono font-bold transition-all flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Resetting Data...' : 'Reset to Default Demo Data'}</span>
        </button>
      </div>
    </div>
  );
}
