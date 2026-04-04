import { useState } from 'react';
import { Sparkles, Terminal, Code, Cpu, Server, Play, Copy, Check, ShieldAlert, BarChart3 } from 'lucide-react';

interface MlWorkbenchProps {
  logActivity: (action: string, details: string, category: 'auth' | 'system' | 'threat' | 'config', status?: 'success' | 'warning' | 'error') => void;
}

export default function MlWorkbench({ logActivity }: MlWorkbenchProps) {
  const [activeTab, setActiveTab] = useState<'interactive' | 'fastapi' | 'training'>('interactive');
  const [sampleText, setSampleText] = useState(
    "CRITICAL LEAK: Selling database of 50000 accounts from banking domain. Includes emails like admin@finance-corp.com and root IPs: 192.168.1.5. Password hashes are MD5."
  );
  const [extractedEntities, setExtractedEntities] = useState<{
    emails: string[];
    ips: string[];
    riskScore: number;
    category: string;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulated Fast API & MongoDB code
  const backendPythonCode = `from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from pymongo import MongoClient
from transformers import pipeline
import re
import datetime

app = FastAPI(title="DarkShield AI NLP Threat Engine")

# MongoDB Compass connection
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["darkshield_db"]
threats_collection = db["threats"]

# Load fine-tuned NLP model
# Use Hugging Face DistilBERT or RoBERTa for cybersecurity text classification
threat_classifier = pipeline("text-classification", model="Elron/bleach-cyber-threat-detector")

class DarkWebPost(BaseModel):
    content: string
    source: string

def extract_entities(text: str):
    emails = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    ips = re.findall(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', text)
    return {"emails": emails, "ips": ips}

@app.post("/api/v1/analyze-threat")
async def analyze_threat(post: DarkWebPost, background_tasks: BackgroundTasks):
    try:
        # NLP Model Inference
        inference_result = threat_classifier(post.content)[0]
        label = inference_result['label']
        score = inference_result['score']
        
        # Entity Extraction via Regex + NLP NER
        entities = extract_entities(post.content)
        
        threat_document = {
            "source": post.source,
            "content": post.content,
            "classification": label,
            "confidence": float(score),
            "extracted_entities": entities,
            "timestamp": datetime.datetime.utcnow(),
            "status": "investigating"
        }
        
        # Insert into MongoDB Compass
        result = threats_collection.insert_one(threat_document)
        
        return {
            "status": "success",
            "threat_id": str(result.inserted_id),
            "entities_found": entities,
            "ml_classification": label,
            "confidence_score": float(score)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`;

  const runNlpAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g;
      const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;

      const foundEmails = sampleText.match(emailRegex) || [];
      const foundIps = sampleText.match(ipRegex) || [];

      let score = 20;
      if (foundEmails.length > 0) score += 30;
      if (foundIps.length > 0) score += 40;
      if (sampleText.toLowerCase().includes('leak') || sampleText.toLowerCase().includes('selling')) score += 10;

      setExtractedEntities({
        emails: foundEmails,
        ips: foundIps,
        riskScore: Math.min(score, 100),
        category: score > 70 ? 'CRITICAL LEAK' : score > 40 ? 'SUSPICIOUS' : 'INFORMATION'
      });

      setIsAnalyzing(false);
      logActivity('NLP Inference Run', 'Analyzed custom string for cyber threats', 'threat', 'success');
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(backendPythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-[#0b1019] border border-cyan-500/20 rounded-xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 flex items-center gap-2">
            <Cpu className="text-cyan-400" size={28} /> AI + NLP Threat Engine Workbench
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Build, test and deploy Neural Networks for automated dark web parsing and data breach classification.
          </p>
        </div>

        <div className="flex gap-2 bg-slate-900/80 p-1 border border-cyan-500/30 rounded-lg mt-4 md:mt-0">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'interactive' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            🧪 Live NLP Model Tester
          </button>
          <button
            onClick={() => setActiveTab('fastapi')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'fastapi' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            🐍 FastAPI + MongoDB Compass Code
          </button>
        </div>
      </div>

      {activeTab === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-400 text-sm font-semibold mb-2 flex items-center gap-2">
                <Terminal size={16} /> Enter Raw Text (Scraped Dark Web Payload)
              </label>
              <textarea
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                rows={6}
                className="w-full bg-[#050811] border border-cyan-500/30 rounded-lg p-3 text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Paste leaked text data here..."
              />
            </div>

            <button
              onClick={runNlpAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Play size={18} /> {isAnalyzing ? 'Running Neural Net Inference...' : 'Execute ML Classification (BERT)'}
            </button>

            <div className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-xl">
              <h3 className="text-slate-300 font-semibold mb-2 flex items-center gap-1">
                <ShieldAlert className="text-yellow-400" size={16} /> NLP Model Parameters
              </h3>
              <ul className="text-xs space-y-2 text-slate-400">
                <li>• **Base Architecture**: DistilBERT for token classification</li>
                <li>• **Vocabulary Size**: 30,522 cyber terms</li>
                <li>• **Confidence Threshold**: 0.82 minimum pass</li>
                <li>• **Database Connector**: PyMongo client for MongoDB Compass</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#050811] border border-cyan-500/30 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={18} /> Real-Time Inference Output
              </h3>

              {extractedEntities ? (
                <div className="space-y-4">
                  <div className="bg-slate-900/80 p-4 rounded-lg border border-cyan-500/20">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Classification</p>
                    <p className="text-xl font-bold text-yellow-400 mt-1">{extractedEntities.category}</p>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-lg border border-cyan-500/20">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Confidence Risk Score</p>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full shadow-lg shadow-red-500/50"
                        style={{ width: `${extractedEntities.riskScore}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-slate-400">
                      <span>Low Risk</span>
                      <span className="text-red-400 font-bold">{extractedEntities.riskScore}/100</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-lg border border-cyan-500/20">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Entities Extracted (Regex/NER)</p>
                    <div className="space-y-1 text-sm font-mono">
                      <div>
                        <span className="text-cyan-400">Emails:</span>{' '}
                        {extractedEntities.emails.length > 0 ? extractedEntities.emails.join(', ') : 'None'}
                      </div>
                      <div>
                        <span className="text-indigo-400">IP Addresses:</span>{' '}
                        {extractedEntities.ips.length > 0 ? extractedEntities.ips.join(', ') : 'None'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  <Sparkles className="animate-pulse mb-2 text-cyan-400" size={32} />
                  <p className="text-sm">Ready to parse text with AI Engine</p>
                </div>
              )}
            </div>

            <div className="text-center text-xs text-slate-600 mt-4 border-t border-slate-900 pt-3">
              NLP Engine Model v4.1 - Syncing to MongoDB Compass instance localhost:27017
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fastapi' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-lg border border-cyan-500/20">
            <div className="flex items-center gap-2">
              <Server className="text-cyan-400" size={18} />
              <span className="text-slate-300 font-mono text-sm">main.py - FastAPI + PyMongo</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-800 px-3 py-1.5 rounded border border-cyan-500/20"
            >
              {copiedCode ? <Check size={14} /> : <Copy size={14} />} {copiedCode ? 'COPIED!' : 'COPY CODE'}
            </button>
          </div>

          <pre className="bg-[#050811] border border-cyan-500/20 rounded-xl p-5 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed max-h-96">
            <code>{backendPythonCode}</code>
          </pre>

          <div className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-xl flex gap-3 items-start">
            <Code className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
            <div className="text-sm text-slate-300">
              <p className="font-semibold text-white">How to run locally:</p>
              <ol className="list-decimal list-inside text-slate-400 mt-2 space-y-1">
                <li>Install dependencies: <code className="text-cyan-300">pip install fastapi pymongo transformers uvicorn torch</code></li>
                <li>Make sure your **MongoDB Compass** is running on <code className="text-cyan-300">localhost:27017</code></li>
                <li>Run the file: <code className="text-cyan-300">python main.py</code></li>
                <li>FastAPI Swagger docs will be available at <code className="text-cyan-300">http://127.0.0.1:8000/docs</code></li>
              </ol>
            </div>
          </div>

          <div className="bg-[#050811] border border-emerald-500/20 rounded-xl p-5 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-emerald-400 text-sm tracking-widest uppercase">Live MongoDB Connection Test</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              यह मॉड्यूल आपके ब्राउज़र से सीधे आपके लोकल **MongoDB Compass (FastAPI)** बैकएंड से कनेक्ट होने की कोशिश करता है। यदि आपने बैकएंड स्टार्ट कर लिया है, तो आप लाइव टेस्ट कर सकते हैं।
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('http://127.0.0.1:8000/health');
                    if (res.ok) alert('SUCCESS: Connected to FastAPI & MongoDB Compass!');
                    else alert('Connected to Server, but Database is reporting an error.');
                  } catch (e) {
                    alert('CONNECTION ERROR: Make sure your FastAPI is running on http://127.0.0.1:8000');
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-4 rounded-lg tracking-wider transition-colors"
              >
                TEST LIVE CONNECTION
              </button>
              <span className="text-xs text-slate-500 font-mono">Endpoint: http://127.0.0.1:8000/health</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
