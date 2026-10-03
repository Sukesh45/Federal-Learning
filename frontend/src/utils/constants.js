// HealthShield AI - Core Constants & Configuration

export const ATTACK_TYPES = [
  'Normal',
  'DoS',
  'DDoS',
  'Port Scan',
  'Brute Force',
  'Malware',
  'Botnet',
  'Unauthorized Access',
  'Data Exfiltration',
  'Suspicious Traffic'
];

export const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export const SEVERITY_COLORS = {
  Low: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    glow: 'shadow-sm',
    dot: 'bg-emerald-500'
  },
  Medium: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800 border border-amber-200',
    glow: 'shadow-sm',
    dot: 'bg-amber-500'
  },
  High: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-800 border border-orange-200',
    glow: 'shadow-sm',
    dot: 'bg-orange-500'
  },
  Critical: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-800 border border-rose-200',
    glow: 'shadow-sm',
    dot: 'bg-rose-600 animate-ping'
  }
};

export const INITIAL_HOSPITALS = [
  {
    id: 'hosp-a',
    name: 'Hospital A (Metropolitan General)',
    hospitalCode: 'HOSP-METRO-01',
    location: 'Building A, Trauma & ICU Subnet',
    status: 'Online',
    federatedStatus: 'Connected',
    deviceCount: 52,
    dataRecords: 3214,
    threatCount: 248,
    lastActivity: '2 mins ago',
    ipSubnet: '192.168.10.0/24',
    deviceTypes: ['Smart Infusion Pumps (18)', 'Bedside Patient Monitors (22)', 'EHR Server (2)', 'PACS DICOM Node (10)'],
    privacyBudgetUsed: 0.85,
    localModelAccuracy: 97.2
  },
  {
    id: 'hosp-b',
    name: 'Hospital B (St. Jude Healthcare)',
    hospitalCode: 'HOSP-STJUDE-02',
    location: 'Cardiology & Radiology Wing',
    status: 'Online',
    federatedStatus: 'Connected',
    deviceCount: 48,
    dataRecords: 2890,
    threatCount: 178,
    lastActivity: '5 mins ago',
    ipSubnet: '192.168.20.0/24',
    deviceTypes: ['Cardiac Telemetry Hubs (15)', 'CT Imaging Consoles (6)', 'Smart Syringe Drivers (20)', 'Diagnostic Gateways (7)'],
    privacyBudgetUsed: 0.62,
    localModelAccuracy: 96.5
  },
  {
    id: 'hosp-c',
    name: 'Hospital C (BioCare Research Center)',
    hospitalCode: 'HOSP-BIOCARE-03',
    location: 'Oncology & Clinical Trial Labs',
    status: 'Online',
    federatedStatus: 'Connected',
    deviceCount: 61,
    dataRecords: 4120,
    threatCount: 312,
    lastActivity: 'Just now',
    ipSubnet: '192.168.30.0/24',
    deviceTypes: ['DNA Sequencer Gateways (8)', 'Smart Dialysis Units (16)', 'Centralized PACs Server (4)', 'IoMT Temperature Monitors (33)'],
    privacyBudgetUsed: 1.10,
    localModelAccuracy: 98.1
  },
  {
    id: 'hosp-d',
    name: 'Hospital D (Valley Children’s Clinic)',
    hospitalCode: 'HOSP-VALLEY-04',
    location: 'Pediatric & Neonatal Intensive Care',
    status: 'Online',
    federatedStatus: 'Connected',
    deviceCount: 43,
    dataRecords: 2650,
    threatCount: 190,
    lastActivity: '12 mins ago',
    ipSubnet: '192.168.40.0/24',
    deviceTypes: ['Neonatal Incubator Bridges (14)', 'Smart Pulse Oximeters (21)', 'Pediatric EHR Workstations (8)'],
    privacyBudgetUsed: 0.45,
    localModelAccuracy: 95.8
  },
  {
    id: 'hosp-e',
    name: 'Hospital E (Apex Memorial Hospital)',
    hospitalCode: 'HOSP-APEX-05',
    location: 'Surgical Theatres & Emergency Wing',
    status: 'Online',
    federatedStatus: 'Connected',
    deviceCount: 44,
    dataRecords: 3444,
    threatCount: 156,
    lastActivity: '18 mins ago',
    ipSubnet: '192.168.50.0/24',
    deviceTypes: ['Anesthesia Workstations (10)', 'Surgical Robotic Arms (4)', 'Defibrillator Telemetry Nodes (12)', 'Ward Gateways (18)'],
    privacyBudgetUsed: 0.70,
    localModelAccuracy: 96.9
  }
];

export const USER_ROLES = {
  ADMIN: 'Admin',
  SECURITY_ANALYST: 'Security Analyst',
  HOSPITAL_USER: 'Hospital User'
};

export const DEMO_PRESET_THREATS = [
  {
    id: 'preset-1',
    label: 'DDoS Attack on Smart Infusion Pumps',
    sourceIp: '185.220.101.5',
    destIp: '192.168.10.45',
    protocol: 'TCP',
    sourcePort: 44120,
    destPort: 8080,
    packets: 34200,
    bytes: 2450000,
    duration: 12,
    hospitalId: 'hosp-a',
    hospitalName: 'Hospital A (Metropolitan General)',
    affectedDevice: 'Smart Infusion Pump Gateway #12',
    description: 'High packet volume flood observed overwhelming bedside infusion telemetry controller.'
  },
  {
    id: 'preset-2',
    label: 'Ransomware SMB Lateral Movement (Port 445)',
    sourceIp: '192.168.10.88',
    destIp: '192.168.10.99',
    protocol: 'TCP',
    sourcePort: 51200,
    destPort: 445,
    packets: 1850,
    bytes: 94000,
    duration: 2,
    hospitalId: 'hosp-a',
    hospitalName: 'Hospital A (Metropolitan General)',
    affectedDevice: 'EHR PACS Database Server',
    description: 'Rapid SMB tree connect requests without valid credential handshake matching WannaCry/MedusaLocker behavior.'
  },
  {
    id: 'preset-3',
    label: 'Port Reconnaissance Scan on MRI Controller',
    sourceIp: '192.168.10.15',
    destIp: '192.168.20.20',
    protocol: 'TCP',
    sourcePort: 48890,
    destPort: 22,
    packets: 120,
    bytes: 4500,
    duration: 2,
    hospitalId: 'hosp-b',
    hospitalName: 'Hospital B (St. Jude Healthcare)',
    affectedDevice: 'Hospital MRI Controller',
    description: 'Sequential SYN probe sweeping SSH and DICOM ports to discover unpatched firmware.'
  },
  {
    id: 'preset-4',
    label: 'PHI Data Exfiltration to External Server',
    sourceIp: '192.168.30.102',
    destIp: '45.33.22.11',
    protocol: 'TCP',
    sourcePort: 49900,
    destPort: 443,
    packets: 15600,
    bytes: 14500000,
    duration: 58,
    hospitalId: 'hosp-c',
    hospitalName: 'Hospital C (BioCare Research Center)',
    affectedDevice: 'Clinical Trial Genetic Repository',
    description: 'Sustained outbound TLS stream transmitting large binary records outside working hours.'
  },
  {
    id: 'preset-5',
    label: 'Nominal Benign Telemetry Flow (Normal)',
    sourceIp: '192.168.40.12',
    destIp: '10.0.4.5',
    protocol: 'UDP',
    sourcePort: 54321,
    destPort: 53,
    packets: 89,
    bytes: 6120,
    duration: 1,
    hospitalId: 'hosp-d',
    hospitalName: 'Hospital D (Valley Children’s Clinic)',
    affectedDevice: 'Pediatric Pulse Oximeter #04',
    description: 'Standard vital telemetry transmission to local nursing station aggregator.'
  }
];
