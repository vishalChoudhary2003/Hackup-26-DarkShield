import React from 'react';
import { ThreatAnalysis } from '../types';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface AnalyticsViewProps { threats: ThreatAnalysis[]; }

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ threats }) => {
  const lineChartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${12 - i}h ago`).reverse(),
    datasets: [
      {
        label: 'Total Threats',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 15) + 2),
        borderColor: '#00FF9F',
        backgroundColor: 'rgba(0,255,159,0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00FF9F',
        pointRadius: 3,
      },
      {
        label: 'High Risk',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 5)),
        borderColor: '#FF4444',
        backgroundColor: 'rgba(255,68,68,0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FF4444',
        pointRadius: 3,
      },
    ],
  };

  const highRisk = threats.filter(t => t.riskLevel === 'HIGH').length;
  const medRisk  = threats.filter(t => t.riskLevel === 'MEDIUM').length;
  const lowRisk  = threats.filter(t => t.riskLevel === 'LOW').length;

  const doughnutData = {
    labels: ['HIGH', 'MEDIUM', 'LOW'],
    datasets: [{
      data: [highRisk || 1, medRisk || 1, lowRisk || 1],
      backgroundColor: ['#FF4444', '#FFC857', '#00FF9F'],
      borderWidth: 2,
      borderColor: '#111827',
      hoverBorderColor: ['#FF4444', '#FFC857', '#00FF9F'],
    }],
  };

  const sourceCountMap: Record<string, number> = {};
  threats.forEach(t => { sourceCountMap[t.source] = (sourceCountMap[t.source] || 0) + 1; });
  const sortedSources = Object.entries(sourceCountMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const barData = {
    labels: sortedSources.map(s => s[0]),
    datasets: [{
      label: 'Detections',
      data: sortedSources.map(s => s[1]),
      backgroundColor: 'rgba(0,255,159,0.3)',
      borderColor: '#00FF9F',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9CA3AF', font: { family: 'Inter', size: 11 } },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        borderColor: '#374151',
        borderWidth: 1,
        titleColor: '#FFFFFF',
        bodyColor: '#9CA3AF',
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(55,65,81,0.5)' },
        ticks: { color: '#6B7280', font: { size: 10 } },
        border: { color: '#374151' },
      },
      x: {
        grid: { color: 'rgba(55,65,81,0.3)' },
        ticks: { color: '#6B7280', font: { size: 10 } },
        border: { color: '#374151' },
      },
    },
  };

  const cardStyle = {
    background: '#1F2937',
    border: '1px solid #374151',
    borderRadius: '12px',
    padding: '16px',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      {/* Line Chart */}
      <div style={cardStyle}>
        <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase mb-4" style={{ color: '#9CA3AF' }}>
          📈 THREATS OVER TIME
        </h3>
        <div className="h-64">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      {/* Doughnut Chart */}
      <div style={cardStyle}>
        <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase mb-4" style={{ color: '#9CA3AF' }}>
          🎯 RISK DISTRIBUTION
        </h3>
        <div className="h-64 flex justify-center">
          <Doughnut data={doughnutData} options={{ ...chartOptions, scales: undefined }} />
        </div>
      </div>

      {/* Bar Chart — full width */}
      <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
        <h3 className="text-[11px] font-mono font-bold tracking-widest uppercase mb-4" style={{ color: '#9CA3AF' }}>
          🔍 TOP DETECTED SOURCES
        </h3>
        <div className="h-56">
          <Bar data={barData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
        </div>
      </div>
    </div>
  );
};
