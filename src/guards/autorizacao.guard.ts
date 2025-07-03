import { redirect, type LoaderFunction } from "react-router-dom";
import { AuthService } from "../auth/components/form/auth.service";

export function GuardiaoAutorizacao(roles_requeridas: number[]): LoaderFunction {
  return async () => {
    // Adicione verificação defensiva para casos em que o pai ainda não autenticou
    const authService = AuthService.getInstance();
    const usuario = authService.getUserStorage();

    // Se `usuario` ainda não foi definido, o loader pai deve redirecionar
    if (!usuario || !usuario.role) {
      return null;
    }

    const role = usuario.role;
    console.log("Autorizacao guard");

    if (!roles_requeridas.includes(role)) {
      throw redirect("/AcessoNaoAutorizado");
    }

    return null;
  };
}
