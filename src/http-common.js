import axios from "axios";

const api = axios.create({
  // Point at the backend origin (used for /sanctum/csrf-cookie and login)
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    "Accept": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("uid")}`,
  }
});

// If you also use token-based auth, you can set it at runtime using this helper
export function setApiToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export default api;