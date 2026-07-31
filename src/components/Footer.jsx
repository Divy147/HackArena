import React from 'react';
import { Shield, Terminal, Heart, Lock, Radio } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-900 bg-slate-950/90 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="font-extrabold text-lg text-white">
                HACK<span className="text-cyan-400">ARENA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation interactive cybersecurity learning ecosystem. Master ethical hacking, defend systems, and conquer simulated vulnerabilities.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              System Status: Operational
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase text-cyan-400 tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => setActiveTab('landing')} className="hover:text-cyan-400 transition-colors">
                  Home / Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('labs')} className="hover:text-cyan-400 transition-colors">
                  Cyber Attack Labs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('mentor')} className="hover:text-cyan-400 transition-colors">
                  AI Cyber Sentinel
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('leaderboard')} className="hover:text-cyan-400 transition-colors">
                  Global Leaderboard
                </button>
              </li>
            </ul>
          </div>

          {/* Lab Vulnerabilities */}
          <div>
            <h4 className="text-xs font-mono uppercase text-emerald-400 tracking-wider mb-3">Active Modules</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> SQL Injection (Beginner)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Stored XSS (Beginner)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Broken Auth (Intermediate)
              </li>
            </ul>
          </div>

          {/* Security Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-amber-400 tracking-wider mb-3">Legal & Ethics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All challenges on HackArena are non-destructive educational simulations designed for security research and defensive education.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-xs pt-2">
              <Lock className="w-4 h-4 text-cyan-400" /> Encrypted Sandbox Telemetry
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 HackArena Security Systems. Built for Ethical Hackers.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-cyan-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-cyan-400 cursor-pointer">Terms of Engagement</span>
            <span className="hover:text-cyan-400 cursor-pointer">Security Vulnerability Disclosure</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
