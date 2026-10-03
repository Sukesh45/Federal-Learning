import Groq from 'groq-sdk';
import { analyzeThreatFallback } from './threatAnalyzer.js';

// Initialize Groq client conditionally
let groqClient = null;

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
    return null;
  }
  if (!groqClient) {
    try {
      groqClient = new Groq({ apiKey: apiKey.trim() });
    } catch (err) {
      console.warn('Failed to initialize Groq client:', err.message);
      return null;
    }
  }
  return groqClient;
}

export function isGroqConfigured() {
  const client = getGroqClient();
  return client !== null;
}

/**
 * Safely parse JSON from LLM output, stripping markdown code fences if present.
 */
function extractJSON(text) {
  if (!text) return null;
  // Remove markdown code blocks ```json ... ``` or ``` ... ```
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
  }
  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON from AI response:', err.message, 'Raw was:', text);
    return null;
  }
}

/**
 * Analyze a network threat using Groq AI
 */
export async function analyzeNetworkThreat(event) {
  const groq = getGroqClient();
  const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  if (!groq) {
    console.log('[Groq] API Key not set. Using intelligent fallback analyzer.');
    return analyzeThreatFallback(event);
  }

  const systemPrompt = `You are HealthShield AI, a senior cybersecurity and IoMT (Internet of Medical Things) threat analysis intelligence engine.
Analyze network-security telemetry events within a hospital federated healthcare infrastructure.
Classify the event with technical precision, provide actionable indicators, and deliver defensive mitigation protocols.
Do not invent unavailable network facts. Do not claim certainty when data is insufficient.
You MUST respond ONLY with a single valid JSON object with EXACTLY the following structure (no other markdown or text outside the JSON):

{
  "classification": "Normal" | "Suspicious" | "Malicious",
  "attackType": "Normal" | "DoS" | "DDoS" | "Port Scan" | "Brute Force" | "Malware" | "Botnet" | "Unauthorized Access" | "Data Exfiltration" | "Suspicious Traffic",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "confidence": 85,
  "explanation": "Clear, concise technical explanation of the network event and why it poses or does not pose a threat to medical devices and patient data privacy.",
  "indicators": [
    "Indicator 1...",
    "Indicator 2...",
    "Indicator 3..."
  ],
  "recommendations": [
    "Defensive recommendation 1...",
    "Defensive recommendation 2...",
    "Defensive recommendation 3..."
  ],
  "affectedDeviceRisk": "Impact assessment on hospital IoMT devices (infusion pumps, patient monitors, EHR databases, MRI gateways)."
}`;

  const userPrompt = `Analyze this simulated healthcare network event:
- Source IP: ${event.sourceIp || '192.168.1.45'}
- Destination IP: ${event.destIp || '10.0.0.15'}
- Protocol: ${event.protocol || 'TCP'}
- Source Port: ${event.sourcePort || 445}
- Destination Port: ${event.destPort || 80}
- Packets: ${event.packets || 12400}
- Bytes: ${event.bytes || 820000}
- Duration (seconds): ${event.duration || 42}
- Target Hospital: ${event.hospitalName || 'Hospital A'}
- Affected Device / Target: ${event.affectedDevice || 'IoMT Device Gateway'}
- Additional Context: ${event.description || 'Routine medical telemetry / flow log capture'}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: modelName,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const rawResponse = chatCompletion.choices[0]?.message?.content;
    const parsed = extractJSON(rawResponse);

    if (parsed && parsed.attackType && parsed.severity) {
      return {
        ...parsed,
        confidence: Number(parsed.confidence) || 90,
        analyzedBy: `Groq AI (${modelName})`
      };
    } else {
      console.warn('[Groq] JSON structure mismatch, falling back.');
      return analyzeThreatFallback(event);
    }
  } catch (error) {
    console.error('[Groq Error]:', error.message);
    return {
      ...analyzeThreatFallback(event),
      fallbackReason: `Groq API notice: ${error.message}. Loaded intelligent local analyzer.`
    };
  }
}

/**
 * Chat with Groq Security Assistant
 */
export async function chatSecurityAssistant(messages, userRole = 'Security Analyst') {
  const groq = getGroqClient();
  const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const systemInstruction = `You are the HealthShield AI Cybersecurity Assistant, an expert virtual consultant specializing in Healthcare Cybersecurity, Internet of Medical Things (IoMT) threat defense, and Privacy-Preserving Federated Learning (Differential Privacy, Homomorphic Encryption, FedAvg).
Your role:
1. Explain cybersecurity threats (DDoS, Port Scans, Ransomware, Man-in-the-Middle, Data Exfiltration) clearly and accurately.
2. Explain Federated Learning and why it preserves clinical privacy (data never leaves the hospital premise, only model weight matrices are exchanged).
3. Explain Differential Privacy (noise addition, epsilon privacy budget) and Homomorphic Encryption (computing on encrypted model weights).
4. Provide structured, authoritative, yet accessible recommendations for hospital administrators and security engineers.
5. Format your answers nicely with markdown headings, bullet points, and code/configuration blocks where appropriate.
6. Remember to maintain an educational, professional tone suitable for a final-year engineering college project showcase.`;

  if (!groq) {
    // Intelligent contextual assistant fallback responses
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let fallbackReply = '';

    if (lastUserMsg.includes('ddos') || lastUserMsg.includes('dos')) {
      fallbackReply = `### Distributed Denial of Service (DDoS) in Healthcare IoMT

A **DDoS attack** against healthcare networks saturates bandwidth or medical telemetry endpoints (such as smart infusion pumps, bedside vitals monitors, or PACS imaging servers) with synthetic packet floods.

#### Key Risks to Healthcare Systems:
- **Telemetry Interruption:** Clinicians lose real-time patient vital stats.
- **IoMT Device Crashes:** Low-power microcontrollers in medical devices can hang under high socket loads.
- **EHR Unavailability:** Doctors cannot access medication history during emergencies.

#### Recommended Mitigations:
1. **Network Microsegmentation:** Air-gap IoMT devices in dedicated VLANs with strict Access Control Lists (ACLs).
2. **Federated Anomaly Detection:** Use HealthShield's **FedAvg** model across hospitals to detect distributed botnet signatures before they overwhelm internal hospital gateways.
3. **Upstream Rate Limiting:** Implement BGP Anycast scrubbing and deep-packet inspection (DPI) at hospital border routers.`;
    } else if (lastUserMsg.includes('federated') || lastUserMsg.includes('fedavg')) {
      fallbackReply = `### Federated Learning in Healthcare: How FedAvg Protects Clinical Privacy

**Federated Learning (FL)** solves the medical data-sharing dilemma: hospitals want collaborative AI to detect rare cyber threats, but HIPAA and GDPR prohibit sharing raw patient telemetry or network packet captures.

#### Workflow:
1. **Local Training:** Each hospital (Hospital A, B, C, D, E) trains a local neural network on its own private network logs.
2. **Weight Extraction:** Only weight gradients ($\\Delta W$) are extracted; zero patient or network records leave the hospital firewall.
3. **Aggregation (FedAvg):** The central aggregator computes:
   $$W_{global} = \\sum_{k=1}^K \\frac{n_k}{N} W_k$$
4. **Global Distribution:** The refined global threat detection model is broadcast back to all hospitals.

*In HealthShield AI, you can simulate this multi-round convergence in the **Federated Simulation** tab.*`;
    } else if (lastUserMsg.includes('privacy') || lastUserMsg.includes('differential') || lastUserMsg.includes('encryption') || lastUserMsg.includes('homomorphic')) {
      fallbackReply = `### Privacy Preservation: Differential Privacy & Homomorphic Encryption

Even when exchanging model weights, adversaries could perform **Model Inversion** or **Membership Inference** attacks. HealthShield AI demonstrates two defense layers:

#### 1. Differential Privacy (DP)
- Adds calibrated mathematical noise (Laplace or Gaussian) to local model weight updates before transmission:
  $$W' = W + \\mathcal{N}(0, \\sigma^2)$$
- Controlled by the **Privacy Budget ($\\epsilon$)**: Smaller $\\epsilon$ = stronger privacy, but slightly lower model accuracy.

#### 2. Homomorphic Encryption (HE)
- Allows the central server to compute mathematical sums on **encrypted** weights without decrypting them:
  $$\\text{Enc}(W_A) + \\text{Enc}(W_B) = \\text{Enc}(W_A + W_B)$$
- The central aggregator never sees plain model parameters!`;
    } else if (lastUserMsg.includes('ransomware') || lastUserMsg.includes('malware')) {
      fallbackReply = `### Healthcare Ransomware & IoMT Defense Strategies

Medical ransomware (e.g., WannaCry, MedusaLocker) frequently targets medical devices running legacy Windows embedded systems (like MRI and CT consoles).

#### Immediate Defense Playbook:
1. **Disable Legacy SMBv1:** Block TCP ports 445 and 139 at internal subnet boundaries.
2. **Immutable Offsite Backups:** Keep 3-2-1 encrypted backups for Electronic Health Records (EHR).
3. **Zero Trust Architecture:** Require multi-factor authentication for any remote biomedical vendor access.
4. **Continuous Behavioral Anomaly Detection:** Monitor IoMT egress flow volumes for unauthorized encryption payloads.`;
    } else {
      fallbackReply = `### HealthShield AI Security Assistant

Hello! I am your AI cybersecurity specialist for **Privacy-Preserving Healthcare Cybersecurity**.

I can assist you with:
- **IoMT Threat Analysis:** Understanding DoS, Port Scans, Brute Force, and Medical Ransomware.
- **Federated Learning:** Explaining FedAvg, local gradient updates, and decentralized model aggregation.
- **Privacy Enhancements:** How Differential Privacy ($\\epsilon$-budget) and Homomorphic Encryption protect hospital boundaries.
- **Incident Response:** Step-by-step mitigation guides for compromised medical devices.

*Tip: Connect your **Groq API Key** in \`backend/.env\` to enable live high-speed AI inference!*`;
    }

    return {
      message: fallbackReply,
      model: 'HealthShield AI Local Assistant (Heuristic Mode)',
      usage: { simulated: true }
    };
  }

  try {
    const formattedMessages = [
      { role: 'system', content: systemInstruction },
      ...messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: modelName,
      temperature: 0.3,
      max_tokens: 1500
    });

    const reply = chatCompletion.choices[0]?.message?.content;
    return {
      message: reply,
      model: `Groq AI (${modelName})`,
      usage: chatCompletion.usage
    };
  } catch (error) {
    console.error('[Groq Chat Error]:', error.message);
    return {
      message: `### Assistant Notice\nAI request could not reach Groq directly (${error.message}).\n\nHere is standard guidance: Ensure your hospital networks enforce strict microsegmentation, monitor port 445/80 flows, and participate in federated privacy-preserving weight aggregation rounds.`,
      model: 'HealthShield AI Fallback',
      error: error.message
    };
  }
}

/**
 * Generate Comprehensive Executive Security Report
 */
export async function generateSecurityReportAI(reportData) {
  const groq = getGroqClient();
  const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const {
    hospitalName = 'All Participating Healthcare Centers',
    totalThreats = 1284,
    criticalThreats = 46,
    highThreats = 112,
    topAttackTypes = ['DDoS', 'Port Scan', 'Brute Force', 'Malware'],
    federatedRounds = 25,
    privacyMethod = 'Differential Privacy (ε=1.0) + Homomorphic Encryption',
    currentAccuracy = '96.8%'
  } = reportData;

  if (!groq) {
    return {
      executiveSummary: `This executive cybersecurity assessment summarizes threat telemetry across ${hospitalName}. Over ${federatedRounds} federated learning rounds, the collaborative threat detection system maintained an impressive ${currentAccuracy} detection accuracy while enforcing strict data confidentiality under ${privacyMethod}. A total of ${totalThreats} suspicious anomalies were intercepted, including ${criticalThreats} critical severity events threatening IoMT availability.`,
      keyFindings: [
        `High concentration of volumetric DoS/DDoS probes targeting IoMT smart infusion gateways.`,
        `Port 445 SMB reconnaissance intercepted from unauthorized external subnets, preventing potential ransomware propagation.`,
        `Federated averaging successfully identified distributed attack signatures without centralizing raw clinical patient records.`,
        `Differential privacy noise injection ($\epsilon=1.0$) preserved 96.8% global threat classification fidelity.`
      ],
      strategicRecommendations: [
        `Enforce strict Layer-2/Layer-3 microsegmentation between biomedical devices and clinical workstations.`,
        `Continue bi-weekly federated model aggregation rounds to assimilate emerging zero-day IoMT attack signatures.`,
        `Implement automated firewall quarantine scripts for endpoints exhibiting persistent port scanning behavior.`,
        `Maintain continuous HIPAA-compliant audit logging for all federated parameter updates.`
      ],
      generatedBy: 'HealthShield AI Automated Engine (Heuristic Baseline)'
    };
  }

  const prompt = `You are HealthShield AI, an advanced healthcare cybersecurity reporting engine.
Generate an executive cybersecurity report summary based on this data:
- Hospital Scope: ${hospitalName}
- Total Intercepted Threats: ${totalThreats}
- Critical Threats: ${criticalThreats}
- High Threats: ${highThreats}
- Primary Threat Types: ${topAttackTypes.join(', ')}
- Federated Rounds Completed: ${federatedRounds}
- Privacy-Preserving Configuration: ${privacyMethod}
- Model Accuracy: ${currentAccuracy}

Respond ONLY with a valid JSON object with the following schema:
{
  "executiveSummary": "2-3 paragraphs of high-level professional narrative suitable for hospital CIOs and CISO.",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3", "Finding 4"],
  "strategicRecommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4"]
}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a healthcare cybersecurity reporting officer. Output valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      model: modelName,
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const parsed = extractJSON(chatCompletion.choices[0]?.message?.content);
    if (parsed && parsed.executiveSummary) {
      return {
        ...parsed,
        generatedBy: `Groq AI (${modelName})`
      };
    }
  } catch (err) {
    console.error('[Groq Report Error]:', err.message);
  }

  // Fallback if parsing or API failed
  return {
    executiveSummary: `This executive cybersecurity assessment summarizes threat telemetry across ${hospitalName}. Over ${federatedRounds} federated learning rounds, the collaborative threat detection system maintained an impressive ${currentAccuracy} detection accuracy while enforcing strict data confidentiality under ${privacyMethod}.`,
    keyFindings: [
      `Intercepted ${criticalThreats} critical and ${highThreats} high-severity anomalies.`,
      `Federated learning protected patient telemetry while achieving ${currentAccuracy} accuracy.`
    ],
    strategicRecommendations: [
      `Maintain air-gapped VLANs for IoMT smart infusion pumps and imaging stations.`,
      `Enforce continuous multi-institution federated model retraining.`
    ],
    generatedBy: 'HealthShield AI Report Engine'
  };
}
