import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routesConfig.tsx';
import '@fontsource/poppins/500.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { GlobalSnackbar } from './shared/GlobalSnackbar.tsx';
import { Roles } from './models/roles.ts';
import { ServicoArmazenamento } from './shared/services/storage.service.ts';

const theme = createTheme({
  palette: {
    mode: "light",
  },
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <ThemeProvider theme={theme}>
      <GlobalSnackbar></GlobalSnackbar>
    </ThemeProvider>
  </StrictMode>,
)