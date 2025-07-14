// models/update-requerimento.interface.ts
export interface UpdateRequerimentoPayload {
  status?: number;
  etapa?: number;
  documentos?: {
    id: number;
    checklist?: any;
    justificativa?: string;
    maior3dias?: boolean;
  }[];
}
