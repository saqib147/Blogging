import api from './axios';

export const getBlogs = (params) => api.get('/api/blogs', { params });
export const getBlogById = (id) => api.get(`/api/blogs/${id}`);
export const createBlog = (data) => api.post('/api/blogs', data);
export const updateBlog = (id, data) => api.put(`/api/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/api/blogs/${id}`);
export const likeBlog = (id) => api.post(`/api/blogs/${id}/like`);
export const unlikeBlog = (id) => api.delete(`/api/blogs/${id}/like`);
export const bookmarkBlog = (id) => api.post(`/api/blogs/${id}/bookmark`);
export const unbookmarkBlog = (id) => api.delete(`/api/blogs/${id}/bookmark`);
export const getCategoriesAndTags = () => api.get('/api/blogs/meta/categories-tags');
