import React from 'react';
import { Shield, Zap, Award, Trophy, Terminal, CheckCircle2, ArrowRight, Activity, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { LABS_DATA, SAMPLE_LEADERBOARD } from '../data/labsData';

export const DashboardPage = ({ onSelectLab, onNavigate }) => {
  const { userProfile } = useAuth();

  const xp = userProfile?.xp || 250;
  const level = userProfile?.level || 1;
  const completedLabs = userProfile?.completedLabs || ['sql-injection'];
  const badges = userProfile?.badges || ['SQL Master', 'Cyber Novice'];

  // XP Progress math (e.g. 500 XP per level)
  const currentLevelBaseXP = (level - 1) * 500;
  const nextLevelXP = level * 500;
  const progressInLevel = xp - currentLevelBaseXP;
  const levelProgressPercentage = Math.min(Math.round((progressInLevel / 500) * 100), 100);

  const totalLabsCount = LABS_DATA.length;
  const completedPercentage = Math.round((completedLabs.length / totalLabsCount) * 100);

  const recentActivities = [
    { text: "Successfully completed SQL Injection Bypass lab", time: "10 mins ago", icon: "💾", color: "text-cyan-400" },
    { text: "Unlocked 'SQL Master' Hacker Badge", time: "10 mins ago", icon: "🏆", color: "text-amber-400" },
    { text: "Gained +250 XP for Flag Submission", time: "10 mins ago", icon: "⚡", color: "text-emerald-400" },
    { text: "Initialized HackArena Cyber Defence Account", time: "1 hour ago", icon: "🛡️", color: "text-purple-400" }
  ];

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Welcome Banner */}
      <GlassCard className="border-cyan-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-cyan-500/60 flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              {userProfile?.avatar || '👾'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, <span className="text-cyan-400">{userProfile?.displayName || 'CyberHacker'}</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
                  RANK #{userProfile?.rank || 4}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                HackArena Operative • Clearances: Level {level} Security Analyst
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('labs')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
            >
              <Terminal className="w-4 h-4" /> Continue Labs
            </button>

            <button
              onClick={() => onNavigate('mentor')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass-panel hover:bg-slate-800 text-cyan-400 font-bold text-sm border border-slate-700 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" /> AI Mentor
            </button>
          </div>

        </div>
      </GlassCard>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total XP Card */}
        <GlassCard glowColor="cyan" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total XP</span>
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{xp} XP</div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Next Level: {nextLevelXP} XP</span>
              <span className="text-cyan-400 font-bold">{levelProgressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercentage}%` }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Current Level */}
        <GlassCard glowColor="green" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Current Level</span>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">LEVEL {level}</div>
          <p className="text-xs text-slate-400">
            Status: {level >= 3 ? 'Elite Hacker' : level >= 2 ? 'Intermediate Hacker' : 'Novice Defender'}
          </p>
        </GlassCard>

        {/* Completed Labs */}
        <GlassCard glowColor="purple" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Completed Labs</span>
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {completedLabs.length} / {totalLabsCount}
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completedPercentage}%` }}
            />
          </div>
        </GlassCard>

        {/* Badges Unlocked */}
        <GlassCard glowColor="amber" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Badges Unlocked</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {badges.length} Badges
          </div>
          <p className="text-xs text-slate-400">
            {badges.join(', ')}
          </p>
        </GlassCard>

      </div>

      {/* Main Grid: Interactive Labs Quick Launch & Leaderboard/Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Active Labs Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" /> Interactive Cyber Labs
            </h2>
            <button
              onClick={() => onNavigate('labs')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              View All Modules <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {LABS_DATA.map((lab) => {
              const isCompleted = completedLabs.includes(lab.id);
              return (
                <GlassCard key={lab.id} className="hover:border-cyan-500/50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                          lab.difficulty === 'Beginner'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                            : 'bg-amber-950 text-amber-400 border-amber-500/40'
                        }`}>
                          {lab.difficulty}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">⏱️ {lab.estimatedTime}</span>
                        {isCompleted && (
                          <span className="text-xs text-cyan-400 font-mono flex items-center gap-1 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> COMPLETED
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white">{lab.title}</h3>
                      <p className="text-xs text-slate-300">{lab.description}</p>
                    </div>

                    <button
                      onClick={() => onSelectLab(lab)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
                        isCompleted
                          ? 'bg-slate-900 border border-slate-700 text-cyan-400 hover:bg-slate-800'
                          : 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:from-cyan-400 hover:to-emerald-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      }`}
                    >
                      {isCompleted ? 'Revisit Lab' : 'Start Lab'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Right Col: Mini Leaderboard & Activity */}
        <div className="space-y-6">
          
          {/* Mini Leaderboard */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> Top Hackers
              </h3>
              <button
                onClick={() => onNavigate('leaderboard')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                View Full
              </button>
            </div>

            <div className="space-y-3">
              {SAMPLE_LEADERBOARD.slice(0, 4).map((hacker) => (
                <div
                  key={hacker.rank}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                      hacker.rank === 1 ? 'bg-amber-400 text-slate-950' :
                      hacker.rank === 2 ? 'bg-slate-300 text-slate-950' :
                      hacker.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{hacker.rank}
                    </span>
                    <span className="text-base">{hacker.avatar}</span>
                    <span className="font-semibold text-white">{hacker.username}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">{hacker.xp} XP</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Activity Stream */}
          <GlassCard>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-cyan-400" /> Recent Telemetry Activity
            </h3>

            <div className="space-y-3 font-sans text-xs">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-sm">{act.icon}</span>
                  <div>
                    <p className="text-slate-300 leading-snug">{act.text}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
