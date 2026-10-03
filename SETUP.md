# HealthShield AI – Setup & Demonstration Guide

Step-by-step instructions for running the **HealthShield AI** privacy-preserving cyber threat detection platform.

---

## 📁 System Architecture Overview

```
Federal Learning/
├── backend/       # Express API server for secure Groq AI threat analysis
├── frontend/      # React + Vite + Tailwind CSS + Firebase Web SDK
└── README.md      # Comprehensive Architecture & Academic Paper Summary
```

---

## 🚀 1. Prerequisites

Ensure you have **Node.js (v18 or higher)** and **npm** installed on your system.
Verify with:
```bash
node -v
npm -v
```

---

## 📦 2. Installation

From the project root folder (`Federal Learning`), you can install all dependencies at once:

```bash
npm run install:all
```

*Or install each individually:*

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔐 3. Environment Variables Configuration

Both frontend and backend utilize `.env` files for security and data isolation.

### A. Frontend Configuration (`frontend/.env`)
Your Firebase credentials have been configured in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSyCrKc2NCfHY1nNiQBk8Wn1UObEM3OwuTXk
VITE_FIREBASE_AUTH_DOMAIN=federal-f3f0f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=federal-f3f0f
VITE_FIREBASE_STORAGE_BUCKET=federal-f3f0f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=588634518522
VITE_FIREBASE_APP_ID=1:588634518522:web:a80af866c84f9ce6202a43
VITE_FIREBASE_MEASUREMENT_ID=G-RF3MJNR942
```

### B. Backend Configuration (`backend/.env`)
Set up your backend settings in `backend/.env`:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_ORIGIN=http://localhost:5173
```

> **Note on Groq AI:**  
> If you have a Groq API key (free at [console.groq.com/keys](https://console.groq.com/keys)), paste it into `GROQ_API_KEY` in `backend/.env`.  
> If left blank, the application automatically uses its high-precision **Local AI Heuristic Classifier**, ensuring your project demo works smoothly without requiring an external internet connection.

---

## ▶️ 4. Running the Application

Open two terminal windows:

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```
*The backend will start at `http://localhost:5000`.*

### Terminal 2: Frontend Web App
```bash
cd frontend
npm run dev
```
*The React app will launch at `http://localhost:5173`.*

---

## 🧑‍💻 5. Logging In (1-Click Demo Profiles)

Open `http://localhost:5173` in your browser.  
On the login screen, choose any of the **1-Click Demo Profiles**:

1. **👩‍⚕️ Administrator:** `admin@healthshield.ai`  
   *Full access to 5 hospitals, global federated rounds, and audit logs.*
2. **👨‍💻 Security Analyst:** `analyst@healthshield.ai`  
   *Threat analysis, active incident response, and alerts management.*
3. **🩺 Hospital User:** `elena@metrogeneral.org`  
   *Local node monitoring for Hospital A (Metropolitan General).*

---

## 🎬 6. Recommended Project Presentation Walkthrough

Follow this 8-step walkthrough during your college viva or project presentation:

1. **Dashboard (`/dashboard`):** Show the 5 connected hospitals, 248 active IoMT devices, live threat distribution charts, and hospital threat comparison bar chart.
2. **Hospitals (`/hospitals`):** Click into **Hospital A** or **Hospital C** to inspect monitored IoMT devices (Infusion Pumps, PACS servers, MRI gateways) and local privacy budgets ($\epsilon=1.0$).
3. **Dataset Management (`/datasets`):** Click **"Load Pre-built IoMT CSV"** to demonstrate automatic feature extraction (Source IP, Destination IP, Protocol, Packets, Bytes, Attack Labels).
4. **Threat Detection (`/threat-detection`):** Click the **"DDoS Attack on Smart Infusion Pumps"** or **"Ransomware SMB Lateral Movement (Port 445)"** preset and click **"Analyze Threat with Groq AI"**. Observe the classification, confidence score, indicators, and clinical mitigations. Click **"Save Threat & Alert"**.
5. **Threat Alerts (`/alerts`):** Show how the high/critical threat automatically created an incident alert. Mark the alert as **"Investigating"** or **"Resolved"**.
6. **Federated Simulation (`/federated-simulation`):** Click **"Start Federated Round"** and present the 7-step decentralized convergence workflow:
   * Local Training $\rightarrow$ Gradient Extraction $\rightarrow$ Privacy Shield $\rightarrow$ FedAvg Server Aggregation $\rightarrow$ Global Model Distribution.
7. **Privacy & Security (`/privacy`):** Demonstrate the **Differential Privacy** $\epsilon$-slider with live parameter noise calculation, and show the **Paillier Homomorphic Encryption** ciphertext aggregation pipeline.
8. **Experiments (`/experiments`):** Click **"Run Simulation Suite"** to generate comparative benchmark graphs comparing Baseline FL vs DP-FedAvg vs HE-FedAvg vs Hybrid Architecture.
9. **Executive Report:** In the Dashboard or Threat page, click **"Executive Report"** and use **"Print / Save as PDF"** to generate an executive incident report.
