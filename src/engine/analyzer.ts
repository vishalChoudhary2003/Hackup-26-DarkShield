import { ThreatAnalysis, RiskLevel } from '../types';
import { COMPANIES_LIST } from './simulator';

const KEYWORDS = ["Breach", "Exploit", "Database", "Ransomware", "SSO", "VPN", "BTC", "Zero-day", "RAT", "Decryption", "Leak", "Hack", "Infected"];

export function analyzeData(content: string, source: string): ThreatAnalysis {
  const timestamp = new Date();
  const analyzedAt = new Date();
  
  // Extract emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
  const emails = Array.from(new Set(content.match(emailRegex) || []));
  
  // Extract IPs
  const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  const ipAddresses = Array.from(new Set(content.match(ipRegex) || []));
  
  // Extract passwords (look for patterns after | or :)
  const passwords: string[] = [];
  if (content.includes('|') || content.includes(':')) {
    const parts = content.split(/[\s|:]+/);
    parts.forEach(p => {
      if (p.length >= 6 && /[0-9]/.test(p) && /[a-zA-Z]/.test(p) && !p.includes('@')) {
        passwords.push(p);
      }
    });
  }
  
  // Detected companies
  const detectedCompanies = COMPANIES_LIST.filter(c => content.toLowerCase().includes(c.toLowerCase()));
  
  // Detected keywords
  const detectedKeywords = KEYWORDS.filter(k => content.toLowerCase().includes(k.toLowerCase()));

  // Calculate scores
  const emailScore = Math.min(emails.length * 5, 30);
  const passwordScore = Math.min(passwords.length * 8, 40);
  const companyScore = detectedCompanies.length > 0 ? 15 : 0;
  const keywordBonus = Math.min(detectedKeywords.length * 2, 15);
  
  const totalScore = Math.min(emailScore + passwordScore + companyScore + keywordBonus, 100);
  
  let riskLevel: RiskLevel = 'LOW';
  if (totalScore >= 70) riskLevel = 'HIGH';
  else if (totalScore >= 40) riskLevel = 'MEDIUM';

  const sourceTypeName = source.includes('(') ? source.split(' (')[1].replace(')', '') : 'Forum Post';

  return {
    id: `THR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    source: source.split(' (')[0],
    sourceType: sourceTypeName as any,
    content,
    timestamp,
    analyzedAt,
    entities: {
      emails,
      passwords: Array.from(new Set(passwords)),
      companies: detectedCompanies,
      ipAddresses,
      keywords: detectedKeywords
    },
    riskScore: totalScore,
    riskLevel,
    riskBreakdown: {
      emailScore,
      passwordScore,
      companyScore,
      keywordBonus
    },
    status: 'analyzed'
  };
}
