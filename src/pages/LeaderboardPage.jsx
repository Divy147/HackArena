import React, { useState, useEffect } from 'react';
import { Trophy, Search, Award, Shield, Crown, Zap, User } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { SAMPLE_LEADERBOARD } from '../data/labsData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const LeaderboardPage = () => {
  const { userProfile } = useAuth();
  const [leaderboard, setLeaderboard] = useState(SAMPLE_LEADERBOARD);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch live leaderboard from backend API
    api.getLeaderboard()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(item => ({
            rank: item.rank,
            username: item.username || item.name || 'Anonymous Cyber',
            xp: item.xp || 0,
            badges: item.badges || ['Cyber Rookie'],
            completedLabs: item.completedLabs?.length || 1,
            avatar: item.avatar || '⚡',
            userId: item.userId
          }));
          setLeaderboard(mapped);
        }
      })
      .catch(err => console.warn('Using local leaderboard data fallback:', err));
  }, []);

  const allUsers = [...leaderboard];
  const currentDisplayName = userProfile?.displayName || userProfile?.name;
  if (currentDisplayName && !allUsers.some(u => u.username === currentDisplayName || u.userId === userProfile?.uid)) {
    allUsers.push({
      rank: allUsers.length + 1,
      username: currentDisplayName,
      xp: userProfile?.xp || 0,
      badges: userProfile?.badges || ['Cyber Rookie'],
      completedLabs: userProfile?.completedLabs?.length || 0,
      avatar: userProfile?.avatar || '👾',
      isCurrentUser: true
    });
  }

  const sortedLeaderboard = allUsers.sort((a, b) => b.xp - a.xp).map((user, idx) => ({
    ...user,
    rank: idx + 1
  }));

  const filteredLeaderboard = sortedLeaderboard.filter(user =>
    (user.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = sortedLeaderboard.slice(0, 3);

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" /> Global Hacker Leaderboard
          </h1>
          <p className="text-xs text-slate-400">
            Real-time rankings based on total XP gained, completed labs, and badges unlocked.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hacker handle..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Rank 2 */}
        {top3[1] && (
          <GlassCard glowColor="cyan" className="text-center space-y-3 order-2 md:order-1 border-cyan-500/40">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-400 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(148,163,184,0.3)]">
              {top3[1].avatar || '👻'}
            </div>
            <div className="inline-block px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
              RANK #2
            </div>
            <h3 className="text-lg font-bold text-white">{top3[1].username}</h3>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">{top3[1].xp} XP</div>
            <div className="flex flex-wrap justify-center gap-1">
              {top3[1].badges?.slice(0, 2).map((b, i) => (
                <span key={i} className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  {typeof b === 'object' ? b.name : b}
                </span>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Rank 1 (Gold Podium) */}
        {top3[0] && (
          <GlassCard glowColor="amber" className="text-center space-y-3 order-1 md:order-2 border-amber-500/60 transform md:-translate-y-4 shadow-[0_0_35px_rgba(245,158,11,0.2)]">
            <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-4xl">
                {top3[0].avatar || '🐉'}
              </div>
              <Crown className="absolute -top-3 w-8 h-8 text-amber-400 animate-bounce" />
            </div>
            <div className="inline-block px-3 py-0.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-400 text-xs font-mono font-bold">
              👑 RANK #1 CHAMPION
            </div>
            <h3 className="text-xl font-extrabold text-white">{top3[0].username}</h3>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">{top3[0].xp} XP</div>
            <div className="flex flex-wrap justify-center gap-1">
              {top3[0].badges?.map((b, i) => (
                <span key={i} className="text-[10px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 text-amber-300">
                  {typeof b === 'object' ? b.name : b}
                </span>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Rank 3 */}
        {top3[2] && (
          <GlassCard glowColor="purple" className="text-center space-y-3 order-3 border-amber-700/40">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-700 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(180,83,9,0.3)]">
              {top3[2].avatar || '⚡'}
            </div>
            <div className="inline-block px-3 py-0.5 rounded-full bg-slate-800 text-amber-600 text-xs font-mono font-bold">
              RANK #3
            </div>
            <h3 className="text-lg font-bold text-white">{top3[2].username}</h3>
            <div className="text-2xl font-extrabold text-purple-400 font-mono">{top3[2].xp} XP</div>
            <div className="flex flex-wrap justify-center gap-1">
              {top3[2].badges?.slice(0, 2).map((b, i) => (
                <span key={i} className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  {typeof b === 'object' ? b.name : b}
                </span>
              ))}
            </div>
          </GlassCard>
        )}

      </div>

      {/* Full Leaderboard Table */}
      <GlassCard className="p-0 overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Hacker Handle</th>
                <th className="py-3.5 px-6">Completed Labs</th>
                <th className="py-3.5 px-6">Badges Earned</th>
                <th className="py-3.5 px-6 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs font-sans">
              {filteredLeaderboard.map((user) => {
                const isUserCurrent = user.username === currentDisplayName || user.userId === userProfile?.uid;
                return (
                  <tr
                    key={user.rank}
                    className={`transition-colors ${
                      isUserCurrent
                        ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <td className="py-4 px-6 font-mono font-bold">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${
                        user.rank === 1 ? 'bg-amber-400 text-slate-950' :
                        user.rank === 2 ? 'bg-slate-300 text-slate-950' :
                        user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-900 text-slate-400'
                      }`}>
                        #{user.rank}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                      <span className="text-xl">{user.avatar || '👾'}</span>
                      <div>
                        <span className="text-sm">{user.username}</span>
                        {isUserCurrent && (
                          <span className="ml-2 text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-slate-300">
                      {user.completedLabs || 1} Labs Solved
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {user.badges?.map((b, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800"
                          >
                            {typeof b === 'object' ? b.name : b}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-extrabold text-emerald-400 text-sm">
                      {user.xp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  );
};
