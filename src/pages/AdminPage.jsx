import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Users, Award, CheckCircle2, Terminal, Activity, 
  Search, RefreshCw, Cpu, Database, Eye, Download, Sparkles, KeyRound 
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.warn('Admin API fetch fallback:', err);
      // Fallback user registry data
      setUsers([
        {
          id: 'user-001',
          displayName: 'CyberViper_0x',
          email: 'viper@hackarena.io',
          xp: 2450,
          level: 5,
          completedLabs: ['sql-injection', 'xss', 'broken-auth'],
          badges: ['SQL Master', 'XSS Hunter', 'Auth Breaker', 'Legend'],
          avatar: '🐉',
          createdAt: '2026-07-28T10:15:00.000Z',
          lastActive: 'Just now'
        },
        {
          id: 'user-002',
          displayName: 'NeonSpectre',
          email: 'spectre@hackarena.io',
          xp: 1800,
          level: 4,
          completedLabs: ['sql-injection', 'xss'],
          badges: ['SQL Master', 'XSS Hunter', 'Pro Hacker'],
          avatar: '👻',
          createdAt: '2026-07-29T14:30:00.000Z',
          lastActive: '5 mins ago'
        },
        {
          id: 'user-003',
          displayName: 'GhostProtocol',
          email: 'ghost@hackarena.io',
          xp: 1650,
          level: 4,
          completedLabs: ['sql-injection', 'broken-auth'],
          badges: ['SQL Master', 'Auth Breaker'],
          avatar: '⚡',
          createdAt: '2026-07-30T09:12:00.000Z',
          lastActive: '12 mins ago'
        },
        {
          id: 'user-004',
          displayName: 'DemoHacker',
          email: 'demo.hacker@hackarena.io',
          xp: 250,
          level: 1,
          completedLabs: ['sql-injection'],
          badges: ['SQL Master', 'Cyber Novice'],
          avatar: '👾',
          createdAt: new Date().toISOString(),
          lastActive: 'Active Session'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const totalXP = users.reduce((sum, u) => sum + (u.xp || 0), 0);
  const totalCompletedLabs = users.reduce((sum, u) => sum + (u.completedLabs?.length || 0), 0);
  const totalBadges = users.reduce((sum, u) => sum + (u.badges?.length || 0), 0);

  const filteredUsers = users.filter(u =>
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Platform Telemetry Logs
  const flagTelemetryLogs = [
    { user: 'DemoHacker', email: 'demo.hacker@hackarena.io', lab: 'SQL Injection', flag: 'FLAG{sql_master}', xp: '+250 XP', time: 'Just now', status: 'SUCCESS' },
    { user: 'GhostProtocol', email: 'ghost@hackarena.io', lab: 'Broken Authentication', flag: 'FLAG{auth_breaker}', xp: '+500 XP', time: '12 mins ago', status: 'SUCCESS' },
    { user: 'NeonSpectre', email: 'spectre@hackarena.io', lab: 'XSS Injection', flag: 'FLAG{xss_hunter}', xp: '+250 XP', time: '1 hour ago', status: 'SUCCESS' },
    { user: 'CyberViper_0x', email: 'viper@hackarena.io', lab: 'Broken Authentication', flag: 'FLAG{auth_breaker}', xp: '+500 XP', time: '2 hours ago', status: 'SUCCESS' },
    { user: 'Anonymous_User', email: 'guest@hackarena.io', lab: 'SQL Injection', flag: 'admin_pass_123', xp: '0 XP', time: '3 hours ago', status: 'FAILED' },
  ];

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <h1 className="text-2xl font-extrabold text-white">
              Platform Owner Command Center
            </h1>
            <span className="text-[10px] font-mono font-bold bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-500/40">
              OWNER PRIVILEGES
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time user analytics, lab completion telemetry, flag submission audit logs, and security telemetry.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:bg-slate-800 text-xs font-mono"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Telemetry
        </button>
      </div>

      {/* Owner Overview Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard glowColor="cyan">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Registered Users</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-2">{users.length} Users</div>
          <p className="text-[11px] text-emerald-400 mt-1">100% Active Operatives</p>
        </GlassCard>

        <GlassCard glowColor="green">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Completed Labs</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">{totalCompletedLabs} Labs</div>
          <p className="text-[11px] text-slate-400 mt-1">Breached & Verified</p>
        </GlassCard>

        <GlassCard glowColor="purple">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Platform XP</span>
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono mt-2">{totalXP} XP</div>
          <p className="text-[11px] text-slate-400 mt-1">Generated by Hackers</p>
        </GlassCard>

        <GlassCard glowColor="amber">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Badges Unlocked</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-2">{totalBadges} Badges</div>
          <p className="text-[11px] text-slate-400 mt-1">Earned across modules</p>
        </GlassCard>

      </div>

      {/* Main Content: Users Registry Table */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 font-mono">
            <Database className="w-5 h-5 text-cyan-400" /> All User Work & Registration Records
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by handle or email..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <GlassCard className="p-0 overflow-hidden border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">User Handle / Email</th>
                  <th className="py-3.5 px-6">Level & XP</th>
                  <th className="py-3.5 px-6">Completed Labs Progress</th>
                  <th className="py-3.5 px-6">Badges Earned</th>
                  <th className="py-3.5 px-6">Registered Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs font-sans">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/60 transition-colors">
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{user.avatar || '👾'}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {user.displayName}
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded">
                              {user.lastActive}
                            </span>
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono">
                      <div className="font-bold text-cyan-400 text-sm">LVL {user.level}</div>
                      <span className="text-slate-400 text-xs">{user.xp} Total XP</span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
                          <span>{user.completedLabs?.length || 0} / 3 Modules Solved</span>
                        </div>
                        <div className="flex gap-1.5">
                          {['sql-injection', 'xss', 'broken-auth'].map((labId) => {
                            const done = user.completedLabs?.includes(labId);
                            return (
                              <span
                                key={labId}
                                title={labId}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                  done
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                                    : 'bg-slate-900 text-slate-600 border-slate-800'
                                }`}
                              >
                                {labId === 'sql-injection' ? 'SQLi' : labId === 'xss' ? 'XSS' : 'AUTH'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {user.badges?.map((b, i) => (
                          <span key={i} className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-slate-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-mono flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect User
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

      </div>

      {/* Real-time Flag Submission Audit Logs */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2 font-mono">
          <Terminal className="w-5 h-5 text-amber-400" /> Platform Flag Submission Audit Logs
        </h2>

        <GlassCard className="p-0 overflow-hidden border-slate-800">
          <div className="divide-y divide-slate-800/80 font-mono text-xs">
            {flagTelemetryLogs.map((log, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                  }`}>
                    {log.status}
                  </span>
                  <span className="text-white font-bold">{log.user}</span>
                  <span className="text-slate-500">({log.email})</span>
                  <span className="text-cyan-400 font-semibold">{log.lab}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {log.flag}
                  </span>
                  <span className="text-emerald-400 font-bold">{log.xp}</span>
                  <span className="text-slate-500 text-[10px]">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* User Detail Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel-glow p-6 rounded-2xl border border-cyan-500/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedUser.avatar}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedUser.displayName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">TOTAL XP</span>
                  <span className="text-cyan-400 font-bold text-lg">{selectedUser.xp} XP</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">HACKER LEVEL</span>
                  <span className="text-emerald-400 font-bold text-lg">LEVEL {selectedUser.level}</span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] block">COMPLETED LABS ({selectedUser.completedLabs.length})</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedUser.completedLabs.map((l, i) => (
                    <span key={i} className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      ✓ {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] block">EARNED BADGES ({selectedUser.badges.length})</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedUser.badges.map((b, i) => (
                    <span key={i} className="bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                      🏆 {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Close Telemetry View
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
