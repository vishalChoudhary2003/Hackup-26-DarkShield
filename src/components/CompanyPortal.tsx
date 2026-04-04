import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  PieChart, 
  Zap, 
  Activity, 
  ChevronRight,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { ThreatAnalysis, User } from '../types';
import { ThreatDetail } from './ThreatDetail';

interface CompanyPortalProps {
  user: User;
  threats: ThreatAnalysis[];
  activeTab: 'company-dashboard' | 'company-threats' | 'company-settings';
  setActiveTab: (tab: any) => void;
}

const CompanyPortal: React.FC<CompanyPortalProps> = ({ user, threats, activeTab, setActiveTab }) => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatAnalysis | null>(null);
  const companyName = user.username.split('@')[0].toUpperCase();
  
  // Filter threats specific to this company
  const companyThreats = threats.filter(t => 
    t.entities.companies.some(c => c.toLowerCase().includes(companyName.toLowerCase())) ||
    t.content.toLowerCase().includes(companyName.toLowerCase())
  );

  const highRiskThreats = companyThreats.filter(t => t.riskLevel === 'HIGH').length;
  const avgRiskScore = companyThreats.length > 0 
    ? Math.round(companyThreats.reduce((acc, curr) => acc + curr.riskScore, 0) / companyThreats.length) 
    : 0;

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D111A]/90 border border-[#00FF9F]/20 p-5 rounded-xl backdrop-blur-md">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#00FF9F]/10 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-[#00FF9F]" />
            </div>
            <span className="text-[10px] font-bold text-[#00FF9F] bg-[#00FF9F]/10 px-2 py-0.5 rounded uppercase tracking-wider">Active Monitor</span>
          </div>
          <p className="text-gray-400 text-sm">Total Detected Threats</p>
          <p className="text-2xl font-bold text-white mt-1">{companyThreats.length}</p>
        </div>

        <div className="bg-[#0D111A]/90 border border-red-500/20 p-5 rounded-xl backdrop-blur-md">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded uppercase tracking-wider gap-1">
              <ArrowUpRight className="w-3 h-3" /> Urgent
            </span>
          </div>
          <p className="text-gray-400 text-sm">High Risk Breaches</p>
          <p className="text-2xl font-bold text-white mt-1">{highRiskThreats}</p>
        </div>

        <div className="bg-[#0D111A]/90 border border-purple-500/20 p-5 rounded-xl backdrop-blur-md">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm">Average Risk Score</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-white mt-1">{avgRiskScore}</p>
            <p className="text-xs text-purple-400 mb-1">/ 100</p>
          </div>
        </div>

        <div className="bg-[#0D111A]/90 border border-emerald-500/20 p-5 rounded-xl backdrop-blur-md">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm">Dark Web Surface Area</p>
          <p className="text-2xl font-bold text-white mt-1">2.4 TB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0D111A]/50 border border-white/5 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#00FF9F]" /> Recent Exposure Events
            </h3>
            <button 
              onClick={() => setActiveTab('company-threats')}
              className="text-sm text-[#00FF9F] hover:text-[#00FF9F]/80 transition-colors flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {companyThreats.slice(0, 5).map((threat) => (
              <div 
                key={threat.id}
                onClick={() => setSelectedThreat(threat)}
                className="group flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-[#00FF9F]/30 hover:bg-[#00FF9F]/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-10 rounded-full ${
                    threat.riskLevel === 'HIGH' ? 'bg-red-500' : threat.riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-[#00FF9F]'
                  }`} />
                  <div>
                    <p className="text-white font-medium line-clamp-1">{threat.source}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(threat.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10 uppercase tracking-tighter">
                        {threat.sourceType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-bold ${
                      threat.riskLevel === 'HIGH' ? 'text-red-400' : 'text-gray-300'
                    }`}>{threat.riskScore} Score</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{threat.riskLevel}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#00FF9F] transition-colors" />
                </div>
              </div>
            ))}
            {companyThreats.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                <Building2 className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No active threats detected for your domain yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#00FF9F]/20 to-purple-600/20 border border-[#00FF9F]/20 rounded-xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-4">Security Score</h3>
            <div className="relative h-48 flex items-center justify-center">
              <svg className="w-40 h-40">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle cx="80" cy="80" r="70" stroke="#00FF9F" strokeWidth="8" fill="transparent" 
                  strokeDasharray={440} 
                  strokeDashoffset={440 - (440 * (100 - avgRiskScore)) / 100} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{100 - avgRiskScore}</span>
                <span className="text-[10px] text-[#00FF9F] font-bold uppercase tracking-[0.2em]">Safety Rating</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Credential Security</span>
                <span className="text-emerald-400">Good</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Leak Resilience</span>
                <span className="text-yellow-400">Average</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Dark Web Noise</span>
                <span className="text-red-400">High</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f2e]/80 border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all gap-2 group">
                <Download className="w-5 h-5 text-gray-400 group-hover:text-[#00FF9F]" />
                <span className="text-[10px] text-gray-400 uppercase font-bold">Report</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all gap-2 group">
                <ShieldAlert className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                <span className="text-[10px] text-gray-400 uppercase font-bold">Takedown</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThreats = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Incidents</h2>
          <p className="text-gray-400 text-sm">Real-time exposure logs detected by DarkShield AI.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search content..." 
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF9F]/50 w-64"
            />
          </div>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-[#1a1f2e]/60 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Incident Source</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entities</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Risk Level</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Detection Date</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {companyThreats.map((threat) => (
              <tr 
                key={threat.id}
                className="hover:bg-[#00FF9F]/5 transition-colors cursor-pointer group"
                onClick={() => setSelectedThreat(threat)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-[#00FF9F]/30 transition-colors">
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-[200px]">{threat.source}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{threat.sourceType}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {threat.entities.emails.length > 0 && (
                      <div className="w-7 h-7 rounded-full bg-[#00FF9F]/20 border border-[#00FF9F]/30 flex items-center justify-center text-[10px] text-[#00FF9F] font-bold" title={`${threat.entities.emails.length} Emails`}>@</div>
                    )}
                    {threat.entities.passwords.length > 0 && (
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] text-purple-400 font-bold" title={`${threat.entities.passwords.length} Passwords`}>***</div>
                    )}
                    {threat.entities.ipAddresses.length > 0 && (
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400 font-bold" title={`${threat.entities.ipAddresses.length} IPs`}>IP</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                    threat.riskLevel === 'HIGH' 
                      ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                      : threat.riskLevel === 'MEDIUM' 
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' 
                      : 'bg-[#00FF9F]/10 border border-[#00FF9F]/30 text-[#00FF9F]'
                  }`}>
                    {threat.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-400">{new Date(threat.timestamp).toLocaleDateString()}</p>
                  <p className="text-[10px] text-gray-600">{new Date(threat.timestamp).toLocaleTimeString()}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 text-gray-600 hover:text-[#00FF9F] transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Company Profile</h2>
        <p className="text-gray-400 text-sm">Manage your organization's monitoring parameters and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-[#1a1f2e]/60 border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00FF9F]" /> Identity Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Organization Name</label>
                <input 
                  type="text" 
                  defaultValue={companyName}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00FF9F]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Primary Domain</label>
                <input 
                  type="text" 
                  defaultValue={`${companyName.toLowerCase()}.com`}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00FF9F]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Administrative Email</label>
                <input 
                  type="email" 
                  defaultValue={user.username}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00FF9F]/50"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f2e]/60 border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Notification Thresholds
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Critical Alerts</p>
                  <p className="text-xs text-gray-500">Email notifications for Risk Score {'>'} 80</p>
                </div>
                <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-[#00FF9F]">
                  <span className="translate-x-5 inline-block h-4 w-4 transform rounded-full bg-black transition" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">Weekly Digest</p>
                  <p className="text-xs text-gray-500">Summary of all lower risk exposures</p>
                </div>
                <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-white/10">
                  <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-gray-400 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1f2e]/60 border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> Monitoring Scope
            </h3>
            <p className="text-xs text-gray-400 mb-4 italic">What we scan for in the Dark Web:</p>
            <div className="space-y-3">
              {['Credential Dumps', 'Brand Mentions', 'VIP Email Exposure', 'Domain Spoofing', 'Database Leaks'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#00FF9F]/10 border border-[#00FF9F]/20 rounded-xl p-6">
            <h3 className="text-sm font-bold text-[#00FF9F] mb-2">Pro Monitoring Active</h3>
            <p className="text-xs text-[#00FF9F]/70 mb-4">You are currently on the Enterprise Plan. All monitoring modules are enabled.</p>
            <button className="w-full py-2 bg-[#00FF9F]/80 hover:bg-[#00FF9F] text-black rounded-lg text-sm font-bold transition-colors">
              Manage Billing
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button className="px-6 py-2 rounded-lg text-gray-400 hover:text-white text-sm font-bold transition-colors">
          Discard Changes
        </button>
        <button className="px-8 py-2 bg-[#00FF9F] hover:bg-[#00FF9F]/90 text-black rounded-lg text-sm font-bold transition-colors shadow-lg shadow-[#00FF9F]/20">
          Save Configuration
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 pb-20">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-[#00FF9F] rounded-xl shadow-lg shadow-[#00FF9F]/20">
          <Building2 className="w-8 h-8 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">{companyName} <span className="text-[#00FF9F]">Security Portal</span></h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Monitoring Active
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{user.username}</span>
          </div>
        </div>
      </div>

      {activeTab === 'company-dashboard' && renderDashboard()}
      {activeTab === 'company-threats' && renderThreats()}
      {activeTab === 'company-settings' && renderSettings()}

      {selectedThreat && (
        <ThreatDetail 
          threat={selectedThreat} 
          onClose={() => setSelectedThreat(null)} 
        />
      )}
    </div>
  );
};

export default CompanyPortal;
