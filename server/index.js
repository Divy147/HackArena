import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAIMentorResponse } from './services/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Registered Users Database
let registeredUsers = [
  {
    id: 'user-001',
    displayName: 'CyberViper_0x',
    email: 'viper@hackarena.io',
    xp: 2450,
    level: 5,
    completedLabs: ['sql-injection', 'xss', 'broken-auth'],
    badges: ['SQL Master', 'XSS Hunter', 'Auth Breaker', 'Legend'],
    avatar: '🐉',
    createdAt: '2026-07-28T10:15:00.000Z',
    lastActive: 'Just now'
  },
  {
    id: 'user-002',
    displayName: 'NeonSpectre',
    email: 'spectre@hackarena.io',
    xp: 1800,
    level: 4,
    completedLabs: ['sql-injection', 'xss'],
    badges: ['SQL Master', 'XSS Hunter', 'Pro Hacker'],
    avatar: '👻',
    createdAt: '2026-07-29T14:30:00.000Z',
    lastActive: '5 mins ago'
  },
  {
    id: 'user-003',
    displayName: 'GhostProtocol',
    email: 'ghost@hackarena.io',
    xp: 1650,
    level: 4,
    completedLabs: ['sql-injection', 'broken-auth'],
    badges: ['SQL Master', 'Auth Breaker'],
    avatar: '⚡',
    createdAt: '2026-07-30T09:12:00.000Z',
    lastActive: '12 mins ago'
  },
  {
    id: 'user-004',
    displayName: 'DemoHacker',
    email: 'demo.hacker@hackarena.io',
    xp: 250,
    level: 1,
    completedLabs: ['sql-injection'],
    badges: ['SQL Master', 'Cyber Novice'],
    avatar: '👾',
    createdAt: new Date().toISOString(),
    lastActive: 'Active Session'
  }
];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    platform: 'HackArena Cybersecurity Platform Backend',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users', (req, res) => {
  res.json({
    count: registeredUsers.length,
    users: registeredUsers
  });
});

app.get('/api/users/:email', (req, res) => {
  const email = req.params.email.toLowerCase();
  const user = registeredUsers.find(u => u.email.toLowerCase() === email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

app.post('/api/users/register', (req, res) => {
  const { displayName, email, avatar } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  let user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.lastActive = 'Just now';
    return res.json({ message: 'User session resumed', user });
  }

  const newUser = {
    id: 'user-' + Date.now(),
    displayName: displayName || email.split('@')[0],
    email: email,
    xp: 0,
    level: 1,
    completedLabs: [],
    badges: ['Cyber Novice'],
    avatar: avatar || '👾',
    createdAt: new Date().toISOString(),
    lastActive: 'Just registered'
  };

  registeredUsers.push(newUser);
  res.status(201).json({ message: 'Registration successful', user: newUser });
});

app.post('/api/ai/mentor', async (req, res) => {
  try {
    const { prompt, labName, completed } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    const aiReply = await getAIMentorResponse(prompt, { labName, completed });
    res.json({ reply: aiReply, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process AI response' });
  }
});

app.post('/api/labs/submit', (req, res) => {
  try {
    const { labId, flag, userEmail } = req.body;

    const FLAG_DATABASE = {
      'sql-injection': { flag: 'FLAG{sql_master}', xp: 250, badge: 'SQL Master', labName: 'SQL Injection' },
      'xss': { flag: 'FLAG{xss_hunter}', xp: 250, badge: 'XSS Hunter', labName: 'XSS' },
      'broken-auth': { flag: 'FLAG{auth_breaker}', xp: 500, badge: 'Auth Breaker', labName: 'Broken Authentication' }
    };

    const labInfo = FLAG_DATABASE[labId];
    if (!labInfo) return res.status(404).json({ success: false, message: 'Lab not found' });

    const isCorrect = flag.trim() === labInfo.flag;

    if (isCorrect) {
      if (userEmail) {
        const user = registeredUsers.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
        if (user) {
          if (!user.completedLabs.includes(labId)) {
            user.completedLabs.push(labId);
            user.xp += labInfo.xp;
            user.level = Math.floor(user.xp / 500) + 1;
          }
          if (!user.badges.includes(labInfo.badge)) {
            user.badges.push(labInfo.badge);
          }
        }
      }

      res.json({
        success: true,
        message: 'Access Granted! System breached successfully.',
        xpAwarded: labInfo.xp,
        badgeUnlocked: labInfo.badge,
        labName: labInfo.labName,
        explanation: `Great job breaching ${labInfo.labName}!`
      });
    } else {
      res.json({
        success: false,
        message: 'Access Denied! Incorrect flag payload.'
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error processing flag submission' });
  }
});

app.get('/api/leaderboard', (req, res) => {
  const sorted = [...registeredUsers].sort((a, b) => b.xp - a.xp).map((user, idx) => ({
    rank: idx + 1,
    username: user.displayName,
    email: user.email,
    xp: user.xp,
    level: user.level,
    badges: user.badges,
    completedLabs: user.completedLabs.length,
    avatar: user.avatar
  }));
  res.json({ leaderboard: sorted });
});

// Listen on 0.0.0.0 to support Android, iPhone, and local network connections
app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ HackArena Backend Server running on http://0.0.0.0:${PORT}`);
});
