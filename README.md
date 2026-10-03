# HealthShield AI – Privacy-Preserving Cyber Threat Detection in Healthcare Systems

> **College Final Year Project Demonstration**  
> Based on the concept: *"Advancing Federated Learning Frameworks for Privacy-preserving Cyber Threat Detection in Healthcare Systems."*

---

## 🌟 Executive Overview

**HealthShield AI** is a cyber threat detection and privacy preservation demonstration platform designed for Internet of Medical Things (IoMT) and healthcare network environments.

In modern healthcare networks, medical devices (such as smart infusion pumps, PACS imaging servers, and telemetry gateways) are susceptible to volumetric DoS/DDoS attacks, lateral SMB ransomware probing, port scans, and unauthorized clinical data exfiltration. However, healthcare privacy mandates (**HIPAA & GDPR**) prohibit centralizing raw patient data or telemetry to a single third-party cloud.

HealthShield AI solves this problem by demonstrating:
1. **Decentralized Federated Learning (FedAvg):** Local hospital nodes train intrusion models without sharing raw clinical records.
2. **Differential Privacy (DP):** Adds calibrated noise ($\epsilon$-budget) to gradient updates to prevent model inversion attacks.
3. **Homomorphic Encryption (HE):** Conceptually aggregates model weights in ciphertext format.
4. **Groq AI Layer:** Delivers high-speed threat explanations, confidence scoring, attack indicators, and clinical mitigations using Groq AI (`llama-3.3-70b-versatile`).

---

## 🏗️ Architecture & Project Structure

The project is cleanly split into **Frontend** and **Backend** folders:

```
Federal Learning/
├── backend/                  # Secure Node/Express Server
│   ├── .env.example          # Backend Environment Template
│   ├── .env                  # Backend Environment Variables (GROQ_API_KEY, PORT)
│   ├── package.json          # Backend Dependencies
│   ├── server.js             # Express API Server
│   └── services/
│       ├── groqService.js    # Groq Cloud AI Integration with robust fallback
│       └── threatAnalyzer.js # Heuristic classifier for standalone/offline demos
│
├── frontend/                 # React + Vite + Tailwind CSS Application
│   ├── .env.example          # Frontend Environment Template
│   ├── .env                  # Frontend Environment Variables (Firebase config & API URL)
│   ├── index.html            # Entry HTML
│   ├── package.json          # Frontend Dependencies (Lucide, Recharts, Firebase)
│   ├── tailwind.config.js    # Cyber SecOps Dark Theme Configuration
│   ├── public/
│   │   ├── healthshield_logo.svg     # Medical Shield Logo
│   │   └── sample_iomt_traffic.csv   # Pre-built 100+ IoMT Flow Records
│   └── src/
│       ├── App.jsx           # Main Router & 15 Application Pages
│       ├── main.jsx          # React Entry Point
│       ├── index.css         # Custom Scrollbars & PDF Print Stylesheets
│       ├── components/       # Layout, Dashboard, Threats, Federated, Privacy, Reports
│       ├── context/          # Auth & Real-Time Notification Contexts
│       ├── pages/            # 15 Interactive Pages
│       ├── services/         # Firebase, Firestore, API, and SecOps Services
│       └── utils/            # CSV Parser, Privacy Math, Demo Data, Formatters
│
├── package.json              # Root Workspace Convenience Script
├── README.md                 # Project Overview & Architecture Guide
└── SETUP.md                  # Step-by-Step Installation & Demo Walkthrough
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite | High-performance SPA with instant HMR |
| **Styling** | Tailwind CSS | Dark cyber SecOps aesthetic, glow effects |
| **Icons** | Lucide React | High-tech cybersecurity iconography |
| **Data Visualization** | Recharts | Interactive Donut, Bar, Area, and Line charts |
| **Database & Auth** | Firebase Web SDK / Firestore | Real-time listeners & user management |
| **AI Intelligence** | Groq Cloud SDK | Llama-3.3-70B threat classification & explanations |
| **Backend API** | Express.js, CORS, Dotenv | Secure server-side isolation of AI API keys |

---

## 🔒 Privacy & Security Mechanisms Demonstrated

### 1. Federated Learning (FedAvg)
Raw clinical records and network packets remain strictly local within each hospital's boundary. Only weight gradients ($\Delta W$) are shared with the aggregator:
$$W_{global} = \sum_{k=1}^K \frac{n_k}{N} W_k$$

### 2. Differential Privacy (DP)
Before transmission, each hospital adds calibrated Laplace or Gaussian perturbation noise controlled by privacy budget $\epsilon$:
$$W' = W + \text{Lap}\left(\frac{\Delta f}{\epsilon}\right)$$

### 3. Homomorphic Encryption (HE)
Simulates Paillier additive homomorphism allowing the central server to sum encrypted weights without decryption keys:
$$\text{Enc}(W_A) \cdot \text{Enc}(W_B) \pmod{N^2} = \text{Enc}(W_A + W_B)$$

---

## 🚀 Quick Start & Local Execution

### 1. Install Dependencies
In root directory:
```bash
npm run install:all
```
*(Or navigate to `backend/` and run `npm install`, then `frontend/` and run `npm install`)*

### 2. Configure Environment Files

**Backend (`backend/.env`):**
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_ORIGIN=http://localhost:5173
```
*(Note: If `GROQ_API_KEY` is left blank, HealthShield AI automatically switches to its intelligent local heuristic engine so demonstrations never fail).*

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
*(Note: HealthShield AI features an integrated reactive local fallback store that operates out of the box even before adding Firebase credentials).*

### 3. Run the System

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open **`http://localhost:5173`** in your browser!

---

## 🧪 1-Click Evaluation Accounts

On the Login screen, click any of the **1-Click Demo Profile** buttons:
* **👩‍⚕️ Administrator:** `admin@healthshield.ai` (Global SecOps overview)
* **👨‍💻 Security Analyst:** `analyst@healthshield.ai` (Threat classification & alerts)
* **🩺 Hospital User:** `elena@metrogeneral.org` (Hospital A local node)

---

## 📚 Complete Demonstration Workflow

1. **Dashboard:** View live metrics across 5 hospitals (248 devices, 16.3k records, threat breakdown).
2. **Hospitals:** Explore the 5 simulated healthcare institutions and inspect IoMT device inventories.
3. **Dataset Management:** Upload a network flow CSV or click **"Load Pre-built IoMT CSV"**.
4. **Threat Detection:** Choose a preset scenario (e.g. *DDoS on Infusion Pump* or *Ransomware on Port 445*) and click **"Analyze Threat with Groq AI"**. Save the threat to automatically dispatch an active alert!
5. **Federated Simulation:** Click **"Start Federated Round"** to observe the animated 7-step FedAvg convergence pipeline.
6. **Privacy Hub:** Adjust the Differential Privacy $\epsilon$-slider to inspect live parameter noise and view the Paillier homomorphic encryption flow.
7. **Experiments:** Click **"Run Simulation Suite"** to benchmark FL vs DP-FedAvg vs HE-FedAvg vs Hybrid architectures.
8. **AI Assistant:** Chat with the Groq AI Cybersecurity Consultant about IoMT attack vectors.
9. **Executive Report:** Click **"Executive Report"** -> **"Print / Save as PDF"** for a printable assessment.

---

## ⚖️ Academic Disclaimer

This application is an educational demonstration developed for a college final-year engineering project. Federated learning, Differential Privacy, and Homomorphic Encryption features are educational simulations. AI-generated threat analysis is for demonstration purposes and does not replace certified healthcare security appliances.
