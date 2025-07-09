import type { Usuario } from "../../models/usuario.interface";
import type { AxiosInstance } from "axios";
import { ApiService } from "../../interceptors/Api/api.intercept";
import { apiURL } from "../../config";

export const getUsuario = async (id: number): Promise<Usuario> => {
  const api: AxiosInstance = ApiService.getInstance();
  const resp = await api.get<Usuario>(`${apiURL}/usuarios/${id}`);
  return resp.data;
};
