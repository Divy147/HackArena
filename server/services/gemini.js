import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Google GenAI client if API key is provided
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
let aiClient = null;

if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize Gemini AI client:', err.message);
  }
}

/**
 * System Instruction for HackArena AI Mentor (CyberSentinel)
 */
const SYSTEM_INSTRUCTION = `
You are "CyberSentinel", an elite AI Cybersecurity Mentor for the HackArena learning platform.
Your goals:
1. Help users understand cybersecurity concepts, ethical hacking, vulnerability mechanics, and defensive measures.
2. When users ask for hints on active labs (SQL Injection, XSS, Broken Auth), provide high-level conceptual guidance and thought-provoking questions.
3. NEVER directly reveal exact flags or solution commands (e.g. NEVER explicitly print "FLAG{...}" or the exact flag string).
4. Maintain a encouraging, professional, cyberpunk mentor persona. Use formatting like bullet points and code blocks when demonstrating safe code snippets.
5. If the user mentions completing a challenge, explain why the vulnerability existed in real-world applications and how developers fix it (remediation & secure coding).
`;

/**
 * Generate AI Mentor response for cybersecurity queries
 */
export async function getAIMentorResponse(userPrompt, context = {}) {
  const { labName, userRole, completed } = context;

  // Fallback responses when API key is not configured
  if (!aiClient) {
    return generateFallbackResponse(userPrompt, labName, completed);
  }

  try {
    const promptContext = labName 
      ? `[Current Active Lab Context: ${labName} | User Status: ${completed ? 'Completed Lab' : 'In Progress'}]\nUser Question: ${userPrompt}`
      : userPrompt;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptContext,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    return response.text || "I'm analyzing the telemetry data, but couldn't formulate a response. Try asking again!";
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return generateFallbackResponse(userPrompt, labName, completed);
  }
}

/**
 * Fallback AI response generator for smooth offline / demo experience
 */
function generateFallbackResponse(prompt, labName, completed) {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('sql') || labName === 'SQL Injection') {
    if (lower.includes('hint') || lower.includes('cant solve') || lower.includes("can't solve") || lower.includes('help')) {
      return "💡 **SQL Injection Hint**: Focus on how SQL input queries are concatenated. In standard SQL, single quotes (`'`) close a string literal. What happens if you introduce a condition that is always true, such as `' OR '1'='1`?";
    }
    return "🛡️ **SQL Injection Overview**: SQLi occurs when untrusted user input is directly concatenated into database queries. To prevent SQLi, always use **Parameterized Queries (Prepared Statements)** or ORM abstractions.";
  }

  if (lower.includes('xss') || labName === 'XSS') {
    if (lower.includes('hint') || lower.includes('cant solve') || lower.includes("can't solve") || lower.includes('help')) {
      return "💡 **XSS Hint**: The target comment field renders HTML directly without escaping. Try injecting an HTML tag with an inline JavaScript handler like `<img src=x onerror=...>` or `<script>...`.";
    }
    return "🛡️ **XSS Overview**: Cross-Site Scripting allows attackers to inject malicious client-side scripts. Mitigation involves output encoding, Context-Aware HTML Escaping, and enforcing a strong Content Security Policy (CSP).";
  }

  if (lower.includes('auth') || lower.includes('token') || labName === 'Broken Authentication') {
    if (lower.includes('hint') || lower.includes('cant solve') || lower.includes("can't solve") || lower.includes('help')) {
      return "💡 **Broken Auth Hint**: Inspect the active session payload in the simulated token console. Look for parameter flags like `role: \"user\"` or signature verification toggles. What happens if you modify the role claim to `\"admin\"`?";
    }
    return "🛡️ **Broken Authentication Overview**: Flaws in session management enable attackers to hijack user identities or escalate privileges. Fixes include cryptographic JWT signature checks, secure HTTP-only cookies, and multi-factor authentication.";
  }

  return `🤖 **CyberSentinel AI**: Great question! As a cybersecurity enthusiast on HackArena, remember to test input fields carefully, analyze raw HTTP requests, and enforce the principle of least privilege. (Note: To enable full dynamic Gemini AI responses, configure your \`GEMINI_API_KEY\` in \`server/.env\`).`;
}
