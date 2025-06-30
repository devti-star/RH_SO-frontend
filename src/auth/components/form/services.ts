import { apiURL } from "../../../config"
import type { login } from "../../../models/login"
import type { token } from "../../../models/token";
import { useNavigate } from 'react-router-dom';
import api from "../../../interceptors/token.intercept";
import { useSnackbarStore } from "../../../shared/useSnackbar";

export const handleLogin = async(credenciais: login) => {
    try {
        const navigate = useNavigate();
        const response = await api.post<token>(apiURL + "", credenciais);

        const token = response.data.acces_token;

        if (token) localStorage.setItem("token", token);

        // TODO: A página a ser carregada depende da role do usuário
        navigate('/');
        

    } catch (error){
        const { showSnackbar } = useSnackbarStore.getState();
        showSnackbar('E-mail ou senha incorretos', 'error');
    }
}

