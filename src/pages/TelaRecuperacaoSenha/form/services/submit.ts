// src/services/passwordService.ts
import axios from 'axios';
import { apiURL } from '../../../../config';

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.patch(
      `${apiURL}/usuarios/recoverypassword/${token}`,
      {
        "newPassword": newPassword
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Erro ao redefinir senha');
    }
    throw new Error('Erro desconhecido');
  }
};

export const enviarEmail = async (email: string) => {
  try {
    const response = await axios.post(
      `${apiURL}/usuarios/forgotpassword`, // URL corrigida
      { email }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Erro ao enviar e-mail');
    }
    throw new Error('Erro desconhecido');
  }
}