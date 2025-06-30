import { apiURL } from "../config";
import axios from "axios";
import { useSnackbarStore } from "../shared/useSnackbar";
import { ServicoArmazenamento } from "../shared/services/storage.service";

const api = axios.create({
  baseURL: apiURL,
});

api.interceptors.request.use(
  (config) => {
    const servicoArmazenamento = ServicoArmazenamento.getInstance();
    const usuario = servicoArmazenamento.get("usuario");

    if (usuario) {
      config.headers.Authorization = `${usuario.token_type} ${usuario.acces_token}`;
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
    return Promise.reject(error);
  }
);

export default api;