import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useLocation, useNavigate } from 'react-router-dom'; // Importações adicionadas

/* alteraçoes que for feitas no routesconfig devem alterar este array*/

const routes = [
  { label: 'Minhas Solicitações', path: '/minhas-solicitacoes' },
  { label: 'Enviar Atestado', path: '/enviar-atestado' },
  { label: 'Requerimento RH', path: '/requerimento-rh' },
  { label: 'Meus Dados', path: '/meus-dados' },
];
const settings = ['Sair'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const location = useLocation(); // Obtém a rota atual
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{backgroundColor:'#121B23'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo para telas grandes */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
           <Box component="img" sx={{height:40, width:'auto',}} src="src/assets/logoBranca.png" />
          </Typography>

          {/* Menu hambúrguer para mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu navegação"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                {routes.map((route) => (
                <MenuItem 
                  key={route.path} 
                  onClick={() => handleCloseNavMenu(route.path)}
                  sx={{
                    borderBottom: location.pathname === route.path 
                      ? '2px solid white' 
                      : 'none',
                  }}
                >
                  <Typography textAlign="center">{route.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo para mobile */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}

          >
           <Box component="img" sx={{height:40, width:'auto',}} src="src/assets/logoBranca.png" />
          </Typography>

          {/* Botões para desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            {routes.map((route) => (
              <Button
                key={route.path}
                onClick={() => handleCloseNavMenu(route.path)}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: location.pathname === route.path 
                      ? 'white' 
                      : 'transparent',
                    transform: location.pathname === route.path 
                      ? 'scaleX(1)' 
                      : 'scaleX(0)',
                    transition: 'transform 0.3s ease, background-color 0.3s ease',
                  },
                  '&:hover:after': {
                    backgroundColor: 'white',
                    transform: 'scaleX(1)',
                  },
                }}
              >
                {route.label}
              </Button>
            ))}
          </Box>
                      
          {/* Avatar e menu do usuário */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir configurações">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Usuário" variant="square"/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

