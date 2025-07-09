import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Stack,
  useMediaQuery,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import PdfViewer from '../shared/PdfViewer';
import { ApiService } from '../interceptors/Api/api.intercept';
import { useSnackbarStore } from '../shared/useSnackbar';
import { apiURL } from '../config';
import { AuthService } from '../auth/components/form/auth.service';

const TRANSITION = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

const EnvioAtestado = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [observacao, setObservacao] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(true);

  const [fileError, setFileError] = useState(false);
  const [obsError, setObsError] = useState(false);

  const isMobile = useMediaQuery('(max-width:900px)');

  // Ref para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCloseAlertModal = () => {
    setAlertModalOpen(false);
    localStorage.setItem('alerta_atestado_ok', 'true');
  };

  const handleOpenAlertModal = () => setAlertModalOpen(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileError(false);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileError(false);
    // Limpa o valor do input para permitir anexar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleObservacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObservacao(e.target.value);
    setObsError(false);
  };

  const handleSubmit = () => {
    let erro = false;
    if (!file) {
      setFileError(true);
      erro = true;
    }
    // if (!observacao.trim()) {
    //   setObsError(true);
    //   erro = true;
    // }
    if (erro) return;
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    const { showSnackbar } = useSnackbarStore.getState();

    if (!file /*|| !observacao.trim()*/) {
      showSnackbar('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    try {
      const servicoArmazenamento = AuthService.getInstance();
      const usuario = servicoArmazenamento.getUserStorage();
      const usuarioId = usuario?.id;
      const api = ApiService.getInstance();

      const requerimentoResp = await api.post(`${apiURL}/requerimentos`, {
        tipo: 0,
        status: 2,
        etapa: 0,
        assinatura: '',
        observacao,
        usuarioId,
      });

      const requerimentoId = requerimentoResp.data.id;
      const formData = new FormData();
      formData.append('arquivo', file);
      formData.append('requerimentoId', requerimentoId.toString());

      await api.post(`${apiURL}/documentos`, formData);

      showSnackbar('Atestado enviado com sucesso!', 'success');
      setModalOpen(false);
      setFile(null);
      setPreviewUrl(null);
      setObservacao('');
      // Limpa o input após envio com sucesso
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      showSnackbar('Erro ao enviar atestado.', 'error');
      console.log(`Erro: ${error}`)
    }
  };

  const renderPreview = () => {
    if (!previewUrl || !file) return null;
    if (file.type.startsWith('image/')) {
      return (
        <Box
          component="img"
          src={previewUrl}
          alt="Preview"
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        />
      );
    } else if (file.type === 'application/pdf') {
      return <PdfViewer url={previewUrl} height="500px" width="100%" />;
    }
    return <Typography variant="body2">Arquivo não suportado para visualização.</Typography>;
  };

  const canSubmit = !!file /*&& !!observacao.trim()*/;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* MODAL DE ALERTA */}
      <Dialog
        open={alertModalOpen}
        onClose={handleCloseAlertModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            background: '#e9f3fd',
            border: '1.5px solid #1976d2',
            boxShadow: 3,
            textAlign: 'center',
          },
        }}
      >
        <DialogTitle sx={{ color: '#1976d2', fontWeight: 700 }}>
          Atenção!
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#173557', fontWeight: 600 }}>
            O atestado a ser anexado deve conter:
          </Typography>
          <List dense sx={{ pl: 2, textAlign: 'left' }}>
            <ListItem disablePadding>
              <ListItemText primary="• Identificação do médico: nome e CRM/UF" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="• Registro de Qualificação de Especialista (RQE), quando houver" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="• Identificação do paciente: nome e número do CPF, quando houver" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="• Data de emissão" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="• Assinatura qualificada do médico, quando documento eletrônico" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="• Assinatura e carimbo ou número de registro no Conselho Regional de Medicina, quando manuscrito" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="• Dados de contato profissional (telefone e/ou e-mail)" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="• Endereço profissional ou residencial do médico" />
            </ListItem>
          </List>
          <Typography sx={{ mt: 2, fontSize: 14, color: '#555' }}>
            Confira se o atestado está completo antes de enviar.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={handleCloseAlertModal}
            variant="contained"
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: '#173557',
              ':hover': { backgroundColor: '#0f223a' },
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Entendi
          </Button>
        </DialogActions>
      </Dialog>

      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 4,
          backgroundColor: '#f9f9f9',
          overflow: 'hidden',
          transition: TRANSITION,
          minHeight: 420,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, color: '#173557', textAlign: 'center' }}
        >
          Envio de atestado para o SESMT
        </Typography>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: file && !isMobile ? 'row' : 'column',
            justifyContent: 'center',
            alignItems: file && !isMobile ? 'stretch' : 'center',
            minHeight: 300,
            height: file ? 'auto' : 'calc(60vh - 80px)',
            transition: TRANSITION,
          }}
        >
          {/* Inputs - Centralizado antes do upload, lateral após */}
          <Box
            sx={{
              width: file && !isMobile ? '35%' : '60%',
              maxWidth: 700,
              mx: file && !isMobile ? 0 : 'auto',
              display: 'flex',
              alignItems: file && !isMobile ? 'center' : 'center',
              justifyContent: file && !isMobile ? 'flex-start' : 'center',
              transition: TRANSITION,
              height: '100%',
            }}
          >
            <Stack
              spacing={2}
              sx={{
                width: '100%',
                minWidth: 0,
                transition: TRANSITION,
                justifyContent: 'center',
              }}
            >
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<UploadFileIcon />}
                    sx={{
                      height: 44,
                      borderRadius: 2,
                      flex: 1,
                      borderColor: fileError ? 'red' : undefined,
                      transition: TRANSITION,
                    }}
                  >
                    Anexar Documento *
                    <input
                      ref={fileInputRef}
                      hidden
                      type="file"
                      accept=".pdf,image/png,image/jpeg,image/jpg"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Tooltip title="Requisitos para o atestado" arrow>
                    <IconButton
                      color="primary"
                      onClick={handleOpenAlertModal}
                      sx={{
                        ml: 1,
                        background: '#e9f3fd',
                        border: '1.5px solid #1976d2',
                        '&:hover': {
                          background: '#d0e6f8',
                          borderColor: '#125ba1',
                        },
                        height: 44,
                        width: 44,
                        transition: TRANSITION,
                      }}
                    >
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
                {fileError && (
                  <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                    É obrigatório anexar um documento.
                  </Typography>
                )}
              </Box>

              {file && (
                <Chip
                  icon={<InsertDriveFileIcon />}
                  label={file.name}
                  onDelete={handleRemoveFile}
                  deleteIcon={
                    <CloseIcon
                      sx={{ color: '#d41317', fontWeight: 700, '&:hover': { color: '#910c0e' } }}
                    />
                  }
                  sx={{
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mb: 1,
                    fontWeight: 500,
                    fontSize: 15,
                    background: '#f2f4f6',
                    color: '#173557',
                  }}
                />
              )}

                <TextField
                label="Observações"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                value={observacao}
                onChange={handleObservacaoChange}
                sx={{ transition: TRANSITION }}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: canSubmit ? '#173557' : '#aaa',
                  ':hover': { backgroundColor: canSubmit ? '#0f223a' : '#aaa' },
                  height: 44,
                  fontWeight: 600,
                  transition: TRANSITION,
                }}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                Enviar
              </Button>
            </Stack>
          </Box>
          {/* Preview do documento (só aparece quando há arquivo) */}
          {file && (
            <Box
              sx={{
                width: file && !isMobile ? '65%' : '100%',
                pl: file && !isMobile ? 2 : 0,
                pr: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: TRANSITION,
                minWidth: 220,
                maxWidth: 900,
              }}
            >
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#fff',
                  boxShadow: 2,
                  width: '100%',
                  minHeight: 220,
                  transition: TRANSITION,
                }}
              >
                {renderPreview()}
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Confirmar Envio</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom><strong>Observação:</strong> {observacao}</Typography>
          <Typography variant="subtitle1" gutterBottom><strong>Arquivo:</strong> {file?.name}</Typography>
          <Box mt={2}>{renderPreview()}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} sx={{ color: '#FF0808' }}>Cancelar</Button>
          <Button onClick={handleConfirm} variant="contained" sx={{ backgroundColor: '#173557' }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EnvioAtestado;
