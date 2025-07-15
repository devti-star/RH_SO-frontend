import { apiURL } from "../../../config";
import type { Cadastro } from "../../../models/cadastro.interface";
import { useSnackbarStore } from "../../../shared/useSnackbar";
import axios from "axios";

// 1º passo: cadastra usuário sem foto
export const cadastrarUsuario = async (dados: Cadastro): Promise<{ success: boolean; userId?: number; error?: any }> => {
    try {
        console.log(apiURL);
        const resp = await axios.post(`${apiURL}/usuarios`, dados);
        return { success: true, userId: resp.data.userId };
    } catch (error) {
        const { showSnackbar } = useSnackbarStore.getState();
        showSnackbar(`Erro ao criar conta: ${error}`, 'error');
        return { success: false, error };
    }
};

// 2º passo: faz upload da foto
export const uploadFotoUsuario = async (userId: number, foto: File): Promise<boolean> => {
    try {
        const formData = new FormData();
        formData.append("foto", foto);

        await axios.patch(`${apiURL}/usuarios/foto/${userId}`, formData, {
            headers: {
                // O axios seta o Content-Type sozinho!
            },
        });
        return true;
    } catch (error) {
        const { showSnackbar } = useSnackbarStore.getState();
        showSnackbar(`Erro ao enviar foto: ${error}`, 'error');
        return false;
    }
};
