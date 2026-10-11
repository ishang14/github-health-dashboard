import axios from "axios";

// Baked in at build time (see .env / Docker build arg); falls back to the
// local dev server. The Settings page can still override this per-browser.
export const DEFAULT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const TOKEN_KEY = "gh.authToken";

export const getApiBaseUrl = () => {
  try {
    return localStorage.getItem("gh.apiBaseUrl") || DEFAULT_API_BASE_URL;
  } catch {
    return DEFAULT_API_BASE_URL;
  }
};

export const setApiBaseUrl = (url) => {
  try {
    if (url && url.trim()) {
      localStorage.setItem("gh.apiBaseUrl", url.trim());
    } else {
      localStorage.removeItem("gh.apiBaseUrl");
    }
  } catch {
    /* ignore storage errors */
  }

  api.defaults.baseURL = getApiBaseUrl();
};

// --- Auth token plumbing -------------------------------------------------

let authToken = null;

try {
  authToken = localStorage.getItem(TOKEN_KEY);
} catch {
  authToken = null;
}

export const getAuthToken = () => authToken;

export const setAuthToken = (token) => {
  authToken = token || null;

  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    /* ignore storage errors */
  }
};

let onUnauthorized = null;

export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

// --- Axios instance ----------------------------------------------------

const api = axios.create({
  baseURL: getApiBaseUrl()
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

// --- Auth endpoints --------------------------------------------------

export const registerRequest = async (name, email, password) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const loginRequest = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const fetchMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// --- App endpoints -------------------------------------------------

export const analyzeRepository = async (owner, repo) => {
  const response = await api.get(`/analyze/${owner}/${repo}`);

  return response.data;
};

export const getRepositoryHistory = async (owner, repo) => {
  const response = await api.get(`/history/${owner}/${repo}`);

  return response.data;
};

export const getAnalyzedRepositories = async () => {
  const response = await api.get("/repositories");

  return response.data;
};

export const getRecentActivity = async (limit = 50) => {
  const response = await api.get("/history", { params: { limit } });

  return response.data;
};

export const deleteRepositoryHistory = async (owner, repo) => {
  const response = await api.delete(`/repositories/${owner}/${repo}`);

  return response.data;
};

export const clearAllHistory = async () => {
  const response = await api.delete("/repositories");

  return response.data;
};
