import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Checkbox,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type { Atestado } from "../../../models/atestados";
import type { Config } from "../useSesmtDashboard";
import { CHECKLIST } from "../mockData";

interface Props {
  atestado: Atestado;
  tab: number;
  config: Config;
  isMobile: boolean;
  onExpandChecklist: (a: Atestado) => void;
  onCheckChange: (a: Atestado, idx: number) => void;
  onAprovar: (id: number) => void;
  onJustificar: (id: number, acao: "reprovar" | "ajustes" | "informar") => void;
  setSelectedDoc: (id: number) => void;
  setMobileDocOpen: (open: boolean) => void;
}

export default function AtestadoCard({
  atestado: a,
  tab,
  config,
  isMobile,
  onExpandChecklist,
  onCheckChange,
  onAprovar,
  onJustificar,
  setSelectedDoc,
  setMobileDocOpen,
}: Props) {
  const checklistPreenchido = a.checklist?.slice(0, -1)?.every?.((v) => v);
  let statusIcon: React.ReactNode = null;
  if (config.tabs[tab].label === "Finalizados") {
    if (a.aprovado === "aprovado")
      statusIcon = <CheckCircleIcon sx={{ color: "green", mr: 1, fontSize: 28, verticalAlign: "middle" }} />;
    else if (a.aprovado === "reprovado")
      statusIcon = <CancelIcon sx={{ color: "red", mr: 1, fontSize: 28, verticalAlign: "middle" }} />;
  }

  const showChecklistToggle = config.mostraChecklist(tab);

  return (
    <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 3, overflow: "hidden", minWidth: 310 }}>
      <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Avatar
          sx={{ width: 54, height: 54, mr: 2 }}
          src={
            a.foto ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(a.nome)}&background=ccc&color=333`
          }
          alt={a.nome}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" align="left" sx={{ fontWeight: "bold" }}>
            {statusIcon}
            {a.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {a.texto}
          </Typography>
          {config.statusLabel(a, tab)}
          {showChecklistToggle && (
            <Button
              onClick={() => onExpandChecklist(a)}
              size="small"
              variant="text"
              sx={{ pl: 0, mb: 1, color: "#1277be", fontWeight: 600 }}
              endIcon={a.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {a.expanded ? "Ocultar Checklist" : "Ver Checklist"}
            </Button>
          )}
          {showChecklistToggle && a.expanded && (
            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 2, px: 2, py: 1, mb: 1, bgcolor: "#fafafa" }}>
              {CHECKLIST.map((txt, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox checked={!!a.checklist[i]} disabled={!!a.aprovado} onChange={() => onCheckChange(a, i)} />
                  <Typography variant="body2">{txt}</Typography>
                </Box>
              ))}
            </Box>
          )}
          {config.tabs[tab].label === "Em Ajustes" && (
            <Typography sx={{ color: "#b68400", fontWeight: 600 }}>Observação: {a.observacao}</Typography>
          )}
          {config.tabs[tab].label === "Finalizados" && a.aprovado === "aprovado" && (
            <Typography sx={{ color: "#18b46f", fontWeight: 600 }}>Atestado aprovado</Typography>
          )}
          {config.tabs[tab].label === "Finalizados" && a.aprovado === "reprovado" && (
            <Typography sx={{ color: "#e22", fontWeight: 600 }}>Atestado reprovado</Typography>
          )}
          {config.tabs[tab].label === "Finalizados" && a.observacao && (
            <Typography sx={{ color: "#1277be", mt: 0.5, fontWeight: 600 }}>
              Justificativa: {a.observacao}
            </Typography>
          )}
          {config.tabs[tab].label === "Análise Pendente" && (
            <Typography sx={{ color: checklistPreenchido ? "#18b46f" : "#e6a700", fontWeight: 600 }}>
              {a.aprovado === "aprovado"
                ? "Atestado aprovado"
                : a.aprovado === "reprovado"
                ? "Atestado reprovado"
                : checklistPreenchido
                ? "Checklist preenchido"
                : "Checklist não preenchido"}
            </Typography>
          )}
          {config.tabs[tab].label === "Em Progresso" && a.observacao && (
            <Typography sx={{ color: "#1277be", mt: 0.5, fontWeight: 600 }}>
              Observação: {a.observacao}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mt: 1,
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedDoc(a.id);
                if (isMobile) setMobileDocOpen(true);
              }}
              sx={{ borderRadius: 2, minHeight: 38, maxHeight: 38, minWidth: 120, flexShrink: 0, flexGrow: 0, px: 2 }}
            >
              VER DOCUMENTO
            </Button>
            {config.botoes(tab, a.checklist, a.aprovado).includes("aprovar") && (
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{ borderRadius: 2, minHeight: 38, maxHeight: 38, minWidth: 120, flexShrink: 0, flexGrow: 0, px: 2 }}
                disabled={!config.canAprovar(a.checklist, a.aprovado)}
                onClick={() => onAprovar(a.id)}
              >
                Aprovar
              </Button>
            )}
            {config.botoes(tab, a.checklist, a.aprovado).includes("reprovar") && (
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{ borderRadius: 2, minHeight: 38, maxHeight: 38, minWidth: 120, flexShrink: 0, flexGrow: 0, px: 2 }}
                disabled={!!a.aprovado}
                onClick={() => onJustificar(a.id, "reprovar")}
              >
                Reprovar
              </Button>
            )}
            {config.botoes(tab, a.checklist, a.aprovado).includes("ajustes") && (
              <Button
                variant="contained"
                size="small"
                sx={{ borderRadius: 2, minHeight: 38, maxHeight: 38, minWidth: 120, flexShrink: 0, flexGrow: 0, px: 2, bgcolor: "#ffcc00", color: "#222" }}
                disabled={!!a.aprovado}
                onClick={() => onJustificar(a.id, "ajustes")}
              >
                Enviar para Ajustes
              </Button>
            )}
            {config.botoes(tab, a.checklist, a.aprovado).includes("informar") && (
              <Button variant="contained" size="small" sx={{ borderRadius: 2, bgcolor: "#1277be" }} onClick={() => onJustificar(a.id, "informar")}>Informar usuário</Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

