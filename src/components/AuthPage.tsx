import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Cpu } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthPageProps {
  onLogin: (user: UserType) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '', inviteCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (formData.email === 'admin@darkshield.ai') {
        onLogin({ id: 'admin', username: 'Administrator', role: 'admin', lastLogin: new Date().toISOString() });
      } else {
        // Pass full email as username so ClientPortal can extract domain
        onLogin({
          id: `client-${Math.random().toString(36).substr(2, 9)}`,
          username: formData.email,
          role: 'company',
          lastLogin: new Date().toISOString()
        });
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden" style={{ background: '#040608' }}>
      
      {/* LEFT SIDE: 3D CYBER TERMINAL */}
      <div className="hidden lg:flex flex-[1.4] relative items-center justify-center p-12 overflow-hidden border-r border-[#00FF9F]/10">
        {/* Dynamic Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none matrix-bg shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00FF9F]/5 via-transparent to-transparent pointer-events-none" />

        {/* 3D TERMINAL CONTAINER */}
        <div className="relative z-10 w-full max-w-2xl transform transition-transform duration-1000 perspective-[2000px] hover:rotate-y-[-5deg]">
          <div className="glass-card p-1 rounded-2xl shadow-[0_0_100px_rgba(0,255,159,0.15)] border-[#00FF9F]/20 relative overflow-hidden"
            style={{ 
              transform: 'rotateY(12deg) rotateX(5deg)', 
              boxShadow: '20px 40px 80px rgba(0,0,0,0.8), -1px -1px 0 rgba(0,255,159,0.3)',
              background: 'linear-gradient(135deg, rgba(13,17,26,0.95) 0%, rgba(6,8,13,0.98) 100%)'
            }}>
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#00FF9F]/10 bg-black/40">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-3 h-3" /> DARKSHIELD_SENTINEL_V5.0
              </div>
            </div>

            {/* Terminal Content (Animated Stream) */}
            <div className="p-8 font-mono text-xs leading-relaxed space-y-2 max-h-[500px] overflow-hidden relative">
              <div className="text-[#00FF9F]/80 opacity-70 animate-pulse">[SYSTEM] Initializing Sentinel Neural Core...</div>
              <div className="text-[#00FF9F]">{">> "}Loading Cryptographic Modules: AES-256-GCM [OK]</div>
              <div className="text-[#00FF9F]">{">> "}Establishing Secure Neural Link... [CONNECTED]</div>
              <div className="text-white/40 mt-4">--- INCOMING THREAT INTELLIGENCE FEED ---</div>
              <div className="flex gap-4 items-center group cursor-default">
                <span className="text-red-500 font-bold">[CRITICAL]</span>
                <span className="text-white/60">Node 14.2.19: Data breach detected in financial sector.</span>
                <span className="text-[#00FF9F]/40 ml-auto font-black">2ms ago</span>
              </div>
              <div className="flex gap-4 items-center opacity-60">
                <span className="text-yellow-500 font-bold">[WARNING]</span>
                <span className="text-white/60">Global Proxy Network: Anomaly detected (Tor node skip).</span>
                <span className="text-[#00FF9F]/40 ml-auto font-black">14s ago</span>
              </div>
              <div className="text-[#00FF9F]">{">> "}Scanning Dark Web Directory: Onion_v3_root...</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="text-[#00FF9F]/30 overflow-hidden whitespace-nowrap">0x4F2...D9E [PROCESSING]</div>
                <div className="text-[#00FF9F]/30 overflow-hidden whitespace-nowrap">0x8A1...F2C [ANALYZING]</div>
                <div className="text-[#00FF9F]/30 overflow-hidden whitespace-nowrap">0x2D9...B1E [COMPLETED]</div>
                <div className="text-[#00FF9F]/30 overflow-hidden whitespace-nowrap">0x6E4...A8B [STANDBY]</div>
              </div>
              <div className="text-[#00FF9F] mt-2 animate-pulse">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</div>
              <div className="mt-6 p-4 rounded-xl border border-[#00FF9F]/20 bg-[#00FF9F]/5 text-[10px] uppercase tracking-wider text-center">
                User Authentication Required to Access Secure Data Console
              </div>

              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,.06),rgba(0,255,0,.02),rgba(0,0,255,.06))] z-20" style={{ backgroundSize: '100% 4px, 3px 100%' }} />
            </div>
          </div>

          {/* Floating UI Decorative Elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border border-[#00FF9F]/10 flex items-center justify-center animate-spin-slow">
             <div className="w-24 h-24 rounded-full border border-[#00FF9F]/10 animate-reverse-spin-slow" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: SECURE ACCESS CONSOLE */}
      <div className="flex-1 min-h-screen flex items-center justify-center p-8 lg:p-16 relative bg-[#06080D]/50 backdrop-blur-xl">
        <div className="w-full max-w-sm z-10 animate-in slide-in-from-right duration-700">
          
          {/* Mobile Only Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 bg-[#00FF9F]/10 border border-[#00FF9F]/20">
              <Shield className="w-10 h-10 text-[#00FF9F]" />
            </div>
            <h1 className="text-4xl font-black text-white">DarkShield <span className="text-[#00FF9F]">AI</span></h1>
          </div>

          {/* Login Card */}
          <div className="p-10 rounded-[2.5rem] shadow-2xl glass-card relative" style={{ background: '#0D111A', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            {/* Login Header */}
            <div className="mb-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#00FF9F]/5 border border-[#00FF9F]/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-[#00FF9F]" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-widest uppercase">SECURE_LOGIN</h2>
              <p className="text-[10px] font-mono text-gray-500 mt-2 uppercase tracking-widest">Identification Required</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ml-1 text-gray-400">Secure Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[#00FF9F]" style={{ color: '#4B5563' }} />
                  <input type="email" required placeholder="admin@darkshield.ai"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-4 pl-14 pr-6 text-base rounded-3xl transition-all outline-none"
                    style={{ background: '#040608', border: '1px solid #1F2937', color: '#FFFFFF' }} />
                </div>
              </div>

              {/* Password */}
              <div className="mb-8">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ml-1 text-gray-400">Access Keycode</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[#00FF9F]" style={{ color: '#4B5563' }} />
                  <input type="password" required placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full py-4 pl-14 pr-6 text-base rounded-3xl transition-all outline-none"
                    style={{ background: '#040608', border: '1px solid #1F2937', color: '#FFFFFF' }} />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading}
                className="w-full font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all mt-10 uppercase tracking-[0.3em] text-sm group overflow-hidden relative"
                style={{
                  background: loading ? '#374151' : '#00FF9F',
                  color: loading ? '#9CA3AF' : '#06080D',
                  boxShadow: loading ? 'none' : '0 10px 40px rgba(0,255,159,0.3)',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                {loading ? (
                  <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,0,0,0.1)', borderTopColor: '#000' }} />
                ) : (
                  <>
                    <span>Decrypt & Enter</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                  </>
                )}
                {/* Button Glow Ray */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 rounded-2xl text-xs text-center border border-red-500/20 bg-red-500/10 text-red-400">
                {error}
              </div>
            )}
          </div>

          <p className="text-center mt-12 text-[10px] font-mono tracking-[0.4em] uppercase text-gray-700">
            AUTHORIZED PERSONNEL ONLY · SYSTEM_SENTINEL_V5.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;