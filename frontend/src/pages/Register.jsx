import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, Building2, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { INITIAL_HOSPITALS, USER_ROLES } from '../utils/constants.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(USER_ROLES.SECURITY_ANALYST);
  const [hospitalId, setHospitalId] = useState('hosp-a');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const hospitalObj = INITIAL_HOSPITALS.find(h => h.id === hospitalId) || INITIAL_HOSPITALS[0];

    try {
      await register({
        name,
        email,
        password,
        role,
        hospitalId,
        hospitalName: hospitalObj.name
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

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
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-white border border-slate-200 shadow-md mb-3">
            <img src="/healthshield_logo.svg" alt="HealthShield Logo" className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Register SecOps Account
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">
            HealthShield AI Hospital Collaborative Network
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  placeholder="Dr. Maya Patel"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
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
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  placeholder="maya.patel@hospital.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  User Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-900 font-mono"
                >
                  <option value={USER_ROLES.SECURITY_ANALYST}>Security Analyst</option>
                  <option value={USER_ROLES.ADMIN}>Administrator</option>
                  <option value={USER_ROLES.HOSPITAL_USER}>Hospital User</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Affiliated Hospital
                </label>
                <select
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl text-xs text-slate-900 font-mono"
                >
                  {INITIAL_HOSPITALS.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name.split(' ')[0]} {h.name.split(' ')[1]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Registering Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-700 font-bold hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
