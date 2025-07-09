import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import { AuthService } from "../auth/components/form/auth.service";
import { useSnackbarStore } from "../shared/useSnackbar";
import { decodeJwt } from "../shared/jwt";
import {
  changePassword,
  getUsuario,
  patchFotoUsuario,
  patchUsuario,
} from "./meus-dados.service";
import type { ChangePassword } from "../models/changePassword";
import { ApiService } from "../interceptors/Api/api.intercept";

const azulPrimario = "#050A24";
const azulClaro = "#173557";

interface UsuarioCampos {
  nomeCompleto: string;
  departamento: string;
  secretaria: string;
  telefone: string;
  cargo: string;
  foto: string | null;
  email: string;
  matricula: string;
  cpf: string;
  rg: string;
}

const PerfilUsuario: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showSnackbar } = useSnackbarStore.getState();

  const [campos, setCampos] = useState<UsuarioCampos | null>(null);
  const [originais, setOriginais] = useState<UsuarioCampos | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(null);

  const [openSenhaModal, setOpenSenhaModal] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);

  const authService = AuthService.getInstance();
  const usuario = authService.getUserStorage();
  const usuarioId = usuario?.id ?? decodeJwt(usuario?.access_token)?.sub;
  
  useEffect(() => {
    const fetchData = async () => {
      if (!usuarioId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getUsuario(usuarioId);

        const camposUsuario: UsuarioCampos = {
          nomeCompleto: data.nomeCompleto ?? "",
          departamento: data.departamento ?? "",
          secretaria: data.secretaria ?? "",
          telefone: data.telefone ?? "",
          cargo: data.cargo ?? "",
          foto: data.foto ?? null,
          email: data.email ?? "",
          matricula: data.matricula ?? "",
          cpf: data.cpf ?? "",
          rg:
            typeof data.rg === "object" && data.rg !== null
              ? [data.rg.numeroRG, data.rg.orgãoExpeditor]
                  .filter(Boolean)
                  .join(" - ")
              : data.rg || "",
        };
        setCampos(camposUsuario);
        setOriginais(camposUsuario);
      } catch {
        showSnackbar("Erro ao carregar dados do usuário", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!usuarioId || !campos) return;
    if (fotoFile) return;

    // Só busca se houver caminho salvo
    if (!campos.foto) {
      setFotoPerfilUrl(null);
      return;
    }

    const buscarFoto = async () => {
      try {
        const api = ApiService.getInstance();
        const resp = await api.get(`/usuarios/foto/${usuarioId}`, { responseType: "blob" });
        const url = URL.createObjectURL(resp.data);
        setFotoPerfilUrl(url);
      } catch {
        setFotoPerfilUrl(null);
      }
    };

    buscarFoto();

    return () => {
      if (fotoPerfilUrl) URL.revokeObjectURL(fotoPerfilUrl);
    };
  }, [usuarioId, fotoFile, campos?.foto]); // <- use campos?.foto, não só campos!





  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const imageURL = URL.createObjectURL(file);
      setCampos((prev) => (prev ? { ...prev, foto: imageURL } : prev));
    }
  };

  const handleChangeCampo = (
    campo: keyof UsuarioCampos,
    valor: string | null
  ) => {
    setCampos((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  };

  const abrirModalSenha = () => setOpenSenhaModal(true);
  const fecharModalSenha = () => {
    setOpenSenhaModal(false);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmaSenha("");
  };


  const toggleMostrarSenhaAtual = () =>
    setMostrarSenhaAtual((prev) => !prev);
  const toggleMostrarNovaSenha = () =>
    setMostrarNovaSenha((prev) => !prev);
  const toggleMostrarConfirmaSenha = () =>
    setMostrarConfirmaSenha((prev) => !prev);

  const salvarSenha = async () => {
    if (novaSenha !== confirmaSenha) {
      showSnackbar("A nova senha e a confirmação devem ser iguais.", "error");
      return;
    }

    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      showSnackbar("Por favor, preencha todos os campos.", "error");
      return;
    }

    try {
      const dados: ChangePassword = {
        currentPassword: senhaAtual,
        newPassword: novaSenha,
      };
      console.error(JSON.stringify(dados));
      const result = await changePassword(dados);

      if (result) showSnackbar("Senha alterada com sucesso!", "success");
    } catch (error: any) {
      showSnackbar(`${error.message}`, "error");
    }
    fecharModalSenha();
  };

  const hasChanges = () => {
    if (!campos || !originais) return false;
    return (
      campos.nomeCompleto !== originais.nomeCompleto ||
      campos.departamento !== originais.departamento ||
      campos.secretaria !== originais.secretaria ||
      campos.telefone !== originais.telefone ||
      campos.cargo !== originais.cargo ||
      fotoFile !== null
    );
  };

  const salvarAlteracoes = async () => {
    if (!usuarioId || !campos || !originais) return;
    setSaving(true);
    try {
      const dadosAtualizados: Partial<UsuarioCampos> = {};
      if (campos.nomeCompleto !== originais.nomeCompleto)
        dadosAtualizados.nomeCompleto = campos.nomeCompleto;
      if (campos.departamento !== originais.departamento)
        dadosAtualizados.departamento = campos.departamento;
      if (campos.secretaria !== originais.secretaria)
        dadosAtualizados.secretaria = campos.secretaria;
      if (campos.telefone !== originais.telefone)
        dadosAtualizados.telefone = campos.telefone;
      if (campos.cargo !== originais.cargo)
        dadosAtualizados.cargo = campos.cargo;

      if (Object.keys(dadosAtualizados).length > 0) {
        await patchUsuario(usuarioId, dadosAtualizados);
      }
      if (fotoFile) {
        await patchFotoUsuario(usuarioId, fotoFile);
        setFotoFile(null);
        // Recarrega usuário após upload
        const data = await getUsuario(usuarioId);
        setCampos((prev) => prev ? { ...prev, foto: data.foto ?? null } : prev);
      }


      setOriginais({ ...campos });
      setFotoFile(null);
      showSnackbar("Dados atualizados com sucesso!", "success");
    } catch (err) {
      showSnackbar("Erro ao salvar dados.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !campos) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      p={2}
      sx={{
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: isMobile ? "center" : "flex-start",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 4,
          maxWidth: 1200,
          width: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "center" : "flex-start",
          alignItems: isMobile ? "center" : "stretch",
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="stretch"
          justifyContent={isMobile ? "center" : "flex-start"}
          sx={{ width: isMobile ? "100vw" : "auto", px: isMobile ? 2 : 0 }}
        >
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              height: "100%",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: azulPrimario }}
            >
              Foto
            </Typography>
            <Avatar
              src={
                fotoFile
                  ? URL.createObjectURL(fotoFile)
                  : fotoPerfilUrl ?? undefined
              }
              sx={{
                width: 140,
                height: 140,
                border: `3px solid ${azulClaro}`,
                boxShadow: 3,
                mt: 2,
                mb: 2,
              }}
            />



            <Button
              variant="contained"
              component="label"
              disabled={saving}
              sx={{
                backgroundColor: azulPrimario,
                textTransform: "none",
                fontWeight: 500,
                px: 4,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: azulClaro,
                },
              }}
            >
              Alterar Foto
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            md={9}
            sx={{
              textAlign: { xs: "center", md: "left" },
              width: isMobile ? "100vw" : "auto",
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              gutterBottom
              sx={{ color: azulPrimario }}
            >
              Dados Pessoais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  value={campos.nomeCompleto}
                  onChange={(e) =>
                    handleChangeCampo("nomeCompleto", e.target.value)
                  }
                  disabled={saving}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cargo"
                  value={campos.cargo}
                  onChange={(e) => handleChangeCampo("cargo", e.target.value)}
                  disabled={saving}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="CPF" value={campos.cpf} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Matrícula"
                  value={campos.matricula}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="RG" value={campos.rg} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone/Whatsapp"
                  value={campos.telefone}
                  onChange={(e) =>
                    handleChangeCampo("telefone", e.target.value)
                  }
                  disabled={saving}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Box mt={4}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                gutterBottom
                sx={{ color: azulPrimario }}
              >
                Dados do Trabalho
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Departamento"
                    value={campos.departamento}
                    onChange={(e) =>
                      handleChangeCampo("departamento", e.target.value)
                    }
                    disabled={saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Secretaria"
                    value={campos.secretaria}
                    onChange={(e) =>
                      handleChangeCampo("secretaria", e.target.value)
                    }
                    disabled={saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ApartmentIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mt={4}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                gutterBottom
                sx={{ color: azulPrimario }}
              >
                Informações de Login
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={campos.email}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  display="flex"
                  justifyContent={{ xs: "center", sm: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={abrirModalSenha}
                    disabled={saving}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      backgroundColor: azulPrimario,
                      "&:hover": { backgroundColor: azulClaro },
                    }}
                    startIcon={<LockResetIcon />}
                  >
                    Alterar Senha
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={salvarAlteracoes}
            disabled={!hasChanges() || saving}
            sx={{
              px: 6,
              backgroundColor: hasChanges() ? azulPrimario : "#bdbdbd",
              "&:hover": {
                backgroundColor: hasChanges() ? azulClaro : "#bdbdbd",
              },
            }}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : "Salvar"}
          </Button>
        </Box>

        <Dialog
          open={openSenhaModal}
          onClose={fecharModalSenha}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{ fontWeight: 700, color: azulPrimario, textAlign: "center" }}
          >
            Alterar Senha
          </DialogTitle>
          <DialogContent>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
              <TextField
                label="Senha Atual"
                type={mostrarSenhaAtual ? "text" : "password"}
                fullWidth
                margin="normal"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleMostrarSenhaAtual}
                        edge="end"
                        aria-label="Mostrar ou ocultar a senha"
                      >
                        {mostrarSenhaAtual ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Nova Senha"
                type={mostrarNovaSenha ? "text" : "password"}
                fullWidth
                margin="normal"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleMostrarNovaSenha}
                        edge="end"
                        aria-label="Mostrar ou ocultar a senha"
                      >
                        {mostrarNovaSenha ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirme a Senha"
                type={mostrarConfirmaSenha ? "text" : "password"}
                fullWidth
                margin="normal"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleMostrarConfirmaSenha}
                        edge="end"
                        aria-label="Mostrar ou ocultar a senha"
                      >
                        {mostrarConfirmaSenha ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ pr: 3, pb: 2 }}>
            <Button onClick={fecharModalSenha} color="secondary">
              Cancelar
            </Button>
            <Button
              onClick={salvarSenha}
              variant="contained"
              sx={{
                backgroundColor: azulPrimario,
                "&:hover": { backgroundColor: azulClaro },
              }}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default PerfilUsuario;
