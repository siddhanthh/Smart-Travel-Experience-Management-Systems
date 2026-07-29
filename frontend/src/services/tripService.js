import api from './api';

export const tripService = {
  create: (data) => api.post('/trips', data).then((r) => r.data),
  list: (params) => api.get('/trips', { params }).then((r) => r.data),
  getById: (id) => api.get(`/trips/${id}`).then((r) => r.data),
  update: (id, data) => api.put(`/trips/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/trips/${id}`).then((r) => r.data),
  join: (id) => api.post(`/trips/${id}/join`).then((r) => r.data),
  members: (id) => api.get(`/trips/${id}/members`).then((r) => r.data),
  cancel: (id) => api.put(`/trips/${id}/cancel`).then((r) => r.data),
};
