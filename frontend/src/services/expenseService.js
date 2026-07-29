import api from './api';

export const expenseService = {
  add: (data) => api.post('/expenses', data).then((r) => r.data),
  listForTrip: (tripId) => api.get(`/expenses/trip/${tripId}`).then((r) => r.data),
  getBalances: (tripId) => api.get(`/expenses/trip/${tripId}/balances`).then((r) => r.data),
  settle: (data) => api.post('/expenses/settle', data).then((r) => r.data),
  getSettlements: (tripId) =>
    api.get(`/expenses/trip/${tripId}/settlements`).then((r) => r.data),
};
