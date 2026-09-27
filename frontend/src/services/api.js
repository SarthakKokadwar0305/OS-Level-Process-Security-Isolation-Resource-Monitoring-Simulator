/**
 * Centralized API Service for OS Simulator.
 * Configured with Axios to interact with Flask REST endpoints.
 *
 * NOTE FOR TEAMMATES:
 * Replace or extend endpoints as your module requires.
 * All functions return Axios promises resolving to standardized backend responses.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Response interceptor for streamlined error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.message || error.message || 'API request failed';
    console.error(`[API Error]: ${errorMsg}`, error);
    return Promise.reject(error.response?.data || { message: errorMsg, success: false });
  }
);

// --- Health API ---
export const healthAPI = {
  check: () => apiClient.get('/health'),
};

// --- Process Management APIs ---
// Connected to /api/process/*
export const processAPI = {
  // GET /api/process/list
  list: () => apiClient.get('/process/list'),

  // POST /api/process/create
  create: (data) => apiClient.post('/process/create', data),

  // POST /api/process/kill
  kill: (pid) => apiClient.post('/process/kill', { pid }),

  // POST /api/process/suspend
  suspend: (pid) => apiClient.post('/process/suspend', { pid }),

  // POST /api/process/resume
  resume: (pid) => apiClient.post('/process/resume', { pid }),
};

// --- Security Monitoring APIs ---
// Connected to /api/security/*
export const securityAPI = {
  // GET /api/security/logs
  getLogs: (limit = 50) => apiClient.get(`/security/logs?limit=${limit}`),

  // POST /api/security/check
  checkPermission: (data) => apiClient.post('/security/check', data),

  // POST /api/security/isolate
  isolateProcess: (data) => apiClient.post('/security/isolate', data),
};

// --- Resource Monitoring APIs ---
// Connected to /api/resource/*
export const resourceAPI = {
  // GET /api/resource/cpu
  getCpu: () => apiClient.get('/resource/cpu'),

  // GET /api/resource/memory
  getMemory: () => apiClient.get('/resource/memory'),

  // GET /api/resource/disk
  getDisk: () => apiClient.get('/resource/disk'),

  // GET /api/resource/processes
  getProcesses: () => apiClient.get('/resource/processes'),
};

// --- System Logging APIs ---
// Connected to /api/system/logs
export const systemAPI = {
  getLogs: (limit = 50) => apiClient.get(`/system/logs?limit=${limit}`),
};

export default apiClient;
