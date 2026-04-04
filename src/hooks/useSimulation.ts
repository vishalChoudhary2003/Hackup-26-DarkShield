import { useState, useEffect, useRef, useCallback } from 'react';
import { ThreatAnalysis, Alert, MonitoredCompany, ActivityLog, User } from '../types';
import { generateSimulatedData } from '../engine/simulator';
import { analyzeData } from '../engine/analyzer';

const INITIAL_COMPANIES = ["TechCorp Industries", "GlobalBank Financial"];

export function useSimulation() {
  const [threats, setThreats] = useState<ThreatAnalysis[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [monitoredCompanies, setMonitoredCompanies] = useState<MonitoredCompany[]>(() => {
    return INITIAL_COMPANIES.map(name => ({
      name,
      domain: name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
      threats: 0,
      lastSeen: undefined
    }));
  });
  
  const [isSimulating, setIsSimulating] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logActivity = useCallback((user: User, action: string, details: string, category: ActivityLog['category'], status: ActivityLog['status'] = 'success') => {
    const newLog: ActivityLog = {
      id: `LOG-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: user.id,
      userName: user.username,
      userRole: user.role,
      action,
      details,
      category,
      status
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 500));
  }, []);

  // Initial Burst & Real Data Fetch
  useEffect(() => {
    // Fetch live TorCrawl data ONLY (No initial simulated burst)

    // Fetch live TorCrawl data
    const fetchRealData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/threats');
        if (response.ok) {
          const realThreats = await response.json();
          if (realThreats.length > 0) {
            setThreats(prev => {
              const existingIds = new Set(prev.map(t => t.id));
              const newRealThreats = realThreats
                .filter((t: any) => !existingIds.has(t.id))
                .map((t: any) => ({ 
                  ...t, 
                  // Force parsing as correct Date objects
                  timestamp: new Date(t.timestamp),
                  analyzedAt: new Date(t.analyzedAt)
                }));
              
              if (newRealThreats.length === 0) return prev;

              const combined = [...newRealThreats, ...prev].sort((a, b) => 
                b.timestamp.getTime() - a.timestamp.getTime()
              );
              // Initialize with exactly 100 threats to prevent instant 500 cap
              return combined.slice(0, 100);
            });
          }
        }
      } catch (e) {
        // Bridge server might be down, ignore
      }
    };

    fetchRealData();
    // Stop the 5-second interval of fetching static data to prevent it overriding our cap
    // const interval = setInterval(fetchRealData, 5000);
    // return () => clearInterval(interval);
  }, []);

  // Set up threat counts for companies
  useEffect(() => {
    setMonitoredCompanies(prev => prev.map(company => {
      const matchingThreats = threats.filter(t => 
        t.entities.companies.some(c => c.toLowerCase() === company.name.toLowerCase())
      );
      return {
        ...company,
        threats: matchingThreats.length,
        lastSeen: matchingThreats.length > 0 ? matchingThreats[0].timestamp : undefined
      };
    }));
  }, [threats]);

  // Simulation Loop
  useEffect(() => {
    if (!isSimulating) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const scheduleNext = () => {
      // 2 minutes (120,000 ms) static interval for scanning
      const delay = 120000; 
      timerRef.current = setTimeout(() => {
        setThreats(prev => {
          // Stop adding if we reach 500
          if (prev.length >= 500) return prev;
          
          const simData = generateSimulatedData(monitoredCompanies.map(c => c.name));
          const analysis = analyzeData(simData.content, simData.sourceName);
          
          if (analysis.riskScore > 85) {
            setAlerts(prevAlerts => [{
              id: `ALT-${analysis.id}`,
              threatId: analysis.id,
              timestamp: new Date(),
              riskScore: analysis.riskScore,
              riskLevel: analysis.riskLevel,
              source: analysis.source,
              message: `CRITICAL AI ALERT: Risk Score ${analysis.riskScore.toFixed(0)} - Immediate action required.`,
              dismissed: false
            }, ...prevAlerts].slice(0, 5));
          }

          return [analysis, ...prev];
        });

        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isSimulating, monitoredCompanies]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);

  const addMonitoredCompany = useCallback((companyName: string, email?: string, password?: string, user?: User) => {
    setMonitoredCompanies(prev => {
      if (prev.some(c => c.name.toLowerCase() === companyName.toLowerCase())) {
        return prev;
      }
      return [
        ...prev,
        {
          name: companyName,
          domain: companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
          threats: 0,
          lastSeen: undefined,
          clientEmail: email,
          clientPassword: password
        }
      ];
    });

    if (user) {
      logActivity(user, 'Target Registered', `User added ${companyName} to active monitoring with client credentials.`, 'config');
    }
  }, [logActivity]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  }, []);

  const startScan = useCallback(async (url: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      return response.ok;
    } catch (e) {
      console.error('Failed to start scan:', e);
      return false;
    }
  }, []);

  return {
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
  };
}
