import { apiURL } from "../../../config";
import type { login } from "../../../models/login";
import { redirect, useNavigate, type NavigateFunction } from "react-router-dom";
import { useSnackbarStore } from "../../../shared/useSnackbar";
import { ServicoArmazenamento } from "../../../shared/services/storage.service";
import type { LoginResponse, Usuario } from "../../../models/usuario.interface";
import axios from "axios";
import { Roles } from "../../../models/roles";

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

  async login(credenciais: login, navigate: NavigateFunction): Promise<void> {
    try {
      console.log("BaseAPI: ", AuthService.baseAPI );
      // const navigate = useNavigate();  >
      const response = await axios.post<LoginResponse>(
        AuthService.baseAPI + "/auth/login",
        credenciais, 
      );

      const token = response.data;
      const headers = {Authorization: `${token.token_type} ${token.access_token}`};

      const response_usuario = await axios.get<Usuario>(AuthService.baseAPI + "/auth/me", {headers: headers});
      let usuario = response_usuario.data;
      usuario = {...usuario, ...token};
      if (usuario) AuthService.servicoArmazenamento.set("usuario", usuario);
      console.log(usuario);

      if (usuario.role === Roles.PADRAO) {
        navigate("/MinhasSolicitacoes");
      } else {
        navigate("/admin");
      }
      
    } catch (error) {
      const { showSnackbar } = useSnackbarStore.getState();
      showSnackbar(`E-mail ou senha incorretos ${error}`, "error");
      console.log(error);
    }
  }

  logout(): void {
    AuthService.servicoArmazenamento.remove("usuario");
  }

  isLoggedIn(): boolean {
    const usuario = this.getUserStorage();

    return !!(usuario && usuario.access_token !== null);
  }

  getUserStorage(isRediret: boolean = true): Usuario | null {
    let usuario: Usuario | null = null;
    try {
      usuario = AuthService.servicoArmazenamento.get("usuario");
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
