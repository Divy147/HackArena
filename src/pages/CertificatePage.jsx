import React, { useRef, useEffect, useState } from 'react';
import { Download, ShieldCheck, ArrowLeft, Printer, Award, CheckCircle2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { api } from '../services/api';

export const CertificatePage = ({ onBack }) => {
  const { userProfile } = useAuth();
  const canvasRef = useRef(null);
  const [certBackendData, setCertBackendData] = useState(null);

  const userName = userProfile?.displayName || userProfile?.name || 'CyberHacker';
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const certId = certBackendData?.certificateId || `HA-CERT-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    // Fetch certificate metadata from backend API
    api.getCertificate()
      .then(res => {
        if (res.success && res.data) {
          setCertBackendData(res.data);
        }
      })
      .catch(err => console.warn('Certificate backend notice:', err.message));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 800;

    canvas.width = width;
    canvas.height = height;

    // Background Gradient (Dark Cyberpunk Theme)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#030712');
    bgGradient.addColorStop(0.5, '#0b132b');
    bgGradient.addColorStop(1, '#030712');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Border Neon Accent Framing
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, width - 84, height - 84);

    // Corner Hexagon Accents
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(30, 30, 30, 6);
    ctx.fillRect(30, 30, 6, 30);
    ctx.fillRect(width - 60, 30, 30, 6);
    ctx.fillRect(width - 36, 30, 6, 30);

    // Header Title
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HACKARENA CYBERSECURITY DEFENSE ACADEMY', width / 2, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'extrabold 48px sans-serif';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', width / 2, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('THIS IS OFFICIALLY PRESENTED TO', width / 2, 240);

    // Recipient Name
    ctx.fillStyle = '#00ff66';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText(userName.toUpperCase(), width / 2, 320);

    // Divider Line
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 250, 350);
    ctx.lineTo(width / 2 + 250, 350);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px sans-serif';
    ctx.fillText('For successfully demonstrating proficiency in hands-on interactive vulnerability exploitation,', width / 2, 410);
    ctx.fillText('SQL Injection bypass techniques, Cross-Site Scripting (XSS) remediation, and Broken Auth defense.', width / 2, 440);

    // Badges Earned Text
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('VERIFIED MODULES: [ SQL INJECTION ] • [ STORED XSS ] • [ BROKEN AUTH ]', width / 2, 500);

    // Official Stamp / Seal (Bottom Left)
    ctx.save();
    ctx.beginPath();
    ctx.arc(200, 640, 50, 0, Math.PI * 2);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.fill();

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('VERIFIED', 200, 635);
    ctx.fillText('ACADEMY SEAL', 200, 652);
    ctx.restore();

    // Signatures & Cert Info
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ISSUE DATE: ${issueDate}`, 400, 640);
    ctx.fillText(`CERTIFICATE ID: ${certId}`, 400, 665);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#00ff66';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('CyberSentinel AI', 1000, 640);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText('Director of Automated Cyber Telemetry', 1000, 665);

  }, [userName, certId]);

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = `HackArena_Certificate_${userName.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const handleDownloadPDF = () => {
    const downloadUrl = api.getCertificateDownloadUrl();
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 font-bold text-xs font-mono transition-all"
          >
            <FileText className="w-4 h-4" /> Download Official PDF
          </button>
          
          <button
            onClick={handleDownloadPNG}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,255,102,0.3)] transition-all"
          >
            <Download className="w-4 h-4" /> Download Certificate (PNG)
          </button>
        </div>
      </div>

      {/* Canvas Display Card */}
      <GlassCard className="p-4 sm:p-6 border-cyan-500/50 flex flex-col items-center">
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <canvas ref={canvasRef} className="max-w-full h-auto mx-auto block" />
        </div>
      </GlassCard>

    </div>
  );
};
