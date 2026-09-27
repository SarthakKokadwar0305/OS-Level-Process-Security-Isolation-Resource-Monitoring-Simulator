import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ResourceChart({
  title,
  type = 'line',
  data,
  height = 240,
  subtitle,
}) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
          boxWidth: 12,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
      },
    },
    scales:
      type !== 'doughnut'
        ? {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: {
                color: '#64748b',
                font: { size: 10, family: 'monospace' },
              },
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: {
                color: '#64748b',
                font: { size: 10, family: 'monospace' },
              },
              beginAtZero: true,
            },
          }
        : undefined,
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-gray-800 flex flex-col justify-between">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-dark-800 text-cyan-400 border border-gray-800">
          {type}
        </span>
      </div>

      <div style={{ height: `${height}px` }} className="w-full relative">
        {type === 'line' && <Line data={data} options={defaultOptions} />}
        {type === 'bar' && <Bar data={data} options={defaultOptions} />}
        {type === 'doughnut' && <Doughnut data={data} options={defaultOptions} />}
      </div>
    </div>
  );
}
