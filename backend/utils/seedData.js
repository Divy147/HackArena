/**
 * Seed configuration for initial CTF Labs and Badges
 */

const SEED_LABS = [
  {
    id: "sql-injection",
    title: "SQL Injection",
    category: "Web Security",
    difficulty: "Beginner",
    xp: 100,
    correctFlag: "FLAG{sql_master}",
    badgeId: "sql-beginner",
    badgeName: "SQL Beginner",
    description: "Learn how malicious SQL statements are injected into entry fields for execution (e.g. bypass authentication or extract sensitive data).",
    instructions: "Exploit the login form query logic by injecting `' OR '1'='1` or similar payloads to bypass the check and extract the hidden administrator flag.",
    vulnerabilityDetails: {
      name: "SQL Injection (SQLi)",
      cwe: "CWE-89",
      impact: "High - Unauthorized database access, data tampering, or authentication bypass",
      remediation: "Use parameterized queries / prepared statements (e.g. PDO, Knex, ORMs) instead of concatenating raw SQL strings."
    }
  },
  {
    id: "xss",
    title: "Cross-Site Scripting (XSS)",
    category: "Web Security",
    difficulty: "Beginner",
    xp: 100,
    correctFlag: "FLAG{xss_hunter}",
    badgeId: "xss-hunter",
    badgeName: "XSS Hunter",
    description: "Discover how unescaped user input rendered in the browser can execute arbitrary JavaScript and hijack user sessions.",
    instructions: "Inject a script payload into the search or comment input field to force the browser to trigger a script alert or log the flag.",
    vulnerabilityDetails: {
      name: "Reflected & Stored XSS",
      cwe: "CWE-79",
      impact: "Medium/High - Session hijacking, cookie theft, DOM manipulation",
      remediation: "Encode all dynamic untrusted input before rendering in DOM, enforce Content Security Policy (CSP), and use HTTP-only cookies."
    }
  },
  {
    id: "broken-authentication",
    title: "Broken Authentication",
    category: "Identity & Access",
    difficulty: "Intermediate",
    xp: 150,
    correctFlag: "FLAG{auth_breaker}",
    badgeId: "auth-expert",
    badgeName: "Authentication Expert",
    description: "Explore flaws in session management, weak password policies, and predictable token generation.",
    instructions: "Analyze weak session token generation or bypass MFA logic to gain access to the admin account and capture the flag.",
    vulnerabilityDetails: {
      name: "Broken Authentication & Session Management",
      cwe: "CWE-287",
      impact: "Critical - Account takeover, unauthorized admin privilege escalation",
      remediation: "Implement multi-factor authentication, strong password hashing (argon2/bcrypt), robust JWT validation, and secure session rotation."
    }
  }
];

const SEED_BADGES = [
  {
    id: "cyber-rookie",
    name: "Cyber Rookie",
    description: "Awarded for completing your very first cybersecurity lab on HackArena.",
    icon: "🛡️",
    category: "Achievement"
  },
  {
    id: "sql-beginner",
    name: "SQL Beginner",
    description: "Awarded for successfully exploiting and understanding SQL Injection.",
    icon: "💉",
    category: "Lab Mastery"
  },
  {
    id: "xss-hunter",
    name: "XSS Hunter",
    description: "Awarded for identifying and executing Cross-Site Scripting (XSS).",
    icon: "🏹",
    category: "Lab Mastery"
  },
  {
    id: "auth-expert",
    name: "Authentication Expert",
    description: "Awarded for mastering Broken Authentication and session security.",
    icon: "🔑",
    category: "Lab Mastery"
  }
];

module.exports = {
  SEED_LABS,
  SEED_BADGES
};
