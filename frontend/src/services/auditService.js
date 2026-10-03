import { subscribeCollection, addItem, getCollectionItems } from './firestoreStore.js';

export function subscribeToAuditLogs(callback) {
  return subscribeCollection('auditLogs', (items) => {
    const sorted = [...items].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    callback(sorted);
  });
}

export async function recordAuditLog(logEntry) {
  const record = {
    userId: logEntry.userId || 'usr-anon',
    userName: logEntry.userName || 'System User',
    action: logEntry.action || 'GENERAL_ACTION',
    description: logEntry.description || 'System event recorded.',
    hospitalId: logEntry.hospitalId || 'all',
    hospitalName: logEntry.hospitalName || 'HealthShield Network',
    timestamp: new Date().toISOString()
  };

  return await addItem('auditLogs', record);
}

export async function exportAuditLogsToCSV() {
  const logs = await getCollectionItems('auditLogs');
  if (!logs || logs.length === 0) return '';

  const headers = ['Timestamp', 'User', 'Action', 'Hospital', 'Description'];
  const rows = logs.map(l => [
    `"${l.timestamp || ''}"`,
    `"${l.userName || l.userId || ''}"`,
    `"${l.action || ''}"`,
    `"${l.hospitalName || ''}"`,
    `"${(l.description || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
