import React, { useState, useEffect } from 'react';
import { PlusCircle, RefreshCw, AlertCircle, CheckCircle2, Shield, Play, Pause, XCircle } from 'lucide-react';
import ProcessTable from '../components/ProcessTable';
import { processAPI } from '../services/api';

export default function ProcessPage() {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pidInput, setPidInput] = useState('');

  // Form State for process creation
  const [newProcessForm, setNewProcessForm] = useState({
    name: '',
    priority: 'MEDIUM',
    user: 'user',
  });

  // Fetch process list using Axios call
  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const response = await processAPI.list();
      if (response && response.data && response.data.processes) {
        setProcesses(response.data.processes);
      }
    } catch (err) {
      console.error('Failed to fetch processes:', err);
      showMessage('Failed to connect to process manager API. Showing cached table.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const showMessage = (msg, type = 'success') => {
    setActionMessage({ msg, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Handler: Create Process via Axios
  const handleCreateProcess = async (e) => {
    e.preventDefault();
    if (!newProcessForm.name.trim()) return;

    try {
      const res = await processAPI.create(newProcessForm);
      showMessage(res.message || `Process '${newProcessForm.name}' created!`);
      setIsCreateModalOpen(false);
      setNewProcessForm({ name: '', priority: 'MEDIUM', user: 'user' });
      fetchProcesses();
    } catch (err) {
      showMessage(err.message || 'Error creating process', 'error');
    }
  };

  // Handler: Kill Process via Axios
  const handleKill = async (pid) => {
    const targetPid = pid || parseInt(pidInput);
    if (!targetPid) return;
    try {
      const res = await processAPI.kill(targetPid);
      showMessage(res.message || `Process PID ${targetPid} killed`);
      setPidInput('');
      fetchProcesses();
    } catch (err) {
      showMessage(err.message || `Error killing PID ${targetPid}`, 'error');
    }
  };

  // Handler: Suspend Process via Axios
  const handleSuspend = async (pid) => {
    const targetPid = pid || parseInt(pidInput);
    if (!targetPid) return;
    try {
      const res = await processAPI.suspend(targetPid);
      showMessage(res.message || `Process PID ${targetPid} suspended`);
      setPidInput('');
      fetchProcesses();
    } catch (err) {
      showMessage(err.message || `Error suspending PID ${targetPid}`, 'error');
    }
  };

  // Handler: Resume Process via Axios
  const handleResume = async (pid) => {
    const targetPid = pid || parseInt(pidInput);
    if (!targetPid) return;
    try {
      const res = await processAPI.resume(targetPid);
      showMessage(res.message || `Process PID ${targetPid} resumed`);
      setPidInput('');
      fetchProcesses();
    } catch (err) {
      showMessage(err.message || `Error resuming PID ${targetPid}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Process Management Subsystem
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Simulate process creation, state transitions, PCB dispatching, and signal delivery.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Process</span>
          </button>

          <button
            onClick={fetchProcesses}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 border border-gray-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Table</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center space-x-2 transition-all ${
            actionMessage.type === 'error'
              ? 'bg-rose-950/60 border-rose-800 text-rose-300'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
          }`}
        >
          {actionMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{actionMessage.msg}</span>
        </div>
      )}

      {/* Quick Signal Dispatch Bar */}
      <div className="glass-panel p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span className="font-semibold text-gray-300">Quick Signal Dispatch:</span>
          <span>Apply kernel signal to specific PID</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="number"
            placeholder="Target PID..."
            value={pidInput}
            onChange={(e) => setPidInput(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-dark-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 w-32 font-mono"
          />

          <button
            onClick={() => handleResume()}
            disabled={!pidInput}
            className="px-2.5 py-1.5 rounded-md bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800 text-xs disabled:opacity-40 flex items-center gap-1"
          >
            <Play className="w-3 h-3" />
            <span>Resume</span>
          </button>

          <button
            onClick={() => handleSuspend()}
            disabled={!pidInput}
            className="px-2.5 py-1.5 rounded-md bg-purple-950 hover:bg-purple-900 text-purple-400 border border-purple-800 text-xs disabled:opacity-40 flex items-center gap-1"
          >
            <Pause className="w-3 h-3" />
            <span>Suspend</span>
          </button>

          <button
            onClick={() => handleKill()}
            disabled={!pidInput}
            className="px-2.5 py-1.5 rounded-md bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 text-xs disabled:opacity-40 flex items-center gap-1"
          >
            <XCircle className="w-3 h-3" />
            <span>Kill</span>
          </button>
        </div>
      </div>

      {/* Process Table Shell */}
      <ProcessTable
        processes={processes}
        onKill={handleKill}
        onSuspend={handleSuspend}
        onResume={handleResume}
        loading={loading}
      />

      {/* Create Process Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-gray-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-semibold text-white">Create Simulated Process</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProcess} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Process Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. database_worker, crypto_miner"
                  value={newProcessForm.name}
                  onChange={(e) =>
                    setNewProcessForm({ ...newProcessForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Priority</label>
                <select
                  value={newProcessForm.priority}
                  onChange={(e) =>
                    setNewProcessForm({ ...newProcessForm, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">User / Security Principal</label>
                <input
                  type="text"
                  placeholder="root, admin, user, guest"
                  value={newProcessForm.user}
                  onChange={(e) =>
                    setNewProcessForm({ ...newProcessForm, user: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
                >
                  Dispatch (POST /api/process/create)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
