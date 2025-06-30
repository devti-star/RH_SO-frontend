import { apiURL } from "../../../config"
import type { login } from "../../../models/login"
import type { LoginResponse } from "../../../models/LoginResponse";
import { useNavigate } from 'react-router-dom';
import api from "../../../interceptors/token.intercept";
import { useSnackbarStore } from "../../../shared/useSnackbar";

export const handleLogin = async(credenciais: login) => {
    try {
        const navigate = useNavigate();
        const response = await api.post<LoginResponse>(apiURL + "", credenciais);

        const token = response.data.acces_token;
        const role = response.data.role;

        if (token) localStorage.setItem("token", token);

        // Supondo que a role será recebida como um inteiro
        if (role) localStorage.setItem("role", String(role));

        // TODO: A página a ser carregada depende da role do usuário
        navigate('/');
        

    } catch (error){
        const { showSnackbar } = useSnackbarStore.getState();
        showSnackbar('E-mail ou senha incorretos', 'error');
    }
}

