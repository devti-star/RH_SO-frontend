import { redirect } from "react-router-dom";

export async function GuardiaoAutenticacao(){
    const isAuthenticated = !!localStorage.getItem("token");
    if (!isAuthenticated) throw redirect("/login");
}