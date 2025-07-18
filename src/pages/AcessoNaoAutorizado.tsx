import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

export default function AcessoNaoAutorizado() {

  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        minWidth:'100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: 'center',
          backgroundColor: '#fff',
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Box mb={3}>
          <ErrorOutlineIcon sx={{ fontSize: 100, color: '#D41317' }} />
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#173557', mb: 2 }}>
          401 - Acesso não autorizado
        </Typography>
        <Typography variant="body1" sx={{ color: '#444', mb: 4 }}>
          Opa! Você não tem permissão para acessar essa página
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#050a24',
            color: '#fff',
            paddingX: 4,
            '&:hover': { backgroundColor: '#173557' },
          }}
          onClick={() => navigate(-2)}
        >
          Voltar para a página anterior
        </Button>
      </Paper>
    </Container>
  );
}
