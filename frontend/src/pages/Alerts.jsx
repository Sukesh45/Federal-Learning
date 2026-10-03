import React, { useState, useEffect } from 'react';
import {
  Bell,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  AlertTriangle,
  Building2,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { subscribeToAlerts, updateAlertStatus, deleteAlert } from '../services/alertService.js';
import { SEVERITY_COLORS } from '../utils/constants.js';
import { formatDate, formatTimeAgo } from '../utils/formatters.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Alerts() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [alerts, setAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const unsub = subscribeToAlerts(setAlerts);
    return () => unsub();
  }, []);

  const handleStatusChange = async (alertId, newStatus) => {
    await updateAlertStatus(alertId, newStatus, user);
    addToast('Status Updated', `Alert marked as ${newStatus}.`, 'info');
  };

  const handleDeleteAlert = async (alertId) => {
    if (confirm('Delete this threat alert?')) {
      await deleteAlert(alertId, user);
      addToast('Alert Removed', 'Alert deleted from queue.', 'info');
    }
  };

  const filteredAlerts = alerts.filter(a => {
    const matchSev = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchStat = filterStatus === 'ALL' || a.status === filterStatus;
    return matchSev && matchStat;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-700 font-bold">
              Incident Response Center
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-bold">
              {alerts.length} Total Alerts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Threat & Incident Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Real-time security notifications dispatched when High or Critical IoMT network anomalies (DDoS, Malware SMB scans, PHI exfiltration) are classified by Groq AI.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New Only</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">No Matching Threat Alerts</h3>
            <p className="text-xs text-slate-500">All alerts in this filter view are cleared.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const sev = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.Low;

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-3xl bg-white border ${sev.border} shadow-sm transition-all duration-200 hover:border-cyan-400 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div className={`p-3 rounded-2xl ${sev.bg} border ${sev.border} flex-shrink-0 mt-0.5`}>
                    <ShieldAlert className={`w-5 h-5 ${sev.text}`} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{alert.title}</h3>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${sev.badge}`}>
                        {alert.severity}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                        alert.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : alert.status === 'Investigating'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                      }`}>
                        STATUS: {alert.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 font-medium">
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-cyan-700" />
                        <span className="text-slate-700 font-semibold">{alert.hospitalName}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(alert.createdAt)} ({formatTimeAgo(alert.createdAt)})</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div className="flex items-center space-x-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {alert.status !== 'Investigating' && alert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleStatusChange(alert.id, 'Investigating')}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-mono font-semibold transition-colors"
                    >
                      Investigate
                    </button>
                  )}

                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleStatusChange(alert.id, 'Resolved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-mono font-semibold transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
