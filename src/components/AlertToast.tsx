import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ThreatAnalysis } from '../types';

interface AlertToastProps {
  latestThreat: ThreatAnalysis | null;
}

export const AlertToast: React.FC<AlertToastProps> = ({ latestThreat }) => {
  const [visible, setVisible] = useState(false);
  const [threat, setThreat] = useState<ThreatAnalysis | null>(null);

  useEffect(() => {
    if (latestThreat && latestThreat.riskLevel === 'HIGH') {
      setThreat(latestThreat);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [latestThreat]);

  if (!visible || !threat) return null;

  return (
    <div className="fixed top-24 right-6 z-[100] bg-[#FF4444] border border-red-500 rounded-2xl p-6 shadow-2xl max-w-sm flex items-start gap-4 animate-slide-in-up">
      <div className="p-2 bg-white/20 rounded-lg text-white">
        <AlertTriangle className="w-5 h-5 animate-bounce" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-mono font-bold text-red-100 tracking-wider">CRITICAL BREACH DETECTED</div>
        <p className="text-sm font-mono text-white mt-2 font-bold truncate">{threat.source}</p>
        <p className="text-xs text-red-100 mt-2 line-clamp-2">{threat.content}</p>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="text-white/70 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
