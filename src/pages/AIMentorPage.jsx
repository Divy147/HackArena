import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Terminal, Shield, RefreshCcw, HelpCircle, Code, Lock } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { api } from '../services/api';

export const AIMentorPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Welcome to **CyberSentinel AI Command Center**!\n\nI am your dedicated Google Gemini-powered cybersecurity mentor. I can explain complex vulnerabilities, discuss OWASP Top 10 exploits, critique security architecture, and guide your lab progress.\n\nWhat security concept or challenge would you like to explore today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.chatAI(promptText);
      const replyText = res.data?.reply || "I'm analyzing security telemetry, try asking again!";

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "🤖 **CyberSentinel**: " + (err.message || "SQL Injection occurs when raw user inputs are concatenated directly into SQL queries. To prevent this, always use Prepared Statements (Parameterized Queries)."),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    { title: "Explain SQL Injection", desc: "How raw SQL query strings are manipulated", query: "Explain how SQL Injection works in detail and how developers prevent it." },
    { title: "Cross-Site Scripting (XSS)", desc: "Differences between Stored, Reflected & DOM XSS", query: "What are the key differences between Stored XSS and Reflected XSS?" },
    { title: "Broken Authentication", desc: "Common JWT session vulnerabilities & fixes", query: "Why are client-side JWT role claims dangerous when signature verification is disabled?" },
    { title: "OWASP Top 10 Summary", desc: "Overview of critical web application risks", query: "Can you provide a summary of the most critical vulnerabilities in the OWASP Top 10?" }
  ];

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" /> AI CyberSentinel Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Powered by Google Gemini API • Ethical Cyber Mentor & Defensive Advisor
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-500/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>GEMINI MODEL ACTIVE</span>
        </div>
      </div>

      {/* Main Layout: Prompts Bar & Full Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Pre-configured prompt cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
            Quick Knowledge Triggers
          </h3>

          <div className="space-y-3">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sp.query)}
                className="w-full text-left p-3.5 rounded-xl glass-panel hover:border-cyan-500/50 hover:bg-slate-900 transition-all group"
              >
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {sp.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">{sp.desc}</p>
              </button>
            ))}
          </div>

          <GlassCard className="p-4 border-slate-800 text-xs space-y-2">
            <span className="font-mono text-amber-400 font-bold block flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> CyberSentinel Guidelines:
            </span>
            <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
              <li>Answers technical security questions</li>
              <li>Explains mitigation & secure coding</li>
              <li>Maintains ethical hacking boundaries</li>
              <li>Never reveals direct flag strings</li>
            </ul>
          </GlassCard>
        </div>

        {/* Right Side: Chat Feed (3 cols) */}
        <div className="lg:col-span-3">
          <GlassCard className="border-cyan-500/50 h-[620px] flex flex-col justify-between p-0 overflow-hidden">
            
            {/* Chat Messages Window */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-4 rounded-2xl leading-relaxed text-xs ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <span className="block text-[9px] text-slate-400 mt-2 text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono py-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>CyberSentinel AI is generating security insights...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask CyberSentinel about vulnerabilities, code remediation, or security concepts..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500/70 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !input.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <span>Send</span> <Send className="w-4 h-4" />
              </button>
            </div>

          </GlassCard>
        </div>

      </div>

    </div>
  );
};
