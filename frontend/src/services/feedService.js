import api from './api';

export const feedService = {
  createPost: (data) => {
    // Support image uploads via multipart if images are File objects
    if (data.images && data.images.some((i) => i instanceof File)) {
      const form = new FormData();
      form.append('tripId', data.tripId);
      form.append('content', data.content);
      data.images.forEach((img) => form.append('images', img));
      return api
        .post('/feed/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => r.data);
    }
    return api.post('/feed/posts', data).then((r) => r.data);
  },
  getFeedForTrip: (tripId, params) =>
    api.get(`/feed/posts/trip/${tripId}`, { params }).then((r) => r.data),
  getAllFeed: (params) => api.get('/feed/posts', { params }).then((r) => r.data),
  getPost: (id) => api.get(`/feed/posts/${id}`).then((r) => r.data),
  deletePost: (id) => api.delete(`/feed/posts/${id}`).then((r) => r.data),
  addComment: (postId, content) =>
    api.post(`/feed/posts/${postId}/comments`, { content }).then((r) => r.data),
  deleteComment: (commentId) => api.delete(`/feed/comments/${commentId}`).then((r) => r.data),
  toggleReaction: (postId) => api.post(`/feed/posts/${postId}/reactions`).then((r) => r.data),
};
