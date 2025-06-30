import { apiURL } from "../../../config";
import type { login } from "../../../models/login";
import { useNavigate } from "react-router-dom";
import api from "../../../interceptors/token.intercept";
import { useSnackbarStore } from "../../../shared/useSnackbar";
import { ServicoArmazenamento } from "../../../shared/services/storage.service";
import type { Usuario } from "../../../models/usuario.interface";

export class AuthService {
  private static readonly baseAPI = apiURL;
  private static readonly servicoArmazenamento =
    ServicoArmazenamento.getInstance();
  private static instance: AuthService;

  private constructor(){};

  static getInstance() {
    if (!AuthService.instance){
        AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  async login(credenciais: login): Promise<void> {
    try {
      const navigate = useNavigate();
      const response = await api.post<Usuario>(
        AuthService.baseAPI + "",
        credenciais
      );

      const usuario = response.data;

      if (usuario) AuthService.servicoArmazenamento.set("usuario", usuario);

      // TODO: A página a ser carregada depende da role do usuário
      navigate("/");
    } catch (error) {
      const { showSnackbar } = useSnackbarStore.getState();
      showSnackbar("E-mail ou senha incorretos", "error");
    }
  }

  logout(): void {
    AuthService.servicoArmazenamento.remove("usuario");
  }

  isLoggedIn(): boolean {
    const usuario = this.getUserStorage();

    return !!(usuario && usuario.acces_token !== null);
  }

  getUserStorage(isRediret: boolean = true): Usuario | null {
    let usuario: Usuario | null = null;
    try {
      usuario = AuthService.servicoArmazenamento.get("usuario");
      console.log("No authService");
    } catch (error) {
      this.logout();
      if (isRediret) {
        const navigate = useNavigate();
        navigate("/login");
      }
    }
    return usuario;
  }
}
