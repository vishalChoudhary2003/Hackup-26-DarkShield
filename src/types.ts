export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ThreatAnalysis {
  id: string;
  source: string;
  sourceType: 'Forum Post' | 'Credential Dump' | 'Paste Log' | 'Marketplace' | 'Chat Log';
  content: string;
  timestamp: Date;
  analyzedAt: Date;
  entities: {
    emails: string[];
    passwords: string[];
    companies: string[];
    ipAddresses: string[];
    keywords: string[];
  };
  riskScore: number;
  riskLevel: RiskLevel;
  riskBreakdown: {
    emailScore: number;
    passwordScore: number;
    companyScore: number;
    keywordBonus: number;
  };
  status: 'analyzed' | 'investigating' | 'false_positive';
  isReal?: boolean;
}

export interface MonitoredCompany {
  name: string;
  domain: string;
  threats: number;
  lastSeen: Date | undefined;
  clientEmail?: string;
  clientPassword?: string;
}

export interface Alert {
  id: string;
  threatId: string;
  message: string;
  riskScore: number;
  riskLevel: RiskLevel;
  source: string;
  timestamp: Date;
  dismissed: boolean;
}

export type TabView = 'dashboard' | 'logs' | 'organizations' | 'settings' | 'activity' | 'company-dashboard' | 'company-threats' | 'company-settings';

export type UserRole = 'admin' | 'user' | 'company';

export interface CompanyAccount {
  id: string;
  name: string;
  email: string;
  industry: string;
  registrationDate: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  apiKey: string;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  lastLogin: string;
  companyId?: string; // Links to a company account if role is 'company'
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  category: 'auth' | 'system' | 'threat' | 'config';
  status: 'success' | 'warning' | 'error';
}
