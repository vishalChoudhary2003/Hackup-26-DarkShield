# 🛡️ DarkShield AI 
### Advanced Threat Intelligence & Security Operations Center (SOC)

## 📌 Project Overview
DarkShield AI is a state-of-the-art Threat Intelligence Dashboard designed to monitor the dark web, hacker forums, and illicit channels in real-time. Built with a stunning, high-fidelity "Cybersecurity Neon Green" aesthetic, it serves as a central command interface for enterprise SecOps teams to identify vulnerabilities before they become breaches.

## ✨ Key Features
- **Live Threat Intel Feed:** Real-time stream of simulated data anomalies, leaked credentials, and network breaches.
- **3D Secure Authenticator:** A visually striking split-screen login portal featuring an interactive, animated matrix terminal overlay.
- **Client & Admin Portals:** Role-based access separating the overarching SOC Administrative interface from focused Client/Company Dashboards.
- **Enterprise-Grade UI:** Fully responsive design utilizing deep dark backgrounds (`#0A0F1C`), neon green accents (`#00FF9F`), glassmorphism, and dynamic micro-animations.
- **Organization Monitoring:** Tools to add, scan, and assess the zero-trust security posture of monitored entities.

## 🛠️ Technology Stack
- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Custom Scoped CSS
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Charts:** Recharts / Chart.js

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone this repository or open the project folder in your terminal.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running the Application
To start the Vite development server, run:
```bash
npm run dev
```
Navigate to `http://localhost:5173` (or the port specified in the terminal) in your web browser to view the application.

## 🎨 Design System
The DarkShield UI adheres to a strict "Neon Cyber Command" design language:
- **Primary Background:** `#0A0F1C`
- **Secondary Surfaces:** `#1F2937`
- **Primary Accent / Safe Indicator:** `#00FF9F` (Neon Green)
- **Warning Indicator:** `#EAB308` (Yellow)
- **Critical Risk Indicator:** `#EF4444` (Red)
- **Typography:** Inter & Monospace (for terminal/log simulations)

## 🔐 Authentication Sandbox
By default, the application runs a mock simulation authentication engine to demonstrate capabilities:
- Logging in as **`admin@darkshield.ai`** grants full SOC Administrator access to all system tabs (Organizations, Global Settings, System Activity).
- Entering **any other email** will log you in as a Standard Client and route you to the isolated Client Dashboard.

---
*Built for the next generation of active Cyber Defense.*
