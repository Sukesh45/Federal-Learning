import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4 text-cyan-800 font-mono">
        <div className="w-10 h-10 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold">Authenticating HealthShield SecOps Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center text-slate-700 font-sans">
        <h2 className="text-xl font-bold text-rose-700">Access Restricted</h2>
        <p className="mt-2 text-sm text-slate-600">Your role ({user.role}) does not have permission to view this section.</p>
      </div>
    );
  }

  return <Outlet />;
}
