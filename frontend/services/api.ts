import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change to your machine's local IP when testing on a physical device
const API_BASE = 'http://localhost:3000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth (Aryan's module) ──────────────────────────
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login:    (data: any) => api.post('/auth/login', data),
  logout:   ()          => api.post('/auth/logout'),
};

export const profileAPI = {
  getMe:  ()          => api.get('/profile/me'),
  update: (data: any) => api.patch('/profile/update', data),
};

// ── Resources (Sankalp's module) ──────────────────
export const resourcesAPI = {
  getAll:        (params?: { search?: string; category?: string }) =>
                   api.get('/resources', { params }),
  getById:       (id: string)             => api.get(`/resources/${id}`),
  getCategories: ()                       => api.get('/resources/categories'),
  getBookmarks:  ()                       => api.get('/resources/bookmarks/all'),
  addBookmark:   (id: string)             => api.post(`/resources/bookmarks/${id}`),
  removeBookmark:(id: string)             => api.delete(`/resources/bookmarks/${id}`),
  create:        (data: any)              => api.post('/resources', data),
  update:        (id: string, data: any)  => api.patch(`/resources/${id}`, data),
  delete:        (id: string)             => api.delete(`/resources/${id}`),
};

export const notificationsAPI = {
  getAll:   ()           => api.get('/notifications'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  dismiss:  (id: string) => api.delete(`/notifications/${id}`),
  send:     (data: any)  => api.post('/notifications', data),
};

// ── Tasks (Ishaan's module — stub) ────────────────
export const tasksAPI = {
  getAll:  ()                         => api.get('/tasks'),
  create:  (data: any)                => api.post('/tasks', data),
  update:  (id: string, data: any)    => api.patch(`/tasks/${id}`, data),
  delete:  (id: string)               => api.delete(`/tasks/${id}`),
};

// ── Navigation (Aditya's module — stub) ───────────
export const navigationAPI = {
  searchLocations: (q: string)  => api.get('/navigation/locations', { params: { q } }),
  saveLocation:    (id: string) => api.post(`/navigation/saved/${id}`),
};

// ── Community (Varun's module — stub) ─────────────
export const communityAPI = {
  getPosts:   ()          => api.get('/community/posts'),
  createPost: (data: any) => api.post('/community/posts', data),
  getGroups:  ()          => api.get('/community/groups'),
  joinGroup:  (id: string)=> api.post(`/community/groups/${id}/join`),
  getFAQ:     ()          => api.get('/community/faq'),
};

export default api;
