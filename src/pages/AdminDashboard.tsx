import React from "react";
import {
  Box,
  Tabs,
  Tab,
  Badge,
  TextField,
  IconButton,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
} from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// Checklist base (triagem)
const CHECKLIST = [
  "Inciso I - Identificação do médico: nome e CRM/UF;",
  "Inciso II - Registro de Qualificação de Especialista (RQE), quando houver;",
  "Inciso III - Identificação do paciente: nome e número do CPF, quando houver;",
  "Inciso IV - Data de emissão;",
  "Inciso V - Assinatura qualificada do médico, quando documento eletrônico;",
  "Inciso VI - Assinatura e carimbo ou número de registro no Conselho Regional de Medicina, quando manuscrito;",
  "Inciso VII - Dados de contato profissional (telefone e/ou e-mail);",
  "Inciso VIII - Endereço profissional ou residencial do médico;",
];

// Troque aqui para "triagem" | "medico" | "enfermeiro"
const perfilAtual = "enfermeiro";

// Mock de atestados - de arquivo1.pdf a arquivo14.pdf, todos checklist colapsados inicialmente
const MOCK_ATESTADOS = [
  // Triagem pendentes
  {
    id: 1,
    nome: "Cid 1",
    texto: "Atestado 1",
    arquivo: "arquivo1.pdf",
    status: "triagem",
    checklist: [false, false, false, false, false, false, false, false],
    aprovado: null,
    observacao: "",
    expanded: false,
  },
  {
    id: 2,
    nome: "Cid 2",
    texto: "Atestado 2",
    arquivo: "arquivo2.pdf",
    status: "triagem",
    checklist: [false, false, false, false, false, false, false, false],
    aprovado: null,
    observacao: "",
    expanded: false,
  },
  {
    id: 3,
    nome: "Cid 3",
    texto: "Atestado 3",
    arquivo: "arquivo3.pdf",
    status: "triagem",
    checklist: [false, false, false, false, false, false, false, false],
    aprovado: null,
    observacao: "",
    expanded: false,
  },
  {
    id: 4,
    nome: "Cid 4",
    texto: "Atestado 4",
    arquivo: "arquivo4.pdf",
    status: "triagem",
    checklist: [false, false, false, false, false, false, false, false],
    aprovado: null,
    observacao: "",
    expanded: false,
  },
  // Em Progresso
  {
    id: 5,
    nome: "Cid 5",
    texto: "Atestado 5",
    arquivo: "arquivo5.pdf",
    status: "medico",
    checklist: [true, true, true, true, true, true, true, true],
    aprovado: null,
    observacao: "",
    expanded: false,
  },
  {
    id: 6,
    nome: "Cid 6",
    texto: "Atestado 6",
    arquivo: "arquivo6.pdf",
    status: "enfermeiro",
    checklist: [true, true, true, true, true, true, true, true],
    aprovado: "reprovado",
    observacao: "Aguardando justificativa do enfermeiro.",
    expanded: false,
  },
  // Em Ajustes
  {
    id: 7,
    nome: "Cid 7",
    texto: "Atestado 7",
    arquivo: "arquivo7.pdf",
    status: "ajustes",
    checklist: [false, false, false, false, false, false, false, false],
    aprovado: null,
    observacao: "Precisa reenvio.",
    expanded: false,
  },
  // Finalizados
  {
    id: 8,
    nome: "Cid 8",
    texto: "Atestado 8",
    arquivo: "arquivo8.pdf",
    status: "finalizado",
    checklist: [true, true, true, true, true, true, true, true],
    aprovado: "aprovado",
    observacao: "",
    expanded: false,
  },
  {
    id: 9,
    nome: "Cid 9",
    texto: "Atestado 9",
    arquivo: "arquivo9.pdf",
    status: "finalizado",
    checklist: [true, true, true, true, true, true, true, true],
    aprovado: "reprovado",
    observacao: "Assinatura inválida.",
    expanded: false,
  },
  // Médico pendentes
  {
    id: 10,
    nome: "Cid 10",
    texto: "Atestado 10",
    arquivo: "arquivo10.pdf",
    status: "medico",
    checklist: [true, true, true, true, true, true, true, true],
    aprovado: null,
    observacao: "",
    expanded: false,
  },
  {
    id: 11,
    nome: "Cid 11",
    texto: "Atestado 11",
    arquivo: "arquivo11.pdf",
    status: "medico",
    checklist: [true, true, true, true, true, true, true, true],
    aprovado: null,
    observacao: "",
    expanded: false,
  },
  // Médico finalizados
  {
    id: 12,
    nome: "Cid 12",
    texto: "Atestado 12",
    arquivo: "arquivo12.pdf",
    status: "finalizado",
    checklist: [true, true, true, true, true, true, true, true],
    aprovado: "aprovado",
    observacao: "",
    expanded: false,
  },
  {
    id: 13,
    nome: "Cid 13",
    texto: "Atestado 13",
    arquivo: "arquivo13.pdf",
    status: "finalizado",
    checklist: [true, true, true, true, true, true, true, true],
    aprovado: "reprovado",
    observacao: "Médico não autorizado.",
    expanded: false,
  },
  // Enfermeiro finalizados
  {
    id: 14,
    nome: "Cid 14",
    texto: "Atestado 14",
    arquivo: "arquivo14.pdf",
    status: "finalizado",
    checklist: [true, true, true, true, true, true, true, true],
    aprovado: "aprovado",
    observacao: "",
    expanded: false,
  },
];

function getConfig(perfil) {
  if (perfil === "triagem")
    return {
      tabs: [
        { label: "Análise Pendente", status: ["triagem"] },
        { label: "Em Progresso", status: ["medico", "enfermeiro"] },
        { label: "Em Ajustes", status: ["ajustes"] },
        { label: "Finalizados", status: ["finalizado"] },
      ],
      mostraChecklist: (tab) => tab === 0, // Só mostra checklist em pendentes
      statusLabel: (a, tab) => {
        if (tab === 2)
          return (
            <span style={{ color: "#b68400" }}>
              Aguardando reenvio do atestado pelo requerente.
            </span>
          );
        if (tab === 1) {
          if (a.status === "medico")
            return (
              <span style={{ color: "#0d68b6" }}>
                Aguardando aprovação do médico
              </span>
            );
          if (a.status === "enfermeiro")
            return (
              <span style={{ color: "#b66400" }}>
                Aguardando justificativa do enfermeiro
              </span>
            );
        }
        return null;
      },
      observacaoStyle: (tab) =>
        tab === 2 ? { color: "#b68400" } : { color: "#1277be" },
      botoes: (tab, checklist = [], aprovado = null) => {
        if (tab === 0) return ["aprovar", "reprovar", "ajustes"];
        return [];
      },
      canAprovar: (checklist, aprovado) =>
        checklist.every((c) => c) && !aprovado,
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
          <span style={{ color: "#b66400" }}>
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
          <span style={{ color: "#b66400" }}>
            Mensagem do médico: {a.observacao}
          </span>
        ) : null,
      observacaoStyle: () => ({ color: "#1277be" }),
      botoes: (tab) => (tab === 0 ? ["informar"] : []),
      canAprovar: () => false,
    };
  return { tabs: [] };
}

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const config = getConfig(perfilAtual);

  const [tab, setTab] = React.useState(0);
  const [busca, setBusca] = React.useState("");
  const [atestados, setAtestados] = React.useState(
    MOCK_ATESTADOS.map((a) => ({ ...a }))
  );
  const [selectedDoc, setSelectedDoc] = React.useState(null);
  const [justifyOpen, setJustifyOpen] = React.useState(false);
  const [justifyValue, setJustifyValue] = React.useState("");
  const [acaoJustificar, setAcaoJustificar] = React.useState("");
  const [atualId, setAtualId] = React.useState(null);

  // PDF
  const [numPages, setNumPages] = React.useState(1);
  const handlePdfLoad = (pdf) => setNumPages(pdf.numPages);

  // Filtro
  const filtrarAtestados = () => {
    const statusArr = config.tabs[tab].status;
    return atestados.filter(
      (a) =>
        statusArr.includes(a.status) &&
        (a.nome.toLowerCase().includes(busca.toLowerCase()) ||
          a.texto.toLowerCase().includes(busca.toLowerCase()))
    );
  };

  // Badge de notificação (apenas pendentes)
  const getBadge = (tabIdx) => {
    if (!config.tabs[tabIdx].status) return 0;
    return atestados.filter((a) =>
      config.tabs[tabIdx].status.includes(a.status)
    ).length;
  };

  // Checklist handler (triagem)
  const handleCheckChange = (a, idx) => {
    setAtestados((ats) =>
      ats.map((at) =>
        at.id === a.id
          ? {
              ...at,
              checklist: at.checklist.map((v, i) => (i === idx ? !v : v)),
            }
          : at
      )
    );
  };

  // Expand/Collapse handler para checklist (só triagem pendente)
  const handleExpandChecklist = (a) => {
    setAtestados((ats) =>
      ats.map((at) => (at.id === a.id ? { ...at, expanded: !at.expanded } : at))
    );
  };

  // Aprovar
  const handleAprovar = (id) => {
    setAtestados((ats) =>
      ats.map((a) =>
        a.id === id
          ? {
              ...a,
              aprovado: "aprovado",
              status:
                perfilAtual === "triagem"
                  ? "medico"
                  : perfilAtual === "medico"
                  ? "finalizado"
                  : "finalizado",
              observacao: "",
            }
          : a
      )
    );
  };

  // Justificar (reprovar, ajustes, informar)
  const handleJustificar = (id, acao) => {
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
              aprovado:
                acaoJustificar === "reprovar" ? "reprovado" : a.aprovado,
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

  // Docs
  const docSelecionado = atestados.find((a) => a.id === selectedDoc);

  // Render
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#f8f8f8",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "center",
        p: 0,
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 3,
          width: isMobile ? "100vw" : "90vw",
          maxWidth: 1450,
          height: isMobile ? "100%" : "80vh",
          minHeight: 620,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stretch",
          p: 0,
          minWidth: isMobile ? "100vw" : 0,
        }}
      >
        {/* ESQUERDA */}
        <Box
          sx={{
            width: isMobile ? "100%" : "55%",
            minWidth: isMobile ? 0 : 370,
            borderRight: isMobile ? "none" : "1.5px solid #e0e0e0",
            borderBottom: isMobile ? "1.5px solid #e0e0e0" : "none",
            display: "flex",
            flexDirection: "column",
            p: isMobile ? "20px 0 0 0" : "38px 0 0 0",
            maxHeight: isMobile ? "none" : "100%",
          }}
        >
          <Box
            sx={{
              px: isMobile ? 2 : 5,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                mb: 2,
                ".MuiTabs-flexContainer": {
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? 2 : 0,
                },
              }}
              orientation="horizontal"
              variant={isMobile ? "scrollable" : "standard"}
            >
              {config.tabs.map((t, idx) => (
                <Tab
                  key={t.label}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontWeight: "bold" }}>{t.label}</span>
                      {idx === 0 && (
                        <Badge
                          badgeContent={getBadge(idx)}
                          color="error"
                          sx={{
                            ml: 2,
                            mb: "0px",
                            "& .MuiBadge-badge": { top: -10, right: 2 },
                          }}
                        />
                      )}
                    </Box>
                  }
                  sx={{ textTransform: "none" }}
                />
              ))}
            </Tabs>
            <Divider sx={{ mb: 2 }} />

            <TextField
              variant="outlined"
              placeholder="Pesquisa"
              size="small"
              sx={{ width: "100%", mb: 2 }}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton size="small" onClick={() => setBusca("")}>
                    ×
                  </IconButton>
                ),
              }}
            />

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                pr: isMobile ? 0 : 1,
              }}
            >
              <Stack spacing={2}>
                {filtrarAtestados().length === 0 && (
                  <Typography
                    sx={{ mt: 5, textAlign: "center", color: "#bbb" }}
                  >
                    Nenhum resultado encontrado.
                  </Typography>
                )}
                {filtrarAtestados().map((a) => {
                  const checklistPreenchido = a.checklist?.every?.((v) => v);

                  // Ícone de aprovado/reprovado para finalizados
                  let statusIcon = null;
                  if (config.tabs[tab].label === "Finalizados") {
                    if (a.aprovado === "aprovado")
                      statusIcon = (
                        <CheckCircleIcon
                          sx={{
                            color: "green",
                            mr: 1,
                            fontSize: 28,
                            verticalAlign: "middle",
                          }}
                        />
                      );
                    else if (a.aprovado === "reprovado")
                      statusIcon = (
                        <CancelIcon
                          sx={{
                            color: "red",
                            mr: 1,
                            fontSize: 28,
                            verticalAlign: "middle",
                          }}
                        />
                      );
                  }

                  // É o checklist expansível da triagem/pendentes
                  const showChecklistToggle =
                    perfilAtual === "triagem" && config.mostraChecklist(tab);

                  return (
                    <Card
                      key={a.id}
                      variant="outlined"
                      sx={{
                        boxShadow: 2,
                        borderRadius: 3,
                        overflow: "hidden",
                        minWidth: 310,
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Avatar
                          sx={{ width: 54, height: 54, mr: 2 }}
                          src={
                            a.foto ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              a.nome
                            )}&background=ccc&color=333`
                          }
                          alt={a.nome}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            align="left"
                            sx={{ fontWeight: "bold" }}
                          >
                            {statusIcon}
                            {a.nome}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {a.texto}
                          </Typography>
                          {/* Status/etapa */}
                          {config.statusLabel(a, tab)}
                          {/* Botão expandir checklist (só triagem pendente) */}
                          {showChecklistToggle && (
                            <Button
                              onClick={() => handleExpandChecklist(a)}
                              size="small"
                              variant="text"
                              sx={{
                                pl: 0,
                                mb: 1,
                                color: "#1277be",
                                fontWeight: 600,
                              }}
                              endIcon={
                                a.expanded ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              }
                            >
                              {a.expanded
                                ? "Ocultar Checklist"
                                : "Ver Checklist"}
                            </Button>
                          )}
                          {/* Checklist */}
                          {showChecklistToggle && a.expanded && (
                            <Box
                              sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                mb: 1,
                                bgcolor: "#fafafa",
                              }}
                            >
                              {CHECKLIST.map((txt, i) => (
                                <Box
                                  key={i}
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Checkbox
                                    checked={!!a.checklist[i]}
                                    disabled={!!a.aprovado}
                                    onChange={() => handleCheckChange(a, i)}
                                  />
                                  <Typography variant="body2">{txt}</Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                          {/* Em Ajustes */}
                          {config.tabs[tab].label === "Em Ajustes" && (
                            <>
                              <Typography
                                sx={{
                                  color: "#b68400",
                                  fontWeight: 600,
                                  mb: 0.5,
                                }}
                              >
                                Aguardando reenvio do atestado pelo requerente.
                              </Typography>
                              <Typography sx={{ color: "#b68400" }}>
                                Justificativa: {a.observacao}
                              </Typography>
                            </>
                          )}
                          {/* Mensagem final de aprovado/reprovado ou checklist */}
                          {config.tabs[tab].label === "Finalizados" &&
                            a.aprovado === "aprovado" && (
                              <Typography
                                sx={{ color: "#18b46f", fontWeight: 600 }}
                              >
                                Atestado aprovado
                              </Typography>
                            )}
                          {config.tabs[tab].label === "Finalizados" &&
                            a.aprovado === "reprovado" && (
                              <Typography
                                sx={{ color: "#e22", fontWeight: 600 }}
                              >
                                Atestado reprovado
                              </Typography>
                            )}
                          {/* Observação em finalizados e reprovações */}
                          {config.tabs[tab].label === "Finalizados" &&
                            a.observacao && (
                              <Typography sx={{ color: "#1277be", mt: 0.5 }}>
                                Justificativa: {a.observacao}
                              </Typography>
                            )}
                          {/* Checklist preenchido/Não preenchido */}
                          {config.tabs[tab].label === "Análise Pendente" &&
                            perfilAtual === "triagem" && (
                              <Typography
                                sx={{
                                  color: checklistPreenchido
                                    ? "#18b46f"
                                    : "#e6a700",
                                  fontWeight: 600,
                                }}
                              >
                                {a.aprovado === "aprovado"
                                  ? "Atestado aprovado"
                                  : a.aprovado === "reprovado"
                                  ? "Atestado reprovado"
                                  : checklistPreenchido
                                  ? "Checklist preenchido"
                                  : "Checklist não preenchido"}
                              </Typography>
                            )}
                          {/* Observação em em progresso */}
                          {config.tabs[tab].label === "Em Progresso" &&
                            a.observacao && (
                              <Typography sx={{ color: "#1277be", mt: 0.5 }}>
                                Justificativa: {a.observacao}
                              </Typography>
                            )}

                          {/* Botões */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              flexWrap: isMobile ? "wrap" : "nowrap",
                              mt: 1,
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setSelectedDoc(a.id)}
                              sx={{ borderRadius: 2 }}
                            >
                              VER DOCUMENTO
                            </Button>
                            {/* Demais botões só se tab permitir */}
                            {config
                              .botoes(tab, a.checklist, a.aprovado)
                              .includes("aprovar") && (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                sx={{ borderRadius: 2 }}
                                disabled={
                                  !config.canAprovar(a.checklist, a.aprovado)
                                }
                                onClick={() => handleAprovar(a.id)}
                              >
                                Aprovar
                              </Button>
                            )}
                            {config
                              .botoes(tab, a.checklist, a.aprovado)
                              .includes("reprovar") && (
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                sx={{ borderRadius: 2 }}
                                disabled={!!a.aprovado}
                                onClick={() =>
                                  handleJustificar(a.id, "reprovar")
                                }
                              >
                                Reprovar
                              </Button>
                            )}
                            {config
                              .botoes(tab, a.checklist, a.aprovado)
                              .includes("ajustes") && (
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  borderRadius: 2,
                                  bgcolor: "#ffcc00",
                                  color: "#222",
                                }}
                                disabled={!!a.aprovado}
                                onClick={() =>
                                  handleJustificar(a.id, "ajustes")
                                }
                              >
                                Enviar para Ajustes
                              </Button>
                            )}
                            {config
                              .botoes(tab, a.checklist, a.aprovado)
                              .includes("informar") && (
                              <Button
                                variant="contained"
                                size="small"
                                sx={{ borderRadius: 2, bgcolor: "#1277be" }}
                                onClick={() =>
                                  handleJustificar(a.id, "informar")
                                }
                              >
                                Informar usuário
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Box>
        {/* DIREITA */}
        <Box
          sx={{
            width: isMobile ? "100%" : "45%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            px: isMobile ? 2 : 4,
            pt: isMobile ? 2 : 5,
            bgcolor: "#f4f4f4",
            minHeight: isMobile ? 260 : "auto",
            flex: isMobile ? "none" : undefined,
          }}
        >
          <Box sx={{ width: "100%", display: "flex", alignItems: "center", mb: 1, ml: 1 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 18,
                color: "#111",
                flex: 1,
              }}
            >
              {docSelecionado ? docSelecionado.arquivo : "Nome do arquivo.pdf"}
            </Typography>
            {docSelecionado && (
              <IconButton
                onClick={() => window.open(`/${docSelecionado.arquivo}`, "_blank")}
                title="Abrir PDF em nova aba"
              >
                <FullscreenIcon />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              width: "100%",
              flex: 1,
              bgcolor: "#d6d6d6",
              border: "2px solid #7db2ff",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: isMobile ? 180 : 350,
              mt: 2,
              mx: "auto",
              overflow: "auto",
            }}
          >
            {docSelecionado ? (
              <Document
                file={`/${docSelecionado.arquivo}`}
                loading="Carregando PDF..."
                error={<span>Não foi possível exibir o PDF.</span>}
                onLoadSuccess={handlePdfLoad}
              >
                <Page
                  pageNumber={1}
                  width={isMobile ? undefined : 500}
                  height={isMobile ? 330 : undefined}
                />
              </Document>
            ) : (
              "DOCUMENTO"
            )}
          </Box>
        </Box>
      </Box>

      {/* Pop up de justificar */}
      <Dialog
        open={justifyOpen}
        onClose={() => setJustifyOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {acaoJustificar === "reprovar"
            ? "Justificar Reprovação"
            : acaoJustificar === "ajustes"
            ? "Enviar para Ajustes"
            : "Justificativa ao Usuário"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {acaoJustificar === "reprovar" &&
              "Digite a justificativa para reprovação do atestado. Esta mensagem será enviada ao usuário."}
            {acaoJustificar === "ajustes" &&
              "Digite a mensagem para o usuário ajustar e reenviar o atestado. Esta mensagem será enviada ao usuário."}
            {acaoJustificar === "informar" &&
              "Digite a justificativa que será enviada ao usuário sobre o indeferimento do atestado."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Mensagem"
            type="text"
            fullWidth
            multiline
            minRows={2}
            value={justifyValue}
            onChange={(e) => setJustifyValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJustifyOpen(false)}>Cancelar</Button>
          <Button
            onClick={confirmarJustificar}
            variant="contained"
            color={
              acaoJustificar === "reprovar"
                ? "error"
                : acaoJustificar === "ajustes"
                ? "warning"
                : "primary"
            }
            disabled={justifyValue.trim().length === 0}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
