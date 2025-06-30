import { redirect, type LoaderFunction } from "react-router-dom";
import { ServicoArmazenamento } from "../shared/services/storage.service";

export function GuardiaoAutorizacao(roles_requeridas: number[]): LoaderFunction {
  return async () => {
    // Adicione verificação defensiva para casos em que o pai ainda não autenticou
    const servicoArmazenamento = ServicoArmazenamento.getInstance();
    const usuario = servicoArmazenamento.get("usuario");

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
