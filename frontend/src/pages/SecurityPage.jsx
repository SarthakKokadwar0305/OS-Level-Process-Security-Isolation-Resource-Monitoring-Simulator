import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Radio,
  FileText,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Send,
} from 'lucide-react';
import { securityAPI } from '../services/api';

export default function SecurityPage() {
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form states for checking permissions & isolating processes
  const [permForm, setPermForm] = useState({ user: 'guest', action: 'kill', pid: 1001 });
  const [permResult, setPermResult] = useState(null);
  const [isolatePid, setIsolatePid] = useState('');
  const [isolateReason, setIsolateReason] = useState('Anomalous syscall activity');

  // Isolation status state
  const [isolatedPids, setIsolatedPids] = useState([1005]);

  // Fetch security logs via Axios
  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await securityAPI.getLogs(50);
      if (res?.data?.logs) {
        setSecurityLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch security logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const showNotification = (msg, isError = false) => {
    setFeedback({ msg, isError });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handler: POST /api/security/check
  const handleCheckPermission = async (e) => {
    e.preventDefault();
    try {
      const res = await securityAPI.checkPermission({
        user: permForm.user,
        action: permForm.action,
        pid: parseInt(permForm.pid),
      });
      setPermResult(res.data);
      showNotification(res.message || 'Permission check evaluated successfully');
    } catch (err) {
      showNotification(err.message || 'Error checking permission', true);
    }
  };

  // Handler: POST /api/security/isolate
  const handleIsolateProcess = async (e) => {
    e.preventDefault();
    if (!isolatePid) return;
    try {
      const res = await securityAPI.isolateProcess({
        pid: parseInt(isolatePid),
        reason: isolateReason,
      });
      showNotification(res.message || `Process PID ${isolatePid} quarantined!`);
      setIsolatedPids((prev) => [...new Set([...prev, parseInt(isolatePid)])]);
      setIsolatePid('');
      fetchLogs();
    } catch (err) {
      showNotification(err.message || 'Error isolating process', true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Security & Isolation Subsystem
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Access control policies (RBAC), sandboxing isolation, threat detection heuristics, and security audit trail.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 border border-gray-700 text-xs font-medium transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      {/* Notification Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center space-x-2 ${
            feedback.isError
              ? 'bg-rose-950/60 border-rose-800 text-rose-300'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Four Primary Cards: Permission Status, Isolation Status, Threat Detection, Security Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Permission Status */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium text-gray-400">Permission Status</span>
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg font-bold text-white">RBAC Matrix Active</div>
              <p className="text-xs text-gray-400 mt-1">
                Enforcing capability tokens and least-privilege ring boundaries.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
            <span>Clearance Level</span>
            <span className="font-mono text-cyan-400 font-semibold">Tier 3 (Confidential)</span>
          </div>
        </div>

        {/* Card 2: Isolation Status */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium text-gray-400">Isolation Status</span>
              <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/40">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg font-bold text-white">
                {isolatedPids.length} Sandboxed {isolatedPids.length === 1 ? 'Process' : 'Processes'}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Virtual memory boundaries and raw I/O restrictions enforced.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
            <span>Quarantine Mode</span>
            <span className="font-mono text-purple-400 font-semibold">STRICT JAIL</span>
          </div>
        </div>

        {/* Card 3: Threat Detection */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium text-gray-400">Threat Detection</span>
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/40">
                <Radio className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg font-bold text-amber-400">Anomaly Heuristics ON</div>
              <p className="text-xs text-gray-400 mt-1">
                Detecting abnormal CPU spikes, buffer overflows, and unauthorized syscalls.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
            <span>Suspicious Events</span>
            <span className="font-mono text-amber-400 font-semibold">1 Detected</span>
          </div>
        </div>

        {/* Card 4: Security Logs Summary */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium text-gray-400">Security Audit</span>
              <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg font-bold text-white">{securityLogs.length} Events Logged</div>
              <p className="text-xs text-gray-400 mt-1">
                Immutable security event streaming enabled to logs/system.log.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
            <span>Audit Sink</span>
            <span className="font-mono text-emerald-400 font-semibold">SQLite / File</span>
          </div>
        </div>
      </div>

      {/* Interactive Testing Modules (POST /api/security/check & POST /api/security/isolate) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module A: Test Permission Check (POST /api/security/check) */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Evaluate Permission Policy</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-cyan-400 border border-gray-800">
              POST /api/security/check
            </span>
          </div>

          <form onSubmit={handleCheckPermission} className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-400 mb-1">User Role</label>
                <select
                  value={permForm.user}
                  onChange={(e) => setPermForm({ ...permForm, user: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="guest">guest</option>
                  <option value="operator">operator</option>
                  <option value="admin">admin</option>
                  <option value="root">root</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Requested Action</label>
                <select
                  value={permForm.action}
                  onChange={(e) => setPermForm({ ...permForm, action: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="read">read</option>
                  <option value="write">write</option>
                  <option value="exec">exec</option>
                  <option value="kill">kill</option>
                  <option value="suspend">suspend</option>
                  <option value="isolate">isolate</option>
                  <option value="sys_admin">sys_admin</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Target PID</label>
                <input
                  type="number"
                  value={permForm.pid}
                  onChange={(e) => setPermForm({ ...permForm, pid: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-gray-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Verify Access</span>
              </button>

              {permResult && (
                <div
                  className={`text-xs px-2.5 py-1 rounded font-mono font-bold flex items-center gap-1.5 border ${
                    permResult.authorized
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border-rose-800'
                  }`}
                >
                  <span>
                    {permResult.authorized ? 'AUTHORIZED' : 'ACCESS DENIED'} ({permResult.role} →{' '}
                    {permResult.action})
                  </span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Module B: Quaranine Process Sandbox (POST /api/security/isolate) */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Quarantine Process (Sandbox Isolation)</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-purple-400 border border-gray-800">
              POST /api/security/isolate
            </span>
          </div>

          <form onSubmit={handleIsolateProcess} className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-400 mb-1">Target PID</label>
                <input
                  type="number"
                  placeholder="e.g. 1005"
                  value={isolatePid}
                  onChange={(e) => setIsolatePid(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-gray-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-400 mb-1">Quarantine Reason</label>
                <input
                  type="text"
                  value={isolateReason}
                  onChange={(e) => setIsolateReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="submit"
                disabled={!isolatePid}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <Lock className="w-3 h-3" />
                <span>Enforce Sandbox Quarantine</span>
              </button>

              <span className="text-[11px] text-gray-400 font-mono">
                Isolated PIDs: {isolatedPids.join(', ') || 'None'}
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Security Logs Table / Feed */}
      <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Security Subsystem Audit Log</h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {securityLogs.length} Events Logged
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-800 bg-dark-900/60">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-dark-800/80 text-gray-400 uppercase text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-2.5 px-4">ID</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Severity</th>
                <th className="py-2.5 px-4">Event Type</th>
                <th className="py-2.5 px-4">PID</th>
                <th className="py-2.5 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {securityLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No security events in audit stream
                  </td>
                </tr>
              ) : (
                securityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="py-2.5 px-4 text-gray-500">#{log.id}</td>
                    <td className="py-2.5 px-4 text-gray-400">{log.timestamp}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          log.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-white font-semibold">{log.event}</td>
                    <td className="py-2.5 px-4 text-cyan-400">
                      {log.pid ? `#${log.pid}` : 'SYSTEM'}
                    </td>
                    <td className="py-2.5 px-4 text-gray-300 font-sans">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
