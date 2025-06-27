import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";

const azulPrimario = "#050A24";
const azulClaro = "#173557";

const PerfilUsuario: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [openSenhaModal, setOpenSenhaModal] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  const abrirModalSenha = () => setOpenSenhaModal(true);
  const fecharModalSenha = () => {
    setOpenSenhaModal(false);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmaSenha("");
  };

  const salvarSenha = () => {
    if (novaSenha !== confirmaSenha) {
      alert("A nova senha e a confirmação devem ser iguais.");
      return;
    }
    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    alert("Senha alterada com sucesso!");
    fecharModalSenha();
  };

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
        <Grid container spacing={4} alignItems="stretch" justifyContent={isMobile ? "center" : "flex-start"}
          sx={{ width: isMobile ? "100vw" : "auto", px: isMobile ? 2 : 0 }}>
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
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: azulPrimario }}>
              Foto
            </Typography>
            <Avatar
              src={profileImage ?? undefined}
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
              Editar Perfil
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Grid>

          <Grid item xs={12} md={9} sx={{ textAlign: { xs: "center", md: "left" }, width: isMobile ? "100vw" : "auto" }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: azulPrimario }}>
              Dados Pessoais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nome Completo" defaultValue="Murilo Nascimento Carvalho" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Cargo" defaultValue="Desenvolvedor Fullstack" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="CPF" defaultValue="666.666.666-66" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Matrícula" defaultValue="35715978936" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="RG" defaultValue="99.999.99-X" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Telefone/Whatsapp" defaultValue="(18) 91234-6978" />
              </Grid>
            </Grid>

            <Box mt={4}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: azulPrimario }}>
                Dados do Trabalho
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Departamento" defaultValue="T.I" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Secretaria" defaultValue="DPTI" />
                </Grid>
              </Grid>
            </Box>

            <Box mt={4}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: azulPrimario }}>
                Informações de Login
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" defaultValue="murilo_nasci_carv@gmail.com" />
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
                    sx={{ textTransform: "none", fontWeight: 600, backgroundColor: azulPrimario, "&:hover": { backgroundColor: azulClaro } }}
                    startIcon={<LockResetIcon />}
                  >
                    Alterar Senha
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Dialog open={openSenhaModal} onClose={fecharModalSenha} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 700, color: azulPrimario, textAlign: "center" }}>
            Alterar Senha
          </DialogTitle>
          <DialogContent>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
              <TextField
                label="Senha Atual"
                type="password"
                fullWidth
                margin="normal"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
              <TextField
                label="Nova Senha"
                type="password"
                fullWidth
                margin="normal"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <TextField
                label="Confirme a Senha"
                type="password"
                fullWidth
                margin="normal"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ pr: 3, pb: 2 }}>
            <Button onClick={fecharModalSenha} color="secondary">
              Cancelar
            </Button>
            <Button onClick={salvarSenha} variant="contained" sx={{ backgroundColor: azulPrimario, "&:hover": { backgroundColor: azulClaro } }}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default PerfilUsuario;
