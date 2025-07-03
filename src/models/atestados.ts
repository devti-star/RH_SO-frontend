export type Perfil = "triagem" | "medico" | "enfermeiro";
export type Status = Perfil | "ajustes" | "finalizado";
export type Aprovacao = "aprovado" | "reprovado" | null;

export interface Atestado {
  id: number;
  nome: string;
  texto: string;
  arquivo: string;
  status: Status;
  checklist: boolean[];
  aprovado: Aprovacao;
  observacao: string;
  expanded: boolean;
  foto?: string;
}
