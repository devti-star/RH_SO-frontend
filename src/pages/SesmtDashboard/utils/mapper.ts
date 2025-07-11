import type { Aprovacao, Atestado, Status } from "../../../models/atestados";
import type { Requerimento } from "../../../models/requerimento.interface";

// Função auxiliar para converter checklist do backend em array de booleanos para o frontend
function checklistToBooleanArray(checklist: any): boolean[] {
  if (!checklist || !Array.isArray(checklist) || checklist.length === 0) {
    return [false, false, false, false, false, false, false, false, false];
  }
  const c = checklist[0];
  return [
    c.incisoI ?? false,
    c.incisoII ?? false,
    c.incisoIII ?? false,
    c.incisoIV ?? false,
    c.incisoV ?? false,
    c.incisoVI ?? false,
    c.incisoVII ?? false,
    c.incisoVIII ?? false,
    c.periodoMaiorQue3Dias ?? false,
  ];
}

// Mapeia a etapa numérica do backend para a string de status do frontend
function etapaToString(etapa: number): Status {
  switch (etapa) {
    case 0: return "triagem";
    case 1: return "medico";
    case 2: return "enfermeiro";
    case 3: return "ajustes";
    default: return "triagem";
  }
}

// Mapeia o status numérico do backend para o texto de aprovação
function aprovadoStatus(req: any): Aprovacao {
  if (req.status === 1) return "aprovado";
  if (req.status === 0) return "reprovado";
  return null;
}

// NOVO: Função para determinar status de exibição do card baseado em concluido, etapa e status
function mapStatusToAba(req: Requerimento, doc: any): Status {
  if (doc.concluido === true) return "finalizado";

  // -- Fluxo de exibição de acordo com o processo
  // 1. Se triagem reprovou, deve ir para finalizado (mas só finalize quando realmente finalizado)
  // 2. Se médico aprovou, finalize
  // 3. Se médico reprovou e enfermeiro já entrou em contato, finalize
  // 4. Caso contrário, siga o fluxo por etapa

  // -- Você pode personalizar ainda mais se quiser outras regras específicas aqui!
  return etapaToString(req.etapa);
}

export function mapRequerimentosParaAtestados(requerimentos: Requerimento[]): Atestado[] {
  return requerimentos.flatMap(req => {
    return req.documentos.map(doc => ({
      id: doc.id,
      requerimentoId: req.id,
      nome: req.usuario?.nomeCompleto ?? "N/A",
      texto: req.observacao ?? "",
      arquivo: doc.caminho,
      status: mapStatusToAba(req, doc),   // <-- Aqui usa a função nova!
      checklist: checklistToBooleanArray(doc.checklist),
      aprovado: aprovadoStatus(req),
      observacao: doc.justificativa ?? "",
      expanded: false,
      foto: req.usuario?.foto ?? undefined,
      concluido: doc.concluido ?? false,  // Adicione se quiser usar no front também
    }));
  });
}
