import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  Download,
  Search,
  Filter,
  Building2,
  User,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { subscribeToAuditLogs, exportAuditLogsToCSV } from '../services/auditService.js';
import { formatDate, formatTimeAgo } from '../utils/formatters.js';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function AuditLogs() {
  const { addToast } = useNotifications();
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('ALL');

  useEffect(() => {
    const unsub = subscribeToAuditLogs(setLogs);
    return () => unsub();
  }, []);

  const handleExportCSV = async () => {
    try {
      const csv = await exportAuditLogsToCSV();
      if (!csv) {
        addToast('Empty', 'No audit logs available to export.', 'warning');
        return;
      }
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `healthshield_audit_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Export Complete', 'Audit logs exported to CSV.', 'success');
    } catch (e) {
      addToast('Export Error', e.message, 'error');
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      (log.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHospital = hospitalFilter === 'ALL' || log.hospitalId === hospitalFilter;
    return matchesSearch && matchesHospital;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              HIPAA & Security Governance
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
              Immutable Trail
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            System & Security Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Chronological audit trail of all SecOps events, user logins, dataset uploads, AI threat evaluations, and federated training iterations.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-cyan-800 text-xs font-mono font-bold flex items-center space-x-2 transition-all border border-slate-200"
        >
          <Download className="w-3.5 h-3.5 text-cyan-600" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actions, operators, or descriptions..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
          />
        </div>

        <select
          value={hospitalFilter}
          onChange={(e) => setHospitalFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
        >
          <option value="ALL">All Hospital Nodes</option>
          <option value="hosp-a">Hospital A (Metropolitan)</option>
          <option value="hosp-b">Hospital B (St. Jude)</option>
          <option value="hosp-c">Hospital C (BioCare)</option>
          <option value="hosp-d">Hospital D (Valley Children's)</option>
          <option value="hosp-e">Hospital E (Apex Memorial)</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Hospital Scope</th>
                <th className="py-3 px-4">Event Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                    No matching audit log records.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-medium">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.userName || log.userId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-cyan-50 text-cyan-800 border border-cyan-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-purple-800 font-semibold whitespace-nowrap">
                      {log.hospitalName || 'All Nodes'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-md truncate">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
