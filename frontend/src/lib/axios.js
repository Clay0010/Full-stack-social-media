import axios from "axios";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : import.meta.env.VITE_API_URL;
// const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"; // takes the backend url from render

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
