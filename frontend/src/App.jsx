import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import ErrorBoundary from './components/Common/ErrorBoundary.jsx';

import Sidebar from './components/Layout/Sidebar.jsx';
import Header from './components/Layout/Header.jsx';
import ProtectedRoute from './components/Layout/ProtectedRoute.jsx';
import AcademicDisclaimerBanner from './components/Common/AcademicDisclaimerBanner.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Hospitals from './pages/Hospitals.jsx';
import HospitalDetail from './pages/HospitalDetail.jsx';
import DatasetManagement from './pages/DatasetManagement.jsx';
import ThreatDetection from './pages/ThreatDetection.jsx';
import FederatedSimulation from './pages/FederatedSimulation.jsx';
import PrivacySecurity from './pages/PrivacySecurity.jsx';
import Experiments from './pages/Experiments.jsx';
import Alerts from './pages/Alerts.jsx';
import AIAssistant from './pages/AIAssistant.jsx';
import AuditLogs from './pages/AuditLogs.jsx';
import BasePaper from './pages/BasePaper.jsx';
import About from './pages/About.jsx';
import Settings from './pages/Settings.jsx';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AcademicDisclaimerBanner />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
}

function FallbackRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/dashboard" : "/"} replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing & Auth Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected SecOps Application Routes (Require Authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/hospitals" element={<Hospitals />} />
                  <Route path="/hospitals/:id" element={<HospitalDetail />} />
                  <Route path="/datasets" element={<DatasetManagement />} />
                  <Route path="/threat-detection" element={<ThreatDetection />} />
                  <Route path="/federated-simulation" element={<FederatedSimulation />} />
                  <Route path="/privacy" element={<PrivacySecurity />} />
                  <Route path="/experiments" element={<Experiments />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/assistant" element={<AIAssistant />} />
                  <Route path="/audit-logs" element={<AuditLogs />} />
                  <Route path="/base-paper" element={<BasePaper />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<FallbackRedirect />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
