import api from './api';

export const adminService = {
  stats: () => api.get('/admin/stats').then((r) => r.data),
  reports: (params) => api.get('/admin/reports', { params }).then((r) => r.data),
  auditLogs: (params) => api.get('/admin/audit-logs', { params }).then((r) => r.data),
  listUsers: (params) => api.get('/users', { params }).then((r) => r.data),
  getUser: (id) => api.get(`/users/${id}`).then((r) => r.data),
  updateUser: (id, data) => api.put(`/users/${id}`, data).then((r) => r.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then((r) => r.data),
};
