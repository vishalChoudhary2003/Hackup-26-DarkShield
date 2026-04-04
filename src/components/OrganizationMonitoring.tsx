import React, { useState, useMemo } from 'react';
import { MonitoredCompany, ThreatAnalysis } from '../types';
import { COMPANIES_LIST } from '../engine/simulator';
import { Plus, X, Search, ChevronRight, Building, ShieldAlert, RefreshCw, Mail, Calendar, Eye } from 'lucide-react';

interface OrganizationMonitoringProps {
  companies: MonitoredCompany[];
  addCompany: (name: string, email?: string, password?: string) => void;
  threats: ThreatAnalysis[];
  startScan?: (url: string) => Promise<boolean>;
}

export const OrganizationMonitoring: React.FC<OrganizationMonitoringProps> = ({
  companies,
  addCompany,
  threats,
  startScan
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<MonitoredCompany | null>(null);
  const [addSearchTerm, setAddSearchTerm] = useState('');
  const [scanningCompanies, setScanningCompanies] = useState<Record<string, boolean>>({});
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');

  // Scan action simulation & real bridge
  const triggerScan = async (name: string, domain: string) => {
    setScanningCompanies(prev => ({ ...prev, [name]: true }));
    
    if (startScan) {
      await startScan(domain);
      setTimeout(() => {
        setScanningCompanies(prev => ({ ...prev, [name]: false }));
      }, 5000);
    } else {
      setTimeout(() => {
        setScanningCompanies(prev => ({ ...prev, [name]: false }));
      }, 2000);
    }
  };

  // Organizations overview stats
  const stats = useMemo(() => {
    const totalThreats = companies.reduce((sum, c) => sum + c.threats, 0);
    const activeAlerts = companies.filter(c => c.threats > 0).length;
    return [
      { label: 'Total Organizations', value: companies.length, color: 'text-gray-300', border: 'border-white/10' },
      { label: 'Active Alerts', value: activeAlerts, color: 'text-orange-400', border: 'border-orange-500/20' },
      { label: 'Total Threats Detected', value: totalThreats, color: 'text-red-400', border: 'border-red-500/20' },
      { label: 'Avg Risk Score', value: '54%', color: 'text-[#00FF9F]', border: 'border-[#00FF9F]/20' }
    ];
  }, [companies]);

  // Company Details Threats List
  const getCompanyThreats = (companyName: string) => {
    return threats.filter(t => t.entities.companies.some(c => c.toLowerCase() === companyName.toLowerCase()));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wider font-mono">ORGANIZATION MONITORING</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">Configure and analyze custom client assets for targeted deep web analysis.</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF4444] hover:bg-red-600 text-white font-mono text-xs font-bold rounded-xl border border-red-500 shadow-lg shadow-red-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          ADD ORGANIZATION
        </button>
      </div>

      {/* Mini stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className={`bg-white/[0.02] border ${s.border} p-4 rounded-xl glass-card`}>
            <span className="text-[10px] font-mono tracking-widest text-gray-500 block">{s.label.toUpperCase()}</span>
            <span className={`text-xl font-bold mt-1 block ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Grid of monitored companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {companies.map((company, index) => {
          const isScanning = scanningCompanies[company.name];
          const hasThreats = company.threats > 0;

          return (
            <div key={index} className="bg-[#111118]/80 border border-white/5 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between glass-card">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="text-md font-bold text-white truncate flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#00FF9F]" />
                      {company.name}
                    </h3>
                    <span className="text-xs font-mono text-gray-500 mt-0.5 block truncate">{company.domain}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    hasThreats ? 'bg-red-500/10 text-red-500' : 'bg-[#00FF9F]/10 text-[#00FF9F]'
                  }`}>
                    {hasThreats ? 'ALERT DETECTED' : 'MONITORING'}
                  </span>
                </div>

                {/* Risk score bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                    <span>Targeted Threats:</span>
                    <span className="font-bold text-white">{company.threats} incidents</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 relative">
                    <div 
                      className={`h-full rounded-full ${hasThreats ? 'bg-red-500' : 'bg-[#00FF9F]'}`} 
                      style={{ width: `${Math.min(company.threats * 10, 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#00FF9F]" />
                    <span>security@{company.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Last Scan: {company.lastSeen ? new Date(company.lastSeen).toLocaleTimeString() : 'Never'}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => {
                    if (!company.clientEmail || !company.clientPassword) {
                      const generatedEmail = `security@${company.domain}`;
                      const generatedPassword = `DarkShield_${Math.floor(1000 + Math.random() * 9000)}`;
                      company.clientEmail = generatedEmail;
                      company.clientPassword = generatedPassword;
                    }
                    setShowDetailModal(company);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 rounded-lg border border-white/10 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> DETAILS
                </button>
                <button
                  onClick={() => triggerScan(company.name, company.domain)}
                  disabled={isScanning}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#00FF9F]/10 hover:bg-[#00FF9F]/20 text-xs font-mono text-[#00FF9F] rounded-lg border border-[#00FF9F]/20 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  {isScanning ? 'SCANNING...' : 'SCAN NOW'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Organization Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl glass-card">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#06060a]">
              <h2 className="text-sm font-bold text-white tracking-wider font-mono">
                {selectedCompanyName ? 'CONFIGURE CLIENT CREDENTIALS' : 'ADD TARGET ORGANIZATION'}
              </h2>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedCompanyName(null);
                  setClientEmail('');
                  setClientPassword('');
                }} 
                className="text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!selectedCompanyName ? (
              <>
                <div className="p-4 border-b border-white/5">
                  <div className="relative">
                    <Search className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search companies database..."
                      value={addSearchTerm}
                      onChange={(e) => setAddSearchTerm(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2 text-sm focus:outline-none focus:border-[#00FF9F]/50"
                    />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                  {COMPANIES_LIST.filter(c => c.toLowerCase().includes(addSearchTerm.toLowerCase())).map((name, index) => {
                    const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
                    const threatCount = threats.filter(t => t.entities.companies.some(co => co.toLowerCase() === name.toLowerCase())).length;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedCompanyName(name);
                          setClientEmail(`security@${domain}`);
                          setClientPassword(`DarkShield_${Math.floor(1000 + Math.random() * 9000)}`);
                        }}
                        className="w-full p-4 flex justify-between items-center hover:bg-white/[0.02] text-left group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{name}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">{domain}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          {threatCount > 0 && (
                            <span className="text-[10px] font-mono bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">
                              {threatCount} detected
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-all" />
                        </div>
                      </button>
                    );
                  })}

                  
                  {addSearchTerm.trim() !== '' && !COMPANIES_LIST.some(c => c.toLowerCase() === addSearchTerm.toLowerCase()) && (
                    <button
                        onClick={() => {
                          setSelectedCompanyName(addSearchTerm);
                          const domain = addSearchTerm.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
                          setClientEmail(`security@${domain}`);
                          setClientPassword(`DarkShield_${Math.floor(1000 + Math.random() * 9000)}`);
                        }}
                        className="w-full p-4 flex justify-between items-center bg-[#00FF9F]/5 hover:bg-[#00FF9F]/10 text-left group border-t border-[#00FF9F]/20"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-[#00FF9F] group-hover:text-white transition-colors">+ Add Custom Organization</div>
                          <div className="text-xs text-[#00FF9F]/50 font-mono mt-0.5">Create entry for "{addSearchTerm}"</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#00FF9F]" />
                      </button>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 space-y-4">
                <div className="p-3 bg-[#00FF9F]/10 border border-[#00FF9F]/20 rounded-xl">
                  <span className="text-[10px] font-mono font-bold text-[#00FF9F] block uppercase tracking-wider mb-1">Company Selected</span>
                  <span className="text-sm font-bold text-white block">{selectedCompanyName}</span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">CLIENT LOGIN EMAIL</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none font-mono text-white focus:border-[#00FF9F]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">
                    CLIENT LOGIN PASSWORD <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter secure password"
                      value={clientPassword}
                      onChange={(e) => setClientPassword(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none font-mono text-white focus:border-[#00FF9F]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setClientPassword(`Pass_${Math.random().toString(36).slice(-6).toUpperCase()}`)}
                      className="px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono text-gray-300"
                    >
                      GENERATE
                    </button>
                  </div>
                  <p className="text-[10px] text-yellow-500 font-mono mt-1">⚠️ Remember to share this password with the client for portal login.</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setSelectedCompanyName(null)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-400 rounded-xl border border-white/10 transition-all"
                  >
                    BACK
                  </button>
                  <button
                    onClick={() => {
                      addCompany(selectedCompanyName, clientEmail, clientPassword);
                      setShowAddModal(false);
                      setSelectedCompanyName(null);
                      setClientEmail('');
                      setClientPassword('');
                    }}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-xl border border-red-400 shadow-lg shadow-red-900/20 transition-all"
                  >
                    PROVISION PORTAL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl glass-card">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#06060a]">
              <div>
                <h2 className="text-lg font-bold text-white font-mono">{showDetailModal.name}</h2>
                <span className="text-xs text-gray-500 font-mono">{showDetailModal.domain}</span>
              </div>
              <button onClick={() => setShowDetailModal(null)} className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-xl">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono">
                  <span className="text-[10px] text-gray-500 block">THREAT COUNT</span>
                  <span className="text-xl font-bold text-white block mt-1">{showDetailModal.threats}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono">
                  <span className="text-[10px] text-gray-500 block">HIGH RISK</span>
                  <span className="text-xl font-bold text-red-500 block mt-1">
                    {getCompanyThreats(showDetailModal.name).filter(t => t.riskLevel === 'HIGH').length}
                  </span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono">
                  <span className="text-[10px] text-gray-500 block">EMAILS DETECTED</span>
                  <span className="text-xl font-bold text-[#00FF9F] block mt-1">
                    {getCompanyThreats(showDetailModal.name).reduce((sum, t) => sum + t.entities.emails.length, 0)}
                  </span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono">
                  <span className="text-[10px] text-gray-500 block">PASSWORDS FOUND</span>
                  <span className="text-xl font-bold text-purple-500 block mt-1">
                    {getCompanyThreats(showDetailModal.name).reduce((sum, t) => sum + t.entities.passwords.length, 0)}
                  </span>
                </div>
              </div>

              {/* Client Portal Credentials */}
              {showDetailModal.clientEmail && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl font-mono">
                  <span className="text-[10px] text-yellow-500 font-bold block mb-2 uppercase tracking-widest">🔑 CLIENT PORTAL ACCESS CREDENTIALS</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-gray-400 block">CLIENT EMAIL</span>
                      <span className="text-sm font-bold text-white block mt-1">{showDetailModal.clientEmail}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">CLIENT PASSWORD</span>
                      <span className="text-sm font-bold text-purple-400 block mt-1">{showDetailModal.clientPassword || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Threat Feed List */}
              <div>
                <h3 className="text-xs font-mono font-bold text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-yellow-500" />
                  INCIDENT LOGS ({getCompanyThreats(showDetailModal.name).length})
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {getCompanyThreats(showDetailModal.name).length === 0 ? (
                    <div className="text-center text-gray-600 font-mono text-xs py-8 border border-dashed border-white/5 rounded-xl">
                      NO LEAKS DETECTED FOR THIS ORGANIZATION
                    </div>
                  ) : (
                    getCompanyThreats(showDetailModal.name).map((threat, idx) => (
                      <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono text-white">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[#00FF9F] font-bold">{threat.source}</span>
                          <span className={`px-1 rounded text-[9px] font-bold ${
                            threat.riskLevel === 'HIGH' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                          }`}>{threat.riskLevel}</span>
                        </div>
                        <p className="text-gray-400 line-clamp-2 mt-1">{threat.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
