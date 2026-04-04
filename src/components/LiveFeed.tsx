import React, { useState } from 'react';
import { ThreatAnalysis } from '../types';
import { ShieldCheck, Database, BarChart3, ExternalLink, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { DatabaseView } from './DatabaseView';
import { AnalyticsView } from './AnalyticsView';

interface LiveFeedProps {
  threats: ThreatAnalysis[];
  searchTerm: string;
  onSelectThreat: (threat: ThreatAnalysis) => void;
}

const riskColor = (level: string) => ({
  HIGH:   { border: '#FF4444', bg: 'rgba(255,68,68,0.03)',  badge: '#FF4444', badgeBg: 'rgba(255,68,68,0.1)'   },
  MEDIUM: { border: '#FFC857', bg: 'rgba(255,200,87,0.03)', badge: '#FFC857', badgeBg: 'rgba(255,200,87,0.1)'  },
  LOW:    { border: '#00FF9F', bg: 'rgba(0,255,159,0.03)',  badge: '#00FF9F', badgeBg: 'rgba(0,255,159,0.1)'   },
})[level] ?? { border: '#374151', bg: 'transparent', badge: '#9CA3AF', badgeBg: 'rgba(156,163,175,0.1)' };

export const LiveFeed: React.FC<LiveFeedProps> = ({ threats, searchTerm, onSelectThreat }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'database' | 'analytics'>('feed');
  const [expandedThreatId, setExpandedThreatId] = useState<string | null>(null);

  const filteredThreats = threats.filter(t =>
    t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: string) => setExpandedThreatId(expandedThreatId === id ? null : id);

  const tabs = [
    { id: 'feed'      as const, label: 'Live Feed', icon: ShieldCheck },
    { id: 'database'  as const, label: 'Database',  icon: Database    },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3   },
  ];

  return (
    <div className="rounded-2xl overflow-hidden glass-card" style={{ background: '#0D111A', border: '1px solid #151C26' }}>

      {/* Header Tabs */}
      <div className="flex p-1" style={{ background: '#06080D', borderBottom: '1px solid #151C26' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-4 py-4 text-sm font-mono font-bold tracking-wider transition-all relative"
              style={{ color: isActive ? '#00FF9F' : '#6B7280', background: isActive ? 'rgba(0,255,159,0.05)' : 'transparent' }}
            >
              <Icon className="w-5 h-5" />
              {tab.label.toUpperCase()}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: '#00FF9F', boxShadow: '0 0 10px rgba(0,255,159,0.6)' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[500px]">
        {activeTab === 'feed' && (
          <div className="max-h-[600px] overflow-y-auto p-6 space-y-4">
            {filteredThreats.length === 0 ? (
              <div className="p-12 text-center font-mono text-base" style={{ color: '#4B5563' }}>
                NO THREATS MATCH SEARCH CRITERIA
              </div>
            ) : (
              filteredThreats.map((threat) => {
                const isExpanded = expandedThreatId === threat.id;
                const rc = riskColor(threat.riskLevel);

                return (
                  <div
                    key={threat.id}
                    className="p-6 rounded-xl transition-all relative group/card"
                    style={{
                      background: rc.bg,
                      border: `1px solid #151C26`,
                      borderLeft: `3px solid ${rc.border}`,
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = rc.border}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#151C26'}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap text-sm">
                          <span className="font-mono font-bold" style={{ color: '#9CA3AF' }}>{threat.source}</span>
                          {threat.isReal && (
                            <span className="px-2 py-1 rounded font-bold font-mono text-xs animate-pulse"
                              style={{ background: 'rgba(0,255,159,0.1)', color: '#00FF9F', border: '1px solid rgba(0,255,159,0.2)' }}>
                              TOR DISCOVERED
                            </span>
                          )}
                          <span style={{ color: '#374151' }}>•</span>
                          <span className="px-2 py-1 rounded font-mono text-xs"
                            style={{ background: 'rgba(255,255,255,0.04)', color: '#9CA3AF', border: '1px solid #374151' }}>
                            {threat.isReal ? 'Live Crawler' : threat.sourceType}
                          </span>
                          <span style={{ color: '#374151' }}>•</span>
                          <span className="font-mono text-xs" style={{ color: '#6B7280' }}>
                            {new Date(threat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-base font-mono mt-3 line-clamp-2" style={{ color: '#D1D5DB' }}>{threat.content}</p>

                        <div className="flex flex-wrap gap-2 mt-3 text-[10px] font-mono">
                          {threat.entities.emails.length > 0 && (
                            <span className="px-2 py-0.5 rounded border border-[#00FF9F]/20 bg-[#00FF9F]/5 text-[#00FF9F]">
                              {threat.entities.emails.length} emails
                            </span>
                          )}
                          {threat.entities.passwords.length > 0 && (
                            <span className="px-2 py-0.5 rounded border border-[#7B61FF]/20 bg-[#7B61FF]/5 text-[#7B61FF]">
                              {threat.entities.passwords.length} passwords
                            </span>
                          )}
                          {threat.entities.companies.length > 0 && (
                            <span className="px-2 py-0.5 rounded border border-[#00FF9F]/20 bg-[#00FF9F]/5 text-[#00FF9F]">
                              {threat.entities.companies.length} companies
                            </span>
                          )}
                          {threat.entities.keywords.map((k, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-gray-400">
                              #{k}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span className="px-3 py-1.5 rounded-xl text-xs font-black font-mono shadow-sm"
                          style={{ background: rc.badgeBg, color: rc.badge, border: `1px solid ${rc.border}30` }}>
                          SCORE {threat.riskScore}
                        </span>
                        <button onClick={() => toggleExpand(threat.id)} className="p-1.5 transition-colors hover:text-white" style={{ color: '#6B7280' }}>
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 pt-6 text-sm font-mono rounded-2xl p-5" style={{ borderTop: '1px solid #1F2937', background: 'rgba(0,0,0,0.2)' }}>
                        <div className="font-bold flex items-center gap-2 mb-3 text-[#00FF9F]">
                          <Info className="w-4 h-4" /> <span className="terminal-cursor uppercase">RAW CONTENT SUMMARY</span>
                        </div>
                        <div className="whitespace-pre-wrap break-all leading-relaxed" style={{ color: '#9CA3AF' }}>{threat.content}</div>
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={() => onSelectThreat(threat)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-[#00FF9F]/20 border border-[#00FF9F]/30"
                            style={{ background: 'rgba(0,255,159,0.1)', color: '#00FF9F' }}
                          >
                            <ExternalLink className="w-4 h-4" /> VIEW FULL ANALYSIS
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'database'  && <DatabaseView  threats={threats} onSelectThreat={onSelectThreat} />}
        {activeTab === 'analytics' && <AnalyticsView threats={threats} />}
      </div>
    </div>
  );
};
