import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Layers, GitBranch, RefreshCw } from 'lucide-react';
import ResourceChart from '../components/ResourceChart';
import { resourceAPI } from '../services/api';

export default function ResourcePage() {
  const [loading, setLoading] = useState(false);
  const [processResources, setProcessResources] = useState([]);
  const [stats, setStats] = useState({
    cpu: { usage_percent: 24.5, core_count: 4, user_percent: 14.2, system_percent: 8.1 },
    memory: { total_mb: 8192, used_mb: 3450, free_mb: 4742, usage_percent: 42.1 },
    disk: { total_gb: 256, used_gb: 88.5, free_gb: 167.5, usage_percent: 34.6 },
  });

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [cpuRes, memRes, diskRes, procRes] = await Promise.allSettled([
        resourceAPI.getCpu(),
        resourceAPI.getMemory(),
        resourceAPI.getDisk(),
        resourceAPI.getProcesses(),
      ]);

      if (cpuRes.status === 'fulfilled' && cpuRes.value?.data) {
        setStats((prev) => ({ ...prev, cpu: cpuRes.value.data }));
      }
      if (memRes.status === 'fulfilled' && memRes.value?.data) {
        setStats((prev) => ({ ...prev, memory: memRes.value.data }));
      }
      if (diskRes.status === 'fulfilled' && diskRes.value?.data) {
        setStats((prev) => ({ ...prev, disk: diskRes.value.data }));
      }
      if (procRes.status === 'fulfilled' && procRes.value?.data?.process_resources) {
        setProcessResources(procRes.value.data.process_resources);
      }
    } catch (err) {
      console.error('Failed to fetch resource metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // 1. CPU Chart Data (Line)
  const cpuChartData = {
    labels: ['-30s', '-25s', '-20s', '-15s', '-10s', '-5s', 'Now'],
    datasets: [
      {
        label: 'User Space (%)',
        data: [12, 14, 18, 15, 20, 16, stats.cpu.user_percent || 14.2],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Kernel System (%)',
        data: [6, 8, 9, 7, 10, 8, stats.cpu.system_percent || 8.1],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // 2. RAM Memory Chart Data (Doughnut)
  const memoryChartData = {
    labels: ['Used RAM (MB)', 'Cached Buffer (MB)', 'Free RAM (MB)'],
    datasets: [
      {
        data: [
          stats.memory.used_mb || 3450,
          stats.memory.cached_mb || 1200,
          stats.memory.free_mb || 4742,
        ],
        backgroundColor: ['#a855f7', '#6366f1', '#10b981'],
        borderColor: '#111827',
        borderWidth: 2,
      },
    ],
  };

  // 3. Disk I/O & Capacity Data (Bar)
  const diskChartData = {
    labels: ['Root (/dev/sda1)', 'Swap Area', 'Simulated RAMDisk'],
    datasets: [
      {
        label: 'Allocated Storage (GB)',
        data: [stats.disk.used_gb || 88.5, 4.0, 1.2],
        backgroundColor: '#06b6d4',
        borderRadius: 4,
      },
      {
        label: 'Available Free (GB)',
        data: [stats.disk.free_gb || 167.5, 4.0, 0.8],
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
      },
    ],
  };

  // 4. Threads & Concurrency Chart Data (Bar)
  const threadsChartData = {
    labels: processResources.length
      ? processResources.map((p) => p.name)
      : ['systemd', 'kthreadd', 'syslogd', 'sec_guard', 'worker_pool'],
    datasets: [
      {
        label: 'Active Kernel Threads',
        data: processResources.length
          ? processResources.map((p) => p.threads || 1)
          : [4, 2, 1, 3, 8],
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Resource Monitoring Subsystem
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time telemetry and time-series profiling for CPU, RAM, Disk I/O, and Concurrency Threads.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="px-3.5 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 border border-gray-700 text-xs font-medium transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Top Resource Metrics Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Total CPU Usage</div>
            <div className="text-lg font-bold font-mono text-white">
              {stats.cpu.usage_percent || 24.5}%
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/40">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">RAM Allocated</div>
            <div className="text-lg font-bold font-mono text-white">
              {stats.memory.usage_percent || 42.1}%
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/40">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Disk Storage Free</div>
            <div className="text-lg font-bold font-mono text-white">
              {stats.disk.free_gb || 167.5} GB
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Total Threads</div>
            <div className="text-lg font-bold font-mono text-white">18 Threads</div>
          </div>
        </div>
      </div>

      {/* The 4 Resource Charts (CPU, RAM, Disk, Threads) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: CPU Utilization */}
        <ResourceChart
          title="CPU Core Utilization"
          subtitle="User vs Kernel System load over 30 second window"
          type="line"
          data={cpuChartData}
          height={240}
        />

        {/* Chart 2: RAM Memory */}
        <ResourceChart
          title="Memory Page Distribution"
          subtitle="Physical memory allocation, buffers, and free frames"
          type="doughnut"
          data={memoryChartData}
          height={240}
        />

        {/* Chart 3: Disk Storage */}
        <ResourceChart
          title="Disk Space & Partition Capacity"
          subtitle="Simulated block device utilization"
          type="bar"
          data={diskChartData}
          height={240}
        />

        {/* Chart 4: Thread Concurrency */}
        <ResourceChart
          title="Thread Distribution Across Processes"
          subtitle="Concurrent execution context breakdown"
          type="bar"
          data={threadsChartData}
          height={240}
        />
      </div>

      {/* Process Resource Breakdown Table */}
      <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="text-sm font-semibold text-white">
            Per-Process Resource Consumption Table
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-cyan-400 border border-gray-800">
            GET /api/resource/processes
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-800 bg-dark-900/60 font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-dark-800/80 text-gray-400 uppercase text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-2.5 px-4">PID</th>
                <th className="py-2.5 px-4">Process Name</th>
                <th className="py-2.5 px-4">CPU Share</th>
                <th className="py-2.5 px-4">Resident Memory</th>
                <th className="py-2.5 px-4">Thread Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {processResources.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    Loading process resource table...
                  </td>
                </tr>
              ) : (
                processResources.map((item) => (
                  <tr key={item.pid} className="hover:bg-dark-800/30 transition-colors">
                    <td className="py-2.5 px-4 text-cyan-400 font-bold">#{item.pid}</td>
                    <td className="py-2.5 px-4 text-white font-sans">{item.name}</td>
                    <td className="py-2.5 px-4 text-gray-300">{item.cpu_percent}%</td>
                    <td className="py-2.5 px-4 text-gray-300">{item.memory_mb} MB</td>
                    <td className="py-2.5 px-4 text-emerald-400">{item.threads} threads</td>
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
