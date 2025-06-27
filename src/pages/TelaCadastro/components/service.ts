import { apiURL } from "../../../config";
import api from "../../../interceptors/token.intercept";
import type { Cadastro } from "../../../models/cadastro.interface";
import { useSnackbarStore } from "../../../shared/useSnackbar";

export const handleCadastro = async(dados: Cadastro): Promise<boolean> => {
    try {
        await api.post<Cadastro>(`${apiURL}/cadastrar`, dados);
        return true;
    } catch (error){
        const { showSnackbar } = useSnackbarStore.getState();
        showSnackbar('Erro ao criar conta: ', 'error');
        return false;
    } 
}