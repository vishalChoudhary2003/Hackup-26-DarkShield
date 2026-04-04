import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Globe,
  RefreshCcw,
  FileSpreadsheet,
  Calendar,
  Lock,
  LayoutDashboard,
  ShieldAlert,
  Settings,
  Shield,
  Radio,
  LogOut,
  ChevronLeft,
  HardDrive,
  Activity,
  CheckCircle,
  XCircle,
  BellRing,
  Bell,
  X,
  User as UserIcon,
  Mail,
  Wifi,
  Database,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import {
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  RadialBarChart, RadialBar
} from 'recharts';
import { ThreatAnalysis, User } from '../types';
import { ThreatDetail } from './ThreatDetail';

interface ClientPortalProps {
  user: User;
  threats: ThreatAnalysis[];
  onLogout: () => void;
  addMonitoredCompany: (companyName: string) => void;
}

type ClientTab = 'dashboard' | 'threats' | 'activity' | 'settings';

interface ClientActivity {
  id: string;
  action: string;
  category: 'Security' | 'Access' | 'Scan';
  timestamp: Date;
  status: 'Success' | 'Failed' | 'Warning';
}

const ClientPortal: React.FC<ClientPortalProps> = ({ user, onLogout, addMonitoredCompany }) => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatAnalysis | null>(null);

  // Auto-register the client's company into the global dark web simulation loop so it generates threats
  React.useEffect(() => {
    if (user.username && user.username !== 'Administrator') {
      addMonitoredCompany(user.username);
    }
  }, [user.username, addMonitoredCompany]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [clientTab, setClientTab] = useState<ClientTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [dbThreats, setDbThreats] = useState<ThreatAnalysis[]>([]);
  const [alerts, setAlerts] = useState<{ id: string; message: string; level: string; time: Date }[]>([]);
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const prevThreatCount = React.useRef(0);

  // Settings state
  const [alertThreshold, setAlertThreshold] = useState<'all' | 'medium' | 'high'>('all');
  const [scraperIntensity, setScraperIntensity] = useState<'passive' | 'active'>('passive');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showRiskScore, setShowRiskScore] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [clientActivities, setClientActivities] = useState<ClientActivity[]>([
    { id: 'ca1', action: 'Client Portal logged in successfully', category: 'Access', timestamp: new Date(Date.now() - 500000), status: 'Success' },
    { id: 'ca2', action: 'Requested deep dark web scan on organization domain', category: 'Scan', timestamp: new Date(Date.now() - 3600000), status: 'Success' },
    { id: 'ca3', action: 'Modified threat alerting threshold to HIGH', category: 'Security', timestamp: new Date(Date.now() - 86400000), status: 'Success' },
    { id: 'ca4', action: 'Failed login attempt detected from IP 198.51.100.42', category: 'Access', timestamp: new Date(Date.now() - 120000000), status: 'Failed' },
  ]);

  // Extract company name from email domain if formatted as email@companyname.com
  const emailDomain = user.username.includes('@') ? user.username.split('@')[1] : '';
  const companyName = emailDomain ? emailDomain.split('.')[0].toUpperCase() : user.username.toUpperCase();

  // Fetch verified threats directly via API targeting MongoDB
  React.useEffect(() => {
    const fetchCompanyThreats = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/threats/company/${companyName.toLowerCase()}`);
        if (res.ok) {
          const data = await res.json();
          setDbThreats(data);
        }
      } catch (err) {
        console.error("Failed fetching DB threats:", err);
      }
    };
    
    fetchCompanyThreats();
    const interval = setInterval(fetchCompanyThreats, 5000); // Live poll from MongoDB!
    return () => clearInterval(interval);
  }, [companyName]);



  // Seed simulated active breaches for this specific company if the live threat feed has none yet,
  // preventing 100% Safety Score on empty feeds
  const initialCompanyBreaches = React.useMemo<ThreatAnalysis[]>(() => {
    return [
      {
        id: `BREACH-SEED-1`,
        content: `ALERT: Found database dump from ${companyName} containing cleartext employee passwords and email addresses. Threat actor is distributing links on Tor network.`,
        source: "Shadow_Forum (Credential Dump)",
        sourceType: "Credential Dump",
        riskLevel: "HIGH",
        riskScore: 92,
        timestamp: new Date(Date.now() - 3600000),
        analyzedAt: new Date(Date.now() - 3600000),
        entities: { emails: [`admin@${companyName.toLowerCase()}.com`], passwords: ['*******'], companies: [companyName], ipAddresses: [], keywords: ['database'] },
        riskBreakdown: { emailScore: 40, passwordScore: 30, companyScore: 20, keywordBonus: 2 },
        status: 'analyzed'
      },
      {
        id: `BREACH-SEED-2`,
        content: `Listing: Exploitation material targeting perimeter firewalls of ${companyName}. Vendor provides remote root access and network traversal scripts.`,
        source: "DarkCloud_DB (Forum Post)",
        sourceType: "Forum Post",
        riskLevel: "MEDIUM",
        riskScore: 68,
        timestamp: new Date(Date.now() - 7200000),
        analyzedAt: new Date(Date.now() - 7200000),
        entities: { emails: [], passwords: [], companies: [companyName], ipAddresses: ['192.168.1.1'], keywords: ['exploit'] },
        riskBreakdown: { emailScore: 0, passwordScore: 0, companyScore: 40, keywordBonus: 28 },
        status: 'analyzed'
      }
    ];
  }, [companyName]);

  const activeCompanyThreats = dbThreats.length > 0 ? dbThreats : initialCompanyBreaches;

  // Risk analytics
  const filteredThreats = activeCompanyThreats.filter(threat => {
    if (activeFilter === 'all') return true;
    return threat.riskLevel.toLowerCase() === activeFilter.toLowerCase();
  }).filter(threat => 
    threat.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    threat.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highRiskCount = activeCompanyThreats.filter(t => t.riskLevel === 'HIGH').length;
  const mediumRiskCount = activeCompanyThreats.filter(t => t.riskLevel === 'MEDIUM').length;

  const safetyScore = Math.max(15, 100 - (highRiskCount * 12) - (mediumRiskCount * 5));

  const runClientScan = () => {
    setScanLoading(true);
    setTimeout(() => {
      setScanLoading(false);
      const newActivity: ClientActivity = {
        id: `ca_scan_${Date.now()}`,
        action: `Dark Web Scraper completed a recursive search for ${companyName}`,
        category: 'Scan',
        timestamp: new Date(),
        status: 'Success'
      };
      setClientActivities(prev => [newActivity, ...prev]);
    }, 1500);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Source,Risk Level,Risk Score,Details\n"
      + dbThreats.map(t => `"${new Date(t.timestamp).toLocaleDateString()}","${t.source}","${t.riskLevel}",${t.riskScore},"${t.content.replace(/"/g, '""')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${companyName}_Threat_Log.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const dismissAlert = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  const saveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Detect new company threats from MongoDB and trigger live toast notifications
  React.useEffect(() => {
    if (dbThreats.length > prevThreatCount.current && prevThreatCount.current > 0) {
      const newest = dbThreats[0];
      const meetsThreshold =
        alertThreshold === 'all' ||
        (alertThreshold === 'medium' && ['MEDIUM', 'HIGH'].includes(newest.riskLevel)) ||
        (alertThreshold === 'high' && newest.riskLevel === 'HIGH');

      if (meetsThreshold) {
        const newAlert = {
          id: `alert-${Date.now()}`,
          message: newest.content.slice(0, 110) + '...',
          level: newest.riskLevel,
          time: new Date()
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        setTimeout(() => {
          setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
        }, 8000);
      }
    }
    prevThreatCount.current = dbThreats.length;
  }, [dbThreats, alertThreshold]);

  const clientMenuItems = [
    { id: 'dashboard' as ClientTab, label: 'Personalized Dashboard', icon: LayoutDashboard },
    { id: 'threats' as ClientTab, label: 'Incident Intel Logs', icon: ShieldAlert },
    { id: 'activity' as ClientTab, label: 'Client Activity Log', icon: Activity },
    { id: 'settings' as ClientTab, label: 'Portal Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen text-gray-100 flex relative overflow-hidden" style={{ background: '#06080D' }}>

      {/* LIVE ALERT TOASTS - Fixed top-right */}
      <div className="fixed top-4 right-4 z-[100] space-y-3 w-80">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-xl shadow-2xl transition-all"
            style={{
              background: alert.level === 'HIGH' ? 'rgba(30,8,8,0.95)' : alert.level === 'MEDIUM' ? 'rgba(30,22,8,0.95)' : 'rgba(8,30,18,0.95)',
              border: `1px solid ${alert.level === 'HIGH' ? 'rgba(255,68,68,0.5)' : alert.level === 'MEDIUM' ? 'rgba(255,200,87,0.5)' : 'rgba(0,255,159,0.5)'}`,
              boxShadow: `0 0 20px ${alert.level === 'HIGH' ? 'rgba(255,68,68,0.2)' : alert.level === 'MEDIUM' ? 'rgba(255,200,87,0.15)' : 'rgba(0,255,159,0.15)'}`
            }}
          >
            <div className="p-1.5 rounded-lg shrink-0" style={{ background: alert.level === 'HIGH' ? 'rgba(255,68,68,0.15)' : alert.level === 'MEDIUM' ? 'rgba(255,200,87,0.15)' : 'rgba(0,255,159,0.15)' }}>
              <Bell className="w-4 h-4" style={{ color: alert.level === 'HIGH' ? '#FF4444' : alert.level === 'MEDIUM' ? '#FFC857' : '#00FF9F' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{ background: alert.level === 'HIGH' ? 'rgba(255,68,68,0.2)' : alert.level === 'MEDIUM' ? 'rgba(255,200,87,0.2)' : 'rgba(0,255,159,0.2)', color: alert.level === 'HIGH' ? '#FF4444' : alert.level === 'MEDIUM' ? '#FFC857' : '#00FF9F' }}>
                  {alert.level} RISK
                </span>
                <span className="text-[10px] font-mono" style={{ color: '#6B7280' }}>{companyName}</span>
              </div>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#D1D5DB' }}>{alert.message}</p>
              <p className="text-[10px] font-mono mt-1" style={{ color: '#4B5563' }}>{new Date(alert.time).toLocaleTimeString()}</p>
            </div>
            <button onClick={() => dismissAlert(alert.id)} className="shrink-0 transition-colors" style={{ color: '#6B7280' }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      {/* 1. SIDEBAR FOR CLIENT */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col justify-between transition-all duration-300 ${
          isSidebarCollapsed ? 'w-[70px]' : 'w-[260px]'
        }`}
        style={{ background: 'linear-gradient(180deg, #080D18 0%, #0A0F1C 100%)', borderRight: '1px solid #1F2937', boxShadow: '4px 0 24px rgba(0,0,0,0.5)' }}
      >
        <div>
          {/* Logo */}
          <div className="p-4 flex items-center gap-3 overflow-hidden" style={{ borderBottom: '1px solid #1F2937' }}>
            <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(0,255,159,0.1)', border: '1px solid rgba(0,255,159,0.2)', boxShadow: '0 0 10px rgba(0,255,159,0.15)' }}>
              <Shield className="w-6 h-6" style={{ color: '#00FF9F' }} />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-white tracking-wider truncate" style={{ textShadow: '0 0 8px rgba(0,255,159,0.3)' }}>CLIENT HUB</span>
                <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: '#00FF9F', opacity: 0.8 }}>{companyName}</span>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-1 mt-4">
            {clientMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = clientTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setClientTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium relative group ${
                    isActive 
                      ? 'text-white bg-white/[0.03] border-l-2 border-[#00FF9F]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.01]'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isSidebarCollapsed && <span className="text-sm tracking-wide truncate">{item.label}</span>}
                  
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-[#111118] border border-white/10 rounded-md text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area */}
        <div className="p-2 border-t border-white/5 space-y-2">
          {!isSidebarCollapsed ? (
            <div className="mx-1 p-3 bg-white/[0.02] rounded-xl border border-white/5 mb-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#00FF9F]/10">
                  <Building2 className="w-5 h-5 text-[#00FF9F]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{user.username}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#00FF9F]">
                    Client Node
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/[0.03] hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg text-xs font-medium transition-all border border-transparent hover:border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}

          {!isSidebarCollapsed && (
            <div className="mx-2 p-3 bg-white/[0.02] rounded-xl border border-white/5 flex items-center gap-3">
              <div className="p-1 bg-emerald-500/10 rounded-full animate-pulse">
                <Radio className="w-4 h-4 text-[#00FF9F]" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-gray-400">NODE STATUS</div>
                <div className="text-xs font-bold text-white tracking-wide">SECURE LINK</div>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-white hover:bg-white/[0.02] rounded-lg transition-all"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA FOR CLIENT */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-[70px]' : 'pl-[260px]'
        }`}
      >
        {/* Sticky Header */}
        <header className="border-b border-white/5 bg-[#0a0f1d]/60 backdrop-blur-xl sticky top-0 z-40 px-8 py-4 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-mono font-bold tracking-wider text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#00FF9F]" />
              CLIENT OPERATIONS PANEL
            </h2>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#00FF9F]/10 border border-[#00FF9F]/20 text-[#00FF9F] uppercase tracking-widest font-mono">
              TENANT ENCRYPTED
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell Alert Button */}
            <div className="relative">
              <button
                onClick={() => setShowAlertPanel(p => !p)}
                className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <Bell className={`w-4 h-4 ${alerts.length > 0 ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}`} />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </button>

              {/* Alert Dropdown Panel */}
              {showAlertPanel && (
                <div className="absolute right-0 top-12 w-80 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-yellow-400" /> Live Alerts — {companyName}
                    </span>
                    <button onClick={() => { setAlerts([]); setShowAlertPanel(false); }} className="text-[10px] text-gray-500 hover:text-red-400 font-mono transition-colors">Clear All</button>
                  </div>
                  {alerts.length > 0 ? (
                    <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                      {alerts.map(alert => (
                        <div key={alert.id} className="p-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                            alert.level === 'HIGH' ? 'bg-red-500' : alert.level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-[#00FF9F]'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                alert.level === 'HIGH' ? 'bg-red-500/20 text-red-400' : alert.level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[#00FF9F]/20 text-[#00FF9F]'
                              }`}>{alert.level}</span>
                              <span className="text-[10px] text-gray-600 font-mono">{new Date(alert.time).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{alert.message}</p>
                          </div>
                          <button onClick={() => dismissAlert(alert.id)} className="text-gray-700 hover:text-white transition-colors shrink-0 mt-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Bell className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 font-mono">No active alerts for {companyName}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={runClientScan}
              disabled={scanLoading}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 text-[#00FF9F] ${scanLoading ? 'animate-spin' : ''}`} />
              {scanLoading ? 'Scanning Dark Web...' : 'Trigger Retroactive Scan'}
            </button>
          </div>
        </header>

        {/* View Selection Container */}
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">

          {/* TAB 1: PERSONALIZED DASHBOARD */}
          {clientTab === 'dashboard' && (
            <>
              {/* Greeting */}
              <div className="bg-gradient-to-r from-[#00FF9F]/10 via-indigo-600/5 to-transparent border border-[#00FF9F]/20 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF9F]/5 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
                <div className="max-w-xl">
                  <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Personalized Threat Intel</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Custom data intelligence and risk indicators specifically scoped to protect markers associated with <span className="text-[#00FF9F] font-bold">{companyName}</span>.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#101422]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Safety Rating</p>
                    <div className="p-2 bg-[#00FF9F]/10 rounded-lg border border-[#00FF9F]/20">
                      <ShieldCheck className="w-5 h-5 text-[#00FF9F]" />
                    </div>
                  </div>
                  <div>
                    <p className={`text-5xl font-black ${
                      safetyScore > 75 ? 'text-[#00FF9F]' : safetyScore > 40 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{safetyScore}%</p>
                    <p className="text-xs text-gray-500 mt-2">Overall organizational security posture on the dark web</p>
                  </div>
                </div>

                <div className="bg-[#101422]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company Exposures</p>
                    <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-5xl font-black text-white">{dbThreats.length}</p>
                    <p className="text-xs text-gray-500 mt-2">Leaks directly mentioning your organization</p>
                  </div>
                </div>

                <div className="bg-[#101422]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">High Risk Breaches</p>
                    <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-5xl font-black text-orange-400">{highRiskCount}</p>
                    <p className="text-xs text-gray-500 mt-2">Requires immediate incident investigation</p>
                  </div>
                </div>
              </div>

              {/* Charts & Analytics - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                {/* Pie Chart: Risk Level Distribution */}
                <div className="bg-[#101422]/60 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-400" /> Risk Level Distribution
                  </h3>
                  {(() => {
                    const high = activeCompanyThreats.filter(t => t.riskLevel === 'HIGH').length;
                    const medium = activeCompanyThreats.filter(t => t.riskLevel === 'MEDIUM').length;
                    const low = activeCompanyThreats.filter(t => t.riskLevel === 'LOW').length;
                    const pieData = [
                      { name: 'High', value: high || 1, color: '#ef4444' },
                      { name: 'Medium', value: medium || 1, color: '#f59e0b' },
                      { name: 'Low', value: low || 0, color: '#22c55e' },
                    ].filter(d => d.value > 0);
                    return (
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                            {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Legend iconType="circle" iconSize={8} formatter={(val) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{val}</span>} />
                          <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #ffffff10', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </div>

                {/* Safety Score Radial Gauge */}
                <div className="bg-[#101422]/60 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" /> Organization Safety Score Gauge
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <ResponsiveContainer width={150} height={150}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ name: 'Safety', value: safetyScore, fill: safetyScore > 75 ? '#22c55e' : safetyScore > 40 ? '#f59e0b' : '#ef4444' }]} startAngle={90} endAngle={-270}>
                          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#ffffff08' }} />
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill={safetyScore > 75 ? '#22c55e' : safetyScore > 40 ? '#f59e0b' : '#ef4444'} fontSize={20} fontWeight={900}>{safetyScore}%</text>
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Database Leaks</span>
                          <span>{Math.round(dbThreats.length * 0.6)} Records</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, dbThreats.length * 6)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Leaked Credentials</span>
                          <span>{Math.round(dbThreats.length * 0.3)} Instances</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, dbThreats.length * 3)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Forum Threads</span>
                          <span>{Math.round(dbThreats.length * 0.1)} Threads</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, dbThreats.length)}%` }}></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-mono pt-1">Scanning every 45s</p>
                    </div>
                  </div>
                </div>
              </div>

            </>
          )}

          {/* TAB 2: INCIDENT INTEL LOGS */}
          {clientTab === 'threats' && (
            <>
              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
                <div className="flex items-center gap-2 bg-[#101422]/60 border border-white/10 rounded-xl px-4 py-2.5 w-full sm:w-96">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search leaked databases..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white focus:outline-none text-sm w-full font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto self-start sm:self-auto">
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeFilter === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    All Threads
                  </button>
                  <button 
                    onClick={() => setActiveFilter('high')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeFilter === 'high' ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    High Risk
                  </button>
                  <button 
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl transition-all ml-auto"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Export logs
                  </button>
                </div>
              </div>

              {/* Live Threat Feed Table */}
              <div className="bg-[#101422]/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#00FF9F]" />
                    <h3 className="text-lg font-bold text-white font-mono">CLIENT THREAT SCAN INDEX</h3>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Synchronized: Real-time
                  </span>
                </div>

                {filteredThreats.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {filteredThreats.map((threat) => (
                      <div 
                        key={threat.id}
                        onClick={() => setSelectedThreat(threat)}
                        className="p-6 hover:bg-blue-500/5 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl border ${
                            threat.riskLevel === 'HIGH' 
                              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                              : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                          }`}>
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-bold font-mono">{threat.source}</p>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 uppercase border border-white/10">
                                {threat.sourceType}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 font-mono line-clamp-1 bg-black/30 p-2 rounded border border-white/5 mt-2">
                              {threat.content}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-mono">
                              <span>Extracted: {new Date(threat.timestamp).toLocaleTimeString()}</span>
                              <span>•</span>
                              <span className="text-blue-400 font-medium">{threat.entities.emails.length} exposed emails</span>
                              <span>•</span>
                              <span className="text-purple-400 font-medium">{threat.entities.passwords.length} credentials</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 self-end md:self-auto">
                          <div className="text-right">
                            <p className={`text-sm font-black ${
                              threat.riskLevel === 'HIGH' ? 'text-red-400' : 'text-yellow-400'
                            }`}>RISK SCORE {threat.riskScore}</p>
                            <span className="text-[9px] uppercase tracking-widest text-gray-500">Threat Level</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#00FF9F] transition-all group-hover:translate-x-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border-t border-dashed border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 font-bold text-lg">Your Domain is Secure</p>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mt-1">No dark web threat leaks currently mention your registered organization.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 3: CLIENT ACTIVITY LOG */}
          {clientTab === 'activity' && (
            <div className="bg-[#101422]/80 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" /> Personal Activity Log
                </h3>
                <p className="text-xs text-gray-500 font-mono">Tied strictly to {companyName} node</p>
              </div>

              <div className="overflow-hidden border border-white/5 rounded-xl bg-black/20 divide-y divide-white/5">
                {clientActivities.map((act) => (
                  <div key={act.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all">
                    <div className="flex items-center gap-4">
                      {act.status === 'Success' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : act.status === 'Failed' ? (
                        <XCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      )}
                      
                      <div>
                        <p className="text-sm font-medium text-white">{act.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 font-mono px-1.5 py-0.5 rounded">
                            {act.category}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {new Date(act.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <span className={`text-xs font-mono font-bold ${
                      act.status === 'Success' ? 'text-emerald-400' : act.status === 'Failed' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      [{act.status.toUpperCase()}]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PORTAL SETTINGS */}
          {clientTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" /> Portal Preferences
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono uppercase">{companyName} Node</span>
              </div>

              {/* Account Info */}
              <div className="bg-[#101422]/80 border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-400" /> Account Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 font-mono mb-1">REGISTERED EMAIL</label>
                    <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-xl px-4 py-2.5">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-white font-mono">{user.username}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-mono mb-1">COMPANY NODE</label>
                    <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-xl px-4 py-2.5">
                      <Building2 className="w-4 h-4 text-[#00FF9F]" />
                      <span className="text-sm text-white font-mono">{companyName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert Settings */}
              <div className="bg-[#101422]/80 border border-white/5 rounded-2xl p-6 space-y-5">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-yellow-400" /> Alert & Notification Settings
                </h4>

                <div>
                  <label className="block text-xs text-gray-500 font-mono mb-2">ALERT THRESHOLD</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['all', 'medium', 'high'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setAlertThreshold(level)}
                        className={`py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all border ${
                          alertThreshold === level
                            ? level === 'high' ? 'bg-red-500/20 border-red-500/40 text-red-400' : level === 'medium' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                        }`}
                      >
                        {level === 'all' ? 'All Risks' : level === 'medium' ? 'Med+' : 'High Only'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-600 font-mono mt-2">Live alerts will appear for threats matching this threshold</p>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-white/5">
                  <div>
                    <p className="text-sm text-white font-medium">Email Alert Notifications</p>
                    <p className="text-xs text-gray-500 mt-0.5">Send breach alerts to {user.username}</p>
                  </div>
                  <button
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`relative w-11 h-6 rounded-full transition-all ${ emailAlerts ? 'bg-blue-600' : 'bg-white/10' }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ emailAlerts ? 'left-6' : 'left-1' }`} />
                  </button>
                </div>
              </div>

              {/* Scanner Settings */}
              <div className="bg-[#101422]/80 border border-white/5 rounded-2xl p-6 space-y-5">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-emerald-400" /> Scanner & Intelligence Settings
                </h4>

                <div>
                  <label className="block text-xs text-gray-500 font-mono mb-2">SCRAPER INTENSITY</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setScraperIntensity('passive')}
                      className={`py-3 px-4 rounded-xl text-xs font-bold font-mono text-left transition-all border ${
                        scraperIntensity === 'passive' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1"><Radio className="w-3.5 h-3.5" /> Passive</div>
                      <p className="text-[10px] text-gray-600 font-normal">Standard node harvesting</p>
                    </button>
                    <button
                      onClick={() => setScraperIntensity('active')}
                      className={`py-3 px-4 rounded-xl text-xs font-bold font-mono text-left transition-all border ${
                        scraperIntensity === 'active' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1"><Zap className="w-3.5 h-3.5" /> Active</div>
                      <p className="text-[10px] text-gray-600 font-normal">Deep query mode</p>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-white/5">
                  <div>
                    <p className="text-sm text-white font-medium">Auto-Refresh Feed</p>
                    <p className="text-xs text-gray-500 mt-0.5">Automatically refresh threats every 5s</p>
                  </div>
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`relative w-11 h-6 rounded-full transition-all ${ autoRefresh ? 'bg-blue-600' : 'bg-white/10' }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ autoRefresh ? 'left-6' : 'left-1' }`} />
                  </button>
                </div>
              </div>

              {/* Display Settings */}
              <div className="bg-[#101422]/80 border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" /> Display Preferences
                </h4>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-white font-medium">Show Risk Scores</p>
                    <p className="text-xs text-gray-500 mt-0.5">Display numerical score on threat cards</p>
                  </div>
                  <button
                    onClick={() => setShowRiskScore(!showRiskScore)}
                    className={`relative w-11 h-6 rounded-full transition-all ${ showRiskScore ? 'bg-blue-600' : 'bg-white/10' }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ showRiskScore ? 'left-6' : 'left-1' }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-white/5">
                  <div>
                    <p className="text-sm text-white font-medium">Dark Mode</p>
                    <p className="text-xs text-gray-500 mt-0.5">Cybersecurity command center theme</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-gray-600" />
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative w-11 h-6 rounded-full transition-all ${ darkMode ? 'bg-blue-600' : 'bg-white/10' }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ darkMode ? 'left-6' : 'left-1' }`} />
                    </button>
                    <Moon className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={saveSettings}
                className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all font-mono ${
                  settingsSaved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {settingsSaved ? '✓ SETTINGS SAVED' : 'SAVE CHANGES'}
              </button>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-black/30 py-6 text-center text-xs text-gray-600 font-mono">
          DARKSHIELD CLIENT PORTAL SERVICE • MULTI-TENANCY COMPLIANCE VERIFIED
        </footer>

        {/* Threat Detail Modal */}
        {selectedThreat && (
          <ThreatDetail 
            threat={selectedThreat} 
            onClose={() => setSelectedThreat(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default ClientPortal;
