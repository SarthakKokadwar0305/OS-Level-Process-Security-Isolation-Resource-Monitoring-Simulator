import React from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export default function AlertPanel({ alerts = [], title = 'Security & Isolation Alerts' }) {
  const getSeverityIcon = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />;
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-950/40 border-rose-800/50 text-rose-300';
      case 'WARNING':
        return 'bg-amber-950/40 border-amber-800/50 text-amber-300';
      default:
        return 'bg-cyan-950/40 border-cyan-800/50 text-cyan-300';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-gray-800">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">
            No active threat alerts or anomalous events reported.
          </p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id || alert.timestamp}
              className={`p-3 rounded-lg border flex items-start space-x-3 text-xs ${getSeverityStyle(
                alert.severity
              )}`}
            >
              {getSeverityIcon(alert.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                  <span className="font-bold tracking-tight uppercase">
                    {alert.event || 'SECURITY_EVENT'}
                  </span>
                  <span className="text-gray-400">{alert.timestamp || 'N/A'}</span>
                </div>
                <p className="text-gray-300 font-sans leading-relaxed text-xs">{alert.details}</p>
                {alert.pid !== undefined && alert.pid !== 0 && (
                  <span className="inline-block mt-1 font-mono text-[10px] text-gray-400">
                    Target PID: #{alert.pid}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
