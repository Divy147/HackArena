import React, { useState } from 'react';
import { 
  Shield, Terminal, Key, Cpu, Zap, HelpCircle, CheckCircle2, 
  AlertCircle, Sparkles, Send, Eye, RefreshCw, Lock, Unlock, ArrowRight 
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { LABS_DATA } from '../data/labsData';
import { useAuth } from '../context/AuthContext';
import { BadgeModal } from '../components/BadgeModal';
import { api } from '../services/api';

export const LabsPage = ({ initialLab, onNavigateToMentor, onNavigateToDashboard }) => {
  const { userProfile, refreshProfile } = useAuth();
  const [selectedLab, setSelectedLab] = useState(initialLab || LABS_DATA[0]);
  const [userFlagInput, setUserFlagInput] = useState('');
  const [flagFeedback, setFlagFeedback] = useState(null);
  const [showAIHintModal, setShowAIHintModal] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  
  // Celebration modal state
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeModalData, setBadgeModalData] = useState(null);

  // --- Interactive Lab 1: SQL Injection State ---
  const [sqliUsername, setSqliUsername] = useState("admin' OR '1'='1 --");
  const [sqliPassword, setSqliPassword] = useState("anything");
  const [sqliQueryLog, setSqliQueryLog] = useState("");
  const [sqliResult, setSqliResult] = useState(null);

  // --- Interactive Lab 2: XSS State ---
  const [xssInput, setXssInput] = useState("<script>alert('XSS Pwned')</script>");
  const [xssComments, setXssComments] = useState([
    { author: 'System Admin', text: 'Welcome to the public security board.', isXSS: false }
  ]);
  const [xssTriggered, setXssTriggered] = useState(false);

  // --- Interactive Lab 3: Broken Auth State ---
  const [jwtToken, setJwtToken] = useState({
    header: { alg: "HS256", typ: "JWT" },
    payload: { sub: "109283", name: "Guest User", role: "user", exp: 1785234500 },
    signature: "s3cr3t_s1gn4tur3_h4sh"
  });
  const [authRoleInput, setAuthRoleInput] = useState("user");
  const [authBypassed, setAuthBypassed] = useState(false);

  // --- Lab Handlers ---

  const handleRunSQLi = (e) => {
    e.preventDefault();
    const constructedQuery = `SELECT * FROM users WHERE username = '${sqliUsername}' AND password = '${sqliPassword}';`;
    setSqliQueryLog(constructedQuery);

    const lowerUser = sqliUsername.toLowerCase();
    if (lowerUser.includes("' or '1'='1") || lowerUser.includes("' or 1=1") || lowerUser.includes("' or 'a'='a")) {
      setSqliResult({
        success: true,
        message: "SQL Authentication Bypassed! Returned 1 record (Admin User).",
        flag: "FLAG{sql_master}"
      });
      setUserFlagInput("FLAG{sql_master}");
    } else {
      setSqliResult({
        success: false,
        message: "Invalid Credentials. Query evaluated to FALSE (0 rows returned)."
      });
    }
  };

  const handlePostCommentXSS = (e) => {
    e.preventDefault();
    if (!xssInput.trim()) return;

    const containsScript = xssInput.toLowerCase().includes("<script") || 
                           xssInput.toLowerCase().includes("onerror=") || 
                           xssInput.toLowerCase().includes("onload=");

    setXssComments(prev => [...prev, {
      author: 'You',
      text: xssInput,
      isXSS: containsScript
    }]);

    if (containsScript) {
      setXssTriggered(true);
      setUserFlagInput("FLAG{xss_hunter}");
    }
  };

  const handleUpdateJWTRole = () => {
    const isNowAdmin = authRoleInput.trim().toLowerCase() === "admin";
    setJwtToken(prev => ({
      ...prev,
      payload: { ...prev.payload, role: authRoleInput }
    }));

    if (isNowAdmin) {
      setAuthBypassed(true);
      setUserFlagInput("FLAG{auth_breaker}");
    } else {
      setAuthBypassed(false);
    }
  };

  const handleFetchAIHint = async () => {
    setHintLoading(true);
    setShowAIHintModal(true);
    try {
      const res = await api.chatAI(
        `Give me a helpful non-spoiling hint for the ${selectedLab.title} lab challenge.`,
        selectedLab.id
      );
      setCurrentHint(res.data?.reply || selectedLab.hints[0]);
    } catch (e) {
      setCurrentHint(selectedLab.hints[0]);
    } finally {
      setHintLoading(false);
    }
  };

  const handleSubmitFlag = async (e) => {
    e.preventDefault();
    if (!userFlagInput.trim()) return;

    setFlagFeedback(null);

    try {
      const result = await api.submitFlag(selectedLab.id, userFlagInput.trim());

      if (result.success) {
        setFlagFeedback({ type: 'success', message: result.message });
        
        // Refresh full user profile from backend
        await refreshProfile();

        // Show celebration modal with backend AI explanation
        setBadgeModalData({
          xpAwarded: result.data.xpGained,
          badgeUnlocked: result.data.newBadges?.length ? result.data.newBadges[0].name : selectedLab.badge,
          explanation: result.data.aiExplanation?.explanation || selectedLab.explanation
        });
        setShowBadgeModal(true);
      } else {
        setFlagFeedback({ type: 'error', message: result.message });
      }
    } catch (err) {
      setFlagFeedback({ type: 'error', message: err.message || 'Error submitting flag to server.' });
    }
  };

  const isCompleted = userProfile?.completedLabs?.includes(selectedLab.id);

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Labs Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Terminal className="w-6 h-6 text-cyan-400" /> Interactive CTF Challenge Arena
          </h1>
          <p className="text-xs text-slate-400">
            Simulated vulnerability sandboxes. Exploit vector, capture the flag, gain XP & unlock badges.
          </p>
        </div>

        {/* Labs Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {LABS_DATA.map((lab) => {
            const active = selectedLab.id === lab.id;
            const completed = userProfile?.completedLabs?.includes(lab.id);
            return (
              <button
                key={lab.id}
                onClick={() => {
                  setSelectedLab(lab);
                  setFlagFeedback(null);
                  setUserFlagInput('');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                  active 
                    ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{lab.title}</span>
                {completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Layout: Interactive Sandbox (2 cols) + Brief & Flag Submission (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Interactive Sandbox (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <GlassCard className="border-cyan-500/40 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-bold uppercase">{selectedLab.title} SANDBOX</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Target Vulnerability: <span className="text-amber-400">{selectedLab.category}</span>
              </div>
            </div>

            {/* --- Lab 1 Sandbox: SQL Injection --- */}
            {selectedLab.id === 'sql-injection' && (
              <div className="space-y-5 text-xs font-sans">
                <p className="text-slate-300">
                  Target: <strong>Administrator Login Form</strong>. Exploit unsanitized input to bypass password check.
                </p>

                <form onSubmit={handleRunSQLi} className="space-y-4 max-w-md bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] mb-1">Username / Payload:</label>
                    <input
                      type="text"
                      value={sqliUsername}
                      onChange={(e) => setSqliUsername(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] mb-1">Password:</label>
                    <input
                      type="text"
                      value={sqliPassword}
                      onChange={(e) => setSqliPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    <Zap className="w-4 h-4" /> Execute SQL Query
                  </button>
                </form>

                {/* SQL Log & Result Stream */}
                {sqliQueryLog && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Constructed Server Query:</span>
                    <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                      {sqliQueryLog}
                    </pre>
                  </div>
                )}

                {sqliResult && (
                  <div className={`p-4 rounded-xl border font-mono text-xs ${
                    sqliResult.success ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-red-950/60 border-red-500/50 text-red-300'
                  }`}>
                    <p>{sqliResult.message}</p>
                    {sqliResult.flag && (
                      <div className="mt-2 pt-2 border-t border-emerald-500/30 flex items-center justify-between">
                        <span>CAPUTRED FLAG:</span>
                        <code className="bg-slate-950 px-2.5 py-1 rounded text-cyan-400 font-bold select-all">
                          {sqliResult.flag}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- Lab 2 Sandbox: XSS --- */}
            {selectedLab.id === 'xss' && (
              <div className="space-y-5 text-xs font-sans">
                <p className="text-slate-300">
                  Target: <strong>Live Comment Board</strong>. Inject dynamic script payloads to force script execution.
                </p>

                <form onSubmit={handlePostCommentXSS} className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] mb-1">Post Unescaped HTML/Script Payload:</label>
                    <input
                      type="text"
                      value={xssInput}
                      onChange={(e) => setXssInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Comment
                  </button>
                </form>

                {/* Comment Board Render */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Rendered DOM Stream:</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {xssComments.map((c, i) => (
                      <div key={i} className={`p-3 rounded-xl border ${c.isXSS ? 'bg-amber-950/40 border-amber-500/50' : 'bg-slate-900/80 border-slate-800'}`}>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{c.author}:</span>
                        <p className="text-slate-200 mt-1 font-mono text-[11px]">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {xssTriggered && (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-mono text-xs space-y-2">
                    <p>🚨 SCRIPT EXECUTED IN DOM! Cookie / Flag Hijacked.</p>
                    <div className="flex items-center justify-between border-t border-emerald-500/30 pt-2">
                      <span>CAPTURED FLAG:</span>
                      <code className="bg-slate-950 px-2.5 py-1 rounded text-cyan-400 font-bold select-all">
                        FLAG{"{xss_hunter}"}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- Lab 3 Sandbox: Broken Auth --- */}
            {selectedLab.id === 'broken-authentication' && (
              <div className="space-y-5 text-xs font-sans">
                <p className="text-slate-300">
                  Target: <strong>Session Claim Tampering</strong>. Change payload role claim from <code className="text-cyan-400">user</code> to <code className="text-amber-400">admin</code>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
                    <span className="text-slate-500 uppercase block text-[10px]">JWT Payload Claims:</span>
                    <pre className="text-cyan-400">
                      {JSON.stringify(jwtToken.payload, null, 2)}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <label className="block text-slate-400 font-mono text-[11px]">Modify Role Claim:</label>
                    <input
                      type="text"
                      value={authRoleInput}
                      onChange={(e) => setAuthRoleInput(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                    <button
                      onClick={handleUpdateJWTRole}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono"
                    >
                      Update Token Claims
                    </button>
                  </div>
                </div>

                {authBypassed && (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-mono text-xs space-y-2">
                    <p>🔓 ADMIN PRIVILEGES ESCALATED! Privilege check passed.</p>
                    <div className="flex items-center justify-between border-t border-emerald-500/30 pt-2">
                      <span>CAPTURED FLAG:</span>
                      <code className="bg-slate-950 px-2.5 py-1 rounded text-cyan-400 font-bold select-all">
                        FLAG{"{auth_breaker}"}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            )}

          </GlassCard>

          {/* Educational Overview Card */}
          <GlassCard className="border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" /> Challenge Objectives & Guidance
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {selectedLab.description}
            </p>
          </GlassCard>

        </div>

        {/* Right Sidebar: Submit Flag & AI Hints (1 col) */}
        <div className="space-y-6">
          
          {/* Submit Flag Form */}
          <GlassCard className="border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Key className="w-4 h-4 text-emerald-400" /> Submit Flag
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                +{selectedLab.xp} XP
              </span>
            </div>

            <form onSubmit={handleSubmitFlag} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={userFlagInput}
                  onChange={(e) => setUserFlagInput(e.target.value)}
                  placeholder="FLAG{...}"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 font-mono text-xs text-cyan-400 placeholder-slate-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(0,255,102,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Flag</span> <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>

            {flagFeedback && (
              <div className={`p-3 rounded-xl border text-xs font-mono ${
                flagFeedback.type === 'success' 
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                  : 'bg-red-950/60 border-red-500/50 text-red-300'
              }`}>
                {flagFeedback.message}
              </div>
            )}
          </GlassCard>

          {/* AI Mentor Hints Button */}
          <GlassCard className="border-cyan-500/40 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Need Assistance?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask our Google Gemini AI mentor for progressive hints without spoiling the solution.
            </p>

            <button
              onClick={handleFetchAIHint}
              className="w-full py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" /> Request AI Hint
            </button>
          </GlassCard>

        </div>

      </div>

      {/* AI Hint Modal */}
      {showAIHintModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <GlassCard className="max-w-lg w-full border-cyan-500/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4" /> AI Mentor Hint: {selectedLab.title}
              </h3>
              <button
                onClick={() => setShowAIHintModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {hintLoading ? (
              <div className="py-8 text-center text-xs font-mono text-cyan-400 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Consulting Gemini AI Mentor...</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
                {currentHint}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Celebration / Educational Modal */}
      {showBadgeModal && badgeModalData && (
        <BadgeModal
          data={badgeModalData}
          onClose={() => setShowBadgeModal(false)}
          onNavigateToMentor={onNavigateToMentor}
        />
      )}

    </div>
  );
};
