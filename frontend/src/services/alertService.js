import { subscribeCollection, addItem, updateItem, deleteItem } from './firestoreStore.js';
import { recordAuditLog } from './auditService.js';

export function subscribeToAlerts(callback) {
  return subscribeCollection('alerts', (items) => {
    const sorted = [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    callback(sorted);
  });
}

export async function createAlertFromThreat(threat) {
  const alertData = {
    threatId: threat.id,
    hospitalId: threat.hospitalId || 'hosp-a',
    hospitalName: threat.hospitalName || 'Healthcare Node',
    severity: threat.severity || 'High',
    title: `${threat.severity === 'Critical' ? '🚨 CRITICAL:' : '⚠️ HIGH:'} ${threat.attackType} on ${threat.affectedDevice || threat.destIp}`,
    message: threat.description || `Suspicious ${threat.attackType} flow detected from ${threat.sourceIp} to ${threat.destIp}.`,
    status: 'New',
    createdAt: new Date().toISOString()
  };

  return await addItem('alerts', alertData);
}

export async function createManualAlert(alertData, currentUser = null) {
  const alert = await addItem('alerts', {
    ...alertData,
    status: alertData.status || 'New',
    createdAt: new Date().toISOString()
  });

  await recordAuditLog({
    userId: currentUser?.uid || 'usr-system',
    userName: currentUser?.displayName || currentUser?.email || 'Security Analyst',
    action: 'ALERT_CREATED',
    hospitalId: alertData.hospitalId || 'all',
    hospitalName: alertData.hospitalName || 'Healthcare Node',
    description: `Manual security alert created: ${alertData.title}`
  });

  return alert;
}

export async function updateAlertStatus(alertId, newStatus, currentUser = null) {
  await updateItem('alerts', alertId, { status: newStatus });
  await recordAuditLog({
    userId: currentUser?.uid || 'usr-system',
    userName: currentUser?.displayName || currentUser?.email || 'Security Analyst',
    action: 'ALERT_STATUS_CHANGED',
    description: `Alert ID ${alertId} status transitioned to "${newStatus}".`
  });
}

export async function deleteAlert(alertId, currentUser = null) {
  await deleteItem('alerts', alertId);
  await recordAuditLog({
    userId: currentUser?.uid || 'usr-system',
    userName: currentUser?.displayName || currentUser?.email || 'Security Analyst',
    action: 'ALERT_DELETED',
    description: `Alert ID ${alertId} was removed from the active alert queue.`
  });
}
