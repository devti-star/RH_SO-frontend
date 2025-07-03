import type { secretaria } from "./secretaria.interface";

export interface LoginResponse{
    access_token: string;
    token_type: string;
}


export interface Usuario extends LoginResponse{
    id_usuario: number,
    nomeCompleto: string;
    role: number;
    email: string,
    cpf: string,
    rg: string,
    matricula: string,
    departamento: string,
    secretaria: string,
    telefone: string,
    cargo: string,
    foto: any, //TODO: coisa feia isso aqui, se faz necessário decidir como a foto será recebida do backend
}
