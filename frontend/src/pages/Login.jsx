import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { DEMO_USERS } from '../services/authService.js';

export default function Login() {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@healthshield.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid login credentials. Try 1-click demo accounts below.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleKey) => {
    setError('');
    setLoading(true);
    try {
      const demoUser = DEMO_USERS[roleKey];
      await login(demoUser.email, 'password123');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Back to landing link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-mono font-semibold text-slate-600 hover:text-cyan-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
        <span className="text-[11px] font-mono text-slate-400">HealthShield AI</span>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-white border border-slate-200 shadow-md mb-3">
            <img src="/healthshield_logo.svg" alt="HealthShield Logo" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center justify-center space-x-2">
            <span>HealthShield</span>
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-mono">
            Privacy-Preserving Cyber Threat Detection in Healthcare
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <h2 className="text-lg font-bold text-slate-900 mb-1">SecOps Sign In</h2>
          <p className="text-xs text-slate-500 mb-6">
            Enter credentials or select a 1-click evaluation profile.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1.5 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                  placeholder="admin@healthshield.ai"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-mono text-slate-700 uppercase font-semibold">
                  Password
                </label>
                <span className="text-[11px] text-cyan-700 hover:underline cursor-pointer font-medium">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Evaluation Profiles */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-[11px] font-mono text-slate-500 text-center uppercase tracking-wider mb-3 font-semibold">
              ⚡ 1-Click Demo Evaluation Profiles
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-center transition-all group"
              >
                <span className="text-base block mb-0.5">👩‍⚕️</span>
                <span className="text-[11px] font-mono font-bold text-slate-800 group-hover:text-blue-700 block">Admin</span>
                <span className="text-[9px] text-slate-500 block truncate">Global SecOps</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ANALYST')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-center transition-all group"
              >
                <span className="text-base block mb-0.5">👨‍💻</span>
                <span className="text-[11px] font-mono font-bold text-slate-800 group-hover:text-cyan-700 block">Analyst</span>
                <span className="text-[9px] text-slate-500 block truncate">Threat Monitor</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('HOSPITAL_USER')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-center transition-all group"
              >
                <span className="text-base block mb-0.5">🩺</span>
                <span className="text-[11px] font-mono font-bold text-slate-800 group-hover:text-purple-700 block">Hospital</span>
                <span className="text-[9px] text-slate-500 block truncate">Local Node</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-700 font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>

        {/* Academic Note */}
        <p className="text-[11px] text-center text-slate-500 mt-6 font-mono">
          Final Year Engineering Project Demonstration • HealthShield AI
        </p>
      </div>
    </div>
  );
}
