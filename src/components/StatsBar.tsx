import React from 'react';
import { AlertTriangle, ShieldAlert, Mail, KeyRound, Building2, TrendingUp } from 'lucide-react';
import { ThreatAnalysis } from '../types';

interface StatsBarProps {
  threats: ThreatAnalysis[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ threats }) => {
  const highRiskCount = threats.filter(t => t.riskLevel === 'HIGH').length;
  const emailsCount = threats.reduce((sum, t) => sum + t.entities.emails.length, 0);
  const passwordsCount = threats.reduce((sum, t) => sum + t.entities.passwords.length, 0);
  const allCompanies = threats.flatMap(t => t.entities.companies);
  const uniqueCompanies = new Set(allCompanies).size;
  const avgRiskScore = threats.length > 0
    ? Math.round(threats.reduce((sum, t) => sum + t.riskScore, 0) / threats.length)
    : 0;

  const stats = [
    { key: 'totalThreats',      label: 'Total Threats',       value: threats.length, icon: AlertTriangle, accent: '#FFC857', bar: '#FFC857' },
    { key: 'highRiskAlerts',    label: 'High Risk Alerts',    value: highRiskCount,  icon: ShieldAlert,   accent: '#FF4444', bar: '#FF4444' },
    { key: 'emailsDetected',    label: 'Emails Detected',     value: emailsCount,    icon: Mail,          accent: '#00FF9F', bar: '#00FF9F' },
    { key: 'passwordsFound',    label: 'Passwords Found',     value: passwordsCount, icon: KeyRound,      accent: '#00FF9F', bar: '#00FF9F' },
    { key: 'companiesAffected', label: 'Companies Affected',  value: uniqueCompanies,icon: Building2,     accent: '#00FF9F', bar: '#00FF9F' },
    { key: 'avgRiskScore',      label: 'Avg Risk Score',      value: `${avgRiskScore}%`, icon: TrendingUp, accent: '#00FF9F', bar: '#00FF9F' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {stats.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="relative overflow-hidden flex flex-col justify-between rounded-2xl p-6 transition-all group"
            style={{
              background: '#0D111A',
              border: '1px solid #151C26',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = card.accent;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px rgba(0,0,0,0.4), 0 0 12px ${card.accent}22`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#151C26';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)';
            }}
          >
            {/* Top row */}
            <div className="flex justify-between items-start mb-6">
              <div className="p-3.5 rounded-xl" style={{ background: `${card.accent}18`, border: `1px solid ${card.accent}30`, boxShadow: `0 0 8px ${card.accent}20` }}>
                <Icon className="w-6 h-6" style={{ color: card.accent }} />
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: '#9CA3AF', border: '1px solid #374151' }}>
                +{Math.floor(Math.random() * 20) + 3}%
              </span>
            </div>

            {/* Value */}
            <div>
              <span className="text-xs font-mono font-bold tracking-widest block mb-2 uppercase" style={{ color: '#6B7280' }}>
                {card.label}
              </span>
              <span className="text-3xl font-black text-white tracking-tight" style={{ textShadow: `0 0 10px ${card.accent}40` }}>
                {card.value}
              </span>
            </div>

            {/* Bottom accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-80 transition-all"
              style={{ background: `linear-gradient(90deg, ${card.bar}, transparent)` }} />
          </div>
        );
      })}
    </div>
  );
};
