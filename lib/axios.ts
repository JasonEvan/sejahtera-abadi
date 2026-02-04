import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  },
);

export default api;
