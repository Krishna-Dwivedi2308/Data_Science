// src/api/index.js
import axios from "axios";

const API_BASE_URL = import.meta.env.BACKEND_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// make post request to /create_input with this query along with token as Authorizatin header
export const createInput = async (query) => {
  const response = await api.post(`/create_input?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const createPlaylist = async (name_of_playlist) => {
  const response = await api.post(
    `/create_playlist_protected?name_of_playlist=${encodeURIComponent(name_of_playlist)}`
  );
  return response.data;
};

export const loginWithSpotify = async () => {
  // simply redirect user to backend login route
  window.location.href = `${api.defaults.baseURL}/login`;
};
