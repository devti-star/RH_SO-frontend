import type { Usuario } from "../models/usuario.interface";
import type { AxiosInstance } from "axios";
import { ApiService } from "../interceptors/Api/api.intercept";
import { apiURL } from "../config";
import type { ChangePassword } from "../models/changePassword";

export const getUsuario = async (id: number): Promise<Usuario> => {
  const api: AxiosInstance = ApiService.getInstance();
  const resp = await api.get<Usuario>(`/usuarios/${id}`);
  return resp.data;
};

export const patchUsuario = async (
  id: number,
  dados: Partial<Usuario>
): Promise<Usuario> => {
  const api: AxiosInstance = ApiService.getInstance();
  const resp = await api.patch<Usuario>(`/usuarios/${id}`, dados);
  return resp.data;
};

export const patchFotoUsuario = async (
  id: number,
  foto: File
): Promise<void> => {
  const api: AxiosInstance = ApiService.getInstance();
  const formData = new FormData();
  formData.append("foto", foto);
  await api.patch(`${apiURL}/usuarios/foto/${id}`, formData, { headers: {} });
};

export const changePassword = async (
  dados: ChangePassword
): Promise<boolean> => {
  const api: AxiosInstance = ApiService.getInstance();

  const result = await api.patch(`usuarios/mudar-senha`, {...dados});

  return result.status === 200;
};
