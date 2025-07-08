import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PdfViewer from '../shared/PdfViewer';
import { ApiService } from '../interceptors/Api/api.intercept';
import { useSnackbarStore } from '../shared/useSnackbar';
import { ServicoArmazenamento } from '../shared/services/storage.service';
import { apiURL } from '../config';
import { AuthService } from '../auth/components/form/auth.service';

const EnvioAtestado = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [observacao, setObservacao] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = () => {
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    const { showSnackbar } = useSnackbarStore.getState();

    if (!file) {
      showSnackbar('Selecione um arquivo para enviar.', 'error');
      return;
    }

    try {
      const servicoArmazenamento = AuthService.getInstance();
      const usuario = servicoArmazenamento.getUserStorage();
      const usuarioId = usuario?.id; // ajuste se o campo do usuário for diferente
      const api = ApiService.getInstance();

      const requerimentoResp = await api.post(`${apiURL}/requerimentos`, {
        tipo: 0, // ATESTADO
        status: 2, // EM_PROCESSO
        etapa: 0, // TRIAGEM
        assinatura: '',
        observacao,
        usuarioId,
      });

      const requerimentoId = requerimentoResp.data.id; // ajustar chave conforme retorno do backend
      const formData = new FormData();
      formData.append('arquivo', file); // ajustar nome do campo conforme backend
      formData.append('requerimentoId', requerimentoId.toString());

      await api.post(`${apiURL}/documentos`, formData, {
        headers: {
          // o axios define automaticamente o Content-Type multipart/form-data
        },
      });

      showSnackbar('Atestado enviado com sucesso!', 'success');
      setModalOpen(false);
      setFile(null);
      setPreviewUrl(null);
      setObservacao('');
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 4, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#173557', textAlign: 'center' }}>
          Envio de atestado para o SESMT
        </Typography>

        <Grid container spacing={2} justifyContent="center" alignItems="flex-start">
          <Grid item xs={12} md={5}>
            <Box>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<UploadFileIcon />}
                sx={{ height: 40, borderRadius: 2 }}
              >
                Anexar Documento
                <input
                  hidden
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <Chip
                  icon={<InsertDriveFileIcon />}
                  label={file.name}
                  sx={{ mt: 1.5, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                />
              )}

              <TextField
                label="Observações"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, backgroundColor: '#173557', ':hover': { backgroundColor: '#0f223a' }, height: 40 }}
                onClick={handleSubmit}
              >
                Enviar
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {previewUrl && (
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, backgroundColor: '#fff', boxShadow: 2 }}>
                {renderPreview()}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Confirmar Envio</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom><strong>Observação:</strong> {observacao}</Typography>
          <Typography variant="subtitle1" gutterBottom><strong>Arquivo:</strong> {file?.name}</Typography>
          <Box mt={2}>{renderPreview()}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} sx={{color: '#FF0808' }}>Cancelar</Button>
          <Button onClick={handleConfirm} variant="contained" sx={{ backgroundColor: '#173557' }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EnvioAtestado;
