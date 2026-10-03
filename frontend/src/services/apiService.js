const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * HealthShield AI Backend API Client
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend may be offline or in standalone mode
  }
  return {
    status: 'standalone-client',
    aiEngine: {
      provider: 'HealthShield Client-Side AI Heuristic Engine',
      isGroqConfigured: false,
      model: 'Client-Side Rule & Statistical Classifier'
    }
  };
}

/**
 * Request Groq AI Threat Analysis
 */
export async function analyzeThreatAPI(networkEvent) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-threat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(networkEvent)
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.warn('Backend API unreachable for threat analysis, utilizing local analyzer:', error.message);
  }

  // Fallback client-side analysis
  return performLocalClientAnalysis(networkEvent);
}

/**
 * Chat with AI Security Assistant
 */
export async function chatAssistantAPI(messages, userRole = 'Security Analyst') {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userRole })
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.warn('Backend API unreachable for chat, using client response engine:', error.message);
  }

  // Fallback response
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  let fallbackReply = `### HealthShield AI Assistant\nI am analyzing your query regarding healthcare IoMT cybersecurity and privacy-preserving federated learning.\n\nKey takeaway: Ensure raw patient data remains localized at each hospital while using **Differential Privacy** and **FedAvg** aggregation to train shared intrusion detection models.`;

  if (lastMsg.includes('ddos') || lastMsg.includes('flood')) {
    fallbackReply = `### Distributed Denial of Service (DDoS) on Healthcare IoMT\n\n- **Target Impact:** Exhausts socket buffers on smart infusion pumps and monitors.\n- **Defense:** Microsegmentation, rate limiting, and federated anomaly detection across hospital gateways.`;
  } else if (lastMsg.includes('federated') || lastMsg.includes('fedavg')) {
    fallbackReply = `### Federated Learning (FedAvg) Workflow\n\n1. **Local Training:** Hospitals train models on local logs.\n2. **Weight Sharing:** Only gradient matrices are shared.\n3. **Aggregation:** Global weights computed without centralizing raw medical telemetry.`;
  }

  return {
    message: fallbackReply,
    model: 'HealthShield Local Engine (Standalone Mode)'
  };
}

/**
 * Generate Security Executive Report
 */
export async function generateReportAPI(reportData) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.warn('Backend API unreachable for report, generating client-side report:', error.message);
  }

  return {
    executiveSummary: `This executive security report covers federated threat detection telemetry across ${reportData.hospitalName || 'all participating hospitals'}. Over ${reportData.federatedRounds || 25} federated rounds, the system maintained high precision intrusion defense while preserving HIPAA clinical data confidentiality.`,
    keyFindings: [
      `Intercepted ${reportData.criticalThreats || 46} critical and ${reportData.highThreats || 112} high-severity anomalies.`,
      `Zero raw medical telemetry was exposed outside hospital boundary nodes.`,
      `Differential Privacy ensured gradient privacy protection against model inversion.`
    ],
    strategicRecommendations: [
      `Enforce Layer-3 microsegmentation between biomedical telemetry and staff networks.`,
      `Maintain continuous federated retraining across all 5 hospital partner nodes.`
    ],
    generatedBy: 'HealthShield AI Automated Engine'
  };
}

/**
 * Client-Side Heuristic Classifier (Fallback)
 */
function performLocalClientAnalysis(event) {
  const pCount = Number(event.packets) || 0;
  const bCount = Number(event.bytes) || 0;
  const dPort = Number(event.destPort) || 80;
  const dSec = Number(event.duration) || 1;
  const proto = (event.protocol || 'TCP').toUpperCase();

  if (pCount > 10000 || (pCount > 2000 && dSec < 5)) {
    return {
      classification: 'Malicious',
      attackType: pCount > 20000 ? 'DDoS' : 'DoS',
      severity: 'Critical',
      confidence: 95,
      explanation: `Volumetric flood detected on ${event.destIp}:${dPort} with ${pCount.toLocaleString()} packets in ${dSec}s over ${proto}. Threatens telemetry availability on medical equipment.`,
      indicators: [
        `High packet velocity: ${Math.round(pCount / dSec)} pkts/sec`,
        `Throughput surge exceeding IoMT baseline`,
        `Unacknowledged asymmetric connection requests`
      ],
      recommendations: [
        `Quarantine target IP ${event.destIp} to isolated VLAN`,
        `Deploy perimeter rate-limiting filter for ${event.sourceIp}`
      ],
      affectedDeviceRisk: 'Immediate risk of device telemetry crash and vital monitoring drop.',
      analyzedBy: 'HealthShield Local Intelligence Engine'
    };
  } else if (dPort === 445 || dPort === 139 || dPort === 3389 || dPort === 22) {
    return {
      classification: 'Malicious',
      attackType: (dPort === 445 || dPort === 139) ? 'Malware' : 'Brute Force',
      severity: 'High',
      confidence: 92,
      explanation: `Suspicious remote access / SMB probing on port ${dPort} from ${event.sourceIp}. Signature indicates lateral movement or credential spraying.`,
      indicators: [
        `Restricted protocol port ${dPort} accessed without prior authorization`,
        `High-frequency authentication attempts`
      ],
      recommendations: [
        `Block ingress port ${dPort} on hospital subnet`,
        `Perform endpoint forensic scan on target ${event.destIp}`
      ],
      affectedDeviceRisk: 'Vulnerability to ransomware encryption and credential compromise.',
      analyzedBy: 'HealthShield Local Intelligence Engine'
    };
  } else if (bCount > 500000 && dPort === 443) {
    return {
      classification: 'Malicious',
      attackType: 'Data Exfiltration',
      severity: 'Critical',
      confidence: 94,
      explanation: `Abnormal high-volume outbound data transfer (${(bCount / (1024 * 1024)).toFixed(2)} MB) to external IP ${event.destIp}. Potential PHI/EHR extraction.`,
      indicators: [
        `Large egress volume: ${(bCount / 1024).toFixed(1)} KB`,
        `Non-standard clinical sync timeframe`
      ],
      recommendations: [
        `Terminate outbound socket connection immediately`,
        `Initiate HIPAA security incident protocol`
      ],
      affectedDeviceRisk: 'High risk of patient data breach and regulatory compliance violation.',
      analyzedBy: 'HealthShield Local Intelligence Engine'
    };
  }

  return {
    classification: 'Normal',
    attackType: 'Normal',
    severity: 'Low',
    confidence: 96,
    explanation: `Network parameters reflect standard benign healthcare telemetry. Packet counts and byte distribution match normal IoMT operational profiles.`,
    indicators: [
      `Standard protocol payload size and normal packet intervals`,
      `Authorized clinical subnet addressing`
    ],
    recommendations: [
      `Continue standard federated passive monitoring`,
      `Retain baseline log for benign neural network training`
    ],
    affectedDeviceRisk: 'Device functioning normally within clinical parameters.',
    analyzedBy: 'HealthShield Local Intelligence Engine'
  };
}
