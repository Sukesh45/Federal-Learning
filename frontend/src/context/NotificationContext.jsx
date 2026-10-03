import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToAlerts } from '../services/alertService.js';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsub = subscribeToAlerts((alerts) => {
      setActiveAlerts(alerts);
      const newAlerts = alerts.filter(a => a.status === 'New');
      setUnreadCount(newAlerts.length);
    });
    return () => unsub();
  }, []);

  const addToast = (title, message, type = 'info', duration = 4500) => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newToast = { id, title, message, type };
    setToasts(prev => [newToast, ...prev]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ toasts, activeAlerts, unreadCount, addToast, removeToast }}>
      {children}
      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none px-4">
        {toasts.map(toast => {
          let borderClass = 'border-cyan-200 bg-white text-slate-900 shadow-xl';
          let icon = 'ℹ️';
          if (toast.type === 'critical' || toast.type === 'danger' || toast.type === 'error') {
            borderClass = 'border-rose-300 bg-rose-50 text-rose-950 shadow-xl';
            icon = '🚨';
          } else if (toast.type === 'success') {
            borderClass = 'border-emerald-300 bg-emerald-50 text-emerald-950 shadow-xl';
            icon = '✅';
          } else if (toast.type === 'warning') {
            borderClass = 'border-amber-300 bg-amber-50 text-amber-950 shadow-xl';
            icon = '⚠️';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 animate-fade-in flex items-start space-x-3 ${borderClass}`}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm tracking-wide text-slate-900">{toast.title}</h4>
                <p className="text-xs mt-1 text-slate-600 leading-relaxed font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 text-xs font-mono px-1 rounded hover:bg-slate-200/50"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
