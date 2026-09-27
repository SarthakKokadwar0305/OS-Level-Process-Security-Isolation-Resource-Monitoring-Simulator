import React, { useState, useEffect } from 'react';
import { ScrollText, RefreshCw, Filter, Search, Terminal, Download } from 'lucide-react';
import { systemAPI } from '../services/api';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback initial placeholder logs
  const placeholderLogs = [
    {
      id: 1,
      timestamp: '2026-09-27 18:40:01',
      level: 'INFO',
      message: '[INIT] Kernel simulation subsystems bootstrap initialized',
    },
    {
      id: 2,
      timestamp: '2026-09-27 18:40:03',
      level: 'INFO',
      message: '[DATABASE] SQLite helper initialized (schema ready for migration)',
    },
    {
      id: 3,
      timestamp: '2026-09-27 18:40:04',
      level: 'INFO',
      message: '[PROCESS] Seeding baseline OS processes: systemd, kthreadd, syslogd',
    },
    {
      id: 4,
      timestamp: '2026-09-27 18:41:15',
      level: 'WARNING',
      message: '[PROCESS] High context switch overhead detected on ready queue',
    },
    {
      id: 5,
      timestamp: '2026-09-27 18:42:20',
      level: 'ERROR',
      message: '[SECURITY] Privilege escalation violation: PID 1005 attempted raw memory write',
    },
    {
      id: 6,
      timestamp: '2026-09-27 18:42:21',
      level: 'INFO',
      message: '[SECURITY] Process PID 1005 quarantined into strict sandbox namespace',
    },
  ];

  const fetchSystemLogs = async () => {
    setLoading(true);
    try {
      const res = await systemAPI.getLogs(100);
      if (res?.data?.logs && res.data.logs.length > 0) {
        setLogs(res.data.logs);
      } else {
        setLogs(placeholderLogs);
      }
    } catch {
      setLogs(placeholderLogs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemLogs();
  }, []);

  // Filter and search
  const filteredLogs = (logs.length ? logs : placeholderLogs).filter((log) => {
    const matchesLevel =
      filterLevel === 'ALL' || log.level?.toUpperCase() === filterLevel;
    const matchesSearch =
      !searchQuery ||
      log.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.timestamp?.includes(searchQuery);
    return matchesLevel && matchesSearch;
  });

  const downloadLogs = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'os_simulator_system.log');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            System & Kernel Audit Logs
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Aggregated log streams from Python logging service written to logs/system.log.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={downloadLogs}
            className="px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 border border-gray-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>

          <button
            onClick={fetchSystemLogs}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Poll Live Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search log messages, modules, PIDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-dark-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Level Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">Level:</span>
          {['ALL', 'INFO', 'WARNING', 'ERROR'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors border ${
                filterLevel === lvl
                  ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                  : 'bg-dark-900 text-gray-400 border-gray-800 hover:text-gray-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Event Stream Records</h3>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            Showing {filteredLogs.length} of {logs.length || placeholderLogs.length} entries
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-800 bg-dark-950/70 font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-dark-800/80 text-gray-400 uppercase text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-2.5 px-4 w-16">ID</th>
                <th className="py-2.5 px-4 w-44">Timestamp</th>
                <th className="py-2.5 px-4 w-28">Level</th>
                <th className="py-2.5 px-4">Log Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 font-sans">
                    No log events matching current filters
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-dark-800/30 transition-colors">
                    <td className="py-2 px-4 text-gray-500">#{log.id || idx + 1}</td>
                    <td className="py-2 px-4 text-gray-400 text-[11px]">
                      {log.timestamp || 'N/A'}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          log.level === 'ERROR'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : log.level === 'WARNING'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-gray-200">{log.message || log.raw}</td>
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
