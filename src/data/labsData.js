export const LABS_DATA = [
  {
    id: 'sql-injection',
    title: 'SQL Injection Bypass',
    vulnerability: 'SQL Injection',
    category: 'Web Exploitation',
    difficulty: 'Beginner',
    estimatedTime: '15 mins',
    xp: 250,
    flag: 'FLAG{sql_master}',
    badge: 'SQL Master',
    description: 'Learn how unescaped user inputs allow attackers to inject raw SQL clauses into backend database queries to bypass login authentication without a valid password.',
    objectives: [
      'Analyze the vulnerable login form.',
      'Understand how SQL query concatenation handles quotes.',
      'Craft a payload such as `admin\' OR \'1\'=\'1` to force the query result to evaluate to TRUE.',
      'Retrieve the secret flag from the admin dashboard.'
    ],
    hints: [
      'In SQL, single quotes (\') terminate string parameters.',
      'The logical OR operator returns TRUE if either condition is true. Try: `admin\' OR \'1\'=\'1`',
      'Using double dashes `--` or `#` comments out the rest of the original SQL query.'
    ],
    explanation: 'SQL Injection (SQLi) occurs when untrusted user input is directly concatenated into database query strings. The application should use Parameterized Queries (Prepared Statements) or an Object-Relational Mapper (ORM) to sanitize user parameters.'
  },
  {
    id: 'xss',
    title: 'Stored & Reflected XSS',
    vulnerability: 'Cross-Site Scripting (XSS)',
    category: 'Client-Side Security',
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    xp: 250,
    flag: 'FLAG{xss_hunter}',
    badge: 'XSS Hunter',
    description: 'Discover how failing to sanitize user input rendered on web pages allows malicious scripts to execute within the victim browser context.',
    objectives: [
      'Locate the interactive comment submission input.',
      'Test if HTML tags or script elements are rendered without HTML entity escaping.',
      'Execute a script payload such as `<script>alert("xss")</script>` or `<img src=x onerror=alert(1)>`.',
      'Extract the flag revealed upon script trigger.'
    ],
    hints: [
      'Try typing basic HTML like `<h1>test</h1>` into the input to check for raw HTML rendering.',
      'Try injecting `<script>window.triggerXSS()</script>` or `<img src=x onerror=window.triggerXSS()>`',
      'Inspect the raw DOM response in the vulnerability console preview.'
    ],
    explanation: 'Cross-Site Scripting (XSS) permits attackers to inject client-side scripts. Prevention requires contextual output encoding (e.g. converting `<` to `&lt;`), using modern frontend frameworks that automatically escape strings, and setting a robust Content Security Policy (CSP).'
  },
  {
    id: 'broken-auth',
    title: 'Broken Session & Role Tampering',
    vulnerability: 'Broken Authentication',
    category: 'Identity & Access',
    difficulty: 'Intermediate',
    estimatedTime: '25 mins',
    xp: 500,
    flag: 'FLAG{auth_breaker}',
    badge: 'Auth Breaker',
    description: 'Investigate weak session management where client-side token claims or cookies dictate authorization without server-side validation.',
    objectives: [
      'Inspect the simulated JWT session token payload in the terminal debugger.',
      'Identify the claim parameter controlling access rights (`"role": "user"`).',
      'Tamper with the session claim or forge the authorization header to elevate privileges to `"admin"`.',
      'Access the restricted administrative console and claim the flag.'
    ],
    hints: [
      'Look at the active session object decoded in the terminal panel.',
      'Change the JSON property `"role": "user"` to `"role": "admin"`.',
      'Re-sign or submit the updated token to unlock the secret flag.'
    ],
    explanation: 'Broken Authentication happens when session identification tokens are predictable, unsigned, or trusted solely on the client side. Applications must verify digital signatures (e.g. HMAC SHA256) on every privileged request.'
  }
];

export const SAMPLE_LEADERBOARD = [
  { rank: 1, username: 'CyberViper_0x', xp: 2450, badges: ['SQL Master', 'XSS Hunter', 'Auth Breaker', 'Legend'], completedLabs: 3, avatar: '🐉' },
  { rank: 2, username: 'NeonSpectre', xp: 1800, badges: ['SQL Master', 'XSS Hunter', 'Pro Hacker'], completedLabs: 2, avatar: '👻' },
  { rank: 3, username: 'GhostProtocol', xp: 1650, badges: ['SQL Master', 'Auth Breaker'], completedLabs: 2, avatar: '⚡' },
  { rank: 4, username: 'ZeroDay_Hero', xp: 1200, badges: ['SQL Master', 'Novice'], completedLabs: 1, avatar: '☣️' },
  { rank: 5, username: 'ByteNinja', xp: 950, badges: ['XSS Hunter'], completedLabs: 1, avatar: '🥷' },
  { rank: 6, username: 'CipherQueen', xp: 750, badges: ['Novice'], completedLabs: 1, avatar: '👑' },
];

export const ALL_BADGES = [
  { id: 'sql-master', name: 'SQL Master', desc: 'Conquered SQL Injection vulnerability challenge', icon: '💾', color: 'from-blue-500 to-cyan-400' },
  { id: 'xss-hunter', name: 'XSS Hunter', desc: 'Mastered Cross-Site Scripting exploitation', icon: '🎯', color: 'from-emerald-500 to-teal-400' },
  { id: 'auth-breaker', name: 'Auth Breaker', desc: 'Bypassed authentication & JWT privilege controls', icon: '🔓', color: 'from-purple-500 to-indigo-400' },
  { id: 'cyber-novice', name: 'Cyber Novice', desc: 'Joined HackArena cybersecurity defense force', icon: '🛡️', color: 'from-amber-500 to-yellow-400' },
  { id: 'hackarena-champion', name: 'Arena Champion', desc: 'Completed all beginner & intermediate labs', icon: '🏆', color: 'from-rose-500 to-pink-500' }
];
