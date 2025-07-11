import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  Card,
  CardContent,
  CardActions,
  useTheme,
  TextField,
  Collapse,
  MenuItem,
  IconButton,
  Paper,
  Tooltip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import PdfViewer from '../shared/PdfViewer';

import axios from 'axios';
import { apiURL } from '../config'; // ajuste o path se necessário
import { AuthService } from '../auth/components/form/auth.service';

// Funções para detectar tipo do arquivo
function isImageFile(filename: string | null): boolean {
  if (!filename) return false;
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
}
function isPdfFile(filename: string | null): boolean {
  if (!filename) return false;
  return /\.pdf$/i.test(filename);
}

// --- Funções utilitárias para mapping dos enums do backend ---
function getStatusInfo(status: number, etapa: number) {
  if (etapa === 3) return { label: "Ajuste Pendente pelo usuário", cor: "info" };
  switch (status) {
    case 0: return { label: 'Indeferido', cor: 'error' };
    case 1: return { label: 'Deferido', cor: 'success' };
    case 2: return { label: 'Em andamento', cor: 'warning' };
    default: return { label: 'Desconhecido', cor: 'default' };
  }
}

function getTipoRequerimento(tipo: number) {
  switch (tipo) {
    case 0: return "Atestado";
    default: return "Outro";
  }
}

function getEtapa(etapa: number) {
  switch (etapa) {
    case 0: return "Triagem";
    case 1: return "Médico";
    case 2: return "Enfermeiro";
    case 3: return "Ajuste";
    default: return "Desconhecida";
  }
}

// --- Função que faz o fetch dos requerimentos do usuário ---
async function fetchRequerimentosUsuario() {
  const usuario = AuthService.getInstance().getUserStorage(false);
  if (!usuario) throw new Error('Usuário não logado!');
  const idUsuario = usuario.id;
  const token = usuario.access_token;
  const token_type = usuario.token_type;

  const response = await axios.get(`${apiURL}/requerimentos/usuario/${idUsuario}`, {
    headers: { Authorization: `${token_type} ${token}` }
  });
  return response.data;
}

export default function MinhasSolicitacoes() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  // Alteração: agora armazena { url, name } ao invés de apenas string
  const [selectedFile, setSelectedFile] = useState<{ url: string, name: string } | null>(null);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [observacaoIndex, setObservacaoIndex] = useState<number | null>(null);
  const [correcaoIndex, setCorrecaoIndex] = useState<number | null>(null);
  const [correcaoFile, setCorrecaoFile] = useState<File | null>(null);

  // Estado para os dados do backend
  const [requerimentos, setRequerimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequerimentos();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchRequerimentos = async () => {
    setLoading(true);
    try {
      const data = await fetchRequerimentosUsuario();
      setRequerimentos(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequerimentos = requerimentos.filter(item => {
    const protocoloNome = item.nome ?? `Protocolo ${item.id}`;
    const matchesSearch = protocoloNome.toLowerCase().includes(search.toLowerCase());
    const statusLabel = getStatusInfo(item.status, item.etapa).label;
    const matchesStatus = statusFilter ? statusLabel === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // NOVO: handler genérico para abrir arquivo (pdf ou imagem)
  const openFile = (documentoPath?: string) => {
    if (documentoPath) {
      setSelectedFile({
        url: `${apiURL}/uploads/${documentoPath}`,
        name: documentoPath
      });
    }
  };

  const handleCorrecao = async (requerimentoId: number) => {
    if (!correcaoFile) return;
    try {
      const formData = new FormData();
      formData.append('arquivo', correcaoFile);
      formData.append('requerimentoId', String(requerimentoId));

      const usuario = AuthService.getInstance().getUserStorage(false);
      const token = usuario?.access_token;
      const token_type = usuario?.token_type;

      await axios.post(
        `${apiURL}/documentos/substituir/${requerimentoId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `${token_type} ${token}`
          }
        }
      );

      await axios.patch(`${apiURL}/requerimentos/${requerimentoId}`, { etapa: 0 }, {
        headers: { 'Authorization': `${token_type} ${token}` }
      });

      setCorrecaoIndex(null);
      setCorrecaoFile(null);
      await fetchRequerimentos();

    } catch (e) {
      alert('Falha ao enviar documento ou atualizar requisição.');
    }
  };

  // --- Renderização ---
  if (loading) {
    return <Box p={4}><Typography>Carregando...</Typography></Box>;
  }

  return (
    <Box sx={{ display: 'flex', mt: 4, position: 'relative', mb: 15 }}>
      <Container sx={{ width: selectedFile && !isMobile ? '40%' : '100%', transition: 'width 0.3s' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            placeholder="Pesquisar por nome ou protocolo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtrar
          </Button>
        </Box>

        <Collapse in={showFilters}>
          <Box mb={3}>
            <TextField
              select
              label="Status"
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Deferido">Deferido</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Indeferido">Indeferido</MenuItem>
              <MenuItem value="Ajuste Pendente pelo usuário">Ajuste Pendente pelo usuário</MenuItem>
            </TextField>
          </Box>
        </Collapse>

        <Grid container direction="column" spacing={2}>
          {filteredRequerimentos.map((item, index) => {
            const isExpanded = expandedCardIndex === index;
            const statusInfo = getStatusInfo(item.status, item.etapa);
            const tipo = getTipoRequerimento(item.tipo);
            const etapa = getEtapa(item.etapa);

            const isAjuste = item.etapa === 3;
            const isFinalizado = item.status === 0 || item.status === 1;
            const isEmAndamento = item.status === 2 && !isAjuste;
            const protocoloNome = item.nome ?? `Protocolo ${item.id}`;
            const docPath = item.documentos && item.documentos.length > 0 ? item.documentos[0].caminho : undefined;

            return (
              <Grid item key={item.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: '#e0e0e0',
                    borderWidth: 2,
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#333' }}>
                        {protocoloNome}
                      </Typography>
                      <Chip label={statusInfo.label} color={statusInfo.cor as any} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tipo: {tipo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Etapa atual: {etapa}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ pl: 2, pb: 2 }}>
                    {/* Botão para abrir documento */}
                    {docPath && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openFile(docPath)}
                      >
                        Ver Documento
                      </Button>
                    )}

                    {isFinalizado && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setObservacaoIndex(observacaoIndex === index ? null : index)}
                      >
                        {item.status === 1 ? 'Ver Observação' : 'Ver motivo do indeferimento'}
                      </Button>
                    )}

                    {isEmAndamento && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setExpandedCardIndex(isExpanded ? null : index)}
                      >
                        Ver Progresso
                      </Button>
                    )}

                    {isAjuste && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setCorrecaoIndex(correcaoIndex === index ? null : index)}
                      >
                        Corrigir
                      </Button>
                    )}
                  </CardActions>

                  {/* Área de correção (upload novo documento) */}
                  <Collapse in={correcaoIndex === index}>
                    <Box px={3} pb={3} pt={1}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Observação para correção
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {item.observacao && item.observacao.length > 0
                          ? item.observacao
                          : "O documento enviado está incompleto ou ilegível. Por favor, reenvie com os dados corretos."}
                      </Typography>
                      <TextField
                        fullWidth
                        label="Observações adicionais (opcional)"
                        multiline
                        minRows={3}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Enviar novo documento
                        <input
                          type="file"
                          hidden
                          accept="application/pdf,image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setCorrecaoFile(file);
                          }}
                        />
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        disabled={!correcaoFile}
                        onClick={() => handleCorrecao(item.id)}
                      >
                        Salvar
                      </Button>
                    </Box>
                  </Collapse>

                  {/* Progresso das etapas */}
                  <Collapse in={isExpanded}>
                    <Box px={3} pb={3} position="relative">
                      <Box display="flex" justifyContent="space-between" alignItems="center" position="relative">
                        {["Triagem","Médico","Enfermeiro"].map((nomeEtapa, i) => {
                          let circleColor = "#e0e0e0";
                          let statusLabel = "Pendente";
                          let statusDescricao = "Esta etapa ainda não foi iniciada.";
                          if (i < item.etapa) {
                            circleColor = "#4caf50";
                            statusLabel = "Aprovado";
                            statusDescricao = "Etapa aprovada com sucesso.";
                          } else if (i === item.etapa) {
                            circleColor = "#ff9800";
                            statusLabel = "Em andamento";
                            statusDescricao = "Aguardando aprovação desta etapa.";
                          }

                          return (
                            <Box
                              key={nomeEtapa}
                              flex={1}
                              textAlign="center"
                              position="relative"
                              sx={{ paddingTop: '48px' }}
                            >
                              {i < 2 && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '30px',
                                    left: '50%',
                                    width: '100%',
                                    height: 2,
                                    backgroundColor: circleColor,
                                    zIndex: 0,
                                    transform: 'translateX(0%)',
                                  }}
                                />
                              )}
                              <Tooltip title={statusDescricao} arrow>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    border: `3px solid ${circleColor}`,
                                    zIndex: 2,
                                    cursor: 'pointer',
                                  }}
                                />
                              </Tooltip>
                              <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                                {statusLabel}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {nomeEtapa}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                      <Box mt={4}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Devolutiva
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          A solicitação está em andamento. Aguardando próxima avaliação.
                        </Typography>
                      </Box>
                    </Box>
                  </Collapse>

                  <Collapse in={observacaoIndex === index}>
                    <Box px={3} pb={3}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {item.status === 1 ? 'Observação Final' : 'Motivo do Indeferimento'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.observacao && item.observacao.length > 0
                          ? item.observacao
                          : item.status === 1
                            ? 'O servidor apresentou documentação adequada e foi avaliado como apto pelo setor responsável.'
                            : 'O atestado foi rejeitado por conter informações incompletas ou inconsistentes. Verifique junto ao setor responsável.'}
                      </Typography>
                    </Box>
                  </Collapse>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Modal lateral/central para PDF ou imagem */}
      {selectedFile && (
        <Box
          sx={{
            width: isMobile ? '100vw' : '40vw',
            height: isMobile ? '100vh' : '80vh',
            position: isMobile ? 'absolute' : 'relative',
            top: isMobile ? 0 : 'auto',
            left: isMobile ? 0 : 'auto',
            backgroundColor: isMobile ? 'white' : 'transparent',
            zIndex: isMobile ? 1300 : 'auto',
            boxShadow: isMobile ? 3 : 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            sx={{
              width: '100%',
              height: '100%',
              p: 2,
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Documento</Typography>
              <IconButton
                onClick={() => setSelectedFile(null)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 10,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                width: '100%',
                height: 'calc(100% - 48px)',
                overflow: 'hidden',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isPdfFile(selectedFile.name) ? (
                <PdfViewer url={selectedFile.url} height="100%" width="100%" />
              ) : isImageFile(selectedFile.name) ? (
                <img
                  src={selectedFile.url}
                  alt="Documento"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: 8
                  }}
                />
              ) : (
                <Typography color="error">
                  Formato de arquivo não suportado.
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
