// services/ApiFactory.ts
import axios, { type AxiosInstance } from "axios";
import { ServicoArmazenamento } from "../../shared/services/storage.service";
import { useSnackbarStore } from "../../shared/useSnackbar";
import { apiURL } from "../../config";

export class ApiFactory {
  static create(baseURL: string = apiURL): AxiosInstance {
    const instance = axios.create({ baseURL });

    instance.interceptors.request.use((config) => {
      const storage = ServicoArmazenamento.getInstance();
      const usuario = storage.get("usuario");

      if (usuario) {
        config.headers.Authorization = `${usuario.token_type} ${usuario.acces_token}`;
      }

      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { showSnackbar } = useSnackbarStore.getState();

        if (error.response?.status === 401) {
          showSnackbar("Sessão expirada. Faça login novamente.", "error");
          localStorage.removeItem("token");
        } else {
          showSnackbar("Erro ao processar requisição.", "error");
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }
}
