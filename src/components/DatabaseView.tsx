import React, { useState, useMemo } from 'react';
import { ThreatAnalysis } from '../types';
import { Download, ArrowUpDown, Search } from 'lucide-react';

interface DatabaseViewProps {
  threats: ThreatAnalysis[];
  onSelectThreat: (threat: ThreatAnalysis) => void;
}

const riskStyle = (level: string) => ({
  HIGH:   { color: '#FF4444', bg: 'rgba(255,68,68,0.12)',   border: 'rgba(255,68,68,0.3)'   },
  MEDIUM: { color: '#FFC857', bg: 'rgba(255,200,87,0.12)',  border: 'rgba(255,200,87,0.3)'  },
  LOW:    { color: '#00FF9F', bg: 'rgba(0,255,159,0.12)',   border: 'rgba(0,255,159,0.3)'   },
} as Record<string,{color:string;bg:string;border:string}>)[level] ?? { color:'#9CA3AF', bg:'rgba(156,163,175,0.1)', border:'rgba(156,163,175,0.2)' };

export const DatabaseView: React.FC<DatabaseViewProps> = ({ threats, onSelectThreat }) => {
  const [riskFilter,  setRiskFilter ] = useState<string>('ALL');
  const [searchTerm,  setSearchTerm ] = useState<string>('');
  const [sortField,   setSortField  ] = useState<'riskScore'|'timestamp'>('timestamp');
  const [sortOrder,   setSortOrder  ] = useState<'asc'|'desc'>('desc');

  const filteredThreats = useMemo(() =>
    threats
      .filter(t => {
        const matchRisk   = riskFilter === 'ALL' || t.riskLevel === riskFilter;
        const matchSearch = t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.source.toLowerCase().includes(searchTerm.toLowerCase());
        return matchRisk && matchSearch;
      })
      .sort((a, b) => {
        const m = sortOrder === 'asc' ? 1 : -1;
        if (a[sortField] < b[sortField]) return -1 * m;
        if (a[sortField] > b[sortField]) return  1 * m;
        return 0;
      }),
    [threats, riskFilter, searchTerm, sortField, sortOrder]
  );

  const toggleSort = (field: 'riskScore'|'timestamp') => {
    if (sortField === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  };

  const exportCSV = () => {
    const headers = ['ID','Source','Type','RiskLevel','RiskScore','Timestamp'];
    const rows    = filteredThreats.map(t => [t.id, t.source, t.sourceType, t.riskLevel, t.riskScore, new Date(t.timestamp).toISOString()]);
    const csv     = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(r => r.join(',')).join('\n');
    const link    = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', 'threat_database_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const thStyle: React.CSSProperties = { padding: '16px 20px', color: '#6B7280', fontSize: '13px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '1px solid #151C26', background: '#06080D', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { padding: '16px 20px', fontSize: '14px', fontFamily: 'monospace', color: '#9CA3AF', borderBottom: '1px solid #0D111A', whiteSpace: 'nowrap' };

  return (
    <div className="p-6 space-y-6">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6" style={{ borderBottom: '1px solid #151C26' }}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#6B7280' }} />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-xl transition-all"
              style={{ background: '#151C26', border: '1px solid #374151', color: '#FFFFFF', outline: 'none' }}
            />
          </div>

          {/* Risk filter buttons */}
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(level => {
            const active = riskFilter === level;
            const rs = level === 'ALL' ? { color: '#00FF9F', bg: 'rgba(0,255,159,0.12)', border: 'rgba(0,255,159,0.3)' } : riskStyle(level);
            return (
              <button key={level} onClick={() => setRiskFilter(level)}
                className="px-4 py-2 rounded-xl text-sm font-bold font-mono transition-all"
                style={{
                  background: active ? rs.bg : 'rgba(255,255,255,0.03)',
                  color: active ? rs.color : '#6B7280',
                  border: `1px solid ${active ? rs.border : '#374151'}`,
                  boxShadow: active ? `0 0 8px ${rs.color}25` : 'none',
                }}>
                {level}
              </button>
            );
          })}
        </div>

        <button onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(0,255,159,0.08)', color: '#00FF9F', border: '1px solid rgba(0,255,159,0.3)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(0,255,159,0.25)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #151C26' }}>
        <table className="w-full text-left border-collapse" style={{ background: '#0D111A' }}>
          <thead>
            <tr>
              <th style={thStyle}>Source</th>
              <th style={thStyle}>Type</th>
              <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => toggleSort('riskScore')}>
                <div className="flex items-center gap-1">Risk <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th style={thStyle}>Emails</th>
              <th style={thStyle}>Passwords</th>
              <th style={thStyle}>Companies</th>
              <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => toggleSort('timestamp')}>
                <div className="flex items-center gap-1">Time <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredThreats.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center font-mono text-sm" style={{ color: '#4B5563' }}>
                  NO RECORDS FOUND
                </td>
              </tr>
            ) : (
              filteredThreats.map((threat, idx) => {
                const rs = riskStyle(threat.riskLevel);
                return (
                  <tr key={threat.id}
                    style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,255,159,0.03)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                  >
                    <td style={{ ...tdStyle, color: '#E5E7EB', fontWeight: 600 }}>{threat.source}</td>
                    <td style={tdStyle}>{threat.sourceType}</td>
                    <td style={tdStyle}>
                      <span className="px-3 py-1 rounded-lg text-xs font-black"
                        style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}>
                        {threat.riskLevel} · {threat.riskScore}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: '#00FF9F' }}>{threat.entities.emails.length}</td>
                    <td style={{ ...tdStyle, color: '#7B61FF' }}>{threat.entities.passwords.length}</td>
                    <td style={{ ...tdStyle, color: '#00FF9F' }}>{threat.entities.companies.length}</td>
                    <td style={{ ...tdStyle, color: '#6B7280', fontSize: '13px' }}>
                      {new Date(threat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => onSelectThreat(threat)}
                        className="text-xs font-bold transition-all px-2 py-1 rounded-lg"
                        style={{ color: '#00FF9F', background: 'rgba(0,255,159,0.08)', border: '1px solid rgba(0,255,159,0.2)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 8px rgba(0,255,159,0.3)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
                        Analyze
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Row count */}
      <p className="text-[11px] font-mono text-right" style={{ color: '#4B5563' }}>
        {filteredThreats.length} records · sorted by {sortField} ({sortOrder})
      </p>
    </div>
  );
};
