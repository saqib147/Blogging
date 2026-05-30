import api from './axios';

export const getUserProfile = (id) => api.get(`/api/users/${id}`);
export const updateUserProfile = (id, data) => api.put(`/api/users/${id}`, data);
export const getUserPosts = (id) => api.get(`/api/users/${id}/posts`);
export const getUserLikedPosts = (id) => api.get(`/api/users/${id}/liked`);
export const getUserBookmarkedPosts = (id) => api.get(`/api/users/${id}/bookmarks`);
export const followUser = (id) => api.post(`/api/users/${id}/follow`);
export const unfollowUser = (id) => api.post(`/api/users/${id}/unfollow`);
export const getUserFollowers = (id) => api.get(`/api/users/${id}/followers`);
export const getUserFollowing = (id) => api.get(`/api/users/${id}/following`);
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
