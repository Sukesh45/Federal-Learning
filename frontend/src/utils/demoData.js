import { INITIAL_HOSPITALS } from './constants.js';

export function getInitialDemoThreats() {
  return [
    {
      id: 'thr-101',
      hospitalId: 'hosp-a',
      hospitalName: 'Hospital A (Metropolitan General)',
      sourceIp: '185.220.101.5',
      destIp: '192.168.10.45',
      protocol: 'TCP',
      sourcePort: 44120,
      destPort: 8080,
      packets: 34200,
      bytes: 2450000,
      duration: 12,
      classification: 'Malicious',
      attackType: 'DDoS',
      severity: 'Critical',
      confidence: 96,
      affectedDevice: 'Smart Infusion Pump Gateway #12',
      status: 'Active',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      description: 'Massive SYN flood packet burst targeting telemetry endpoint, causing infusion monitoring timeout.',
      indicators: [
        'Over 2,850 packets/sec transmission velocity exceeding IoMT baseline by 400%',
        'Source IP flagged in public Tor exit node threat feeds',
        'Asymmetric TCP handshake initiation without payload completion'
      ],
      recommendations: [
        'Isolate Smart Infusion Pump subnet into emergency quarantine VLAN',
        'Trigger automated rate-limiting on border firewall for 185.220.101.0/24',
        'Deploy updated federated anomaly weights to edge IoMT filters'
      ],
      aiAnalysis: 'High-confidence volumetric DDoS attack specifically designed to exhaust microcontroller connection buffers on smart infusion devices.',
      analyzedBy: 'Groq AI (Llama 3.3 70B)'
    },
    {
      id: 'thr-102',
      hospitalId: 'hosp-a',
      hospitalName: 'Hospital A (Metropolitan General)',
      sourceIp: '192.168.10.88',
      destIp: '192.168.10.99',
      protocol: 'TCP',
      sourcePort: 51200,
      destPort: 445,
      packets: 1850,
      bytes: 94000,
      duration: 2,
      classification: 'Malicious',
      attackType: 'Malware',
      severity: 'Critical',
      confidence: 93,
      affectedDevice: 'EHR PACS Database Server',
      status: 'Investigating',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      description: 'Lateral SMB exploration with rapid connection recycling indicative of medical ransomware staging.',
      indicators: [
        'Anomalous SMBv1 tree connect sequence on port 445',
        'Unusual process invocation from biomedical workstation',
        'Rapid encrypted file handle probing'
      ],
      recommendations: [
        'Drop TCP 445 traffic across hospital internal broadcast zones',
        'Isolate host 192.168.10.88 from domain controller',
        'Perform offline memory forensic imaging on target PACS gateway'
      ],
      aiAnalysis: 'Signature matches lateral propagation behavior of healthcare ransomware families (e.g. MedusaLocker). Immediate microsegmentation required.',
      analyzedBy: 'Groq AI (Llama 3.3 70B)'
    },
    {
      id: 'thr-103',
      hospitalId: 'hosp-c',
      hospitalName: 'Hospital C (BioCare Research Center)',
      sourceIp: '192.168.30.102',
      destIp: '45.33.22.11',
      protocol: 'TCP',
      sourcePort: 49900,
      destPort: 443,
      packets: 15600,
      bytes: 14500000,
      duration: 58,
      classification: 'Malicious',
      attackType: 'Data Exfiltration',
      severity: 'Critical',
      confidence: 94,
      affectedDevice: 'Clinical Trial Genetic Repository',
      status: 'Active',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      description: 'High-speed encrypted outbound tunnel transmitting large binary volumes to unrecognized foreign IP.',
      indicators: [
        '14.5 MB egress flow in 58 seconds exceeding clinical data transfer quota',
        'Destination IP geolocated outside certified clinical partner network',
        'Non-standard TLS cipher suite handshake'
      ],
      recommendations: [
        'Sever active outbound socket and blacklist 45.33.22.11',
        'Initiate HIPAA emergency PHI breach protocol',
        'Rotate API authentication tokens for Clinical Trial Data Server'
      ],
      aiAnalysis: 'Potential exfiltration of protected genomic/EHR research data in progress. Immediate perimeter block mandated.',
      analyzedBy: 'Groq AI (Llama 3.3 70B)'
    },
    {
      id: 'thr-104',
      hospitalId: 'hosp-b',
      hospitalName: 'Hospital B (St. Jude Healthcare)',
      sourceIp: '192.168.20.15',
      destIp: '10.0.2.20',
      protocol: 'TCP',
      sourcePort: 48890,
      destPort: 22,
      packets: 120,
      bytes: 4500,
      duration: 2,
      classification: 'Suspicious',
      attackType: 'Port Scan',
      severity: 'Medium',
      confidence: 88,
      affectedDevice: 'Hospital MRI Controller',
      status: 'Resolved',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      description: 'Rapid port reconnaissance sweeping clinical network for open management interfaces.',
      indicators: [
        'TCP SYN packets sent to consecutive port numbers',
        'Zero payload data exchanged',
        'Scanned 14 medical imaging workstations in 1.8 seconds'
      ],
      recommendations: [
        'Enforce strict ACLs on MRI controller interface',
        'Quarantine scanning host 192.168.20.15 for AV verification'
      ],
      aiAnalysis: 'Reconnaissance scan attempting to map clinical imaging hardware. Low immediate payload risk but indicates active adversary probing.',
      analyzedBy: 'Groq AI (Llama 3.3 70B)'
    },
    {
      id: 'thr-105',
      hospitalId: 'hosp-e',
      hospitalName: 'Hospital E (Apex Memorial Hospital)',
      sourceIp: '192.168.50.9',
      destIp: '10.0.5.4',
      protocol: 'TCP',
      sourcePort: 55400,
      destPort: 3389,
      packets: 840,
      bytes: 48000,
      duration: 4,
      classification: 'Suspicious',
      attackType: 'Brute Force',
      severity: 'High',
      confidence: 91,
      affectedDevice: 'Surgical Robotic Console Gateway',
      status: 'Active',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      description: 'Repeated failed RDP authentication attempts exceeding brute-force security threshold.',
      indicators: [
        '42 invalid login attempts in under 4 seconds',
        'Targeting privileged admin console on surgical subsystem',
        'Brute force wordlist fingerprint matched'
      ],
      recommendations: [
        'Lock admin account and enable 15-minute cool-off lockout',
        'Enforce hardware token MFA for surgical console access'
      ],
      aiAnalysis: 'High-frequency brute force attack against remote desktop endpoint controlling surgical robotics.',
      analyzedBy: 'Groq AI (Llama 3.3 70B)'
    },
    {
      id: 'thr-106',
      hospitalId: 'hosp-d',
      hospitalName: 'Hospital D (Valley Children’s Clinic)',
      sourceIp: '192.168.40.99',
      destIp: '198.51.100.24',
      protocol: 'UDP',
      sourcePort: 59000,
      destPort: 53,
      packets: 6200,
      bytes: 450000,
      duration: 15,
      classification: 'Suspicious',
      attackType: 'Botnet',
      severity: 'High',
      confidence: 89,
      affectedDevice: 'Pediatric Incubator Bridge Node',
      status: 'Investigating',
      timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
      description: 'High frequency DNS tunneling / C2 beaconing pulses identified.',
      indicators: [
        'Base32 encoded subdomains in DNS queries',
        'Repetitive fixed-interval beacon timing',
        'Destination DNS server unlisted in trusted medical resolver pool'
      ],
      recommendations: [
        'Sinkhole malicious domain at hospital recursive DNS resolvers',
        'Re-flash firmware on pediatric incubator telemetry bridge'
      ],
      aiAnalysis: 'IoMT device recruited into botnet orchestrator via DNS covert channel.',
      analyzedBy: 'Groq AI (Llama 3.3 70B)'
    }
  ];
}

export function getInitialDemoAlerts() {
  return [
    {
      id: 'alt-1',
      threatId: 'thr-101',
      hospitalId: 'hosp-a',
      hospitalName: 'Hospital A (Metropolitan General)',
      severity: 'Critical',
      title: '🚨 Volumetric DDoS on Smart Infusion Pumps',
      message: 'Hospital A reports a critical volumetric DDoS flood (34.2k packets) targeting bedside infusion controller 192.168.10.45.',
      status: 'New',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: 'alt-2',
      threatId: 'thr-102',
      hospitalId: 'hosp-a',
      hospitalName: 'Hospital A (Metropolitan General)',
      severity: 'Critical',
      title: '☣️ Suspected Ransomware SMB Probing (Port 445)',
      message: 'Suspicious lateral SMB movement detected against PACS EHR Database. Potential ransomware propagation blocked.',
      status: 'Investigating',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      id: 'alt-3',
      threatId: 'thr-103',
      hospitalId: 'hosp-c',
      hospitalName: 'Hospital C (BioCare Research Center)',
      severity: 'Critical',
      title: '📤 Unauthorized Clinical Data Exfiltration',
      message: 'Hospital C detected 14.5MB outbound data burst to unauthorized foreign IP 45.33.22.11 from Genomic Repository.',
      status: 'New',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
    },
    {
      id: 'alt-4',
      threatId: 'thr-105',
      hospitalId: 'hosp-e',
      hospitalName: 'Hospital E (Apex Memorial Hospital)',
      severity: 'High',
      title: '🔐 Brute Force Attack on Surgical Console',
      message: 'High frequency RDP authentication barrage against Surgical Robotic Console (Port 3389). Account lock triggered.',
      status: 'New',
      createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
    },
    {
      id: 'alt-5',
      threatId: 'thr-106',
      hospitalId: 'hosp-d',
      hospitalName: 'Hospital D (Valley Children’s Clinic)',
      severity: 'High',
      title: '🤖 IoMT Botnet C2 DNS Beaconing',
      message: 'Pediatric Incubator Bridge exhibiting repetitive DNS covert channel communication with suspicious command server.',
      status: 'Investigating',
      createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString()
    },
    {
      id: 'alt-6',
      threatId: 'thr-104',
      hospitalId: 'hosp-b',
      hospitalName: 'Hospital B (St. Jude Healthcare)',
      severity: 'Medium',
      title: '🔍 Reconnaissance Port Scan on MRI Unit',
      message: 'Reconnaissance scan detected on MRI controller. Host quarantined and verified benign.',
      status: 'Resolved',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    }
  ];
}

export function getInitialDemoExperiments() {
  return [
    {
      id: 'exp-1',
      experimentName: 'Experiment 1: Baseline Federated Learning (FedAvg)',
      modelType: 'CNN-BiLSTM Anomaly Detector',
      privacyMethod: 'None (Baseline FL)',
      privacyDescription: 'Raw model weights exchanged without perturbation or encryption',
      accuracy: 97.4,
      precision: 96.8,
      recall: 97.1,
      f1Score: 96.9,
      falsePositiveRate: 2.1,
      latency: 42, // ms
      communicationOverhead: 124, // KB per round
      privacyLeakageRisk: 'High (Susceptible to Model Inversion)',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    },
    {
      id: 'exp-2',
      experimentName: 'Experiment 2: FL + Differential Privacy (DP-FedAvg)',
      modelType: 'CNN-BiLSTM + Laplace Noise (ε=1.0)',
      privacyMethod: 'Differential Privacy (ε=1.0, δ=10⁻⁵)',
      privacyDescription: 'Laplace perturbation injected into gradient updates before server aggregation',
      accuracy: 95.8,
      precision: 95.2,
      recall: 94.9,
      f1Score: 95.0,
      falsePositiveRate: 3.4,
      latency: 48,
      communicationOverhead: 128,
      privacyLeakageRisk: 'Low (Mathematically Bounded Privacy)',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    {
      id: 'exp-3',
      experimentName: 'Experiment 3: FL + Homomorphic Encryption (HE-FedAvg)',
      modelType: 'CNN-BiLSTM + Paillier Cryptosystem',
      privacyMethod: 'Homomorphic Encryption (Paillier 2048-bit)',
      privacyDescription: 'Aggregator performs weighted sum on ciphertexts without decryption keys',
      accuracy: 97.4,
      precision: 96.8,
      recall: 97.1,
      f1Score: 96.9,
      falsePositiveRate: 2.1,
      latency: 186,
      communicationOverhead: 640,
      privacyLeakageRisk: 'Zero (Server sees only encrypted ciphertext)',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: 'exp-4',
      experimentName: 'Experiment 4: Hybrid FL + DP + HE (HealthShield Proposed)',
      modelType: 'Hybrid Privacy-Preserving Neural Detector',
      privacyMethod: 'Hybrid (DP ε=1.5 + Additive HE)',
      privacyDescription: 'Dual-shield privacy: local DP noise bounding + ciphertext aggregation',
      accuracy: 96.5,
      precision: 96.0,
      recall: 95.8,
      f1Score: 95.9,
      falsePositiveRate: 2.7,
      latency: 198,
      communicationOverhead: 680,
      privacyLeakageRisk: 'Negligible (Dual Cryptographic & Statistical Protection)',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
    }
  ];
}

export function getInitialDemoRounds() {
  return [
    {
      roundNumber: 1,
      status: 'Completed',
      participatingHospitals: 5,
      localUpdates: 5,
      aggregationStatus: 'Aggregated (FedAvg)',
      accuracy: 88.4,
      precision: 86.2,
      recall: 87.5,
      f1Score: 86.8,
      loss: 0.342,
      communicationOverhead: '124 KB',
      privacyEnabled: true,
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
    },
    {
      roundNumber: 5,
      status: 'Completed',
      participatingHospitals: 5,
      localUpdates: 5,
      aggregationStatus: 'Aggregated (FedAvg)',
      accuracy: 92.1,
      precision: 91.0,
      recall: 91.8,
      f1Score: 91.4,
      loss: 0.215,
      communicationOverhead: '124 KB',
      privacyEnabled: true,
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    },
    {
      roundNumber: 10,
      status: 'Completed',
      participatingHospitals: 5,
      localUpdates: 5,
      aggregationStatus: 'Aggregated (FedAvg)',
      accuracy: 94.6,
      precision: 94.1,
      recall: 93.8,
      f1Score: 93.9,
      loss: 0.148,
      communicationOverhead: '124 KB',
      privacyEnabled: true,
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    {
      roundNumber: 20,
      status: 'Completed',
      participatingHospitals: 5,
      localUpdates: 5,
      aggregationStatus: 'Aggregated (FedAvg)',
      accuracy: 96.1,
      precision: 95.8,
      recall: 95.5,
      f1Score: 95.6,
      loss: 0.089,
      communicationOverhead: '124 KB',
      privacyEnabled: true,
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      roundNumber: 25,
      status: 'Completed',
      participatingHospitals: 5,
      localUpdates: 5,
      aggregationStatus: 'Aggregated (FedAvg)',
      accuracy: 96.8,
      precision: 96.3,
      recall: 96.5,
      f1Score: 96.4,
      loss: 0.062,
      communicationOverhead: '124 KB',
      privacyEnabled: true,
      completedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  ];
}

export function getInitialAuditLogs() {
  return [
    {
      id: 'log-1',
      userId: 'usr-admin-01',
      userName: 'Dr. Sarah Collins (Chief Security Officer)',
      action: 'SYSTEM_INITIALIZATION',
      description: 'HealthShield AI federated cybersecurity cluster initialized with 5 participating healthcare hospital nodes.',
      hospitalId: 'all',
      hospitalName: 'All Hospital Nodes',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    },
    {
      id: 'log-2',
      userId: 'usr-analyst-02',
      userName: 'Alex Chen (IoMT Security Analyst)',
      action: 'DATASET_UPLOAD',
      description: 'Uploaded simulated IoMT network flow capture "iomt_telemetry_batch_09.csv" (3,214 records) for Hospital A.',
      hospitalId: 'hosp-a',
      hospitalName: 'Hospital A (Metropolitan General)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: 'log-3',
      userId: 'usr-analyst-02',
      userName: 'Alex Chen (IoMT Security Analyst)',
      action: 'FEDERATED_ROUND_EXECUTED',
      description: 'Initiated 5-hospital Federated Averaging Round #25 with Differential Privacy noise ε=1.0 enabled.',
      hospitalId: 'all',
      hospitalName: 'All Hospital Nodes',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    },
    {
      id: 'log-4',
      userId: 'usr-analyst-02',
      userName: 'Alex Chen (IoMT Security Analyst)',
      action: 'THREAT_ANALYZED',
      description: 'Analyzed suspicious network flow from 185.220.101.5 via Groq AI. Threat classified as Critical DDoS.',
      hospitalId: 'hosp-a',
      hospitalName: 'Hospital A (Metropolitan General)',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: 'log-5',
      userId: 'usr-admin-01',
      userName: 'Dr. Sarah Collins (Chief Security Officer)',
      action: 'ALERT_DISPATCHED',
      description: 'Automated high-priority security alert dispatched to Hospital A incident response team.',
      hospitalId: 'hosp-a',
      hospitalName: 'Hospital A (Metropolitan General)',
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString()
    }
  ];
}

export function getInitialDemoDatasets() {
  return [
    {
      id: 'ds-1',
      name: 'IoMT Infusion Pump Flow Logs (Batch 1)',
      hospitalId: 'hosp-a',
      hospitalName: 'Hospital A (Metropolitan General)',
      fileName: 'infusion_pump_flows_sep26.csv',
      recordCount: 3214,
      columnCount: 12,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'Indexed & Processed',
      description: 'High-frequency telemetry records captured from bedside smart infusion pumps and gateway routers.'
    },
    {
      id: 'ds-2',
      name: 'Cardiology Telemetry & CT Scans Network Flows',
      hospitalId: 'hosp-b',
      hospitalName: 'Hospital B (St. Jude Healthcare)',
      fileName: 'cardiology_telemetry_flows.csv',
      recordCount: 2890,
      columnCount: 12,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'Indexed & Processed',
      description: 'Network flows captured from Holter monitors, cardiac telemetry hubs, and CT imaging consoles.'
    },
    {
      id: 'ds-3',
      name: 'Genomic & DNA Sequencer Telemetry Logs',
      hospitalId: 'hosp-c',
      hospitalName: 'Hospital C (BioCare Research Center)',
      fileName: 'biocare_sequencer_network.csv',
      recordCount: 4120,
      columnCount: 12,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      status: 'Indexed & Processed',
      description: 'Flow captures from research sequencers, dialysis systems, and PACS DICOM archiving servers.'
    }
  ];
}
