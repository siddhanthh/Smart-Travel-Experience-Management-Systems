import api from './api';

export const searchService = {
  trips: (q, params) => api.get('/search/trips', { params: { q, ...params } }).then((r) => r.data),
  users: (q, params) => api.get('/search/users', { params: { q, ...params } }).then((r) => r.data),
};
