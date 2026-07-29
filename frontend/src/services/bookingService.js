import api from './api';

export const bookingService = {
  create: (data) => api.post('/bookings', data).then((r) => r.data),
  listForTrip: (tripId) => api.get(`/bookings/trip/${tripId}`).then((r) => r.data),
  getById: (id) => api.get(`/bookings/${id}`).then((r) => r.data),
  update: (id, data) => api.put(`/bookings/${id}`, data).then((r) => r.data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`).then((r) => r.data),
};
