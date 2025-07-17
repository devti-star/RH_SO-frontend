import React, { useEffect, useState, useCallback } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import type { Atestado, Perfil, Status, Aprovacao } from "../../models/atestados";
import { CHECKLIST } from "./mockData";
import { solicitarExameMedico, getRequerimentos, atualizarRequerimento, getGerarRequerimentoPdf } from "./sesmt.service";
import { mapRequerimentosParaAtestados } from "./utils/mapper";
import { AuthService } from "../../auth/components/form/auth.service";
import { Roles } from "../../models/roles";
import type { UpdateRequerimentoPayload } from "../../models/update-requerimento.interface";
import { useSnackbarStore } from "../../shared/useSnackbar";

// -- Auxiliares de perfil e configuração
function mapRoleToPerfil(role: number): Perfil {
  switch (role) {
    case Roles.TRIAGEM: return "triagem";
    case Roles.MEDICO: return "medico";
    case Roles.ENFERMEIRO: return "enfermeiro";
    default: return "triagem";
  }
}

const usuario = AuthService.getInstance().getUserStorage();
let perfilAtual: Perfil;
if (usuario) {
  perfilAtual = mapRoleToPerfil(usuario.role);
}

export interface TabItem {
  label: string;
  status: Status[];
}
export interface Config {
  tabs: TabItem[];
  mostraChecklist: (tab: number) => boolean;
  statusLabel: (a: Atestado, tab: number) => React.ReactNode;
  observacaoStyle: (tab: number) => React.CSSProperties;
  botoes: (tab: number, checklist?: boolean[], aprovado?: Aprovacao) => string[];
  canAprovar: (checklist: boolean[], aprovado: Aprovacao) => boolean;
}
function getConfig(perfil: Perfil): Config {
  if (perfil === "triagem")
    return {
      tabs: [
        { label: "Análise Pendente", status: ["triagem"] },
        { label: "Em Progresso", status: ["medico", "enfermeiro"] },
        { label: "Em Ajustes", status: ["ajustes"] },
        { label: "Finalizados", status: ["finalizado"] },
      ],
      mostraChecklist: (tab) => tab === 0,
      statusLabel: (a, tab) => {
        if (tab === 2)
          return (
            <span style={{ color: "#b68400", fontWeight: 600 }}>
              Aguardando reenvio do atestado pelo requerente.
            </span>
          );
        if (tab === 1) {
          if (a.status === "medico")
            return (
              <span style={{ color: "#0d68b6", fontWeight: 600 }}>
                Aguardando aprovação do médico
              </span>
            );
          if (a.status === "enfermeiro")
            return (
              <span style={{ color: "#b66400", fontWeight: 600 }}>
                Aguardando justificativa do enfermeiro
              </span>
            );
        }
        return null;
      },
      observacaoStyle: (tab) => (tab === 2 ? { color: "#b68400" } : { color: "#1277be" }),
      botoes: (tab, checklist, aprovado) => (tab === 0 ? ["aprovar", "reprovar", "ajustes"] : []),
      canAprovar: (checklist, aprovado) => {
        let ok = !aprovado;
        let pular = 1;
        for (let i = 0; i < checklist.length-1; i++) {
          if (pular === i){
            pular = pular*4;
            continue;
          }
          ok=ok && checklist[i];
        }
        return ok;
      }
  };
  if (perfil === "medico")
  return {
    tabs: [
      { label: "Análise Pendente", status: ["medico"] },
      { label: "Em Progresso", status: ["enfermeiro"] },
      { label: "Finalizados", status: ["finalizado"] },
    ],
    mostraChecklist: () => false,
    statusLabel: (a, tab) =>
      tab === 1 ? (
        <span style={{ color: "#b66400", fontWeight: 600 }}>
          Aguardando justificativa do enfermeiro
        </span>
      ) : null,
    observacaoStyle: () => ({ color: "#1277be" }),
    botoes: (tab, checklist, aprovado) => (tab === 0 ? ["aprovar", "reprovar"] : []),
    canAprovar: () => true, // Médico pode sempre aprovar ou reprovar
  };
  if (perfil === "enfermeiro")
    return {
      tabs: [
        { label: "Análise Pendente", status: ["enfermeiro"] },
        { label: "Finalizados", status: ["finalizado"] },
      ],
      mostraChecklist: () => false,
      statusLabel: (a, tab) =>
        tab === 0 ? (
          <span style={{ color: "#9c7102", fontWeight: 600 }}>
            Mensagem do médico: {a.observacao}
          </span>
        ) : null,
      observacaoStyle: () => ({ color: "#1277be" }),
      botoes: (tab, checklist, aprovado) => (tab === 0 ? ["informar"] : []),
      canAprovar: () => false,
    };
  return {
    tabs: [],
    mostraChecklist: () => false,
    statusLabel: () => null,
    observacaoStyle: () => ({}),
    botoes: () => [],
    canAprovar: () => false,
  };
}

// -- HOOK PRINCIPAL
export default function useSesmtDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const config = getConfig(perfilAtual);

  const [tab, setTab] = useState(0);
  const [busca, setBusca] = useState("");
  const [atestados, setAtestados] = useState<Atestado[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [justifyOpen, setJustifyOpen] = useState(false);
  const [justifyValue, setJustifyValue] = useState("");
  const [acaoJustificar, setAcaoJustificar] = useState<"reprovar" | "ajustes" | "informar" | "">("");
  const [atualId, setAtualId] = useState<number | null>(null);
  const [mobileDocOpen, setMobileDocOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);

  // Carrega atestados no início e após cada atualização relevante
  const carregarAtestados = useCallback(async () => {
    setLoading(true);
    try {
      const reqs = await getRequerimentos();
      setAtestados(mapRequerimentosParaAtestados(reqs));
    } catch (e) {
      console.error("Erro ao buscar dados do backend:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAtestados();
  }, [carregarAtestados]);

  // Filtro/tab/paginação
  const filtrarAtestados = useCallback((): Atestado[] => {
    const statusArr = config.tabs[tab]?.status ?? [];
    return atestados.filter(
      (a) =>
        statusArr.includes(a.status) &&
        (a.nome.toLowerCase().includes(busca.toLowerCase()) ||
          a.texto.toLowerCase().includes(busca.toLowerCase()))
    );
  }, [atestados, config.tabs, tab, busca]);

  const atestadosFiltrados = filtrarAtestados();
  const totalPages = Math.ceil(atestadosFiltrados.length / itemsPerPage);
  const paginatedAtestados = atestadosFiltrados.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [busca, tab]);

  const getBadge = (tabIdx: number) => {
    if (!config.tabs[tabIdx]?.status) return 0;
    return atestados.filter((a) => config.tabs[tabIdx].status.includes(a.status)).length;
  };

  // TRIAGEM: pode editar checklist; Médico/Enfermeiro não podem!
  const handleCheckChange = async (a: Atestado, idx: number) => {
    if (perfilAtual !== "triagem") return; // só TRIAGEM pode alterar
    const novoChecklist = a.checklist.map((v, i) => (i === idx ? !v : v));
    setAtestados(ats =>
      ats.map(at =>
        at.id === a.id ? { ...at, checklist: novoChecklist } : at
      )
    );

    // Salva no backend
    const checklistObj = [{
      incisoI: novoChecklist[0] ?? false,
      incisoII: novoChecklist[1] ?? false,
      incisoIII: novoChecklist[2] ?? false,
      incisoIV: novoChecklist[3] ?? false,
      incisoV: novoChecklist[4] ?? false,
      incisoVI: novoChecklist[5] ?? false,
      incisoVII: novoChecklist[6] ?? false,
      incisoVIII: novoChecklist[7] ?? false,
      periodoMaiorQue3Dias: novoChecklist[8] ?? false,
    }];
    try {
      await atualizarRequerimento(a.requerimentoId, {
        documentos: [{ id: a.id, checklist: checklistObj }]
      });
    } catch (err) {
      console.error("Erro ao atualizar checklist:", err);
    }
  };

  const handleExpandChecklist = (a: Atestado) => {
    setAtestados((ats) => ats.map((at) => (at.id === a.id ? { ...at, expanded: !at.expanded } : at)));
  };

  // Aprovação principal (fluxo por perfil)
  const handleAprovar = async (id: number, qtdDias?: string) => {
    const atestado = atestados.find((a) => a.id === id);
    if (!atestado) return;

    

    const checklistObj = [
      {
        incisoI: atestado.checklist[0] ?? false,
        incisoII: atestado.checklist[1] ?? false,
        incisoIII: atestado.checklist[2] ?? false,
        incisoIV: atestado.checklist[3] ?? false,
        incisoV: atestado.checklist[4] ?? false,
        incisoVI: atestado.checklist[5] ?? false,
        incisoVII: atestado.checklist[6] ?? false,
        incisoVIII: atestado.checklist[7] ?? false,
        periodoMaiorQue3Dias: atestado.checklist[8] ?? false,
      }
    ];

    let novoStatus: number = 2;
    let novaEtapa: number = 0;
    let concluido: boolean | undefined = undefined;
    let assinatura: string | undefined = undefined;

    if (perfilAtual === "triagem") {
      novoStatus = 2; // EM_PROCESSO
      novaEtapa = 1;  // MÉDICO
    } else if (perfilAtual === "medico") {
      novoStatus = 1; // DEFERIDO
      novaEtapa = 1;
      concluido = true; // Finaliza
      assinatura = `Dr. ${usuario?.nomeCompleto}<br>CRM: ${usuario?.crm}`;
      
    }

    try {
      await atualizarRequerimento(atestado.requerimentoId, {
        status: novoStatus,
        etapa: novaEtapa,
        documentos: [
          {
            id: atestado.id,
            checklist: checklistObj,
            ...(concluido !== undefined && { concluido }),
            ...(qtdDias !== undefined && { qtdDias }) 
          }
        ],
        ...(assinatura !== undefined && { assinatura })
      });
      await carregarAtestados();
    } catch (err) {
      console.error("Erro ao aprovar:", err);
    }
  };

  // Ao clicar "Reprovar", "Ajustes" ou "Informar usuário"
  const handleJustificar = (id: number, acao: "reprovar" | "ajustes" | "informar") => {
    setJustifyOpen(true);
    setAcaoJustificar(acao);
    setAtualId(id);
    setJustifyValue("");
  };

  const confirmarJustificar = async () => {
    setJustifyOpen(false);
    const atestado = atestados.find((a) => a.id === atualId);
    if (!atestado) return;

    const checklistObj = [
      {
        incisoI: atestado.checklist[0] ?? false,
        incisoII: atestado.checklist[1] ?? false,
        incisoIII: atestado.checklist[2] ?? false,
        incisoIV: atestado.checklist[3] ?? false,
        incisoV: atestado.checklist[4] ?? false,
        incisoVI: atestado.checklist[5] ?? false,
        incisoVII: atestado.checklist[6] ?? false,
        incisoVIII: atestado.checklist[7] ?? false,
        periodoMaiorQue3Dias: atestado.checklist[8] ?? false,
      }
    ];

    let novoStatus: number = 2;
    let novaEtapa: number = 0;
    let concluido: boolean | undefined = undefined;

    if (perfilAtual === "triagem") {
      if (acaoJustificar === "reprovar") {
        novoStatus = 0; // INDEFERIDO
        novaEtapa = 0;  // TRIAGEM
        concluido = true; // Finaliza
      } else if (acaoJustificar === "ajustes") {
        novoStatus = 2; // EM_PROCESSO
        novaEtapa = 3;  // AJUSTE
      }
    } else if (perfilAtual === "medico") {
      if (acaoJustificar === "reprovar") {
        novoStatus = 0; // INDEFERIDO
        novaEtapa = 2;  // ENFERMEIRO
        // Não finaliza ainda!
      }
    } else if (perfilAtual === "enfermeiro") {
      novoStatus = 0;
      novaEtapa = 2;
      concluido = true; // Conclui após enfermeiro informar usuário
    }

    await atualizarRequerimento(atestado.requerimentoId, {
      status: novoStatus,
      etapa: novaEtapa,
      documentos: [
        {
          id: atestado.id,
          checklist: checklistObj,
          justificativa: justifyValue,
          ...(concluido !== undefined && { concluido })
        }
      ]
    });
    await carregarAtestados();
  };

  const docSelecionado = atestados.find((a) => a.id === selectedDoc);
 
  const handleGerarDocumento = async (id: number) => {
    try {
      // Faz a requisição e recebe o PDF como blob
      const documentoBlob = await getGerarRequerimentoPdf(id);

      // Cria uma URL temporária para o blob
      const blobUrl = URL.createObjectURL(documentoBlob);

      // Abre em uma nova aba
      window.open(blobUrl, '_blank');

      // (Opcional) liberar o objeto depois de um tempo para evitar vazamento de memória
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (err) {
      // Mostra erro para o usuário, se desejar
      const { showSnackbar } = useSnackbarStore.getState();
        showSnackbar(`Erro ao gerar pdf`, "error");
        console.log(err);
      }
  }

  return {
    theme,
    isMobile,
    config,
    tab,
    setTab,
    busca,
    setBusca,
    page,
    setPage,
    totalPages,
    paginatedAtestados,
    getBadge,
    handleCheckChange,
    handleExpandChecklist,
    handleAprovar,
    handleJustificar,
    confirmarJustificar,
    selectedDoc,
    setSelectedDoc,
    mobileDocOpen,
    setMobileDocOpen,
    justifyOpen,
    setJustifyOpen,
    justifyValue,
    setJustifyValue,
    acaoJustificar,
    docSelecionado,
    loading,
    handleGerarDocumento
  };
}
