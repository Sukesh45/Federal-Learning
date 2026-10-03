import React from 'react';
import { ShieldAlert, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoDashboard = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-rose-200 shadow-xl text-center space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 inline-block shadow-sm">
              <ShieldAlert className="w-10 h-10 mx-auto" />
            </div>

            <h2 className="text-xl font-black text-slate-900">Something Went Wrong</h2>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              {this.state.error?.message || 'A client render exception occurred.'}
            </p>

            <div className="pt-4 flex items-center justify-center space-x-3">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleGoDashboard}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
