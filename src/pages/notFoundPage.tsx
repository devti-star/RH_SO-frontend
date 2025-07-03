import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFoundPage() {
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
          404 - Página não encontrada
        </Typography>
        <Typography variant="body1" sx={{ color: '#444', mb: 4 }}>
          Opa! A página que você está tentando acessar não existe ou foi movida.
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
          onClick={() => window.location.href = '/login'}
        >
          Voltar para o Login
        </Button>
      </Paper>
    </Container>
  );
}
