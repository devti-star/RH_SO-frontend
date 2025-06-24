import axios from "axios"
import { apiURL } from "../../../config"
import type { login } from "../../../models/login"
import type { token } from "../../../models/token";
import { useNavigate } from 'react-router-dom';

export const handleLogin = async(credenciais: login) => {
    try {
        const navigate = useNavigate();
        const response = await axios.post<token>(apiURL + "", credenciais);

        const token = response.data.acces_token;

        localStorage.setItem("token", token);

        navigate('/');


    } catch (error){
        alert("E-mail ou senhas incorretos. Verifique suas credenciais" + error)
    }
}

