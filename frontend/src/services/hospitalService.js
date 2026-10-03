import { subscribeCollection, updateItem, getCollectionItems } from './firestoreStore.js';
import { recordAuditLog } from './auditService.js';

export function subscribeToHospitals(callback) {
  return subscribeCollection('hospitals', (items) => {
    callback(items);
  });
}

export async function getHospitalById(id) {
  const all = await getCollectionItems('hospitals');
  return all.find(h => h.id === id) || null;
}

export async function updateHospitalInfo(hospitalId, updates, currentUser = null) {
  await updateItem('hospitals', hospitalId, updates);
  if (currentUser) {
    await recordAuditLog({
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      action: 'HOSPITAL_PROFILE_UPDATED',
      hospitalId,
      description: `Hospital details updated for ID ${hospitalId}.`
    });
  }
}
