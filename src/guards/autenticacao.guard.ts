import { redirect, type LoaderFunction } from "react-router-dom";

export const GuardiaoAutenticacao: LoaderFunction = async () => {
    const isAuthenticated = !!localStorage.getItem("token");
    if (!isAuthenticated) throw redirect("/login");
}