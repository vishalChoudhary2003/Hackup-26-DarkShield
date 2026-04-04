import React, { useMemo } from 'react';
import { ThreatAnalysis } from '../types';
import { Shield, Building2, AlertTriangle } from 'lucide-react';

interface CompanyMonitorProps {
  threats: ThreatAnalysis[];
}

export const CompanyMonitor: React.FC<CompanyMonitorProps> = ({ threats }) => {
  const affectedCompanies = useMemo(() => {
    const counts: Record<string, number> = {};
    
    threats.forEach(t => {
      t.entities.companies.forEach(company => {
        // Exclude system/crawler meta labels if any
        if (company.toLowerCase() === 'live tracking' || company.toLowerCase() === 'system') return;
        
        const cleanName = company.toLowerCase();
        counts[cleanName] = (counts[cleanName] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name: name,
        threats: count,
      }))
      .sort((a, b) => b.threats - a.threats)
      .slice(0, 10); // Show top 10 affected
  }, [threats]);

  return (
    <div className="bg-[#111118]/80 border border-white/5 rounded-2xl p-6 glass-card">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <h3 className="text-sm font-mono font-bold tracking-widest text-gray-400 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cyber-cyan" />
          AFFECTED COMPANIES
        </h3>
        <span className="px-3 py-1 rounded-full bg-cyber-red/10 text-cyber-red text-xs font-mono font-bold">
          {affectedCompanies.length} FOUND
        </span>
      </div>

      <div className="space-y-3">
        {affectedCompanies.length === 0 ? (
          <div className="text-center py-4 text-xs font-mono text-gray-600">
            No company data found in recent intelligence gather.
          </div>
        ) : (
          affectedCompanies.map((company, index) => (
            <div 
              key={index} 
              className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="text-base font-bold text-white truncate capitalize">{company.name}</div>
                <div className="text-xs text-gray-500 font-mono truncate mt-1">{company.name}.com</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-red/10 text-cyber-red text-xs font-mono font-bold animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  {company.threats} LEAKS
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
