// services/ApiFactory.ts
import axios, { type AxiosInstance } from "axios";
import { useSnackbarStore } from "../../shared/useSnackbar";
import { apiURL } from "../../config";
import { AuthService } from "../../auth/components/form/auth.service";

export class ApiFactory {
  private static authService: AuthService = AuthService.getInstance();

  static create(baseURL: string = apiURL): AxiosInstance {
    const instance = axios.create({ baseURL });

    instance.interceptors.request.use((config) => {
      
      const usuario = this.authService.getUserStorage();

      if (usuario) {
        config.headers.Authorization = `${usuario.token_type} ${usuario.access_token}`;
      }

      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { showSnackbar } = useSnackbarStore.getState();

        if (error.response?.status === 401) {
          showSnackbar("Sessão expirada. Faça login novamente.", "error");
          this.authService.logout();
        } else {
          showSnackbar("Erro ao processar requisição.", "error");
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }
}
