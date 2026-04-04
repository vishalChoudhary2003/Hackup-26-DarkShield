export const THREAT_SOURCES = [
  "Shadow_Forum (Forum Post)",
  "DarkCloud_DB (Credential Dump)",
  "Onion_Marketplace (Forum Post)",
  "CryptoLeaks (Paste Log)",
  "Hidden_Wiki_2.0 (Marketplace)",
  "BlackHat_Exchange (Credential Dump)",
  "Cipher_Paste (Paste Log)",
  "Underground_Hub (Marketplace)",
  "Tor_Market_Elite (Chat Log)",
  "ZeroBin_Mirror (Paste Log)"
];

export const COMPANIES_LIST = [
  "TechCorp Industries", "GlobalBank Financial", "MedSecure Health",
  "DataVault Systems", "CloudNine Solutions", "NetShield Security",
  "CyberMatrix Corp", "QuantumTech Labs", "InfoGuard Services",
  "PrimeTech Global", "SecureNet Inc", "DigiSafe Corp",
  "NexGen Data", "CoreShield Tech", "ByteForce Systems",
  "AlphaGuard Inc", "SkyNet Solutions", "OmniData Corp",
  "TrustWave Tech", "IronClad Security"
];

const CONTENT_TEMPLATES = [
  "[DUMP] %COMPANY% Employee Database Leak including 250+ email:password pairs. DB size: 45MB. #Breach",
  "SELLING zero-day exploit targeting %COMPANY% internal infrastructure. Serious buyers only. Contact via Jabber.",
  "CRITICAL VULNERABILITY ALERT: Remote code execution discovered on %COMPANY% edge firewalls. Exploit sample attached.",
  "MEGA LEAK: Full customer database of %COMPANY% up for auction. Includes full names, credit card hashes, and cleartext passwords.",
  "RANSOMWARE ATTACK SUCCESS: Encrypted 40+ servers belonging to %COMPANY%. Demanding 50 BTC. Decryption key guaranteed.",
  "Pastebin log leak: detected combolist from darknet parser containing %COMPANY% internal credentials. Admin login included.",
  "Chat transcript: user hacker99 negotiating sale of %COMPANY% VPN access and employee SSO sessions. Selling price $5,000.",
  "Listing: Remote Access Trojan (RAT) pre-configured for %COMPANY% subnets. Tested on Windows 11 and Linux servers.",
  "Database dump: emails from %COMPANY%. Total records 1,200+. Example: admin@%COMPANY_DOMAIN% | S0m3P@ssword123"
];

export function generateSimulatedData(customCompanies: string[] = []): { content: string; source: string; sourceName: string } {
  const sourceIndex = Math.floor(Math.random() * THREAT_SOURCES.length);
  const source = THREAT_SOURCES[sourceIndex];
  const sourceName = source.split(' (')[0];
  
  const pool = [...COMPANIES_LIST, ...customCompanies];
  const company = pool[Math.floor(Math.random() * pool.length)];
  const template = CONTENT_TEMPLATES[Math.floor(Math.random() * CONTENT_TEMPLATES.length)];
  
  const companyDomain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const content = template
    .replace(/%COMPANY%/g, company)
    .replace(/%COMPANY_DOMAIN%/g, companyDomain);

  return { content, source, sourceName };
}
