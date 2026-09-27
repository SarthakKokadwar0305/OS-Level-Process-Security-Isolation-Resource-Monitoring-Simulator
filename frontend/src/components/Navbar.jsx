import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Terminal, RefreshCw, Cpu } from 'lucide-react';
import { healthAPI } from '../services/api';

export default function Navbar() {
  const [healthStatus, setHealthStatus] = useState('CONNECTING');
  const [currentTime, setCurrentTime] = useState('');

  const checkHealth = async () => {
    try {
      const res = await healthAPI.check();
      if (res && res.data && res.data.status) {
        setHealthStatus(res.data.status);
      } else {
        setHealthStatus('ONLINE');
      }
    } catch {
      setHealthStatus('OFFLINE');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-gray-800 bg-dark-900/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Left: Project Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
            OS SIMULATOR
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              Kernel v1.0
            </span>
          </h1>
          <p className="text-xs text-gray-400">Process Security, Isolation & Resource Monitor</p>
        </div>
      </div>

      {/* Right: Live Kernel Metrics & Status */}
      <div className="flex items-center space-x-4">
        {/* System Time */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-gray-400 bg-dark-800 px-3 py-1.5 rounded-md border border-gray-800">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime || '00:00:00'}</span>
        </div>

        {/* Backend Health Badge */}
        <button
          onClick={checkHealth}
          title="Click to recheck health status"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors bg-dark-800 hover:bg-dark-700 border-gray-700"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              healthStatus === 'UP' || healthStatus === 'ONLINE'
                ? 'bg-emerald-400 animate-pulse'
                : healthStatus === 'CONNECTING'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-rose-500'
            }`}
          />
          <span className="text-gray-300">Backend: {healthStatus}</span>
          <RefreshCw className="w-3 h-3 text-gray-400 hover:rotate-180 transition-transform" />
        </button>

        {/* Security Shield Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>RBAC Active</span>
        </div>
      </div>
    </header>
  );
}
