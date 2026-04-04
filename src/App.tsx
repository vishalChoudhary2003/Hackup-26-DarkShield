import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { LiveFeed } from './components/LiveFeed';
import { CompanyMonitor } from './components/CompanyMonitor';
import { SystemInfo } from './components/SystemInfo';
import { ThreatDetail } from './components/ThreatDetail';
import { AlertToast } from './components/AlertToast';
import { OrganizationMonitoring } from './components/OrganizationMonitoring';
import { DatabaseView } from './components/DatabaseView';
import SettingsView from './components/SettingsView';
import ActivityLogView from './components/ActivityLogView';
import AuthPage from './components/AuthPage';
import CompanyPortal from './components/CompanyPortal';
import ClientPortal from './components/ClientPortal';
import { useSimulation } from './hooks/useSimulation';
import { ThreatAnalysis, TabView, User } from './types';
import { ShieldAlert, AlertCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const {
    threats,
    alerts,
    activityLogs,
    monitoredCompanies,
    isSimulating,
    toggleSimulation,
    addMonitoredCompany,
    dismissAlert,
    startScan,
    searchTerm,
    setSearchTerm,
    logActivity
  } = useSimulation();

  const [currentTab, setCurrentTab] = useState<TabView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<ThreatAnalysis | null>(null);

  const latestThreat = threats.length > 0 ? threats[0] : null;

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  if (user.role === 'company') {
    return (
      <ClientPortal 
        user={user} 
        threats={threats} 
        onLogout={() => setUser(null)} 
        addMonitoredCompany={(name) => addMonitoredCompany(name)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cyber-bg text-gray-100 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        user={user}
        onLogout={() => setUser(null)}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-[70px]' : 'pl-[240px]'
        }`}
      >
        {/* Sticky Header */}
        <Header
          isSimulating={isSimulating}
          toggleSimulation={toggleSimulation}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          alerts={alerts}
          dismissAlert={dismissAlert}
        />

        {/* Scrollable Main Layout */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Bar (Only on Dashboard Page) */}
          {currentTab === 'dashboard' && <StatsBar threats={threats} />}

          {/* Tab Views */}
          {currentTab === 'dashboard' && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Column - Live Threat Feed (3 cols) */}
              <div className="xl:col-span-3">
                <LiveFeed 
                  threats={threats} 
                  searchTerm={searchTerm} 
                  onSelectThreat={setSelectedThreat} 
                />
              </div>

              {/* Sidebar Column - Company monitor + System Info (1 col) */}
              <div className="xl:col-span-1 space-y-6">
                <CompanyMonitor threats={threats} />
                <SystemInfo isSimulating={isSimulating} />
              </div>
            </div>
          )}

          {currentTab === 'logs' && (
            <div className="bg-[#0D111A]/90 border border-white/5 rounded-2xl p-8 glass-card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-mono tracking-wider text-white">CENTRALIZED INCIDENT LOGS</h2>
                <p className="text-sm font-mono text-gray-500 mt-2">Full-width comprehensive table representing the entire history of scanned threat intelligence data.</p>
              </div>
              <DatabaseView threats={threats} onSelectThreat={setSelectedThreat} />
            </div>
          )}

          {currentTab === 'organizations' && (
            <OrganizationMonitoring
              companies={monitoredCompanies}
              addCompany={(name: string, email?: string, password?: string) => addMonitoredCompany(name, email, password, user)}
              threats={threats}
              startScan={startScan}
            />
          )}

          {currentTab === 'activity' && (
            <ActivityLogView logs={activityLogs} />
          )}

          {currentTab === 'settings' && (
            <SettingsView user={user} logActivity={logActivity} />
          )}

          {(currentTab === 'company-dashboard' || currentTab === 'company-threats' || currentTab === 'company-settings') && (
            <CompanyPortal 
              user={user} 
              threats={threats} 
              activeTab={currentTab as any} 
              setActiveTab={setCurrentTab} 
            />
          )}
        </main>
      </div>

      {/* Restricted Access Overlay for non-admins */}
      {user.role !== 'admin' && (currentTab === 'settings' || currentTab === 'organizations') && (
        <div className="fixed inset-0 z-[100] bg-[#040608]/95 backdrop-blur-sm flex items-center justify-center p-6 pl-[70px] lg:pl-[240px]">
          <div className="max-w-md w-full glass-panel border-red-500/20 p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 font-mono">ACCESS RESTRICTED</h2>
            <p className="text-gray-400 mb-10 text-base">
              Current user session: <span className="text-[#00FF9F] font-bold uppercase">{user.username} (Analyst)</span>. 
              Administrative privileges are required for this module.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="w-full bg-[#00FF9F] hover:bg-[#00FF9F]/90 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#00FF9F]/20"
              >
                RETURN TO DASHBOARD
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest mt-4">
                <AlertCircle className="w-3 h-3" /> SECURITY_ERROR_403
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Toasts */}
      <ThreatDetail 
        threat={selectedThreat} 
        onClose={() => setSelectedThreat(null)} 
      />

      <AlertToast latestThreat={latestThreat} />
    </div>
  );
}
