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
} from "@mui/material";

// Dados de exemplo, agora com o campo 'foto' (pode ser vazio por enquanto)
const mockAtestados = [
  { id: 1, nome: "Nome cidadão 1", texto: "Texto do atestado 1.", arquivo: "arquivo1.pdf", status: "pendente", foto: "" },
  { id: 2, nome: "Nome cidadão 2", texto: "Texto do atestado 2.", arquivo: "arquivo2.pdf", status: "pendente", foto: "" },
  { id: 3, nome: "Nome cidadão 3", texto: "Texto do atestado 3.", arquivo: "arquivo3.pdf", status: "progresso", foto: "" },
  { id: 4, nome: "Nome cidadão 4", texto: "Texto do atestado 4.", arquivo: "arquivo4.pdf", status: "finalizado", foto: "" },
  { id: 5, nome: "Nome cidadão 5", texto: "Texto do atestado 5.", arquivo: "arquivo5.pdf", status: "pendente", foto: "" },
  { id: 6, nome: "Nome cidadão 6", texto: "Texto do atestado 6.", arquivo: "arquivo6.pdf", status: "finalizado", foto: "" },
  { id: 7, nome: "Nome cidadão 7", texto: "Texto do atestado 7.", arquivo: "arquivo7.pdf", status: "progresso", foto: "" },
];

export default function AdminDashboard() {
  const [tab, setTab] = React.useState(0);
  const [selectedDoc, setSelectedDoc] = React.useState<number | null>(null);
  const [busca, setBusca] = React.useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getStatus = (t: number) =>
    t === 0 ? "pendente" : t === 1 ? "progresso" : "finalizado";

  const atestadosFiltrados = mockAtestados.filter(
    (a) =>
      a.status === getStatus(tab) &&
      (a.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.texto.toLowerCase().includes(busca.toLowerCase()))
  );

  const pendentes = mockAtestados.filter((a) => a.status === "pendente").length;
  const progresso = mockAtestados.filter((a) => a.status === "progresso").length;

  const docSelecionado = mockAtestados.find((a) => a.id === selectedDoc);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#f8f8f8",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "center",
        p: isMobile ? 0 : 0,
        overflow: "auto"
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
                  gap: isMobile ? 2 : 0
                }
              }}
              orientation={isMobile ? "horizontal" : "horizontal"}
              variant={isMobile ? "scrollable" : "standard"}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold" }}>Análise Pendente</span>
                    <Badge badgeContent={pendentes} color="error" sx={{ ml: 1, mb: "2px" }} />
                  </Box>
                }
                sx={{ textTransform: "none" }}
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold" }}>Em Progresso</span>
                    <Badge badgeContent={progresso} color="info" sx={{ ml: 1, mb: "2px" }} />
                  </Box>
                }
                sx={{ textTransform: "none" }}
              />
              <Tab
                label={<span style={{ fontWeight: "bold" }}>Finalizados</span>}
                sx={{ textTransform: "none" }}
              />
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

            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: isMobile ? 0 : 1 }}>
              <Stack spacing={2}>
                {atestadosFiltrados.length === 0 && (
                  <Typography sx={{ mt: 5, textAlign: "center", color: "#bbb" }}>
                    Nenhum resultado encontrado.
                  </Typography>
                )}
                {atestadosFiltrados.map((a) => (
                  <Card key={a.id} variant="outlined" sx={{ boxShadow: 2, borderRadius: 3 }}>
                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ width: 54, height: 54, mr: 2 }}
                        src={a.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.nome)}&background=ccc&color=333`}
                        alt={a.nome}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" align="left" sx={{ fontWeight: "bold" }}>
                          {a.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {a.texto}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setSelectedDoc(a.id)}
                            sx={{ borderRadius: 2 }}
                          >
                            Ver Documento
                          </Button>
                          <Button variant="contained" color="error" size="small" sx={{ borderRadius: 2 }}>
                            Reprovar
                          </Button>
                          <Button variant="contained" color="success" size="small" sx={{ borderRadius: 2 }}>
                            Aprovar
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
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
            flex: isMobile ? "none" : undefined
          }}
        >
          <Typography
            sx={{
              mb: 1,
              ml: 1,
              fontWeight: 500,
              fontSize: 18,
              color: "#111",
              alignSelf: "flex-start",
            }}
          >
            {docSelecionado ? docSelecionado.arquivo : "Nome do arquivo.pdf"}
          </Typography>
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
              fontWeight: 600,
              fontSize: isMobile ? 22 : 32,
              color: "#888",
              minHeight: isMobile ? 180 : 350,
              mt: 2,
              mx: "auto",
            }}
          >
            DOCUMENTO
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
