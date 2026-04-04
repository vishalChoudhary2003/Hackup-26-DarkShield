import React, { useState } from 'react';
import { Save, Shield, Bell, Eye, Database, Terminal, Globe, Lock, CheckCircle } from 'lucide-react';
import { User, ActivityLog } from '../types';

interface SettingsViewProps {
  user: User;
  logActivity: (user: User, action: string, details: string, category: ActivityLog['category'], status?: ActivityLog['status']) => void;
}

/* ── Reusable styled toggle ── */
const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button onClick={onToggle}
    className="relative w-12 h-6 rounded-full transition-all shrink-0"
    style={{ background: on ? '#00FF9F' : '#374151', boxShadow: on ? '0 0 10px rgba(0,255,159,0.4)' : 'none' }}>
    <div className="absolute top-1 w-4 h-4 bg-black rounded-full transition-all shadow"
      style={{ left: on ? '28px' : '4px' }} />
  </button>
);

/* ── Reusable row ── */
const SettingRow = ({ icon: Icon, iconColor, title, desc, control }: {
  icon: React.ElementType; iconColor: string; title: string; desc: string; control: React.ReactNode;
}) => (
  <div className="flex items-center justify-between p-4 rounded-xl transition-all"
    style={{ background: '#151C26', border: '1px solid #374151' }}
    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#4B5563'}
    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#374151'}>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ background: `${iconColor}15`, border: `1px solid ${iconColor}30` }}>
        <Icon className="w-4 h-4" style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{desc}</p>
      </div>
    </div>
    {control}
  </div>
);

const inputStyle: React.CSSProperties = {
  background: '#06080D', border: '1px solid #374151', color: '#FFFFFF',
  borderRadius: '10px', padding: '8px 12px', fontSize: '13px', fontFamily: 'monospace', width: '100%', outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.12em', color: '#6B7280', marginBottom: '8px',
};

const SettingsView: React.FC<SettingsViewProps> = ({ user, logActivity }) => {
  const [activeTab, setActiveTab] = useState<'general'|'notifications'|'security'|'api'>('general');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    autoScan: true, riskThreshold: 65, retentionDays: 30,
    darkWebNodes: ['Tor-Alpha', 'I2P-Main', 'ZeroNet-01'],
    emailAlerts: true, slackWebhook: 'https://hooks.slack.com/services/T00000000/...', twoFactor: true, ipWhitelist: '192.168.1.0/24',
  });

  const toggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') setSettings(p => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    logActivity(user, 'Configuration Updated', `System parameters for ${activeTab} were modified.`, 'config', 'success');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'general'       as const, icon: Eye,      label: 'Engine'     },
    { id: 'notifications' as const, icon: Bell,     label: 'Alerts'     },
    { id: 'security'      as const, icon: Shield,   label: 'Security'   },
    { id: 'api'           as const, icon: Database, label: 'API & Nodes' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-6 h-6" style={{ color: '#00FF9F' }} />
            System Configuration
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Manage DarkShield AI engine parameters and security protocols.</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
          style={{
            background: saved ? '#00FF9F' : '#00FF9F',
            color: '#06080D',
            boxShadow: saved ? '0 0 16px rgba(0,255,159,0.4)' : '0 0 16px rgba(0,255,159,0.4)',
          }}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#06080D', border: '1px solid #151C26' }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: active ? 'rgba(0,255,159,0.1)' : 'transparent',
                color: active ? '#00FF9F' : '#6B7280',
                border: active ? '1px solid rgba(0,255,159,0.25)' : '1px solid transparent',
                boxShadow: active ? '0 0 8px rgba(0,255,159,0.15)' : 'none',
              }}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content card */}
      <div className="rounded-2xl p-6 space-y-5" style={{ background: '#0D111A', border: '1px solid #151C26' }}>

        {/* ENGINE */}
        {activeTab === 'general' && (
          <>
            <SettingRow icon={Shield} iconColor="#00FF9F" title="Automatic Threat Scanning"
              desc="Continuously monitor dark web nodes for target keywords."
              control={<Toggle on={settings.autoScan} onToggle={() => toggle('autoScan')} />} />

            <div>
              <label style={labelStyle}>Risk Score Threshold</label>
              <div className="flex items-center gap-4">
                <input type="range" min="0" max="100" value={settings.riskThreshold}
                  onChange={e => setSettings(p => ({ ...p, riskThreshold: +e.target.value }))}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#00FF9F', background: '#151C26' }} />
                <span className="text-base font-black font-mono w-12 text-right" style={{ color: '#00FF9F' }}>
                  {settings.riskThreshold}%
                </span>
              </div>
              <p className="text-[11px] mt-2 font-mono" style={{ color: '#6B7280' }}>Alerts trigger only above this score threshold.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Data Retention</label>
                <select value={settings.retentionDays}
                  onChange={e => setSettings(p => ({ ...p, retentionDays: +e.target.value }))}
                  style={{ ...inputStyle }}>
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                  <option value={365}>1 Year</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Scan Frequency</label>
                <select style={{ ...inputStyle }}>
                  <option>Real-time (Stream)</option>
                  <option>Every 5 Minutes</option>
                  <option>Hourly</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <>
            <SettingRow icon={Globe} iconColor="#7B61FF" title="Global Webhook Integration"
              desc="Forward high-priority logs to external SIEM/SOC tools."
              control={<Toggle on={settings.emailAlerts} onToggle={() => toggle('emailAlerts')} />} />

            <SettingRow icon={Bell} iconColor="#FFC857" title="Email Alert Notifications"
              desc="Send threat breach summaries directly to registered admin email."
              control={<Toggle on={settings.autoScan} onToggle={() => toggle('autoScan')} />} />

            <div>
              <label style={labelStyle}>Slack Webhook URL</label>
              <input type="password" value={settings.slackWebhook}
                onChange={e => setSettings(p => ({ ...p, slackWebhook: e.target.value }))}
                style={inputStyle} placeholder="https://hooks.slack.com/..." />
            </div>
          </>
        )}

        {/* SECURITY */}
        {activeTab === 'security' && (
          <>
            <SettingRow icon={Lock} iconColor="#FF4444" title="Two-Factor Authentication"
              desc="Require MFA for all administrative settings changes."
              control={<Toggle on={settings.twoFactor} onToggle={() => toggle('twoFactor')} />} />

            <SettingRow icon={Shield} iconColor="#00FF9F" title="Zero Trust Enforcement"
              desc="Verify every access request regardless of origin."
              control={<Toggle on={true} onToggle={() => {}} />} />

            <div>
              <label style={labelStyle}>IP Access Whitelist</label>
              <textarea value={settings.ipWhitelist}
                onChange={e => setSettings(p => ({ ...p, ipWhitelist: e.target.value }))}
                style={{ ...inputStyle, height: '80px', resize: 'none' }} />
              <p className="text-[11px] mt-1.5 font-mono" style={{ color: '#6B7280' }}>One CIDR block per line. Blank = unrestricted.</p>
            </div>
          </>
        )}

        {/* API & NODES */}
        {activeTab === 'api' && (
          <>
            <div>
              <label style={labelStyle}>Active Crawl Nodes</label>
              <div className="space-y-2">
                {settings.darkWebNodes.map(node => (
                  <div key={node} className="flex items-center justify-between py-2.5 px-4 rounded-xl"
                    style={{ background: '#151C26', border: '1px solid #374151' }}>
                    <span className="flex items-center gap-3 text-sm font-mono" style={{ color: '#E5E7EB' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: '#00FF9F', boxShadow: '0 0 8px rgba(0,255,159,0.6)' }} />
                      {node}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ color: '#00FF9F', background: 'rgba(0,255,159,0.08)', border: '1px solid rgba(0,255,159,0.2)' }}>
                      {Math.floor(Math.random() * 200 + 50)}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl text-sm font-bold transition-all border-dashed"
              style={{ color: '#6B7280', border: '1px dashed #374151' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00FF9F'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,159,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; (e.currentTarget as HTMLElement).style.borderColor = '#374151'; }}>
              + Connect New Protocol Node
            </button>
          </>
        )}
      </div>

      {/* Security Note */}
      <div className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: 'rgba(255,200,87,0.06)', border: '1px solid rgba(255,200,87,0.25)' }}>
        <Shield className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#FFC857' }} />
        <p className="text-xs leading-relaxed" style={{ color: '#D1B000' }}>
          <strong>Security Note:</strong> Changing node protocols might require a manual engine restart.
          Existing data will be preserved based on the retention policy. All changes are logged to the audit trail.
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
