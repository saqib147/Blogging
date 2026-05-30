import api from './axios';

export const getBlogComments = (blogId) => api.get(`/api/blogs/${blogId}/comments`);
export const createComment = (blogId, text) => api.post(`/api/blogs/${blogId}/comments`, { text });
export const createReply = (commentId, text) => api.post(`/api/comments/${commentId}/replies`, { text });
export const deleteComment = (commentId) => api.delete(`/api/comments/${commentId}`);
