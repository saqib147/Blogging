import api from './axios';

export const getAdminStats = () => api.get('/api/admin/stats');
export const getAdminUsers = () => api.get('/api/admin/users');
export const updateAdminUserRole = (id, role) => api.put(`/api/admin/users/${id}/role`, { role });
export const deleteAdminUser = (id) => api.delete(`/api/admin/users/${id}`);
export const getAdminBlogs = () => api.get('/api/admin/blogs');
export const updateAdminBlogStatus = (id, status) => api.put(`/api/admin/blogs/${id}/status`, { status });
export const deleteAdminBlog = (id) => api.delete(`/api/admin/blogs/${id}`);
export const getAdminComments = () => api.get('/api/admin/comments');
export const deleteAdminComment = (id) => api.delete(`/api/admin/comments/${id}`);
