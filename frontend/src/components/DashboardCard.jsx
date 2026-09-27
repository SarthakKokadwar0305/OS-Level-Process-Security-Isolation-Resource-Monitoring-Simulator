import React from 'react';

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'cyan',
  trend,
  trendPositive = true,
}) {
  const colorMap = {
    cyan: 'from-cyan-500/10 to-blue-500/5 text-cyan-400 border-cyan-500/20 hover:border-cyan-500/40',
    emerald: 'from-emerald-500/10 to-green-500/5 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40',
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-400 border-amber-500/20 hover:border-amber-500/40',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-400 border-rose-500/20 hover:border-rose-500/40',
    purple: 'from-purple-500/10 to-indigo-500/5 text-purple-400 border-purple-500/20 hover:border-purple-500/40',
  };

  const badgeColorMap = {
    cyan: 'bg-cyan-950 text-cyan-400 border-cyan-800/40',
    emerald: 'bg-emerald-950 text-emerald-400 border-emerald-800/40',
    amber: 'bg-amber-950 text-amber-400 border-amber-800/40',
    rose: 'bg-rose-950 text-rose-400 border-rose-800/40',
    purple: 'bg-purple-950 text-purple-400 border-purple-800/40',
  };

  return (
    <div
      className={`glass-panel glass-panel-hover rounded-xl p-5 border bg-gradient-to-b ${
        colorMap[accentColor] || colorMap.cyan
      } flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase font-medium tracking-wider text-gray-400">{title}</p>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight font-mono">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${badgeColorMap[accentColor] || badgeColorMap.cyan}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-400 border-t border-gray-800/60 pt-3">
        <span>{subtitle || 'Real-time telemetry'}</span>
        {trend && (
          <span
            className={`font-medium font-mono text-[11px] ${
              trendPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
