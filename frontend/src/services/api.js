import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests and attach the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const projectService = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  addMember: (projectId, email) => api.post(`/projects/${projectId}/members`, { email }),
  getMembers: (projectId) => api.get(`/projects/${projectId}/members`),
};

export const issueService = {
  getByProject: (projectId) => api.get(`/projects/${projectId}/issues`),
  create: (data) => api.post('/issues', data),
  updateStatus: (id, status) => api.patch(`/issues/${id}/status`, null, { params: { status } }),
  assign: (id, assigneeId) => api.patch(`/issues/${id}/assign`, null, { params: { assigneeId } }),
  getHistory: (id) => api.get(`/issues/${id}/history`),
  getMyIssues: () => api.get('/issues/me'),
};

export const userService = {
  getAll: () => api.get('/users'),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};

export default api;