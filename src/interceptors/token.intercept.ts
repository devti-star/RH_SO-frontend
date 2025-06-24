import { apiURL } from "../config";
import axios from "axios";
import { useSnackbarStore } from "../shared/useSnackbar";

const api = axios.create({
  baseURL: apiURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { showSnackbar } = useSnackbarStore.getState();

    if (error.response?.status === 401) {
      showSnackbar('Sessão expirada. Faça login novamente.', 'error');
      localStorage.removeItem('token');
    } else {
      showSnackbar('Erro ao processar requisição.', 'error');
    }
    console.log("Entrou aqui!!!!!!!!!!")
    return Promise.reject(error);
  }
);

export default api;