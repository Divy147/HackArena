import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Sparkles, MessageSquare, Terminal, ChevronUp } from 'lucide-react';

export const AIMentorWidget = ({ activeLab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Greetings! I am **CyberSentinel AI**, your cybersecurity mentor. Ask me about vulnerability concepts, code remediation, or lab hints! (I'll never spoil direct flags 🤫)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
      const response = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          labName: activeLab?.title,
          completed: activeLab?.completed
        })
      });

      const data = await response.json();
      const aiReply = data.reply || "I'm analyzing telemetry, but couldn't formulate a response right now.";

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('AI Mentor API error, using intelligent fallback:', err);
      // Fallback AI reply
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `🤖 **CyberSentinel**: ${
            activeLab?.id === 'sql-injection'
              ? "For SQL Injection, remember how quotes parameterize strings. Try appending `' OR '1'='1` to force query boolean evaluation to TRUE."
              : activeLab?.id === 'xss'
              ? "For XSS, check if your input is rendered as unescaped HTML. Try injecting `<script>...</script>` or `<img src=x onerror=...>`."
              : "For Broken Authentication, inspect the active session claims in the token debugger and try elevating the `role` payload from `user` to `admin`."
          }`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Give me a hint for SQL Injection",
    "How to prevent XSS attacks?",
    "Explain Broken Authentication"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-slate-900 border border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:border-cyan-400 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-mono text-xs text-cyan-300 font-semibold tracking-wide">
            AI CyberSentinel
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      ) : (
        <div className="w-[360px] sm:w-[420px] h-[520px] glass-panel-glow rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-cyan-500/50 overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  CyberSentinel AI <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 rounded">GEMINI</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {activeLab ? `Active Context: ${activeLab.title}` : 'Cybersecurity Mentor'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-900 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div
                  className={`max-w-[82%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600/90 text-white rounded-br-none shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <span className="block text-[9px] text-slate-400 mt-1 text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono py-2">
                <Bot className="w-4 h-4 animate-spin" />
                <span>CyberSentinel is processing query telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask cybersecurity question or hint..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
