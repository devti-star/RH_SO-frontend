export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RG {
  numeroRG: string;
  orgãoExpeditor: string;
}

export interface Usuario extends Partial<LoginResponse> {
  id: number;
  nomeCompleto: string;
  role: number;
  email: string;
  cpf: string;
  rg: RG | string;
  matricula: string;
  departamento: string;
  secretaria: string;
  telefone: string;
  cargo: string;
  foto: any; //TODO: coisa feia isso aqui, se faz necessário decidir como a foto será recebida do backend
  crm?: string;
  cre?: string;
  isActive?: boolean;
  activatedAt?: string | null; // ou Date, dependendo do formato
}
