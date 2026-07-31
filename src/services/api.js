/**
 * API Service for HackArena Backend REST Endpoints
 */

const API_BASE = '/api';

/**
 * Retrieve auth headers with JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('hackarena_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * Handle API responses
 */
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `HTTP Error ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // Auth API
  async signup(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const result = await handleResponse(res);
    if (result.data?.token) {
      localStorage.setItem('hackarena_token', result.data.token);
    }
    return result;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await handleResponse(res);
    if (result.data?.token) {
      localStorage.setItem('hackarena_token', result.data.token);
    }
    return result;
  },

  logout() {
    localStorage.removeItem('hackarena_token');
    localStorage.removeItem('hackarena_user_profile');
  },

  // User Profile API
  async getProfile() {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(res);
  },

  async updateProfile(updates) {
    const res = await fetch(`${API_BASE}/user/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return await handleResponse(res);
  },

  // CTF Labs API
  async getLabs() {
    const res = await fetch(`${API_BASE}/labs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await handleResponse(res);
  },

  async getLabById(id) {
    const res = await fetch(`${API_BASE}/labs/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await handleResponse(res);
  },

  async submitFlag(labId, flag) {
    const res = await fetch(`${API_BASE}/labs/submit-flag`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ labId, flag })
    });
    return await handleResponse(res);
  },

  // AI Mentor API
  async chatAI(prompt, labId = null) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt, labId })
    });
    return await handleResponse(res);
  },

  // Leaderboard API
  async getLeaderboard() {
    const res = await fetch(`${API_BASE}/leaderboard`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await handleResponse(res);
  },

  // Badges API
  async getBadges() {
    const res = await fetch(`${API_BASE}/badges`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(res);
  },

  // Certificate API
  async getCertificate() {
    const res = await fetch(`${API_BASE}/certificate`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(res);
  },

  getCertificateDownloadUrl() {
    const token = localStorage.getItem('hackarena_token');
    return `${API_BASE}/certificate?download=true&token=${encodeURIComponent(token || '')}`;
  }
};
