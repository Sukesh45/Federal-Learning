import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  RefreshCw,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldAlert,
  Database,
  ExternalLink,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { resetDatabase, getCollectionItems } from '../../services/firestoreStore.js';
import { checkBackendHealth } from '../../services/apiService.js';
import { formatDate } from '../../utils/formatters.js';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { activeAlerts, unreadCount, addToast } = useNotifications();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [aiStatus, setAiStatus] = useState({ isGroqConfigured: false, model: 'Checking...' });

  const alertDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    checkBackendHealth().then(data => {
      if (data?.aiEngine) {
        setAiStatus(data.aiEngine);
      }
    });
  }, []);

  // Close alert dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (alertDropdownRef.current && !alertDropdownRef.current.contains(event.target)) {
        setShowAlertMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global search implementation
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    const q = query.toLowerCase().trim();

    try {
      const [hospitals, threats, alerts, datasets] = await Promise.all([
        getCollectionItems('hospitals'),
        getCollectionItems('threats'),
        getCollectionItems('alerts'),
        getCollectionItems('datasets')
      ]);

      const matchedHospitals = hospitals.filter(h =>
        h.name?.toLowerCase().includes(q) || h.hospitalCode?.toLowerCase().includes(q) || h.location?.toLowerCase().includes(q)
      );

      const matchedThreats = threats.filter(t =>
        t.attackType?.toLowerCase().includes(q) ||
        t.sourceIp?.toLowerCase().includes(q) ||
        t.destIp?.toLowerCase().includes(q) ||
        t.affectedDevice?.toLowerCase().includes(q) ||
        t.severity?.toLowerCase().includes(q)
      );

      const matchedAlerts = alerts.filter(a =>
        a.title?.toLowerCase().includes(q) || a.message?.toLowerCase().includes(q)
      );

      const matchedDatasets = datasets.filter(d =>
        d.name?.toLowerCase().includes(q) || d.fileName?.toLowerCase().includes(q)
      );

      setSearchResults({
        hospitals: matchedHospitals,
        threats: matchedThreats,
        alerts: matchedAlerts,
        datasets: matchedDatasets,
        total: matchedHospitals.length + matchedThreats.length + matchedAlerts.length + matchedDatasets.length
      });
      setShowSearchModal(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetData = async () => {
    if (confirm('Reset database to pristine college demo dataset? (5 hospitals, 6 threats, active alerts, experiments & rounds)')) {
      setIsResetting(true);
      await resetDatabase();
      setTimeout(() => {
        setIsResetting(false);
        addToast('Demo Data Reset', 'Successfully initialized 5 hospitals and baseline threat telemetry.', 'success');
      }, 500);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shadow-sm">
      {/* Left side: Hamburger & Global Search */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => { if (searchResults) setShowSearchModal(true); }}
            placeholder="Search hospitals, IoMT devices, IPs, threats..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSearchResults(null); setShowSearchModal(false); }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}

          {/* Search Results Dropdown Modal */}
          {showSearchModal && searchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 max-h-96 overflow-y-auto custom-scrollbar animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <span className="text-xs font-mono font-semibold text-cyan-800">
                  Found {searchResults.total} matching items for "{searchQuery}"
                </span>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-medium"
                >
                  Close
                </button>
              </div>

              {searchResults.total === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No matching records found.</p>
              ) : (
                <div className="space-y-3">
                  {/* Threats */}
                  {searchResults.threats.length > 0 && (
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1 font-semibold">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        <span>Threat Records ({searchResults.threats.length})</span>
                      </div>
                      <div className="space-y-1">
                        {searchResults.threats.map(t => (
                          <div
                            key={t.id}
                            onClick={() => { navigate('/threat-detection'); setShowSearchModal(false); }}
                            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-between text-xs border border-slate-100"
                          >
                            <div>
                              <span className="font-semibold text-slate-900">{t.attackType}</span>
                              <span className="text-slate-500 ml-2 font-mono text-[11px]">{t.sourceIp} → {t.destIp}</span>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${t.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                              {t.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hospitals */}
                  {searchResults.hospitals.length > 0 && (
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1 font-semibold">
                        <Building2 className="w-3 h-3 text-cyan-600" />
                        <span>Hospitals ({searchResults.hospitals.length})</span>
                      </div>
                      <div className="space-y-1">
                        {searchResults.hospitals.map(h => (
                          <div
                            key={h.id}
                            onClick={() => { navigate(`/hospitals/${h.id}`); setShowSearchModal(false); }}
                            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-between text-xs border border-slate-100"
                          >
                            <span className="font-semibold text-slate-900">{h.name}</span>
                            <span className="text-slate-500 font-mono text-[11px]">{h.deviceCount} Devices</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center space-x-3">
        {/* Groq AI Status Pill */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-mono">
          <Bot className="w-3.5 h-3.5 text-cyan-600" />
          <span className="text-slate-600 font-medium">Groq AI:</span>
          <span className={aiStatus.isGroqConfigured ? 'text-emerald-700 font-semibold' : 'text-cyan-700 font-semibold'}>
            {aiStatus.isGroqConfigured ? 'Cloud Active' : 'Heuristic Mode'}
          </span>
        </div>

        {/* Load / Reset Demo Data Button */}
        <button
          onClick={handleResetData}
          disabled={isResetting}
          title="Reload initial demo dataset (5 hospitals, threats, alerts)"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium transition-all border border-slate-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-600 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Load Demo Data</span>
        </button>

        {/* Quick Threat Scan Shortcut */}
        <button
          onClick={() => navigate('/threat-detection')}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-sm transition-all font-mono"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Scan</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={alertDropdownRef}>
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          {/* Dropdown Menu */}
          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-900">Active Threat Alerts</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { navigate('/alerts'); setShowAlertMenu(false); }}
                  className="text-[11px] font-mono font-semibold text-cyan-700 hover:underline flex items-center space-x-1"
                >
                  <span>View all</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                {activeAlerts.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No active threat alerts.</p>
                ) : (
                  activeAlerts.slice(0, 5).map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => { navigate('/alerts'); setShowAlertMenu(false); }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold text-slate-900 truncate max-w-[200px]">{alert.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${alert.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{alert.message}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>{alert.hospitalName}</span>
                        <span>{formatDate(alert.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
