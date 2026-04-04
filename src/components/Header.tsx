import React, { useState } from 'react';
import { Play, Pause, Search, Bell, Shield, AlertTriangle, X } from 'lucide-react';
import { Alert } from '../types';

interface HeaderProps {
  isSimulating: boolean;
  toggleSimulation: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  alerts: Alert[];
  dismissAlert: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSimulating,
  toggleSimulation,
  searchTerm,
  setSearchTerm,
  alerts,
  dismissAlert
}) => {
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const activeAlerts = alerts.filter(a => !a.dismissed);

  return (
    <header
      className="sticky top-0 z-50 px-8 py-6 flex items-center justify-between gap-6"
      style={{
        background: 'rgba(6,8,13,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #151C26',
        boxShadow: '0 4px 24px rgba(0,0,0,0.6)'
      }}
    >
      {/* Left - Simulation status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full text-sm"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #374151' }}>
          <span className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'animate-pulse' : ''}`}
            style={{ background: isSimulating ? '#00FF9F' : '#FF4444', boxShadow: isSimulating ? '0 0 10px #00FF9F' : '0 0 10px #FF4444' }} />
          <span className="font-mono uppercase tracking-wider text-xs" style={{ color: '#9CA3AF' }}>
            Simulation: {isSimulating ? 'Running' : 'Paused'}
          </span>
        </div>
        <button
          onClick={toggleSimulation}
          className="p-2.5 rounded-xl transition-all"
          style={{
            background: isSimulating ? 'rgba(255,68,68,0.1)' : 'rgba(0,255,159,0.1)',
            color: isSimulating ? '#FF4444' : '#00FF9F',
            border: `1px solid ${isSimulating ? 'rgba(255,68,68,0.3)' : 'rgba(0,255,159,0.3)'}`,
            boxShadow: isSimulating ? '0 0 12px rgba(255,68,68,0.2)' : '0 0 12px rgba(0,255,159,0.2)'
          }}
          title={isSimulating ? 'Pause Simulation' : 'Resume Simulation'}
        >
          {isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-2xl relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5" style={{ color: '#6B7280' }} />
        </div>
        <input
          type="text"
          placeholder="Global threat search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 text-base placeholder-gray-500 transition-all rounded-2xl focus:ring-2 focus:ring-[#00FF9F]/20"
          style={{
            background: '#0D111A',
            border: '1px solid #374151',
            color: '#FFFFFF',
          }}
        />
      </div>

      {/* Metrics */}
      <div className="hidden lg:flex items-center gap-6 text-sm font-mono px-6" style={{ color: '#9CA3AF', borderLeft: '1px solid #151C26', borderRight: '1px solid #151C26' }}>
        <div>SYS LOAD: <span style={{ color: '#00FF9F', fontWeight: 'bold' }}>42%</span></div>
        <div className="w-2 h-2 rounded-full" style={{ background: '#374151' }} />
        <div>NLP ENGINE: <span style={{ color: '#00FF9F', fontWeight: 'bold' }} className="terminal-cursor">OPTIMIZED</span></div>
      </div>

      {/* Right - Bell + Avatar */}
      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <button
            onClick={() => setShowAlertDropdown(!showAlertDropdown)}
            className="p-3 rounded-2xl transition-all relative"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #374151', color: '#9CA3AF' }}
          >
            <Bell className="w-6 h-6" style={{ color: activeAlerts.length > 0 ? '#FFC857' : '#9CA3AF', filter: activeAlerts.length > 0 ? 'drop-shadow(0 0 6px #FFC857)' : 'none' }} />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
                style={{ background: '#FF4444', boxShadow: '0 0 10px rgba(255,68,68,0.6)' }}>
                {activeAlerts.length}
              </span>
            )}
          </button>

          {showAlertDropdown && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{ background: '#111827', border: '1px solid #374151', boxShadow: '0 0 32px rgba(0,0,0,0.8)' }}>
              <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid #1F2937' }}>
                <span className="font-bold text-sm text-white tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: '#FFC857' }} />
                  CRITICAL ALERTS ({activeAlerts.length})
                </span>
                <button onClick={() => setShowAlertDropdown(false)} style={{ color: '#6B7280' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y" style={{ borderColor: '#1F2937' }}>
                {activeAlerts.length === 0 ? (
                  <div className="p-4 text-center text-xs font-mono" style={{ color: '#6B7280' }}>
                    NO ACTIVE ALERTS DETECTED
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 text-xs transition-colors" style={{ color: '#9CA3AF' }}>
                      <div className="flex justify-between items-start">
                        <span className="font-bold font-mono" style={{ color: '#FF4444' }}>RISK {alert.riskScore}</span>
                        <span className="text-[10px] font-mono" style={{ color: '#6B7280' }}>
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2" style={{ color: '#E5E7EB' }}>{alert.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] font-mono" style={{ color: '#6B7280' }}>{alert.source}</span>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="text-[10px] font-bold transition-colors"
                          style={{ color: '#00FF9F' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-[#00FF9F]/5"
            style={{ background: 'rgba(0,255,159,0.1)', border: '1px solid rgba(0,255,159,0.3)' }}>
            <Shield className="w-6 h-6" style={{ color: '#00FF9F' }} />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold text-white leading-none">ROOT_ADMIN</span>
            <span className="text-xs font-mono mt-1.5" style={{ color: '#6B7280' }}>Tier 3 Access</span>
          </div>
        </div>
      </div>

    </header>
  );
};
