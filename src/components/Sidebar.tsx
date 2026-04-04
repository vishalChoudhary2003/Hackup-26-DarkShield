import React from 'react';
import { LayoutGrid, FileText, Building2, Shield, ChevronLeft, ChevronRight, Settings, Activity, LayoutDashboard, ShieldAlert, Radio } from 'lucide-react';
import { TabView, User } from '../types';
import { LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentTab: TabView;
  setCurrentTab: (tab: TabView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isCollapsed,
  setIsCollapsed,
  user,
  onLogout
}) => {
  const adminMenuItems = [
    { id: 'dashboard' as TabView, label: 'Global Dashboard', icon: LayoutGrid },
    { id: 'logs' as TabView, label: 'Incident Logs', icon: FileText },
    { id: 'organizations' as TabView, label: 'Organization Monitor', icon: Building2 },
    { id: 'activity' as TabView, label: 'System Audit Log', icon: Activity },
    { id: 'settings' as TabView, label: 'System Settings', icon: Settings }
  ];

  const companyMenuItems = [
    { id: 'company-dashboard' as TabView, label: 'Portal Overview', icon: LayoutDashboard },
    { id: 'company-threats' as TabView, label: 'Threat Intel', icon: ShieldAlert },
    { id: 'company-settings' as TabView, label: 'Portal Settings', icon: Settings }
  ];

  const menuItems = user.role === 'company' ? companyMenuItems : adminMenuItems;

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-[60] flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-[70px]' : 'w-[240px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, #040608 0%, #06080D 100%)',
        borderRight: '1px solid #374151',
        boxShadow: '4px 0 24px rgba(0,0,0,0.5)'
      }}
    >
      {/* Logo */}
      <div>
        <div className="p-6 flex items-center gap-4 overflow-hidden" style={{ borderBottom: '1px solid #151C26' }}>
          <div className="p-3 rounded-xl shrink-0" style={{ background: 'rgba(0,255,159,0.1)', border: '1px solid rgba(0,255,159,0.2)', boxShadow: '0 0 12px rgba(0,255,159,0.15)' }}>
            <Shield className="w-8 h-8" style={{ color: '#00FF9F' }} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xl text-white tracking-wider truncate" style={{ textShadow: '0 0 8px rgba(0,255,159,0.4)' }}>DarkShield AI</span>
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#00FF9F', opacity: 0.7 }}>THREAT INTEL</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium relative group`}
                style={{
                  color: isActive ? '#FFFFFF' : '#9CA3AF',
                  background: isActive ? 'rgba(0,255,159,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #00FF9F' : '2px solid transparent',
                  boxShadow: isActive ? 'inset 0 0 12px rgba(0,255,159,0.05)' : 'none',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
              >
                <Icon className="w-6 h-6 shrink-0" style={{ color: isActive ? '#00FF9F' : 'inherit' }} />
                {!isCollapsed && <span className="text-base tracking-wide truncate">{item.label}</span>}

                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 rounded-md text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                    style={{ background: '#151C26', border: '1px solid #374151', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="p-2 space-y-2" style={{ borderTop: '1px solid #151C26' }}>
        {!isCollapsed ? (
          <div className="mx-1 p-3 rounded-xl mb-2" style={{ background: '#0D111A', border: '1px solid #374151' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl" style={{
                background: user.role === 'admin' ? 'rgba(255,68,68,0.1)' : 'rgba(0,255,159,0.1)',
                border: `1px solid ${user.role === 'admin' ? 'rgba(255,68,68,0.3)' : 'rgba(0,255,159,0.3)'}`
              }}>
                {user.role === 'admin' ? (
                  <ShieldCheck className="w-6 h-6" style={{ color: '#FF4444' }} />
                ) : (
                  <UserIcon className="w-6 h-6" style={{ color: '#00FF9F' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-white truncate">{user.username}</div>
                <div className="text-xs font-mono uppercase tracking-wider" style={{ color: user.role === 'admin' ? '#FF4444' : '#00FF9F' }}>
                  {user.role} Access
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', color: '#9CA3AF', border: '1px solid transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,68,68,0.1)'; (e.currentTarget as HTMLElement).style.color = '#FF4444'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,68,68,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center p-3 rounded-xl transition-all group relative"
            style={{ color: '#6B7280' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FF4444'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}

        {!isCollapsed && (
          <div className="mx-2 p-3 rounded-xl flex items-center gap-3" style={{ background: '#111827', border: '1px solid #374151' }}>
            <div className="p-1 rounded-full animate-pulse" style={{ background: 'rgba(0,255,159,0.15)' }}>
              <Radio className="w-4 h-4" style={{ color: '#00FF9F' }} />
            </div>
            <div>
              <div className="text-[11px] font-mono" style={{ color: '#9CA3AF' }}>STATUS</div>
              <div className="text-xs font-bold text-white tracking-wide terminal-cursor">SYSTEM ONLINE</div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg transition-all"
          style={{ color: '#6B7280' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00FF9F'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

      </div>
    </div>
  );
};
