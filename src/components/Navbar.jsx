import React, { useState } from 'react';
import { Shield, Terminal, Cpu, Award, Trophy, User, LogOut, Menu, X, Zap, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Terminal },
    { id: 'dashboard', label: 'Dashboard', icon: Cpu },
    { id: 'labs', label: 'Labs', icon: Shield },
    { id: 'mentor', label: 'AI Mentor', icon: Zap },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'admin', label: 'Owner Panel', icon: ShieldAlert },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-cyan-500/50 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300">
              <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 rounded-lg bg-cyan-500/10 blur-sm group-hover:bg-cyan-500/20" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-wider text-white">
                HACK<span className="text-cyan-400">ARENA</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                v2.4 SEC
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isOwner = item.id === 'admin';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? isOwner 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]' 
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : isOwner
                        ? 'text-rose-400 hover:bg-rose-950/40 border border-rose-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? (isOwner ? 'text-rose-400' : 'text-cyan-400') : (isOwner ? 'text-rose-400' : 'text-slate-400')}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Status & Auth Action */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser || userProfile ? (
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-lg">{userProfile?.avatar || '👾'}</span>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      LVL {userProfile?.level || 1}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {userProfile?.xp || 0} XP
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Disconnect Cyber Link"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-500/30 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 text-cyan-400" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
