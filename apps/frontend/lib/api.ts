import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally handle sign-out or token refresh
      // window.location.reload();
    }
    return Promise.reject(error);
  }
);

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(`${getApiBaseUrl()}${input}`, {
    ...init,
    headers,
  });
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    // Optionally, sign out from Firebase here if you want
    window.location.reload(); // Triggers AuthGate to show sign-in
    throw new Error('Unauthorized');
  }
  return response;
}

export default api; 