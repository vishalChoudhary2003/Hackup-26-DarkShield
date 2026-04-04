import React from 'react';
import { ThreatAnalysis } from '../types';
import { X, Calendar, Server, Shield, Hash, Mail, KeyRound, Building2, Globe, FileText } from 'lucide-react';

interface ThreatDetailProps {
  threat: ThreatAnalysis | null;
  onClose: () => void;
}

const riskColors: Record<string, { text: string; glow: string; bg: string }> = {
  HIGH:   { text: '#FF4C4C', glow: 'rgba(255,76,76,0.4)',   bg: 'rgba(255,76,76,0.08)'   },
  MEDIUM: { text: '#FFC857', glow: 'rgba(255,200,87,0.35)', bg: 'rgba(255,200,87,0.08)'  },
  LOW:    { text: '#4CAF50', glow: 'rgba(76,175,80,0.35)',  bg: 'rgba(76,175,80,0.08)'   },
};

export const ThreatDetail: React.FC<ThreatDetailProps> = ({ threat, onClose }) => {
  if (!threat) return null;
  const rc = riskColors[threat.riskLevel] ?? riskColors.LOW;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-2xl"
        style={{ background: '#0D111A', border: `1px solid ${rc.text}40`, boxShadow: `0 0 40px ${rc.glow}, 0 0 80px rgba(0,0,0,0.8)` }}>

        {/* Header */}
        <div className="p-8 flex justify-between items-center" style={{ background: '#06080D', borderBottom: `1px solid #151C26` }}>
          <div>
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#6B7280' }}>
              THREAT INTELLIGENCE ANALYSIS
            </span>
            <h2 className="text-2xl font-bold text-white tracking-wide mt-2 flex items-center gap-3">
              <Shield className="w-6 h-6" style={{ color: rc.text, filter: `drop-shadow(0 0 6px ${rc.text})` }} />
              {threat.id}
            </h2>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl transition-all"
            style={{ color: '#9CA3AF', background: 'rgba(255,255,255,0.04)', border: '1px solid #374151' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FF4C4C'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,76,76,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; (e.currentTarget as HTMLElement).style.borderColor = '#374151'; }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1 space-y-8">

          {/* Top 3 stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl flex flex-col items-center justify-center text-center"
              style={{ background: rc.bg, border: `1px solid ${rc.text}30` }}>
              <span className="text-xs font-mono uppercase" style={{ color: '#6B7280' }}>Risk Level</span>
              <span className="text-3xl font-black mt-2" style={{ color: rc.text, textShadow: `0 0 12px ${rc.glow}` }}>
                {threat.riskLevel}
              </span>
            </div>

            <div className="p-6 rounded-2xl flex flex-col items-center justify-center text-center"
              style={{ background: '#151C26', border: '1px solid #374151' }}>
              <span className="text-xs font-mono uppercase" style={{ color: '#6B7280' }}>Risk Score</span>
              <span className="text-3xl font-black mt-2 text-white font-mono"
                style={{ textShadow: `0 0 10px ${rc.text}60` }}>
                {threat.riskScore}<span className="text-base text-gray-500">/100</span>
              </span>
            </div>

            <div className="p-6 rounded-2xl flex flex-col items-center justify-center text-center"
              style={{ background: 'rgba(0,207,255,0.05)', border: '1px solid rgba(0,207,255,0.2)' }}>
              <span className="text-xs font-mono uppercase" style={{ color: '#6B7280' }}>Threat Source</span>
              <span className="text-base font-bold mt-2 font-mono truncate max-w-full"
                style={{ color: '#00CFFF', textShadow: '0 0 8px rgba(0,207,255,0.4)' }}>
                {threat.source}
              </span>
            </div>
          </div>

          {/* Risk Breakdown */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase mb-4 flex items-center gap-3" style={{ color: '#6B7280' }}>
              <Hash className="w-5 h-5" style={{ color: '#7B61FF' }} /> RISK BREAKDOWN
            </h3>
            <div className="p-6 rounded-2xl font-mono text-sm space-y-4" style={{ background: '#151C26', border: '1px solid #374151' }}>
              {[
                { label: 'Email Score',                 val: threat.riskBreakdown.emailScore,    color: '#4CAF50' },
                { label: 'Password Score',              val: threat.riskBreakdown.passwordScore, color: '#7B61FF' },
                { label: 'Monitored Company Detected',  val: threat.riskBreakdown.companyScore,  color: '#00CFFF' },
                { label: 'Keyword Bonus',               val: threat.riskBreakdown.keywordBonus,  color: '#FFC857' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center">
                  <span style={{ color: '#9CA3AF' }}>{row.label}:</span>
                  <span className="font-bold" style={{ color: row.color }}>{row.val} pts</span>
                </div>
              ))}
              <div className="pt-3 flex justify-between items-center text-base font-black" style={{ borderTop: '1px solid #374151' }}>
                <span style={{ color: '#FFFFFF' }}>Total Calculated Score:</span>
                <span style={{ color: rc.text, textShadow: `0 0 8px ${rc.glow}` }}>{threat.riskScore} pts</span>
              </div>
            </div>
          </div>

          {/* Extracted Entities */}
          <div>
            <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: '#6B7280' }}>
              <Globe className="w-4 h-4" style={{ color: '#00CFFF' }} /> EXTRACTED ENTITIES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'LEAKED EMAILS',       count: threat.entities.emails.length,    items: threat.entities.emails,    icon: Mail,      color: '#4CAF50' },
                { label: 'LEAKED PASSWORDS',    count: threat.entities.passwords.length, items: threat.entities.passwords, icon: KeyRound,  color: '#7B61FF' },
                { label: 'MONITORED COMPANIES', count: threat.entities.companies.length, items: threat.entities.companies, icon: Building2, color: '#00CFFF' },
                { label: 'DETECTED KEYWORDS',   count: threat.entities.keywords.length,  items: threat.entities.keywords,  icon: Server,    color: '#FFC857' },
              ].map(section => {
                const Icon = section.icon;
                return (
                  <div key={section.label} className="p-4 rounded-xl" style={{ background: '#151C26', border: '1px solid #374151' }}>
                    <div className="text-[10px] font-bold flex items-center gap-2 mb-2 uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                      <Icon className="w-4 h-4" style={{ color: section.color }} />
                      {section.label} ({section.count})
                    </div>
                    {section.count === 0 ? (
                      <div className="text-xs font-mono" style={{ color: '#4B5563' }}>None detected</div>
                    ) : (
                      <div className="max-h-32 overflow-y-auto font-mono text-xs space-y-1">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="py-0.5 px-2 rounded" style={{ color: '#D1D5DB', background: 'rgba(255,255,255,0.03)', borderLeft: `2px solid ${section.color}40` }}>
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raw Content */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase mb-4 flex items-center gap-3" style={{ color: '#6B7280' }}>
              <FileText className="w-5 h-5" style={{ color: '#7B61FF' }} /> RAW INCIDENT LOG
            </h3>
            <div className="p-6 rounded-2xl font-mono text-sm whitespace-pre-wrap break-all leading-relaxed"
              style={{ background: '#040608', border: '1px solid #151C26', color: '#9CA3AF', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}>
              {threat.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex justify-between items-center text-sm font-mono"
          style={{ background: '#06080D', borderTop: '1px solid #151C26', color: '#6B7280' }}>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" style={{ color: '#00CFFF' }} />
            <span>TIMESTAMP: {new Date(threat.timestamp).toLocaleString()}</span>
          </div>
          <button onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold transition-all text-sm"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#9CA3AF', border: '1px solid #374151' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,207,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#00CFFF'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,207,255,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; (e.currentTarget as HTMLElement).style.borderColor = '#374151'; }}>
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
