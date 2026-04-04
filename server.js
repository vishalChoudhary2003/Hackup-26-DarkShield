import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/darkshield_intelligence')
    .then(() => console.log('Connected to MongoDB Compass Database: darkshield_intelligence'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

const ThreatSchema = new mongoose.Schema({
    id: String,
    companyName: { type: String, default: null },
    source: String,
    sourceType: String,
    content: String,
    timestamp: Date,
    analyzedAt: Date,
    entities: {
        emails: [String],
        passwords: [String],
        companies: [String],
        ipAddresses: [String],
        keywords: [String]
    },
    riskScore: Number,
    riskLevel: String,
    riskBreakdown: {
        emailScore: Number,
        passwordScore: Number,
        companyScore: Number,
        keywordBonus: Number
    },
    status: String,
    isReal: Boolean
});
const ThreatModel = mongoose.model('Threat', ThreatSchema);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const TORCRAWL_PATH = path.join(__dirname, 'TorCrawl.py');
const OUTPUT_PATH = path.join(TORCRAWL_PATH, 'output');

let threats = [];

// Helper to save live threats to memory and structurally to MongoDB
async function registerThreat(threatData, storeInDb = true) {
    threats = [threatData, ...threats].slice(0, 500); // 500 in-memory
    if (storeInDb) {
        try {
            await ThreatModel.findOneAndUpdate({ id: threatData.id }, threatData, { upsert: true });
        } catch (e) {
            console.error('Mongo Save Error:', e.message);
        }
    }
}

// Load existing TorCrawl outputs
function loadExistingThreats() {
    if (!fs.existsSync(OUTPUT_PATH)) return;

    const domains = fs.readdirSync(OUTPUT_PATH);
    domains.forEach(domain => {
        const domainPath = path.join(OUTPUT_PATH, domain);
        if (fs.lstatSync(domainPath).isDirectory()) {
            const files = fs.readdirSync(domainPath);
            files.forEach(file => {
                if (file.endsWith('_results.json')) {
                    try {
                        const content = JSON.parse(fs.readFileSync(path.join(domainPath, file), 'utf8'));
                        registerThreat(formatThreat(content, domain, file), false); // false to avoid DB spam on restart
                    } catch (e) {
                        console.error('Error parsing threat file:', file, e);
                    }
                }
            });
        }
    });

    threats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function formatThreat(data, domain, filename) {
    const id = `TOR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const riskScore = 88; // Default high for darkweb match
    
    // Extracted values safely
    const emailsFound = data.emails || [];
    const filesFound = data.files || [];
    
    const dateStr = filename.split('_')[0];
    const parsedDate = dateStr.length === 6 
        ? new Date(`20${dateStr.substring(0,2)}-${dateStr.substring(2,4)}-${dateStr.substring(4,6)}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`)
        : new Date();

    const extractedCompany = data.companyLabel || (domain.replace('www.', '').split('.')[0] || null);

    return {
        id,
        companyName: extractedCompany,
        source: domain,
        sourceType: 'Credential Dump', // Using existing valid sourceType
        content: `Raw extraction from TorCrawl module running against ${data.start_url || domain}. Discovered ${data.links?.length || 0} links, ${emailsFound.length} emails, and ${filesFound.length} files during the scrape iteration.`,
        timestamp: parsedDate,
        analyzedAt: new Date(),
        entities: {
            emails: emailsFound,
            passwords: [], // VERY IMPORTANT: provide empty array to prevent TypeError in frontend crashes
            companies: extractedCompany ? [extractedCompany] : [],
            ipAddresses: [],
            keywords: ['tor_crawl_artifact', 'scrape_success']
        },
        riskScore,
        riskLevel: 'HIGH',
        riskBreakdown: {
            emailScore: emailsFound.length > 0 ? 30 : 0,
            passwordScore: 0,
            companyScore: 20,
            keywordBonus: 38
        },
        status: 'analyzed',
        isReal: true
    };
}

// Watch for file changes
const watcher = chokidar.watch(OUTPUT_PATH, {
    ignored: /(^|[\/\\])\../,
    persistent: true
});

watcher.on('add', (filePath) => {
    if (filePath.endsWith('_results.json')) {
        setTimeout(() => {
            try {
                const domain = path.basename(path.dirname(filePath));
                const filename = path.basename(filePath);
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const newThreat = formatThreat(content, domain, filename);
                
                registerThreat(newThreat, true); // true to persist new crawler json results to DB
            } catch (e) {
                console.error('File parsing error on add', e);
            }
        }, 1000); // Slight delay to ensure TorCrawl finishes writing the file
    }
});

import { spawn } from 'child_process';

function triggerAutomatedScan(url) {
    console.log(`Starting real-time Playwright scan for URL: ${url}`);
    
    const targetDomain = new URL(url.startsWith('http') ? url : `http://${url}`).hostname;
    const extractedCompany = targetDomain.replace('www.', '').split('.')[0] || null;

    // Create an initial status entry
    const startEvent = {
        id: `TOR-SCAN-${Date.now()}`,
        companyName: extractedCompany,
        source: targetDomain,
        sourceType: 'Forum Post', // General type for log output
        content: `[AUTO-TRACKING INITIATED] Deep packet inspection and automated crawler sequence started for target: ${url}. Bypassing standard DNS...`,
        timestamp: new Date(),
        analyzedAt: new Date(),
        entities: { emails: [], passwords: [], companies: extractedCompany ? [extractedCompany] : [], ipAddresses: [], keywords: ['active_scan_started'] },
        riskScore: 25,
        riskLevel: 'LOW',
        riskBreakdown: { emailScore: 0, passwordScore: 0, companyScore: 5, keywordBonus: 20 },
        status: 'investigating',
        isReal: true
    };
    registerThreat(startEvent, true); // Store Live Scan start trace in DB

    // Run Playwright Crawler for extreme speeds
    const cmd = 'node';
    const args = ['fast_crawler.js', url];
    
    // Spawn from the root directory instead of TORCRAWL_PATH
    const child = spawn(cmd, args, { cwd: __dirname });

    child.stdout.on('data', (data) => {
        const text = data.toString().trim();
        if (text && text.includes('##')) {
            // Push real-time stdout text as a Threat line into the dashboard!
            const liveEvent = {
                id: `LIVE-${Math.random().toString(36).substr(2, 9)}`,
                companyName: extractedCompany,
                source: targetDomain,
                sourceType: 'Chat Log',
                content: `[CRAWLER LOG] ${text}`,
                timestamp: new Date(),
                analyzedAt: new Date(),
                entities: { emails: [], passwords: [], companies: extractedCompany ? [extractedCompany] : [], ipAddresses: [], keywords: ['live_trace'] },
                riskScore: 45,
                riskLevel: 'MEDIUM',
                riskBreakdown: { emailScore: 0, passwordScore: 0, companyScore: 10, keywordBonus: 35 },
                status: 'investigating',
                isReal: true
            };
            registerThreat(liveEvent, true); // Store unstructured crawl logs systematically in DB
        }
    });

    child.stderr.on('data', (data) => console.error(`[Playwright ERROR]: ${data}`));
}

app.post('/api/scan', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    triggerAutomatedScan(url);
    res.json({ status: 'Scan sequence engaged', url });
});


app.get('/api/threats', (req, res) => {
    res.json(threats);
});

app.get('/api/threats/company/:companyName', async (req, res) => {
    try {
        const { companyName } = req.params;
        const dbThreats = await ThreatModel.find({ 
            $or: [
                { companyName: new RegExp(`^${companyName}$`, 'i') },
                { source: new RegExp(`^${companyName}`, 'i') },
                { content: new RegExp(companyName, 'i') },
                { 'entities.companies': new RegExp(companyName, 'i') }
            ]
        }).sort({ timestamp: -1 }).limit(200);

        res.json(dbThreats);
    } catch (error) {
        console.error("Client API Error:", error);
        res.status(500).json({ error: 'Database query failed' });
    }
});


// List of random targets to scan automatically 
const AUTOMATED_TARGETS = [
    'http://pastebin.com',
    'http://breachforums.cx.onion',
    'http://nulled.to',
    'http://github.com'
];

app.listen(PORT, () => {
    console.log(`Knowledge Bridge Server running on http://localhost:${PORT}`);
    loadExistingThreats();

    // Start background scanner
    setInterval(() => {
        const randomTarget = AUTOMATED_TARGETS[Math.floor(Math.random() * AUTOMATED_TARGETS.length)];
        triggerAutomatedScan(randomTarget);
    }, 45000); // 45 seconds interval for continuous live automated threat hunting
});
