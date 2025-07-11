import type { Atestado } from "../../models/atestados";
import type { Requerimento } from "../../models/requerimento.interface";
import { ApiService } from "../../interceptors/Api/api.intercept";
import type { UpdateRequerimentoPayload } from "../../models/update-requerimento.interface";

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
  const resp = await api.patch(`/requerimentos/${id}`, update);
  if (resp.status !== 200) throw new Error("Erro ao atualizar requerimento");
  return resp.data;
}
