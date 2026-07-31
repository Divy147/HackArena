import React, { useState } from 'react';
import { User, Shield, Award, CheckCircle2, Trophy, Zap, Download, Lock, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { ALL_BADGES, LABS_DATA } from '../data/labsData';
import { api } from '../services/api';

export const ProfilePage = ({ onNavigateToCertificate }) => {
  const { userProfile, syncProfileState } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatar || '👾');

  const xp = userProfile?.xp || 0;
  const level = userProfile?.level || 1;
  const completedLabs = userProfile?.completedLabs || [];
  const userBadges = (userProfile?.badges || []).map(b => typeof b === 'object' ? b.name : b);

  const avatars = ['👾', '🥷', '🐉', '👻', '⚡', '👑', '☣️', '🤖'];

  // All 3 beginner labs completed check
  const requiredLabs = ['sql-injection', 'xss', 'broken-authentication'];
  const isCertificateEligible = requiredLabs.every(id => completedLabs.includes(id));

  const handleSelectAvatar = async (av) => {
    setSelectedAvatar(av);
    syncProfileState({ ...userProfile, avatar: av });
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Profile Header Banner */}
      <GlassCard className="border-cyan-500/40 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            {/* Avatar Selector */}
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-2xl bg-slate-950 border-2 border-cyan-500/60 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                {selectedAvatar}
              </div>
              <div className="absolute inset-0 bg-slate-950/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-mono text-cyan-400">
                Change Icon
              </div>
            </div>

            <div className="space-y-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-white">
                {userProfile?.displayName || userProfile?.name || 'CyberHacker'}
              </h1>
              <p className="text-xs text-slate-300 font-mono">
                {userProfile?.email || 'hacker@hackarena.io'}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
                  LEVEL {level} DEFENDER
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                  {xp} TOTAL XP
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Download Action Button */}
          <div className="w-full md:w-auto">
            {isCertificateEligible ? (
              <button
                onClick={onNavigateToCertificate}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(0,255,102,0.4)] transition-all"
              >
                <Award className="w-5 h-5" /> View & Download Certificate
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-mono font-bold">
                  <Lock className="w-4 h-4" /> Certificate Locked ({completedLabs.length}/3 Labs Completed)
                </div>
                <p className="text-[11px] text-slate-400">
                  Complete all 3 beginner labs (SQLi + XSS + Broken Auth) to unlock your official PDF/PNG certificate.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Quick Avatar Swapper */}
        <div className="pt-6 mt-6 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-2">CHOOSE AVATAR:</span>
          {avatars.map((av, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectAvatar(av)}
              className={`p-2 rounded-xl text-xl bg-slate-900 border transition-all ${
                selectedAvatar === av ? 'border-cyan-400 bg-cyan-950/40 scale-110' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {av}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Main Grid: Completed Labs + Badges Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Completed Labs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Completed Cyber Modules
          </h2>

          <div className="space-y-3">
            {LABS_DATA.map((lab) => {
              const done = completedLabs.includes(lab.id);
              return (
                <GlassCard key={lab.id} className="p-4 border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          done ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-slate-500'
                        }`}>
                          {done ? 'VERIFIED BREACH' : 'LOCKED'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">+{lab.xp} XP</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{lab.title}</h4>
                    </div>

                    <div className="text-right font-mono text-xs">
                      {done ? (
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Solved
                        </span>
                      ) : (
                        <span className="text-slate-500">Incomplete</span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Unlocked Badges Showcase */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
            <Award className="w-5 h-5 text-amber-400" /> Earned Cyber Badges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_BADGES.map((badge) => {
              const unlocked = userBadges.includes(badge.name) || userBadges.some(b => typeof b === 'string' && b.toLowerCase().includes(badge.name.toLowerCase()));
              return (
                <GlassCard
                  key={badge.id}
                  className={`p-4 border transition-all ${
                    unlocked
                      ? 'border-cyan-500/40 bg-slate-900/90 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'border-slate-800/80 opacity-50 grayscale'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {badge.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                        {unlocked && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
