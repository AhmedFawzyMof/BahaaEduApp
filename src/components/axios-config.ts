import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bahaaedu-production.up.railway.app/api",
});

export default axiosInstance;
