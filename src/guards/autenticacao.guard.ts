import { redirect, type LoaderFunction } from "react-router-dom";
import { AuthService } from "../auth/components/form/auth.service";

export const GuardiaoAutenticacao: LoaderFunction = async () => {
    const servicoAutenticacao = AuthService.getInstance();
    if (!servicoAutenticacao.isLoggedIn()) {
        throw redirect("/login");
    }
}