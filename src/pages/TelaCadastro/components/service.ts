import type { AxiosInstance } from "axios";
import { apiURL } from "../../../config";
import type { Cadastro } from "../../../models/cadastro.interface";
import { useSnackbarStore } from "../../../shared/useSnackbar";
import { ApiService } from "../../../interceptors/Api/api.intercept";

export const handleCadastro = async(dados: Cadastro): Promise<boolean> => {
    try {
        const api: AxiosInstance = ApiService.getInstance();

        const formData = new FormData();
        formData.append('nomeCompleto', dados.nome);
        formData.append('secretaria', dados.secretaria);
        formData.append('cpf', dados.cpf);
        formData.append('departamento', dados.departamento);
        formData.append('rg', dados.rg);
        formData.append('matricula', dados.matricula);
        formData.append('email', dados.email);
        formData.append('cargo', dados.cargo);
        formData.append('telefone', dados.telefone);
        if (dados.foto) {
            formData.append('foto', dados.foto);
        }
        formData.append('senha', dados.senha);

        await api.post(`${apiURL}/usuarios`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return true;
    } catch (error){
        const { showSnackbar } = useSnackbarStore.getState();
        showSnackbar(`Erro ao criar conta: ${error}`, 'error');
        return false;
    }
}

