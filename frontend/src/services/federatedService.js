import { subscribeCollection, addItem, getCollectionItems } from './firestoreStore.js';
import { recordAuditLog } from './auditService.js';

export function subscribeToFederatedRounds(callback) {
  return subscribeCollection('federatedRounds', (items) => {
    const sorted = [...items].sort((a, b) => Number(a.roundNumber || 0) - Number(b.roundNumber || 0));
    callback(sorted);
  });
}

/**
 * Execute a visual multi-step Federated Learning round
 * @param {Object} options - { totalRounds, privacyEnabled, privacyMethod, epsilon, onStepUpdate }
 */
export async function executeFederatedSimulationRound(options = {}, currentUser = null) {
  const {
    currentRound = 1,
    privacyEnabled = true,
    privacyMethod = 'Differential Privacy (ε=1.0)',
    epsilon = 1.0,
    hospitals = [],
    onStepUpdate = () => {}
  } = options;

  const steps = [
    { step: 1, title: 'Local Client Training', desc: 'Hospitals A, B, C, D, E training local IoMT neural network models on isolated clinical flow data.' },
    { step: 2, title: 'Gradient Extraction', desc: 'Extracting local weight matrices (ΔW). Zero patient records or clinical telemetry leaves the firewall.' },
    { step: 3, title: 'Privacy Shield Applied', desc: privacyEnabled ? `Injecting Laplace noise (ε=${epsilon}) and applying Homomorphic masking to weight updates.` : 'Raw weight parameters prepared (Privacy disabled).' },
    { step: 4, title: 'Decentralized Transmission', desc: 'Securely transmitting encrypted / sanitized weight vectors to the Central Federated Aggregator.' },
    { step: 5, title: 'FedAvg Server Aggregation', desc: 'Aggregator executes weighted average: W_global = Σ (n_k / N) * W_k over 5 hospital nodes.' },
    { step: 6, title: 'Global Model Distribution', desc: 'Broadcasting refined global model weights back to all hospital client nodes.' },
    { step: 7, title: 'Round Convergence Evaluation', desc: 'Evaluating global threat detection accuracy, F1-score, and false positive rates.' }
  ];

  for (let i = 0; i < steps.length; i++) {
    onStepUpdate(steps[i]);
    await new Promise(resolve => setTimeout(resolve, 650));
  }

  // Calculate realistic progressive metrics based on round number
  const roundNum = Number(currentRound);
  const baseAcc = Math.min(97.2, 84.0 + Math.log2(roundNum + 1) * 2.6 + (Math.random() * 0.4 - 0.2));
  const precision = Math.min(96.8, baseAcc - 0.4 + (Math.random() * 0.3));
  const recall = Math.min(96.5, baseAcc - 0.3 + (Math.random() * 0.3));
  const f1 = (2 * (precision * recall)) / (precision + recall);
  const loss = Math.max(0.045, 0.45 / Math.sqrt(roundNum + 1));

  const newRoundRecord = {
    roundNumber: roundNum,
    status: 'Completed',
    participatingHospitals: hospitals.length || 5,
    localUpdates: hospitals.length || 5,
    aggregationStatus: 'Aggregated (FedAvg)',
    accuracy: Number(baseAcc.toFixed(2)),
    precision: Number(precision.toFixed(2)),
    recall: Number(recall.toFixed(2)),
    f1Score: Number(f1.toFixed(2)),
    loss: Number(loss.toFixed(4)),
    communicationOverhead: privacyEnabled ? '138 KB' : '124 KB',
    privacyEnabled,
    privacyMethod,
    completedAt: new Date().toISOString()
  };

  const saved = await addItem('federatedRounds', newRoundRecord);

  await recordAuditLog({
    userId: currentUser?.uid || 'usr-system',
    userName: currentUser?.displayName || currentUser?.email || 'Federated Orchestrator',
    action: 'FEDERATED_ROUND_COMPLETED',
    hospitalId: 'all',
    hospitalName: 'All 5 Hospital Clients',
    description: `Federated Round #${roundNum} completed successfully with ${newRoundRecord.accuracy}% global accuracy (${privacyMethod}).`
  });

  return saved;
}
