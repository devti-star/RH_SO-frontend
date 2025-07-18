import type { Atestado } from "../../models/atestados";
import type { Requerimento } from "../../models/requerimento.interface";
import { ApiService } from "../../interceptors/Api/api.intercept";
import type { UpdateRequerimentoPayload } from "../../models/update-requerimento.interface";
import type { Historico } from "../../models/ultimo-requerimento";

export async function solicitarExameMedico(atestado: Atestado) {
  const api = ApiService.getInstance();
  await api.post("/api/solicitar-exame-medico", { atestadoId: atestado.id });
}

export async function getRequerimentos(): Promise<Requerimento[]> {
  const api = ApiService.getInstance();
  const resp = await api.get("/requerimentos");
  if (resp.status !== 200) throw new Error("Erro ao buscar requerimentos");
  return resp.data;
}

export async function atualizarRequerimento(id: number, update: UpdateRequerimentoPayload) {
  const api = ApiService.getInstance();
  console.log("valor de update: ", JSON.stringify(update));
  const maior3dias: boolean = update.documentos?.[0]?.checklist[0].periodoMaiorQue3Dias ?? false;
  delete update.documentos?.[0]?.checklist[0].periodoMaiorQue3Dias;
  console.log("valor do campo maior3dias: ", maior3dias);
  if (update.documentos?.[0]) {
    update.documentos[0].maior3dias = maior3dias;
  }
  const resp = await api.patch(`/requerimentos/${id}`, update);
  if (resp.status !== 200) throw new Error("Erro ao atualizar requerimento");
  return resp.data;
}

export async function getGerarRequerimentoPdf(idRequerimento: number): Promise<Blob> {
  const api = ApiService.getInstance();
  const resp = await api.get(`/relatorios-atestado/${idRequerimento}`, { responseType: "blob" });
  if (resp.status !== 200) throw new Error("Erro ao gerar PDF do requerimento");
  return resp.data as Blob;
}

export async function getUltimoHistorico(idRequerimento: number): Promise<Historico> {
  const api = ApiService.getInstance();
  const resp = await api.get(`/historicos/last/${idRequerimento}`);
  if (resp.status !== 200) throw new Error("Erro ao buscar histórico do requerimento");
  return resp.data;
}
