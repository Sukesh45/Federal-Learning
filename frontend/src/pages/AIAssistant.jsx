import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  ShieldAlert,
  Lock,
  Cpu,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { chatAssistantAPI } from '../services/apiService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

const SUGGESTED_PROMPTS = [
  'What is a DDoS attack on hospital IoMT devices?',
  'Explain how Federated Learning preserves patient privacy.',
  'How does Differential Privacy prevent model inversion?',
  'How can a hospital reduce ransomware risk on port 445?',
  'Explain Homomorphic Encryption in healthcare.',
  'Summarize today\'s critical cybersecurity risks.'
];

export default function AIAssistant() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `### 👋 Welcome to HealthShield AI Security Assistant

I am your dedicated **IoMT Cybersecurity & Privacy-Preserving Federated Learning** consultant.

You can ask me about:
- **IoMT Vulnerabilities:** Attacks on infusion pumps, PACS servers, and medical telemetry gateways.
- **Federated Averaging (FedAvg):** Why clinical data never leaves the hospital firewall.
- **Privacy Defense:** Differential Privacy ($\\epsilon$-budget) and Homomorphic Encryption.
- **Incident Response:** Practical mitigations for intercepted healthcare threats.

*Select a suggestion below or type your question to get started!*`
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query || query.trim() === '') return;

    const newMessages = [...messages, { role: 'user', content: query.trim() }];
    setMessages(newMessages);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await chatAssistantAPI(newMessages, user?.role || 'Security Analyst');
      setMessages([...newMessages, { role: 'assistant', content: response.message }]);
    } catch (err) {
      addToast('Error', 'Failed to reach AI assistant.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: `### HealthShield AI Assistant Session Reset\nAsk me anything regarding healthcare cyber threat detection, IoMT security, or federated learning!`
      }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-120px)] font-sans">
      {/* Page Header */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900">HealthShield AI Security Assistant</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                Groq Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              IoMT Threat Intelligence & Federated Privacy Consultant
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium transition-colors border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-700" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 min-h-0 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-800 flex-shrink-0 text-sm shadow-sm">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-sm font-medium'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none prose prose-slate max-w-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900 flex-shrink-0 text-sm shadow-sm">
                    {user?.avatar || '👤'}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-800 text-sm shadow-sm">
                🤖
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-cyan-800 flex items-center space-x-2 shadow-sm font-semibold">
                <div className="w-3.5 h-3.5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                <span>Groq AI synthesizing response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Suggested Chips & Input Form */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 flex-shrink-0">
          {/* Suggestion Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-[11px] font-mono text-slate-700 hover:text-cyan-800 whitespace-nowrap transition-all font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask HealthShield AI about IoMT security, FedAvg, or Differential Privacy..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-600 font-mono transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-sm disabled:opacity-50 flex-shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
