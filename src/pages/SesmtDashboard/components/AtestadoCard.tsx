import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Checkbox,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type { Atestado } from "../../../models/atestados";
import type { Config } from "../useSesmtDashboard";
import { CHECKLIST } from "../mockData";

// Pegando perfil do usuário logado
import { AuthService } from "../../../auth/components/form/auth.service";
import { Roles } from "../../../models/roles";

function mapRoleToPerfil(role: number) {
  switch (role) {
    case Roles.TRIAGEM: return "triagem";
    case Roles.MEDICO: return "medico";
    case Roles.ENFERMEIRO: return "enfermeiro";
    default: return "triagem";
  }
}
const usuario = AuthService.getInstance().getUserStorage();
const perfilAtual = usuario ? mapRoleToPerfil(usuario.role) : "triagem";

interface Props {
  atestado: Atestado;
  tab: number;
  config: Config;
  isMobile: boolean;
  onExpandChecklist: (a: Atestado) => void;
  onCheckChange: (a: Atestado, idx: number) => void;
  onAprovar: (id: number, qtdDias?: number) => void;
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
  const [openAprovarModal, setOpenAprovarModal] = useState(false);

  // Modal states
  const [tipoDeferimento, setTipoDeferimento] = useState<"integral" | "parcial">("integral");
  const [dias, setDias] = useState<number | "">("");

  const checklistPreenchido = config.canAprovar(a.checklist, a.aprovado)//a.checklist?.slice(0, -1)?.every?.((v) => v);
  let statusIcon: React.ReactNode = null;
  if (config.tabs[tab].label === "Finalizados") {
    if (a.aprovado === "aprovado")
      statusIcon = <CheckCircleIcon sx={{ color: "green", mr: 1, fontSize: 28, verticalAlign: "middle" }} />;
    else if (a.aprovado === "reprovado")
      statusIcon = <CancelIcon sx={{ color: "red", mr: 1, fontSize: 28, verticalAlign: "middle" }} />;
  }

  const showChecklistToggle = config.mostraChecklist(tab);

  // Handler para o botão Aprovar
  const handleAprovarClick = () => {
    if (perfilAtual === "medico") {
      setOpenAprovarModal(true);
    } else {
      onAprovar(a.id);
    }
  };

  // Confirmar a aprovação
  const handleConfirmarAprovacao = () => {
    setOpenAprovarModal(false);
    if (tipoDeferimento === "parcial" && dias) {
      onAprovar(a.id, Number(dias));
    } else {
      onAprovar(a.id);
    }
    setTipoDeferimento("integral");
    setDias("");
  };

  // Atualiza opção selecionada no radio
  const handleChangeTipo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTipoDeferimento(e.target.value as "integral" | "parcial");
    if (e.target.value === "integral") setDias("");
  };

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
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" align="left" sx={{ fontWeight: "bold", flex: 1 }}>
              {statusIcon}
              {a.nome}
            </Typography>
            {perfilAtual === "medico" && (
              <Chip
                label={!!a.checklist[8] ? "Mais de 3 dias" : "Menor ou igual a 3 dias"}
                color="primary"
                sx={{ ml: 2 }}
              />
            )}
          </Box>
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
                  <Checkbox
                    checked={!!a.checklist[i]}
                    // Médico só visualiza, não edita. Demais só editam se não está aprovado.
                    disabled={perfilAtual === "medico" || !!a.aprovado}
                    onChange={() => onCheckChange(a, i)}
                  />
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
            <Typography sx={{ color: checklistPreenchido && perfilAtual === 'triagem' ? "#18b46f" : "#b61e00", fontWeight: 600 }}>
              {a.aprovado === "aprovado"
                ? "Atestado aprovado"
                : a.aprovado === "reprovado"
                ? "Atestado reprovado"
                : (checklistPreenchido && perfilAtual === 'triagem')
                ? "Checklist preenchido"
                : perfilAtual === 'triagem' ? "Checklist não preenchido" : ""}
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
                onClick={handleAprovarClick}
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
                disabled={
                  perfilAtual !== "medico" && !!a.aprovado // Médico pode sempre reprovar, outros só se não aprovado
                }
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
              <Button
                variant="contained"
                size="small"
                sx={{ borderRadius: 2, bgcolor: "#1277be" }}
                onClick={() => onJustificar(a.id, "informar")}
              >
                Informar usuário
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
      {/* Modal de aprovação customizado para médico */}
      <Dialog open={openAprovarModal} onClose={() => setOpenAprovarModal(false)}>
        <DialogTitle>Opções de Deferimento</DialogTitle>
        <DialogContent>
          <RadioGroup
            value={tipoDeferimento}
            onChange={handleChangeTipo}
            sx={{ gap: 1, pt: 1 }}
          >
            <FormControlLabel
              value="integral"
              control={<Radio />}
              label="Deferir tempo integral do atestado apresentado pelo cidadão"
            />
            <FormControlLabel
              value="parcial"
              control={<Radio />}
              label="Especificar tempo de deferimento"
            />
          </RadioGroup>
          {tipoDeferimento === "parcial" && (
            <Box sx={{ mt: 2 }}>
              <TextField
                type="number"
                label="Quantidade de dias"
                value={dias}
                onChange={e => setDias(Number(e.target.value))}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAprovarModal(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarAprovacao}
            color="success"
            variant="contained"
            disabled={tipoDeferimento === "parcial" && (!dias || Number(dias) < 1)}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
