import { subscribeCollection, addItem, updateItem, deleteItem, getCollectionItems } from './firestoreStore.js';
import { createAlertFromThreat } from './alertService.js';
import { recordAuditLog } from './auditService.js';

export function subscribeToThreats(callback) {
  return subscribeCollection('threats', (items) => {
    // Sort descending by timestamp
    const sorted = [...items].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    callback(sorted);
  });
}

export async function saveThreatEvent(threatData, currentUser = null) {
  const threatRecord = {
    ...threatData,
    status: threatData.status || 'Active',
    timestamp: threatData.timestamp || new Date().toISOString()
  };

  const saved = await addItem('threats', threatRecord);

  // If High or Critical severity, automatically create an active alert
  if (saved.severity === 'High' || saved.severity === 'Critical') {
    await createAlertFromThreat(saved);
  }

  // Record audit log
  await recordAuditLog({
    userId: currentUser?.uid || 'usr-system',
    userName: currentUser?.displayName || currentUser?.email || 'Security Analyst',
    action: 'THREAT_RECORDED',
    hospitalId: saved.hospitalId || 'all',
    hospitalName: saved.hospitalName || 'Healthcare Node',
    description: `Recorded ${saved.severity} severity threat: ${saved.attackType} on ${saved.affectedDevice || saved.destIp}.`
  });

  return saved;
}

export async function updateThreatStatus(threatId, newStatus, currentUser = null) {
  await updateItem('threats', threatId, { status: newStatus });
  await recordAuditLog({
    userId: currentUser?.uid || 'usr-analyst',
    userName: currentUser?.displayName || currentUser?.email || 'Security Analyst',
    action: 'THREAT_STATUS_UPDATED',
    description: `Threat ID ${threatId} status changed to ${newStatus}.`
  });
}

export async function removeThreat(threatId, currentUser = null) {
  await deleteItem('threats', threatId);
  await recordAuditLog({
    userId: currentUser?.uid || 'usr-analyst',
    userName: currentUser?.displayName || currentUser?.email || 'Security Analyst',
    action: 'THREAT_DELETED',
    description: `Threat record ${threatId} was deleted.`
  });
}
