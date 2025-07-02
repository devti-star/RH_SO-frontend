import type { AxiosInstance } from "axios";
import { apiURL } from "../../../config";
import type { Cadastro } from "../../../models/cadastro.interface";
import { useSnackbarStore } from "../../../shared/useSnackbar";
import { ApiService } from "../../../interceptors/Api/api.intercept";

export const handleCadastro = async(dados: Cadastro): Promise<boolean> => {
    try {
        const api: AxiosInstance = ApiService.getInstance();
        await api.post<Cadastro>(`${apiURL}/cadastrar`, dados);
        return true;
    } catch (error){
        const { showSnackbar } = useSnackbarStore.getState();
        showSnackbar(`Erro ao criar conta: ${error}`, 'error');
        return false;
    } 
}