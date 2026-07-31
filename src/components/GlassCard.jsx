import React from 'react';

export const GlassCard = ({ children, className = '', hoverGlow = true, glowColor = 'cyan' }) => {
  const glowStyles = {
    cyan: 'hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    green: 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
    purple: 'hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]',
    amber: 'hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
  };

  return (
    <div
      className={`glass-panel rounded-xl p-6 transition-all duration-300 relative overflow-hidden ${
        hoverGlow ? glowStyles[glowColor] || glowStyles.cyan : ''
      } ${className}`}
    >
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      {children}
    </div>
  );
};
