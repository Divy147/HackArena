import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, ShieldCheck, Zap, X, ArrowRight } from 'lucide-react';

export const BadgeModal = ({ isOpen, onClose, labInfo, onGoToDashboard, onAskAI }) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger canvas confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#00ff66', '#a855f7', '#3b82f6']
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-2xl p-6 sm:p-8 text-center border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glowing Badge Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 p-1 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,102,0.5)] mb-4 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-4xl">
            🏆
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-mono mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" /> SYSTEM BREACH SUCCESSFUL
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">
          Lab Completed!
        </h3>
        <p className="text-sm text-cyan-400 font-mono mb-4">
          + {labInfo?.xpAwarded || 250} XP Awarded
        </p>

        {/* Unlocked Badge Card */}
        {labInfo?.badgeUnlocked && (
          <div className="bg-slate-900/80 border border-cyan-500/40 rounded-xl p-4 mb-6 flex items-center gap-4 text-left">
            <div className="text-3xl p-3 bg-cyan-950/60 rounded-lg border border-cyan-500/30">
              🛡️
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                UNLOCKED BADGE
              </span>
              <h4 className="text-lg font-bold text-white">
                {labInfo.badgeUnlocked}
              </h4>
              <p className="text-xs text-slate-400">
                Added to your hacker profile & global leaderboard rank.
              </p>
            </div>
          </div>
        )}

        {/* Post-challenge vulnerability debrief */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-left text-xs text-slate-300 space-y-2 mb-6">
          <span className="font-mono text-cyan-400 font-bold block flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Vulnerability Remediation Debrief:
          </span>
          <p className="leading-relaxed">
            {labInfo?.explanation || "Remember to sanitize all input parameters and enforce parameterized queries to prevent unauthenticated database queries."}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onAskAI}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 text-cyan-400 text-sm font-semibold transition-all"
          >
            Ask AI Mentor <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onGoToDashboard}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,255,102,0.3)] transition-all"
          >
            Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
