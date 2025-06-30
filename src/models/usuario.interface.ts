interface LoginResponse{
    acces_token?: string;
    token_type?: string;
}


export interface Usuario extends LoginResponse{
    id: number,
    nome: string;
    role: number;
}