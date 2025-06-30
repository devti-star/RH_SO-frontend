import { redirect, type LoaderFunction } from "react-router-dom";
import { useSnackbarStore } from "../shared/useSnackbar";

export function GuardiaoAutorizacao(roles_requeridas: number[]): LoaderFunction {
  return async () => {
    const role = Number(localStorage.getItem("role"));
    console.log("Autorizacao guard");
    if (!roles_requeridas.includes(role)) {
        throw redirect("/AcessoNegado");
    }

    return null;
  };
}