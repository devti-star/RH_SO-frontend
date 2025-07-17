export interface Historico {
    id: number;
    etapaAtual: number;
    etapaDestino: number;
    observacao?: string;
    dataRegistro: Date;
}