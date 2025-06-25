import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function RequerimentoCarimbos() {
  const [formList, setFormList] = useState<any[]>([]);

  const handleAddForm = (preFilled = false) => {
    const newForm = preFilled
      ? {
          nome: 'João da Silva',
          matricula: '123456',
          secretaria: 'Saúde',
          departamento: 'Vigilância',
          quantidade: '1',
          observacao: '',
        }
      : {
          nome: '',
          matricula: '',
          secretaria: '',
          departamento: '',
          quantidade: '',
          observacao: '',
        };

    setFormList((prev) => [...prev, newForm]);
  };

  const handleRemoveForm = (index: number) => {
    const newList = [...formList];
    newList.splice(index, 1);
    setFormList(newList);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedList = [...formList];
    updatedList[index][field] = value;
    setFormList(updatedList);
  };

  const handleSubmit = () => {
    console.log('Enviando solicitação:', formList);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f9f9f9',
        px: 2,
        py: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        Requerimento de Carimbos
      </Typography>

      {formList.length === 0 && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: '#050A24', '&:hover': { bgcolor: '#173557' } }}
            onClick={() => handleAddForm(true)}
          >
            Para mim
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#050A24', '&:hover': { bgcolor: '#173557' } }}
            onClick={() => handleAddForm(false)}
          >
            Para outra pessoa
          </Button>
        </Box>
      )}

      {formList.map((form, index) => (
        <Container key={index} maxWidth="lg" sx={{ mb: 4, position: 'relative' }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <IconButton
              onClick={() => handleRemoveForm(index)}
              sx={{ position: 'absolute', top: 0, right: 25 }}
            >
              <CloseIcon />
            </IconButton>

            <Box
              sx={{
                display: 'flex',
                gap: 4,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Informações do requerido
                </Typography>
                <TextField
                  fullWidth
                  label="Nome completo"
                  value={form.nome}
                  onChange={(e) => handleChange(index, 'nome', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Matrícula"
                  value={form.matricula}
                  onChange={(e) => handleChange(index, 'matricula', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Secretaria"
                  value={form.secretaria}
                  onChange={(e) => handleChange(index, 'secretaria', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Departamento"
                  value={form.departamento}
                  onChange={(e) => handleChange(index, 'departamento', e.target.value)}
                />

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Informações do carimbo
                </Typography>
                <TextField
                  fullWidth
                  label="Quantidade"
                  value={form.quantidade}
                  onChange={(e) => handleChange(index, 'quantidade', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Observação"
                  value={form.observacao}
                  onChange={(e) => handleChange(index, 'observacao', e.target.value)}
                />
              </Box>
            </Box>
          </Paper>
        </Container>
      ))}

      {formList.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 6 }}>
          <Button
            onClick={() => handleAddForm(false)}
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: '#fff',
              boxShadow: 3,
              fontSize: 32,
              color: '#000',
              '&:hover': {
                bgcolor: '#eaeaea',
              },
            }}
          >
            +
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              bgcolor: '#D41317',
              '&:hover': { bgcolor: '#b01013' },
              px: 6,
            }}
          >
            Enviar Solicitação
          </Button>
        </Box>
      )}
    </Box>
  );
}
