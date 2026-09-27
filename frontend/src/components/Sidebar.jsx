import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cpu, ShieldAlert, BarChart3, ScrollText, GitBranch } from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Process Management',
    path: '/processes',
    icon: Cpu,
    badge: 'Module 1',
  },
  {
    name: 'Security Monitoring',
    path: '/security',
    icon: ShieldAlert,
    badge: 'Module 2',
  },
  {
    name: 'Resource Monitoring',
    path: '/resources',
    icon: BarChart3,
    badge: 'Module 3',
  },
  {
    name: 'System Logs',
    path: '/logs',
    icon: ScrollText,
    badge: 'Core',
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-800 bg-dark-900 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Navigation Modules
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Team Git Workflow Info Footer */}
      <div className="p-4 m-3 rounded-lg bg-dark-800/80 border border-gray-800 text-xs text-gray-400 space-y-2">
        <div className="flex items-center space-x-2 text-gray-300 font-semibold text-[11px] uppercase tracking-wide">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span>Team Git Branches</span>
        </div>
        <div className="space-y-1 text-[11px] font-mono text-gray-400">
          <div className="flex justify-between">
            <span>Process:</span>
            <span className="text-cyan-400">feat/process-mgr</span>
          </div>
          <div className="flex justify-between">
            <span>Security:</span>
            <span className="text-emerald-400">feat/security-subsys</span>
          </div>
          <div className="flex justify-between">
            <span>Resource:</span>
            <span className="text-amber-400">feat/resource-mon</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
