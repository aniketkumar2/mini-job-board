import axios from "axios";
import { API_HOST } from "../constants/config";

// --- Token helpers ---
export const getAccessToken = () => localStorage.getItem("accessToken");
export const setAccessToken = (token) =>
  localStorage.setItem("accessToken", token);

export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const setRefreshToken = (token) =>
  localStorage.setItem("refreshToken", token);

export const saveTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    setAccessToken(accessToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common["Authorization"];
  }
  if (refreshToken) {
    setRefreshToken(refreshToken);
  } else {
    localStorage.removeItem("refreshToken");
  }
};

export const logoutUser = () => {
  saveTokens(null, null);
  window.location.href = "/login";
};

// --- On app load: set Authorization header if token exists ---
const existingToken = getAccessToken();
if (existingToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

// --- Axios response interceptor ---
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url || "";
    if (error?.response?.status === 401) {
      // if (error?.response?.status === 401 && !url.includes("/api/auth/")) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

// --- API helpers ---
export const validateToken = async (token) => {
  const res = await axios.get(`${API_HOST}/api/auth/validate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { status: true, user: {...} }
};

export const loginAPI = async (email, password) => {
  const res = await axios.post(`${API_HOST}/api/auth/login`, {
    email,
    password,
  });
  if (!res.data.accessToken)
    throw new Error(res.data.message || "Login failed");

  // saveTokens(res.data.accessToken, res.data.refreshToken);
  return res.data.accessToken;
};

export const registerAPI = async (email, password, user_type = "user") => {
  const res = await axios.post(`${API_HOST}/api/auth/register`, {
    email,
    password,
    user_type,
  });
  if (!res.data.success)
    throw new Error(res.data.message || "Registration failed");
  return res.data;
};

export const socialLoginAPI = async (provider, token) => {
  console.log("socialLoginAPI");
  // const refreshToken = getRefreshToken();
  const res = await axios.post(
    `${API_HOST}/api/auth/${provider}`,
    { token },
    { withCredentials: true }
  );

  if (!res.data.status) {
    throw new Error(res.data.message || `${provider} login failed`);
  }

  saveTokens(res.data.accessToken); // store in localStorage
  return res.data.accessToken;
};
export const refreshTokenAPI = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await axios.post(`${API_HOST}/api/auth/refresh-token`, {
      token: refreshToken,
    });
    if (!res.data.success) throw new Error(res.data.message);

    saveTokens(res.data.accessToken, refreshToken);
    return res.data.accessToken;
  } catch {
    logoutUser();
    return null;
  }
};
