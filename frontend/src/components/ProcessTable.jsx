import React from 'react';
import { Play, Pause, XCircle, Cpu, User, ShieldCheck } from 'lucide-react';

export default function ProcessTable({
  processes = [],
  onKill,
  onSuspend,
  onResume,
  loading = false,
}) {
  const getStateBadge = (state) => {
    switch (state) {
      case 'RUNNING':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
      case 'READY':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60';
      case 'BLOCKED':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      case 'SUSPENDED':
        return 'bg-purple-950/80 text-purple-400 border-purple-800/60';
      case 'TERMINATED':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/60';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-rose-400 font-semibold';
      case 'HIGH':
        return 'text-amber-400 font-medium';
      case 'MEDIUM':
        return 'text-cyan-400';
      case 'LOW':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 bg-dark-900/60 shadow-xl">
      <table className="w-full text-left text-xs">
        <thead className="bg-dark-800/90 text-gray-400 uppercase font-mono text-[11px] tracking-wider border-b border-gray-800">
          <tr>
            <th className="py-3.5 px-4 font-semibold">PID</th>
            <th className="py-3.5 px-4 font-semibold">Process Name</th>
            <th className="py-3.5 px-4 font-semibold">State</th>
            <th className="py-3.5 px-4 font-semibold">Priority</th>
            <th className="py-3.5 px-4 font-semibold">CPU %</th>
            <th className="py-3.5 px-4 font-semibold">Memory</th>
            <th className="py-3.5 px-4 font-semibold">User</th>
            <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60 font-mono">
          {loading ? (
            <tr>
              <td colSpan="8" className="py-12 text-center text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Polling Kernel Process Table...</span>
                </div>
              </td>
            </tr>
          ) : processes.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-12 text-center text-gray-400">
                <Cpu className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="font-medium text-gray-300">No active processes found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click 'Create Process' to dispatch a new simulated PCB task.
                </p>
              </td>
            </tr>
          ) : (
            processes.map((proc) => (
              <tr
                key={proc.pid}
                className="hover:bg-dark-800/40 transition-colors group"
              >
                <td className="py-3 px-4 font-bold text-cyan-400">#{proc.pid}</td>
                <td className="py-3 px-4 text-white font-sans font-medium flex items-center gap-2">
                  <span>{proc.name}</span>
                  {proc.isolated && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                      Isolated
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getStateBadge(
                      proc.state
                    )}`}
                  >
                    {proc.state}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={getPriorityBadge(proc.priority)}>{proc.priority}</span>
                </td>
                <td className="py-3 px-4 text-gray-300">{proc.cpu_percent?.toFixed(1)}%</td>
                <td className="py-3 px-4 text-gray-300">{proc.memory_mb?.toFixed(1)} MB</td>
                <td className="py-3 px-4 text-gray-400 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-gray-500" />
                  <span>{proc.user}</span>
                </td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  {proc.state === 'SUSPENDED' ? (
                    <button
                      onClick={() => onResume && onResume(proc.pid)}
                      title="Resume (SIGCONT)"
                      className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 rounded text-[11px] inline-flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSuspend && onSuspend(proc.pid)}
                      title="Suspend (SIGSTOP)"
                      className="px-2 py-1 bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800/60 rounded text-[11px] inline-flex items-center gap-1 transition-colors"
                    >
                      <Pause className="w-3 h-3" />
                      <span>Suspend</span>
                    </button>
                  )}
                  <button
                    onClick={() => onKill && onKill(proc.pid)}
                    title="Terminate (SIGKILL)"
                    className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded text-[11px] inline-flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3 h-3" />
                    <span>Kill</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
