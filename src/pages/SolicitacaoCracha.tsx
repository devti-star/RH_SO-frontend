import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material'

export default function SolicitacaoCracha() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f9f9f9',
        minWidth: '100vw',

      }}
    >
      <Container maxWidth="lg" >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            Requerimento de Crachá
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
              mb: 4,
            }}
          >
            {/* Área dos inputs */}
            <Box sx={{ display: 'flex', gap: 4 }}>
              {/* Coluna Esquerda */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
                <TextField fullWidth label="Nome Completo" sx={{ width: '400px' }}/>
                <TextField fullWidth label="Nome na frente" sx={{ width: '400px' }}/>
                <TextField fullWidth label="RG" sx={{ width: '400px' }}/>
              </Box>

              {/* Coluna Direita */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
                <TextField fullWidth label="Cargo" sx={{ width: '400px' }}/>
                <TextField fullWidth label="Matrícula" sx={{ width: '400px' }}/>
                <TextField fullWidth label="Secretaria" sx={{ width: '400px' }}/>
              </Box>
            </Box>

            {/* Área da foto */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Typography variant="subtitle1">Foto</Typography>
              <Box
                sx={{
                  width: 180,
                  height: 220,
                  bgcolor: '#e0e0e0',
                  borderRadius: 2,
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#050A24',
                  '&:hover': { bgcolor: '#173557' },
                  width: '100%',
                }}
              >
                Alterar foto
              </Button>
            </Box>
          </Box>

          {/* Botão Enviar */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#D41317',
                '&:hover': { bgcolor: '#b01013' },
                px: 6,
              }}
            >
              Enviar Solicitação
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
