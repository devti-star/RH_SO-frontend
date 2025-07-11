// models/requerimento.interface.ts

export interface Usuario {
  id: number;
  nomeCompleto: string;
  email: string;
  cpf: string;
  rg: any; // pode detalhar depois se necessário
  matricula: string;
  departamento: string;
  secretaria: string;
  telefone: string;
  cargo: string;
  foto: string | null;
  role: number;
  isActive: boolean;
  activatedAt: string | null;
}

export interface Documento {
  id: number;
  caminho: string;
  dataEnvio: string;
  maior3dias: boolean;
  concluido: boolean;
  checklist: boolean[] | null;
  justificativa: string | null;
}

export interface Requerimento {
  id: number;
  tipo: number;
  assinatura: string | null;
  status: number;
  etapa: number;
  observacao: string | null;
  criadoEm: string;
  usuario: Usuario;
  documentos: Documento[];
  historico?: {
    id: number;
    etapaAtual: number;
    etapaDestino: number;
    observacao?: string | null;
    dataRegistro: string;
  };
}
