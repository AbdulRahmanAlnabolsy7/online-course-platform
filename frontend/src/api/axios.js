import axios from "axios";
export const TOKEN_KEY = "luma.auth.token";
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function saveToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.skipAuth)
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.skipAuth &&
      getToken()
    ) {
      saveToken(null);
      window.dispatchEvent(new Event("luma:session-expired"));
    }
    return Promise.reject(error);
  },
);
export const payload = async (promise) => (await promise).data.data;
export const collection = async (promise) => (await promise).data;
export default api;
