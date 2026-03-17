import axios from "axios";
import useUserStore from "@/store/useUserStore";

const lostFoundApi = axios.create({
  baseURL: "http://localhost:5004/lost-found", // ← update with your IP
  timeout: 15000,
});

lostFoundApi.interceptors.request.use((config) => {
  const token = useUserStore.getState().getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

lostFoundApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useUserStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default lostFoundApi;
