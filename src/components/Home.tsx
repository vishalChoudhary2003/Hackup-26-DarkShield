import React, { useEffect, useState } from 'react';
import { Shield, PlayCircle, ShieldCheck, ArrowRight, Home as HomeIcon, LayoutDashboard, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            });
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);



    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-left">
                    <div className="logo-shield">
                        <Shield className="icon-yellow w-4 h-4" />
                    </div>
                    <span className="brand-name">DarkShield AI</span>
                </div>

                <div className="nav-center">
                    <a onClick={() => navigate('/app')} className="nav-link cursor-pointer">Client Portal</a>
                </div>

                <div className="nav-right cursor-pointer">
                    <a onClick={() => navigate('/app')} className="login-link">Log in</a>
                    <a onClick={() => navigate('/app')} className="signup-btn">Get Protected</a>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div 
                    className="glow-bg glow-1"
                    style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
                />
                <div 
                    className="glow-bg glow-2"
                    style={{ transform: `translate(${-mousePos.x * 30}px, ${-mousePos.y * 30}px)` }}
                />

                <div className="hero-content mt-10">
                    <div className="pill-badge">
                        <span className="pulse-dot"></span>
                        v2.4.0 NLP Engine Now Live
                    </div>

                    <h1>Identify vulnerabilities before they become <span className="text-gradient">breaches.</span></h1>
                    <p>Enterprise-grade dark web monitoring, leaked credential detection, and automated risk scoring in one
                        unified intelligence dashboard. Built by industry veterans.</p>

                    <div className="hero-actions cursor-pointer">
                        <a onClick={() => navigate('/app')} className="secondary-btn"><PlayCircle className="w-[18px] h-[18px]" /> Try Demo</a>
                    </div>

                    <div className="dashboard-preview mt-20">
                        <div className="mockup-window">
                            <div className="mockup-header">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="mockup-body cursor-pointer" onClick={() => navigate('/app')}>
                                <div className="flex flex-col items-center gap-4">
                                    <ShieldCheck className="huge-icon icon-yellow" />
                                    <span className="text-[#9ca3af] text-sm font-medium">Click to Open Client Dashboard</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="trusted-by mt-12">
                        <p>TRUSTED BY SEC-OPS TEAMS WORLDWIDE</p>
                        <div className="logos">
                            <span>TECHCORP</span>
                            <span>GLOBALFINANCE</span>
                            <span>NEXUS</span>
                            <span>CYBERDEF</span>
                        </div>
                    </div>
                </div>
            </header>



            {/* Footer CTA */}
            <section className="section text-center pb-32">
                <h2 className="section-title">Ready to secure your enterprise?</h2>
                <p className="section-subtitle mb-10">Don't wait to become a statistic. Secure your data, protect your profits, and maintain absolute control.</p>
                <a onClick={() => navigate('/app')} className="primary-btn inline-flex cursor-pointer mx-auto max-w-sm">Deploy DarkShield Intelligence <ArrowRight className="w-[18px] h-[18px]" /></a>
            </section>

            {/* Footer */}
            <footer className="site-footer">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="logo-shield">
                            <Shield className="icon-yellow w-4 h-4" />
                        </div>
                        <h3 className="mt-4 font-bold uppercase">DarkShield AI</h3>
                        <p>Advanced unified intelligence dashboard and threat neutralizer. Identifying vulnerabilities before they become breaches.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Platform</h4>
                        <a href="#">Threat Intel</a>
                        <a href="#">Dark Web Monitor</a>
                        <a href="#">API Access</a>
                    </div>
                    <div className="footer-links">
                        <h4>Company</h4>
                        <a href="#">About Us</a>
                        <a href="#">Careers</a>
                        <a href="#">Contact</a>
                    </div>
                    <div className="footer-links">
                        <h4>Legal</h4>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Compliance</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 DarkShield AI. All rights reserved.</p>
                    <div className="social-links">
                        <a href="#"><Globe className="w-5 h-5"/></a>
                        <a href="#"><LayoutDashboard className="w-5 h-5"/></a>
                        <a href="#"><HomeIcon className="w-5 h-5"/></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
