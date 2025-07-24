import axios from "axios";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";
const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const axiosInstance = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
})