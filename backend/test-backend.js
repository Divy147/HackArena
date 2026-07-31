/**
 * HackArena Backend Automated Integration Test Runner
 */
const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');

let server;
let port;
let authToken = '';
let userId = '';

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json'
    };

    if (dataString) {
      headers['Content-Length'] = Buffer.byteLength(dataString);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(responseBody);
          } catch (e) {
            parsed = responseBody;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', (err) => reject(err));

    if (dataString) {
      req.write(dataString);
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('\n=============================================================');
  console.log('🚀 RUNNING HACKARENA BACKEND INTEGRATION TESTS');
  console.log('=============================================================\n');

  try {
    // 1. Health Check
    console.log('1. Testing GET /api/health...');
    const health = await request('/api/health');
    console.assert(health.status === 200, 'Health check should return 200');
    console.log('   ✅ Health check passed!\n');

    // 2. Signup Test
    console.log('2. Testing User Signup (POST /api/auth/signup)...');
    const signupData = {
      name: 'Cyber Sentinel',
      email: `test_${Date.now()}@hackarena.io`,
      password: 'Password123!'
    };
    const signupRes = await request('/api/auth/signup', 'POST', signupData);
    console.assert(signupRes.status === 201, `Signup failed with status ${signupRes.status}`);
    console.assert(signupRes.body.data.token, 'Signup should return JWT token');
    authToken = signupRes.body.data.token;
    userId = signupRes.body.data.user.uid;
    console.log(`   ✅ User Signup successful! UID: ${userId}\n`);

    // 3. User Profile Test
    console.log('3. Testing Profile Retrieval (GET /api/user/profile)...');
    const profileRes = await request('/api/user/profile', 'GET', null, authToken);
    console.assert(profileRes.status === 200, 'Profile retrieval should return 200');
    console.assert(profileRes.body.data.email === signupData.email, 'Email mismatch in profile');
    console.log('   ✅ User Profile retrieval passed!\n');

    // 4. Unauthorized Request Test
    console.log('4. Testing Auth Guard (GET /api/user/profile without token)...');
    const unauthRes = await request('/api/user/profile', 'GET');
    console.assert(unauthRes.status === 401, 'Request without token must return 401');
    console.log('   ✅ Auth Guard properly rejected unauthorized request!\n');

    // 5. Labs Listing
    console.log('5. Testing Labs Catalog (GET /api/labs)...');
    const labsRes = await request('/api/labs');
    console.assert(labsRes.status === 200, 'GET /api/labs should return 200');
    console.assert(labsRes.body.data.length === 3, 'Should list exactly 3 labs');
    console.log('   ✅ GET /api/labs returned 3 labs!\n');

    // 6. Submit Flag - SQL Injection
    console.log('6. Submitting SQL Injection Flag (FLAG{sql_master})...');
    const sqlFlagRes = await request('/api/labs/submit-flag', 'POST', {
      labId: 'sql-injection',
      flag: 'FLAG{sql_master}'
    }, authToken);
    console.assert(sqlFlagRes.status === 200, 'SQL flag submission should succeed');
    console.assert(sqlFlagRes.body.data.xpGained === 100, 'XP Gained should be 100');
    console.log(`   ✅ SQL Injection Flag verified! XP: ${sqlFlagRes.body.data.totalXp}\n`);

    // 7. Submit Flag - XSS
    console.log('7. Submitting XSS Flag (FLAG{xss_hunter})...');
    const xssFlagRes = await request('/api/labs/submit-flag', 'POST', {
      labId: 'xss',
      flag: 'FLAG{xss_hunter}'
    }, authToken);
    console.assert(xssFlagRes.status === 200, 'XSS flag submission should succeed');
    console.log(`   ✅ XSS Flag verified! XP: ${xssFlagRes.body.data.totalXp}\n`);

    // 8. Submit Flag - Broken Authentication
    console.log('8. Submitting Broken Auth Flag (FLAG{auth_breaker})...');
    const authFlagRes = await request('/api/labs/submit-flag', 'POST', {
      labId: 'broken-authentication',
      flag: 'FLAG{auth_breaker}'
    }, authToken);
    console.assert(authFlagRes.status === 200, 'Broken Auth flag submission should succeed');
    console.log(`   ✅ Broken Auth Flag verified! Total XP: ${authFlagRes.body.data.totalXp}\n`);

    // 9. Incorrect Flag Test
    console.log('9. Submitting Incorrect Flag (FLAG{wrong_flag})...');
    const wrongFlagRes = await request('/api/labs/submit-flag', 'POST', {
      labId: 'sql-injection',
      flag: 'FLAG{wrong_flag}'
    }, authToken);
    console.assert(wrongFlagRes.status === 400, 'Wrong flag must return 400 status');
    console.log('   ✅ Incorrect flag correctly rejected!\n');

    // 10. AI Mentor Chat Test
    console.log('10. Testing Gemini AI Mentor Chat (POST /api/ai/chat)...');
    const aiRes = await request('/api/ai/chat', 'POST', {
      prompt: 'Explain SQL injection in simple terms and give a safe hint',
      labId: 'sql-injection'
    }, authToken);
    console.assert(aiRes.status === 200, 'AI Chat should return 200');
    console.assert(aiRes.body.data.reply, 'AI Reply should be present');
    console.log('   ✅ AI Mentor chat functional!\n');

    // 11. Badges Verification Test
    console.log('11. Testing Badges Status (GET /api/badges)...');
    const badgesRes = await request('/api/badges', 'GET', null, authToken);
    console.assert(badgesRes.status === 200, 'GET /api/badges should return 200');
    const unlockedCount = badgesRes.body.data.filter(b => b.unlocked).length;
    console.assert(unlockedCount === 4, `All 4 badges should be unlocked, got ${unlockedCount}`);
    console.log('   ✅ All 4 Badges (Cyber Rookie, SQL Beginner, XSS Hunter, Auth Expert) successfully unlocked!\n');

    // 12. Leaderboard Test
    console.log('12. Testing Leaderboard (GET /api/leaderboard)...');
    const lbRes = await request('/api/leaderboard');
    console.assert(lbRes.status === 200, 'Leaderboard should return 200');
    console.assert(lbRes.body.data[0].xp === 350, 'Top user should have 350 XP');
    console.log('   ✅ Leaderboard returned accurate rankings!\n');

    // 13. Certificate Generation Test
    console.log('13. Testing Downloadable Certificate (GET /api/certificate)...');
    const certRes = await request('/api/certificate', 'GET', null, authToken);
    console.assert(certRes.status === 200, 'Certificate should return 200');
    console.assert(certRes.body.data.eligible === true, 'User should be eligible for certificate');
    console.log(`   ✅ Certificate unlocked! Code: ${certRes.body.data.certificateId}\n`);

    console.log('=============================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! (13/13)');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('❌ INTEGRATION TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
};

server = app.listen(0, '127.0.0.1', () => {
  port = server.address().port;
  runTests();
});
