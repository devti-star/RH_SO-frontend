import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
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
  Tooltip,
  Stack
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import PdfViewer from '../shared/PdfViewer';

import axios from 'axios';
import { apiURL } from '../config';
import { AuthService } from '../auth/components/form/auth.service';

// Tipos
export interface Documento {
  caminho: string;
  maior3dias?: boolean;
}
export interface Requerimento {
  id: number;
  nome?: string;
  status: number;
  etapa: number;
  tipo: number;
  documentos: Documento[];
  observacao?: string;
  criadoEm: string;
}

// Funções para detectar tipo do arquivo
function isImageFile(filename: string | null | undefined): boolean {
  if (!filename) return false;
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
}
function isPdfFile(filename: string | null | undefined): boolean {
  if (!filename) return false;
  return /\.pdf$/i.test(filename);
}

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

async function fetchRequerimentosUsuario(): Promise<Requerimento[]> {
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

// NOVO: Função para buscar o último histórico de um requerimento
async function fetchLastHistorico(requerimentoId: number) {
  try {
    const usuario = AuthService.getInstance().getUserStorage(false);
    const token = usuario?.access_token;
    const token_type = usuario?.token_type;
    const response = await axios.get(
      `${apiURL}/historicos/last/${requerimentoId}`,
      {
        headers: { Authorization: `${token_type} ${token}` }
      }
    );
    return response.data;
  } catch (e) {
    return null;
  }
}

// ---------- Componente ----------
export default function MinhasSolicitacoes() {
  const theme = useTheme();
  const [search, setSearch] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{ url: string; name: string } | null>(null);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [observacaoIndex, setObservacaoIndex] = useState<number | null>(null);
  const [correcaoIndex, setCorrecaoIndex] = useState<number | null>(null);
  const [correcaoFile, setCorrecaoFile] = useState<File | null>(null);

  const [requerimentos, setRequerimentos] = useState<Requerimento[]>([]);
  const [historicos, setHistoricos] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Ref para scroll do modal
  const docRef = useRef<HTMLDivElement>(null);

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

  // Scrolla até o modal quando abrir
  useEffect(() => {
    if (selectedFile && docRef.current) {
      setTimeout(() => {
        docRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }
  }, [selectedFile]);

  const fetchRequerimentos = async () => {
    setLoading(true);
    try {
      const data = await fetchRequerimentosUsuario();
      setRequerimentos(data);

      // Buscar devolutiva (último histórico) de cada requerimento
      const historicosPromises = data.map(async (req: Requerimento) => {
        const historico = await fetchLastHistorico(req.id);
        return { reqId: req.id, historico };
      });

      const results = await Promise.all(historicosPromises);
      const historicosObj: Record<number, any> = {};
      results.forEach(({ reqId, historico }) => {
        historicosObj[reqId] = historico;
      });
      setHistoricos(historicosObj);
    } finally {
      setLoading(false);
    }
  };

  // Cards em ordem decrescente
  const filteredRequerimentos = [...requerimentos]
    .filter((item: Requerimento) => {
      const protocoloNome = item.nome ?? `Protocolo ${item.id}`;
      const matchesSearch = protocoloNome.toLowerCase().includes(search.toLowerCase());
      const statusLabel = getStatusInfo(item.status, item.etapa).label;
      const matchesStatus = statusFilter ? statusLabel === statusFilter : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.id - a.id);

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

        <Stack direction="column" spacing={2}>
          {filteredRequerimentos.length === 0 ? (
            <Box p={4} textAlign="center">
              <Typography color="text.secondary" fontWeight="bold">
                Não há nenhum documento a ser mostrado.
              </Typography>
            </Box>
          ) : (
            filteredRequerimentos.map((item, index) => {
              console.log('DOCUMENTOS:', item.documentos);
              const isExpanded = expandedCardIndex === index;
              const statusInfo = getStatusInfo(item.status, item.etapa);
              const tipo = getTipoRequerimento(item.tipo);
              const etapa = getEtapa(item.etapa);

              const isAjuste = item.etapa === 3;
              const isFinalizado = item.status === 0 || item.status === 1;
              const isEmAndamento = item.status === 2 && !isAjuste;
              const ano = item.criadoEm ? new Date(item.criadoEm).getFullYear() : '';
              const protocolo = `${item.id}${ano ? '/' + ano : ''}`;
              const protocoloNome = `Protocolo ${protocolo}`;
              const docPath = item.documentos && item.documentos.length > 0 ? item.documentos[0].caminho : undefined;

              // DEVOLUTIVA: busca observacao do último histórico (se houver)
              const devolutiva = historicos[item.id]?.observacao ||
                "A solicitação está em andamento. Aguardando próxima avaliação.";

              return (
                <Box key={item.id}>
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
                      {item.etapa === 1 &&
                        item.documentos?.[0]?.maior3dias === true && (
                          <Box sx={{ mt: 1, mb: 2, p: 2, bgcolor: "#fff3cd", borderRadius: 2, border: "1px solid #ffecb5" }}>
                            <Typography color="warning.main" fontWeight={600}>
                              Atenção: compareça presencialmente ao setor para exame médico. Seu atestado indica período superior a 3 dias.
                            </Typography>
                          </Box>
                        )}

                    </CardContent>

                    <CardActions sx={{ pl: 2, pb: 2 }}>
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
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setObservacaoIndex(observacaoIndex === index ? null : index)}
                          >
                            {item.status === 1 ? 'Ver Observação' : 'Ver motivo do indeferimento'}
                          </Button>
                          {/* Botão solicitado */}
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            sx={{ ml: 1 }}
                            onClick={() => { /* ação futura */ }}
                          >
                            Documento SESMT
                          </Button>
                        </>
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
                          {historicos[item.id]?.observacao && historicos[item.id]?.observacao.length > 0
                            ? historicos[item.id].observacao
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

                        {/* Botão de upload */}
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0];
                              if (file) setCorrecaoFile(file);
                            }}
                          />
                        </Button>

                        {/* Exibição do nome do arquivo e X para excluir */}
                        {correcaoFile && (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                              background: "#f9f9f9",
                              borderRadius: 1,
                              px: 2,
                              py: 1,
                              mb: 2,
                              boxShadow: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '80%',
                              }}
                            >
                              {correcaoFile.name}
                            </Typography>
                            <IconButton
                              aria-label="Remover arquivo"
                              size="small"
                              onClick={() => setCorrecaoFile(null)}
                              sx={{ ml: 2 }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}

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
                          {["Triagem", "Médico", "Enfermeiro"].map((nomeEtapa, i) => {
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
                            {devolutiva}
                          </Typography>
                        </Box>
                      </Box>
                    </Collapse>

                    {/* Observação Final ou Motivo do Indeferimento */}
                    <Collapse in={observacaoIndex === index}>
                      <Box px={3} pb={3}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {item.status === 1 ? 'Observação Final' : 'Motivo do Indeferimento'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {historicos[item.id]?.observacao && historicos[item.id]?.observacao.length > 0
                            ? historicos[item.id].observacao
                            : item.status === 1
                              ? 'O servidor apresentou documentação adequada e foi avaliado como apto pelo setor responsável.'
                              : 'O atestado foi rejeitado por conter informações incompletas ou inconsistentes. Verifique junto ao setor responsável.'}
                        </Typography>
                      </Box>
                    </Collapse>
                  </Card>
                </Box>
              );
            })
          )}
        </Stack>
      </Container>

      {/* Modal centralizado, formato A4 */}
      {selectedFile && (
        <Box
          ref={docRef}
          sx={{
            width: '100vw',
            minHeight: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            background: 'rgba(0,0,0,0.25)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            sx={{
              width: { xs: '95vw', sm: '794px' },  // largura A4
              height: { xs: 'auto', sm: '1123px' }, // altura A4
              maxWidth: '100vw',
              maxHeight: '98vh',
              p: 2,
              boxSizing: 'border-box',
              position: 'relative',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              width="100%"
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
                height: '100%',
                minHeight: '90%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                background: '#f5f5f5',
                boxShadow: 2,
                overflow: 'auto'
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
