import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import type { Atestado, Perfil, Status, Aprovacao } from "../../models/atestados";
import { CHECKLIST, MOCK_ATESTADOS } from "./mockData";
import { solicitarExameMedico } from "./sesmt.service";

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

const perfilAtual: Perfil = "triagem";

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
      botoes: (tab) => (tab === 0 ? ["aprovar", "reprovar", "ajustes"] : []),
      canAprovar: (checklist, aprovado) => checklist.slice(0, -1).every((c) => c) && !aprovado,
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
      botoes: (tab) => (tab === 0 ? ["aprovar", "reprovar"] : []),
      canAprovar: () => true,
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
          <span style={{ color: "#b66400", fontWeight: 600 }}>
            Mensagem do médico: {a.observacao}
          </span>
        ) : null,
      observacaoStyle: () => ({ color: "#1277be" }),
      botoes: (tab) => (tab === 0 ? ["informar"] : []),
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

export default function useSesmtDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const config = React.useMemo(() => getConfig(perfilAtual), []);

  const [tab, setTab] = React.useState(0);
  const [busca, setBusca] = React.useState("");
  const [atestados, setAtestados] = React.useState<Atestado[]>(MOCK_ATESTADOS.map((a) => ({ ...a })));
  const [selectedDoc, setSelectedDoc] = React.useState<number | null>(null);
  const [justifyOpen, setJustifyOpen] = React.useState(false);
  const [justifyValue, setJustifyValue] = React.useState("");
  const [acaoJustificar, setAcaoJustificar] = React.useState<"reprovar" | "ajustes" | "informar" | "">("");
  const [atualId, setAtualId] = React.useState<number | null>(null);
  const [mobileDocOpen, setMobileDocOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 5;

  const filtrarAtestados = React.useCallback((): Atestado[] => {
    const statusArr = config.tabs[tab].status;
    return atestados.filter(
      (a) =>
        statusArr.includes(a.status) &&
        (a.nome.toLowerCase().includes(busca.toLowerCase()) || a.texto.toLowerCase().includes(busca.toLowerCase()))
    );
  }, [atestados, config.tabs, tab, busca]);

  const atestadosFiltrados = filtrarAtestados();
  const totalPages = Math.ceil(atestadosFiltrados.length / itemsPerPage);
  const paginatedAtestados = atestadosFiltrados.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  React.useEffect(() => {
    setPage(1);
  }, [busca, tab]);

  const getBadge = (tabIdx: number) => {
    if (!config.tabs[tabIdx].status) return 0;
    return atestados.filter((a) => config.tabs[tabIdx].status.includes(a.status)).length;
  };

  const handleCheckChange = (a: Atestado, idx: number) => {
    setAtestados((ats) =>
      ats.map((at) => (at.id === a.id ? { ...at, checklist: at.checklist.map((v, i) => (i === idx ? !v : v)) } : at))
    );
  };

  const handleExpandChecklist = (a: Atestado) => {
    setAtestados((ats) => ats.map((at) => (at.id === a.id ? { ...at, expanded: !at.expanded } : at)));
  };

  const handleAprovar = (id: number) => {
    const atestado = atestados.find((a) => a.id === id);
    if (atestado && atestado.checklist[CHECKLIST.length - 1]) {
      solicitarExameMedico(atestado);
    }
    setAtestados((ats) =>
      ats.map((a) =>
        a.id === id
          ? {
              ...a,
              aprovado: "aprovado",
              status: perfilAtual === "triagem" ? "medico" : perfilAtual === "medico" ? "finalizado" : "finalizado",
              observacao: "",
            }
          : a
      )
    );
  };

  const handleJustificar = (id: number, acao: "reprovar" | "ajustes" | "informar") => {
    setJustifyOpen(true);
    setAcaoJustificar(acao);
    setAtualId(id);
    setJustifyValue("");
  };

  const confirmarJustificar = () => {
    setJustifyOpen(false);
    setAtestados((ats) =>
      ats.map((a) =>
        a.id === atualId
          ? {
              ...a,
              aprovado: acaoJustificar === "reprovar" ? "reprovado" : a.aprovado,
              observacao: justifyValue,
              status:
                acaoJustificar === "ajustes"
                  ? "ajustes"
                  : acaoJustificar === "reprovar"
                  ? perfilAtual === "triagem"
                    ? "finalizado"
                    : perfilAtual === "medico"
                    ? "enfermeiro"
                    : "finalizado"
                  : acaoJustificar === "informar"
                  ? "finalizado"
                  : a.status,
            }
          : a
      )
    );
  };

  const docSelecionado = atestados.find((a) => a.id === selectedDoc);

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
  };
}

