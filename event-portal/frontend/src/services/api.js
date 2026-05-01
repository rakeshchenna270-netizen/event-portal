import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach token automatically from localStorage
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);
export const getMe         = ()     => API.get('/auth/me');

// ─── Events ───────────────────────────────────────
export const fetchEvents   = (params) => API.get('/events', { params });
export const fetchEvent    = (id)     => API.get(`/events/${id}`);
export const createEvent   = (data)   => API.post('/events', data);
export const updateEvent   = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent   = (id)     => API.delete(`/events/${id}`);
export const toggleLikeEvent = (id)     => API.post(`/events/${id}/like`);

// ─── Registrations ────────────────────────────────
export const rsvpEvent           = (eventId) => API.post(`/events/${eventId}/rsvp`);
export const cancelRSVP          = (eventId) => API.put(`/events/${eventId}/cancel`);
export const getMyRegistrations  = ()        => API.get('/events/my/registrations');
export const getAttendees        = (eventId) => API.get(`/events/${eventId}/attendees`);
export const removeAttendee      = (eventId, userId) => API.delete(`/events/${eventId}/attendees/${userId}`);
