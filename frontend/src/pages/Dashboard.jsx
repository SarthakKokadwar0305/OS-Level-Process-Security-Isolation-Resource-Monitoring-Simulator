import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  ShieldAlert,
  Server,
  Terminal,
  Layers,
  PauseCircle,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import ResourceChart from '../components/ResourceChart';
import AlertPanel from '../components/AlertPanel';
import { healthAPI, processAPI, securityAPI, systemAPI } from '../services/api';

export default function Dashboard() {
  // Placeholder metrics state
  const [metrics, setMetrics] = useState({
    runningProcesses: 3,
    blockedProcesses: 1,
    cpuUsage: '24.5%',
    ramUsage: '42.1%',
    securityAlerts: 2,
    systemHealth: 'HEALTHY',
    kernelUptime: '04:18:32',
  });

  const [recentLogs, setRecentLogs] = useState([
    { id: 1, timestamp: '18:40:12', level: 'INFO', message: 'Kernel process manager initialized' },
    { id: 2, timestamp: '18:41:05', level: 'WARNING', message: 'High thread contention on PID 1005' },
    { id: 3, timestamp: '18:42:30', level: 'INFO', message: 'Periodic resource telemetry collected' },
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      severity: 'WARNING',
      event: 'UNAUTHORIZED_SYSCALL_ATTEMPT',
      timestamp: '18:05:22',
      pid: 1005,
      details: 'Process attempted restricted sys_ptrace without root privilege',
    },
    {
      id: 2,
      severity: 'CRITICAL',
      event: 'PROCESS_QUARANTINED',
      timestamp: '18:10:00',
      pid: 1005,
      details: 'Automated containment invoked by Isolation subsystem',
    },
  ]);

  // Attempt live API fetch to populate placeholder with backend responses if available
  useEffect(() => {
    async function loadTelemetry() {
      try {
        const [healthRes, procRes, secRes, logsRes] = await Promise.allSettled([
          healthAPI.check(),
          processAPI.list(),
          securityAPI.getLogs(5),
          systemAPI.getLogs(5),
        ]);

        if (procRes.status === 'fulfilled' && procRes.value?.data?.processes) {
          const procs = procRes.value.data.processes;
          const running = procs.filter((p) => p.state === 'RUNNING').length;
          const blocked = procs.filter((p) => p.state === 'BLOCKED' || p.state === 'SUSPENDED').length;
          setMetrics((prev) => ({
            ...prev,
            runningProcesses: running,
            blockedProcesses: blocked,
          }));
        }

        if (healthRes.status === 'fulfilled' && healthRes.value?.data?.status) {
          setMetrics((prev) => ({ ...prev, systemHealth: healthRes.value.data.status }));
        }

        if (secRes.status === 'fulfilled' && secRes.value?.data?.logs) {
          setAlerts(secRes.value.data.logs);
        }

        if (logsRes.status === 'fulfilled' && logsRes.value?.data?.logs) {
          setRecentLogs(logsRes.value.data.logs.slice(0, 5));
        }
      } catch (err) {
        console.warn('Backend not yet running; displaying simulated placeholder metrics', err);
      }
    }

    loadTelemetry();
  }, []);

  // Placeholder Chart Data
  const telemetryChartData = {
    labels: ['18:35', '18:37', '18:39', '18:41', '18:43', '18:45'],
    datasets: [
      {
        label: 'CPU Utilization (%)',
        data: [18, 26, 32, 22, 28, 24.5],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'RAM Allocation (%)',
        data: [38, 40, 41, 41.5, 42, 42.1],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.08)',
        tension: 0.35,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            System Overview & Dashboard
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time simulation metrics, active process states, and threat detection summaries.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <Link
            to="/processes"
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
          >
            <span>Manage Processes</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary Dashboard Cards (Required Placeholder Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Running Processes */}
        <DashboardCard
          title="Running Processes"
          value={metrics.runningProcesses}
          subtitle="Ready queue dispatched"
          icon={Cpu}
          accentColor="emerald"
          trend="+1 ready"
          trendPositive={true}
        />

        {/* 2. Blocked Processes */}
        <DashboardCard
          title="Blocked Processes"
          value={metrics.blockedProcesses}
          subtitle="Waiting for I/O / locks"
          icon={PauseCircle}
          accentColor="amber"
          trend="Stable"
          trendPositive={true}
        />

        {/* 3. CPU Usage */}
        <DashboardCard
          title="CPU Usage"
          value={metrics.cpuUsage}
          subtitle="4 Simulated Cores"
          icon={Activity}
          accentColor="cyan"
          trend="-2.4%"
          trendPositive={true}
        />

        {/* 4. RAM Usage */}
        <DashboardCard
          title="RAM Usage"
          value={metrics.ramUsage}
          subtitle="3,450 / 8,192 MB"
          icon={Layers}
          accentColor="purple"
          trend="+0.6%"
          trendPositive={false}
        />

        {/* 5. Security Alerts */}
        <DashboardCard
          title="Security Alerts"
          value={metrics.securityAlerts}
          subtitle="Anomalies detected"
          icon={ShieldAlert}
          accentColor="rose"
          trend="2 Active"
          trendPositive={false}
        />

        {/* 6. System Health */}
        <DashboardCard
          title="System Health"
          value={metrics.systemHealth}
          subtitle={`Uptime: ${metrics.kernelUptime}`}
          icon={Server}
          accentColor="emerald"
          trend="Kernel OK"
          trendPositive={true}
        />
      </div>

      {/* Main Grid: Telemetry Chart & Security Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResourceChart
            title="Kernel Resource Telemetry"
            subtitle="Real-time processor & virtual memory utilization curves"
            type="line"
            data={telemetryChartData}
            height={260}
          />
        </div>

        <div className="lg:col-span-1">
          <AlertPanel alerts={alerts} title="Active Security Events" />
        </div>
      </div>

      {/* Recent Logs Placeholder Panel */}
      <div className="glass-panel rounded-xl p-5 border border-gray-800">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">Recent System Logs</h3>
          </div>
          <Link
            to="/logs"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>View All Logs</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="font-mono text-xs space-y-2">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-dark-950/60 border border-gray-800/80 hover:border-gray-700/80 transition-colors"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                    log.level === 'WARNING'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : log.level === 'ERROR'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-gray-300 truncate">{log.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
