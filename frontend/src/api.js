import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// 🔐 Attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;

