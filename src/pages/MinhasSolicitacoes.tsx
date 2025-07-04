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

const atestados = [
  {
    nome: 'Protocolo 2025/2654',
    status: 'Finalizado',
    cor: 'success',
    descricao: 'Atestado finalizado com sucesso pelo setor responsável.',
    etapas: [
      { nome: 'Triagem', status: 'aprovado' },
      { nome: 'Médico', status: 'aprovado' },
      { nome: 'Enfermeiro', status: 'aprovado' }
    ]
  },
  {
    nome: 'Protocolo 2025/2689',
    status: 'Em andamento',
    cor: 'warning',
    descricao: 'Solicitação em análise pelo departamento de RH.',
    etapas: [
      { nome: 'Triagem', status: 'aprovado' },
      { nome: 'Médico', status: 'aguardando' },
      { nome: 'Enfermeiro', status: 'pendente' }
    ]
  },
  {
    nome: 'Protocolo 2025/2663',
    status: 'Indeferido',
    cor: 'error',
    descricao: 'Atestado foi indeferido. Motivo disponível para consulta.',
    etapas: [
      { nome: 'Triagem', status: 'aprovado' },
      { nome: 'Médico', status: 'rejeitado' },
      { nome: 'Enfermeiro', status: 'pendente' }
    ]
  },
  {
    nome: 'Protocolo 2025/2799',
    status: 'Ajuste pendente',
    cor: 'info',
    descricao: 'Atestado requer correção antes de ser validado.',
    etapas: [
      { nome: 'Triagem', status: 'pendente' },
      { nome: 'Médico', status: 'pendente' },
      { nome: 'Enfermeiro', status: 'pendente' }
    ]
  }
];

export default function MinhasSolicitacoes() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [observacaoIndex, setObservacaoIndex] = useState<number | null>(null);
  const [correcaoIndex, setCorrecaoIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredAtestados = atestados.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
const openPdf = () => {
  setSelectedPdf('/arquivo1.pdf'); // Acessa diretamente o PDF salvo na pasta public
};


  return (
    <Box sx={{ display: 'flex', mt: 4, position: 'relative',mb: 15  }}>
      <Container sx={{ width: selectedPdf && !isMobile ? '40%' : '100%', transition: 'width 0.3s' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            placeholder="Pesquisar por nome"
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
              <MenuItem value="Finalizado">Finalizado</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Indeferido">Indeferido</MenuItem>
              <MenuItem value="Ajuste pendente">Ajuste pendente</MenuItem>
            </TextField>
          </Box>
        </Collapse>

        <Grid container direction="column" spacing={2}>
          {filteredAtestados.map((item, index) => {
            const isExpanded = expandedCardIndex === index;

            return (
              <Grid item key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: item.destaque ? theme.palette.primary.main : '#e0e0e0',
                    borderWidth: 2,
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#333' }}>
                        {item.nome}
                      </Typography>
                      <Chip label={item.status} color={item.cor as any} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.descricao}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ pl: 2, pb: 2 }}>
                    <Button size="small" variant="outlined" onClick={openPdf}>
                      Ver Documento
                    </Button>

                   {item.status === 'Finalizado' && (
  <Button
    size="small"
    variant="outlined"
    onClick={() =>
      setObservacaoIndex(observacaoIndex === index ? null : index)
    }
  >
    Ver Observação
  </Button>
)}

{item.status === 'Indeferido' && (
  <Button
    size="small"
    variant="outlined"
    onClick={() =>
      setObservacaoIndex(observacaoIndex === index ? null : index)
    }
  >
    Ver motivo do indeferimento
  </Button>
)}


                    {item.status === 'Em andamento' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setExpandedCardIndex(isExpanded ? null : index)}
                      >
                        Ver Progresso
                      </Button>
                    )}

                    {item.status === 'Ajuste pendente' && (
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setCorrecaoIndex(correcaoIndex === index ? null : index)}
                    >
                        Corrigir
                    </Button>
                    )}

                  </CardActions>
<Collapse in={correcaoIndex === index}>
  <Box px={3} pb={3} pt={1}>
    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      Observação para correção
    </Typography>
    <Typography variant="body2" color="text.secondary" mb={2}>
      O documento enviado está incompleto ou ilegível. Por favor, reenvie com os dados corretos.
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
          if (file) {
            console.log('Arquivo selecionado:', file.name);
          }
        }}
      />
    </Button>

    <Button
      variant="outlined"
      color="primary"
      fullWidth
      onClick={() => {
        console.log('Salvar correção para:', item.nome);
        // Aqui você poderá acionar o envio para o backend ou armazenar o estado.
        setCorrecaoIndex(null); // Fecha o painel após salvar
      }}
    >
      Salvar
    </Button>
  </Box>
</Collapse>


                  <Collapse in={isExpanded}>
                    <Box px={3} pb={3} position="relative">
                      <Box display="flex" justifyContent="space-between" alignItems="center" position="relative">
                        {item.etapas.map((etapa, i) => {
                          let circleColor = '#e0e0e0';
                          let statusLabel = 'Pendente';
                          let statusDescricao = 'Esta etapa ainda não foi iniciada.';

                          switch (etapa.status) {
                            case 'aprovado':
                              circleColor = '#4caf50';
                              statusLabel = 'Aprovado';
                              statusDescricao = 'Etapa aprovada com sucesso.';
                              break;
                            case 'aguardando':
                              circleColor = '#ff9800';
                              statusLabel = 'Aguardando';
                              statusDescricao = 'Aguardando aprovação desta etapa.';
                              break;
                            case 'rejeitado':
                              circleColor = '#f44336';
                              statusLabel = 'Rejeitado';
                              statusDescricao = 'Etapa rejeitada. Verifique a devolutiva.';
                              break;
                          }

                          return (
                            <Box
                              key={etapa.nome}
                              flex={1}
                              textAlign="center"
                              position="relative"
                              sx={{ paddingTop: '48px' }}
                            >
                              {/* Linha de conexão (se não for o último item) */}
                              {i < item.etapas.length - 1 && (
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
                              {/* Texto abaixo do círculo */}
                              <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                                {statusLabel}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {etapa.nome}
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
      {item.status === 'Finalizado' ? 'Observação Final' : 'Motivo do Indeferimento'}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {item.status === 'Finalizado'
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

      {selectedPdf && (
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
          onClick={() => setSelectedPdf(null)}
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
          height: 'calc(100% - 48px)', // espaço ajustado para o header
          overflow: 'hidden',
          borderRadius: 1,
        }}
      >
        <PdfViewer url={selectedPdf} height="100%" width="100%" />
      </Box>
    </Paper>
  </Box>
)}







    </Box>
  );
}
