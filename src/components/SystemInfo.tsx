import React, { useState, useEffect } from 'react';
import { Cpu, ShieldAlert, CheckCircle } from 'lucide-react';

interface SystemInfoProps {
  isSimulating: boolean;
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ isSimulating }) => {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (sec: number) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="bg-[#111118]/80 border border-white/5 rounded-2xl p-6 glass-card mt-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <h3 className="text-sm font-mono font-bold tracking-widest text-gray-400 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyber-purple" />
          NLP ENGINE STATUS
        </h3>
        {isSimulating ? (
          <CheckCircle className="w-5 h-5 text-cyber-green animate-pulse" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-cyber-yellow" />
        )}
      </div>

      <div className="space-y-4 font-mono text-sm">
        <div className="flex justify-between items-center py-2 border-b border-white/[0.02]">
          <span className="text-gray-500">MODEL VERSION</span>
          <span className="text-white font-bold">DarkShield_v1.4.2</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/[0.02]">
          <span className="text-gray-500">SCAN RATE</span>
          <span className="text-cyber-green font-bold">~ 24 threads/min</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/[0.02]">
          <span className="text-gray-500">UPTIME</span>
          <span className="text-white font-bold">{formatUptime(uptime)}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/[0.02]">
          <span className="text-gray-500">STATUS</span>
          <span className={`font-bold ${isSimulating ? 'text-cyber-green' : 'text-cyber-yellow'}`}>
            {isSimulating ? 'ONLINE' : 'PAUSED'}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/[0.02]">
          <span className="text-gray-500">ACCURACY</span>
          <span className="text-cyber-cyan font-bold">98.4%</span>
        </div>
      </div>
    </div>
  );
};
