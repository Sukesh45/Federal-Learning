import { subscribeCollection, addItem, deleteItem } from './firestoreStore.js';
import { recordAuditLog } from './auditService.js';

export function subscribeToDatasets(callback) {
  return subscribeCollection('datasets', (items) => {
    const sorted = [...items].sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));
    callback(sorted);
  });
}

export async function saveDatasetMetadata(meta, currentUser = null) {
  const doc = {
    ...meta,
    uploadedAt: new Date().toISOString(),
    status: 'Indexed & Ready for FL'
  };

  const saved = await addItem('datasets', doc);

  await recordAuditLog({
    userId: currentUser?.uid || 'usr-system',
    userName: currentUser?.displayName || currentUser?.email || 'Data Engineer',
    action: 'DATASET_INGESTED',
    hospitalId: meta.hospitalId || 'all',
    hospitalName: meta.hospitalName || 'Healthcare Node',
    description: `Uploaded and registered dataset "${meta.name}" containing ${meta.recordCount} network flow records.`
  });

  return saved;
}

export async function deleteDataset(id, currentUser = null) {
  await deleteItem('datasets', id);
  await recordAuditLog({
    userId: currentUser?.uid || 'usr-system',
    userName: currentUser?.displayName || currentUser?.email || 'Data Engineer',
    action: 'DATASET_DELETED',
    description: `Removed dataset metadata with ID ${id}.`
  });
}
