import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import {
  isGroqConfigured,
  analyzeNetworkThreat,
  chatSecurityAssistant,
  generateSecurityReportAI
} from './services/groqService.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// Root route
app.get('/', (req, res) => {
  res.json({
    project: 'HealthShield AI - Privacy-Preserving Cyber Threat Detection in Healthcare',
    status: 'Operational',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// System Health & Groq Status
app.get('/api/health', (req, res) => {
  const groqActive = isGroqConfigured();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiEngine: {
      provider: groqActive ? 'Groq Cloud API' : 'HealthShield Intelligent Local Engine (Fallback)',
      isGroqConfigured: groqActive,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      mode: groqActive ? 'Live Cloud AI' : 'Smart Local Heuristic (No Key Needed for Demo)'
    },
    privacyProtocols: ['Federated Learning (FedAvg)', 'Differential Privacy (ε-budget)', 'Homomorphic Encryption (Paillier/CKKS Simulation)'],
    hospitalsSimulated: 5
  });
});

// Analyze Cyber Threat via Groq AI
app.post('/api/analyze-threat', async (req, res) => {
  try {
    const event = req.body;
    if (!event) {
      return res.status(400).json({ error: 'Network event payload is required.' });
    }

    const analysis = await analyzeNetworkThreat(event);
    return res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/analyze-threat:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred during threat analysis.',
      details: error.message
    });
  }
});

// Chat with Security Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userRole } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required.' });
    }

    const response = await chatSecurityAssistant(messages, userRole);
    return res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process AI conversation.',
      details: error.message
    });
  }
});

// Generate Security Report
app.post('/api/generate-report', async (req, res) => {
  try {
    const reportData = req.body || {};
    const report = await generateSecurityReportAI(reportData);
    return res.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/generate-report:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate security report.',
      details: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error occurred.',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡️  HealthShield AI Backend Server`);
  console.log(`🚀  Listening on port http://localhost:${PORT}`);
  console.log(`🤖  Groq AI Configured: ${isGroqConfigured() ? 'YES (Live Cloud)' : 'NO (Intelligent Heuristic Fallback)'}`);
  console.log(`=======================================================`);
});
