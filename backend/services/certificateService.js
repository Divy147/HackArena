/**
 * Certificate generation service for HackArena completion
 */
const PDFDocument = require('pdfkit');
const FirebaseService = require('./firebaseService');
const logger = require('../utils/logger');

const REQUIRED_LAB_IDS = ['sql-injection', 'xss', 'broken-authentication'];

class CertificateService {
  /**
   * Evaluate certificate eligibility for a user
   * @param {Object} user 
   */
  static checkEligibility(user) {
    const completedSet = new Set(user.completedLabs || []);
    const missingLabs = REQUIRED_LAB_IDS.filter(id => !completedSet.has(id));
    const isEligible = missingLabs.length === 0;

    return {
      isEligible,
      completedCount: REQUIRED_LAB_IDS.length - missingLabs.length,
      totalRequired: REQUIRED_LAB_IDS.length,
      missingLabs
    };
  }

  /**
   * Get Certificate payload data
   * @param {Object} user 
   */
  static getCertificateData(user) {
    const eligibility = CertificateService.checkEligibility(user);
    if (!eligibility.isEligible) {
      return {
        eligible: false,
        message: `You must complete all ${eligibility.totalRequired} beginner labs to unlock your certificate. Remaining: ${eligibility.missingLabs.join(', ')}`,
        eligibility
      };
    }

    const verificationCode = `HA-CERT-${user.uid.substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    return {
      eligible: true,
      certificateId: verificationCode,
      title: "Certificate of Cybersecurity Mastery",
      recipientName: user.name || user.email.split('@')[0],
      email: user.email,
      courseName: "HackArena Beginner CTF & Vulnerability Exploitation Program",
      labsCompleted: ["SQL Injection", "Cross-Site Scripting (XSS)", "Broken Authentication"],
      totalXp: user.xp || 350,
      levelAchieved: user.level || 4,
      issuedAt: new Date().toISOString(),
      downloadUrl: `/api/certificate?download=true`
    };
  }

  /**
   * Build PDF stream for downloadable certificate using PDFKit
   * @param {Object} user 
   * @param {Object} res Express response stream
   */
  static generateCertificatePdf(user, res) {
    const certData = CertificateService.getCertificateData(user);
    if (!certData.eligible) {
      return res.status(400).json({ success: false, message: certData.message });
    }

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 40
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=HackArena_Certificate_${user.name ? user.name.replace(/\s+/g, '_') : 'Student'}.pdf`);

    doc.pipe(res);

    // Decorative Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(4)
       .stroke('#1e293b');

    doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56)
       .lineWidth(1)
       .stroke('#3b82f6');

    // Header Badge
    doc.fontSize(26)
       .fillColor('#3b82f6')
       .text('HACKARENA', 0, 70, { align: 'center' });

    doc.fontSize(12)
       .fillColor('#64748b')
       .text('CYBERSECURITY ACADEMY & CTF PLATFORM', 0, 105, { align: 'center' });

    // Certificate Title
    doc.fontSize(32)
       .fillColor('#0f172a')
       .text('CERTIFICATE OF MASTERY', 0, 150, { align: 'center' });

    doc.fontSize(14)
       .fillColor('#475569')
       .text('This is proudly presented to', 0, 200, { align: 'center' });

    // Recipient Name
    doc.fontSize(28)
       .fillColor('#2563eb')
       .text(certData.recipientName.toUpperCase(), 0, 230, { align: 'center' });

    // Description
    doc.fontSize(13)
       .fillColor('#334155')
       .text('For successfully completing all hands-on cybersecurity labs:', 0, 280, { align: 'center' });

    doc.fontSize(12)
       .fillColor('#0f172a')
       .text('• SQL Injection   • Cross-Site Scripting (XSS)   • Broken Authentication', 0, 310, { align: 'center' });

    // Metadata Footer
    doc.fontSize(11)
       .fillColor('#64748b')
       .text(`Total XP Earned: ${certData.totalXp} XP   |   Level Achieved: ${certData.levelAchieved}`, 0, 360, { align: 'center' });

    doc.fontSize(10)
       .fillColor('#94a3b8')
       .text(`Certificate Verification ID: ${certData.certificateId}`, 0, 420, { align: 'center' });

    doc.fontSize(9)
       .fillColor('#94a3b8')
       .text(`Issued Date: ${new Date().toLocaleDateString()} | Issued by Google Gemini AI & HackArena Platform`, 0, 440, { align: 'center' });

    doc.end();
  }
}

module.exports = CertificateService;
