import type { AxiosInstance } from "axios";
import { apiURL } from "../../../config";
import type { Cadastro } from "../../../models/cadastro.interface";
import { useSnackbarStore } from "../../../shared/useSnackbar";
import { ApiService } from "../../../interceptors/Api/api.intercept";

// 1º passo: cadastra usuário sem foto
export const cadastrarUsuario = async (dados: Cadastro): Promise<{ success: boolean; userId?: number; error?: any }> => {
    try {
        const { foto, ...dadosSemFoto } = dados; // remove foto
        const api: AxiosInstance = ApiService.getInstance();
        const resp = await api.post(`${apiURL}/usuarios/cadastrar`, dadosSemFoto);
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

        const api: AxiosInstance = ApiService.getInstance();
        await api.patch(`${apiURL}/usuarios/foto/${userId}`, formData, {
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
