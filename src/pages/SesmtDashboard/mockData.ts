import type { Atestado } from "../../models/atestados";

export const CHECKLIST: string[] = [
  "Inciso I - Identificação do médico: nome e CRM/UF;",
  "Inciso II - Registro de Qualificação de Especialista (RQE), quando houver;",
  "Inciso III - Identificação do paciente: nome e número do CPF, quando houver;",
  "Inciso IV - Data de emissão;",
  "Inciso V - Assinatura qualificada do médico, quando documento eletrônico;",
  "Inciso VI - Assinatura e carimbo ou número de registro no Conselho Regional de Medicina, quando manuscrito;",
  "Inciso VII - Dados de contato profissional (telefone e/ou e-mail);",
  "Inciso VIII - Endereço profissional ou residencial do médico;",
  "Período maior de 3 dias",
];

export const MOCK_ATESTADOS: Atestado[] = [
  { id: 1, nome: "Cid 1", texto: "Atestado 1", arquivo: "arquivo1.pdf", status: "triagem", checklist: [false, false, false, false, false, false, false, false, false], aprovado: null, observacao: "", expanded: false },
  { id: 2, nome: "Cid 2", texto: "Atestado 2", arquivo: "arquivo1.pdf", status: "triagem", checklist: [false, false, false, false, false, false, false, false, false], aprovado: null, observacao: "", expanded: false },
  { id: 3, nome: "Cid 3", texto: "Atestado 3", arquivo: "arquivo1.pdf", status: "triagem", checklist: [false, false, false, false, false, false, false, false, false], aprovado: null, observacao: "", expanded: false },
  { id: 4, nome: "Cid 4", texto: "Atestado 4", arquivo: "arquivo1.pdf", status: "triagem", checklist: [false, false, false, false, false, false, false, false, false], aprovado: null, observacao: "", expanded: false },
  { id: 5, nome: "Cid 5", texto: "Atestado 5", arquivo: "arquivo1.pdf", status: "medico", checklist: [true, true, true, true, true, true, true, true, false], aprovado: null, observacao: "", expanded: false },
  { id: 6, nome: "Cid 6", texto: "Atestado 6", arquivo: "arquivo1.pdf", status: "enfermeiro", checklist: [true, true, true, true, true, true, true, true, false], aprovado: "reprovado", observacao: "Laudo incosistente.", expanded: false },
  { id: 7, nome: "Cid 7", texto: "Atestado 7", arquivo: "arquivo1.pdf", status: "ajustes", checklist: [false, false, false, false, false, false, false, false, false], aprovado: null, observacao: "Precisa reenvio.", expanded: false },
  { id: 8, nome: "Cid 8", texto: "Atestado 8", arquivo: "arquivo1.pdf", status: "finalizado", checklist: [true, true, true, true, true, true, true, true, false], aprovado: "aprovado", observacao: "", expanded: false },
  { id: 9, nome: "Cid 9", texto: "Atestado 9", arquivo: "arquivo1.pdf", status: "finalizado", checklist: [true, true, true, true, true, true, true, true, false], aprovado: "reprovado", observacao: "Assinatura inválida.", expanded: false },
  { id: 10, nome: "Cid 10", texto: "Atestado 10", arquivo: "arquivo1.pdf", status: "medico", checklist: [true, true, true, true, true, true, true, true, false], aprovado: null, observacao: "", expanded: false },
  { id: 11, nome: "Cid 11", texto: "Atestado 11", arquivo: "arquivo1.pdf", status: "medico", checklist: [true, true, true, true, true, true, true, true, false], aprovado: null, observacao: "", expanded: false },
  { id: 12, nome: "Cid 12", texto: "Atestado 12", arquivo: "arquivo1.pdf", status: "finalizado", checklist: [true, true, true, true, true, true, true, true, false], aprovado: "aprovado", observacao: "", expanded: false },
  { id: 13, nome: "Cid 13", texto: "Atestado 13", arquivo: "arquivo1.pdf", status: "finalizado", checklist: [true, true, true, true, true, true, true, true, false], aprovado: "reprovado", observacao: "Médico não autorizado.", expanded: false },
  { id: 14, nome: "Cid 14", texto: "Atestado 14", arquivo: "arquivo1.pdf", status: "finalizado", checklist: [true, true, true, true, true, true, true, true, false], aprovado: "aprovado", observacao: "", expanded: false },
  { id: 15, nome: "Cid 15", texto: "Atestado 1", arquivo: "arquivo1.pdf", status: "triagem", checklist: [false, false, false, false, false, false, false, false, false], aprovado: null, observacao: "", expanded: false },
  { id: 16, nome: "Cid 16", texto: "Atestado 16", arquivo: "arquivo1.pdf", status: "triagem", checklist: [false, false, false, false, false, false, false, false, false], aprovado: null, observacao: "", expanded: false },
  { id: 17, nome: "Cid 17", texto: "Atestado 16", arquivo: "arquivo1.pdf", status: "triagem", checklist: [false, false, false, false, false, false, false, false, false], aprovado: null, observacao: "", expanded: false },
];

