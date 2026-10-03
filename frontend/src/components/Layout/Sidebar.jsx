import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Database,
  ShieldAlert,
  Cpu,
  Lock,
  FlaskConical,
  Bell,
  Bot,
  ScrollText,
  FileCode2,
  Info,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/hospitals', label: 'Hospitals', icon: Building2 },
  { path: '/datasets', label: 'Dataset Management', icon: Database },
  { path: '/threat-detection', label: 'Threat Detection', icon: ShieldAlert, badge: 'AI' },
  { path: '/federated-simulation', label: 'Federated Simulation', icon: Cpu, badge: 'FedAvg' },
  { path: '/privacy', label: 'Privacy & Security', icon: Lock, badge: 'DP / HE' },
  { path: '/experiments', label: 'Experiments', icon: FlaskConical },
  { path: '/alerts', label: 'Threat Alerts', icon: Bell, isAlertBadge: true },
  { path: '/assistant', label: 'AI Security Assistant', icon: Bot, badge: 'Groq' },
  { path: '/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { path: '/base-paper', label: 'Base Paper', icon: FileCode2 },
  { path: '/about', label: 'About Project', icon: Info },
  { path: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, switchDemoRole } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src="/healthshield_logo.svg" alt="HealthShield Logo" className="w-9 h-9" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  HealthShield
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-tight truncate max-w-[170px]">
                Privacy-Preserving IoMT SecOps
              </p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Security Core
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.isAlertBadge && unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-rose-500 text-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-100 text-cyan-700 border border-slate-200 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Demo Switcher */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/80">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-base">
                {user?.avatar || '👤'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Security User'}</p>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono text-cyan-700 truncate font-semibold">{user?.role || 'Analyst'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Demo Switcher Buttons */}
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
            <span>Switch Role:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => switchDemoRole('ADMIN')}
                className="px-1.5 py-0.5 rounded bg-slate-200/80 hover:bg-slate-900 hover:text-white transition-colors font-medium text-slate-700"
                title="Switch to Admin"
              >
                Admin
              </button>
              <button
                onClick={() => switchDemoRole('ANALYST')}
                className="px-1.5 py-0.5 rounded bg-slate-200/80 hover:bg-cyan-700 hover:text-white transition-colors font-medium text-slate-700"
                title="Switch to Analyst"
              >
                Analyst
              </button>
              <button
                onClick={() => switchDemoRole('HOSPITAL_USER')}
                className="px-1.5 py-0.5 rounded bg-slate-200/80 hover:bg-purple-700 hover:text-white transition-colors font-medium text-slate-700"
                title="Switch to Hospital User"
              >
                Hospital
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
