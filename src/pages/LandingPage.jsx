import React from 'react';
import { Shield, Terminal, Zap, Lock, Award, ArrowRight, Play, CheckCircle, Cpu, Users, Star, Code2 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const LandingPage = ({ onGetStarted, onExploreLabs }) => {
  const features = [
    {
      icon: Terminal,
      title: 'Interactive Simulated Labs',
      description: 'Breach vulnerabilities in safe, hands-on environments covering SQL Injection, XSS, and Broken Auth.',
      color: 'cyan'
    },
    {
      icon: Zap,
      title: 'Gemini AI Cybersecurity Mentor',
      description: 'Get real-time non-spoiling hints, vulnerability breakdowns, and secure coding remediation advice from CyberSentinel AI.',
      color: 'green'
    },
    {
      icon: Award,
      title: 'Gamified Hacker Progression',
      description: 'Earn XP for every solved challenge, level up your rank, collect cyber badges, and climb the global leaderboard.',
      color: 'purple'
    },
    {
      icon: Lock,
      title: 'Verifiable Certificates',
      description: 'Complete all foundational cybersecurity modules and generate downloadable certificates of achievement.',
      color: 'amber'
    }
  ];

  const testimonials = [
    {
      quote: "HackArena's interactive labs made SQL injection crystal clear. The AI mentor guided me without spoiling the flag!",
      name: "Alex Vance",
      role: "Security Analyst Intern",
      avatar: "👨‍💻",
      rating: 5
    },
    {
      quote: "The cyberpunk theme and gamified level progression kept me hooked. Best platform for starting ethical hacking.",
      name: "Sophia Chen",
      role: "CS Student @ MIT",
      avatar: "👩‍💻",
      rating: 5
    },
    {
      quote: "The Broken Auth lab gave our dev team real perspective on why client-side JWT claims can never be trusted blindly.",
      name: "Marcus Thorne",
      role: "DevSecOps Lead",
      avatar: "🛡️",
      rating: 5
    }
  ];

  return (
    <div className="space-y-24 py-8">
      
      {/* Hero Section */}
      <section className="relative text-center max-w-5xl mx-auto px-4 pt-12 pb-16">
        
        {/* Glow backdrop decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cyberpunk pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-400 text-xs font-mono mb-8 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>AI-POWERED CYBERSECURITY ARENA</span>
        </div>

        {/* Hero Tagline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Learn. <span className="text-neon-cyan">Hack.</span> <span className="text-neon-green">Defend.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Master real-world web exploitation vulnerabilities, solve interactive simulated cyber challenges, and level up with your personal Gemini AI mentor.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-base shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExploreLabs}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl glass-panel hover:bg-slate-800/80 text-cyan-400 font-bold text-base border border-slate-700 hover:border-cyan-500/50 transition-all duration-300"
          >
            <Play className="w-5 h-5 text-cyan-400" /> Explore Interactive Labs
          </button>
        </div>

        {/* Live Cyber Stats Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-panel rounded-2xl border border-slate-800">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">3+</span>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Simulated Labs</p>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">1,000+</span>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Flags Submitted</p>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">100%</span>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Gemini AI Hints</p>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">Instant</span>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Certificate Generation</p>
          </div>
        </div>

      </section>

      {/* Cyber Illustration Teaser / Sandbox Preview */}
      <section className="max-w-6xl mx-auto px-4">
        <GlassCard className="p-8 border-cyan-500/40 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950 px-3 py-1 rounded border border-cyan-500/30">
                CYBER TERMINAL SANDBOX
              </span>
              <h2 className="text-3xl font-bold text-white">
                Simulated Exploitation Without Real System Risk
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                HackArena isolates web application security vulnerabilities inside custom simulated sandboxes. Learn raw SQL concatenation, XSS payload execution, and JWT session tampering in a zero-risk browser environment.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Interactive payload console & live query inspector
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Real-time flag validation system (FLAG{`{...}`})
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> AI CyberSentinel debrief explaining vulnerability fixes
                </li>
              </ul>
            </div>

            {/* Terminal Window Mockup */}
            <div className="w-full md:w-[480px] bg-slate-950 rounded-xl border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden font-mono text-xs">
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-slate-400 text-[10px]">hackarena-terminal -- bash</span>
              </div>
              <div className="p-4 space-y-2 text-slate-300">
                <p className="text-cyan-400">$ hackarena-cli start-lab --id sql-injection</p>
                <p className="text-slate-400">[INFO] Deploying simulated database target...</p>
                <p className="text-amber-400">[WARN] Vulnerable endpoint: /api/login</p>
                <p className="text-slate-300">&gt; Payload: admin' OR '1'='1 --</p>
                <p className="text-emerald-400 font-bold">[SUCCESS] SQL query bypassed authentication!</p>
                <p className="text-cyan-300">[FLAG REVEALED] FLAG{`{sql_master}`}</p>
                <p className="text-purple-400 animate-pulse">&gt; +250 XP Awarded to Hacker Profile</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">
            Built for Future Ethical Hackers
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Everything you need to master cybersecurity fundamentals, from beginner web exploits to AI-assisted defense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={idx} glowColor={feat.color}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">
                      {feat.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">
            What Cyber Defenders Say
          </h2>
          <p className="text-slate-400 text-sm">
            Feedback from cybersecurity students, security analysts, and ethical hacking enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <GlassCard key={idx} hoverGlow={false} className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-800 mt-6">
                <span className="text-2xl">{item.avatar}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-cyan-400">{item.role}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel-glow rounded-3xl p-10 text-center space-y-6 border border-cyan-500/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          {/* ================= TEAM SECTION ================= */}
<section className="py-20 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white mb-3">
        Meet Our Team
      </h2>

      <p className="text-cyan-400 text-xl font-semibold">
        Team Tech Titans
      </p>

      <p className="text-slate-400 mt-3">
        Passionate developers building innovative cybersecurity solutions.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        "Divy Rajput",
        "Rudra Dabhi",
        "Aksh Patel",
        "Manthan Dhudshia",
      ].map((member) => (
        <GlassCard
          key={member}
          hoverGlow
          className="p-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-5">
            <Code2 className="w-10 h-10 text-cyan-400" />
          </div>

          <h3 className="text-xl font-bold text-white">
            {member}
          </h3>

          <p className="text-cyan-400 mt-2">
    
          </p>
        </GlassCard>
      ))}
    </div>
  </div>
</section>
            Ready to Enter the Arena?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join thousands of cybersecurity enthusiasts, solve vulnerability labs, earn badges, and get your certified badge today.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-extrabold text-base shadow-[0_0_30px_rgba(0,255,102,0.4)] transition-all"
          >
            Launch HackArena <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

    </div>
  );
};
