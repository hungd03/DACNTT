import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    let uid = localStorage.getItem("uid");
    if (!uid) {
      uid = Date.now().toString();
      localStorage.setItem("uid", uid);
    }
    config.headers.uid = uid;

    return config;
  },
  (error) => Promise.reject(error)
);
