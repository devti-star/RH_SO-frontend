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
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Definindo tipos para as rotas e subrotas
type RouteItem = {
  label: string;
  path?: string;
  subItems?: Array<{ label: string; path: string }>;
};

const routes: RouteItem[] = [
  { label: 'Minhas Solicitações', path: '/minhas-solicitacoes' },
  { label: 'Enviar Atestado', path: '/enviar-atestado' },
  { label: 'Requerimento RH' },
  {
    label: 'Solicitações',
    subItems: [
      { label: 'Solicitação de Carimbo', path: '/ferias' },
      { label: 'Solicitação de Crachá', path: '/aumento-salarial' },
    ],
  },
];

const settings = ['Meus Dados', 'Sair'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = React.useState<string | null>(null);
  const [dropdownAnchor, setDropdownAnchor] = React.useState<null | HTMLElement>(null);
  const [hoverDropdown, setHoverDropdown] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (path?: string) => {
    setAnchorElNav(null);
    if (path) {
      navigate(path);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenMobileDropdown = (label: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === label ? null : label);
  };

  const isActive = (path?: string, subItems?: Array<{ path: string }>) => {
    if (path) return location.pathname === path;
    if (subItems) return subItems.some(subItem => location.pathname === subItem.path);
    return false;
  };

  const handleOpenDropdown = (label: string, event: React.MouseEvent<HTMLElement>) => {
    setDropdownAnchor(event.currentTarget);
    setHoverDropdown(label);
  };

  const handleCloseDropdown = () => {
    setHoverDropdown(null);
    setDropdownAnchor(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#050a24' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 100, px: 2 }}>
          {/* Logo fixada à esquerda */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Box component="img" sx={{ height: 60, width: 'auto' }} src="src/assets/logoBranca.png" />
          </Box>

          {/* Botões centralizados */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {routes.map((route) => {
              if (route.subItems) {
                const active = isActive(route.path, route.subItems);
                return (
                  <Box
                    key={route.label}
                    sx={{ position: 'relative' }}
                    onMouseEnter={(e) => handleOpenDropdown(route.label, e)}
                    onMouseLeave={handleCloseDropdown}
                  >
                    <Button
                      sx={{
                        mx: 1,
                        color: 'white',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          backgroundColor: active ? 'white' : 'transparent',
                          transform: active ? 'scaleX(1)' : 'scaleX(0)',
                          transition: 'transform 0.3s ease, background-color 0.3s ease',
                        },
                        '&:hover:after': {
                          backgroundColor: 'white',
                          transform: 'scaleX(1)',
                        },
                      }}
                    >
                      {route.label}
                      <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                    </Button>

                    <Menu
                      anchorEl={dropdownAnchor}
                      open={hoverDropdown === route.label}
                      onClose={handleCloseDropdown}
                      MenuListProps={{
                        onMouseLeave: handleCloseDropdown,
                        sx: { py: 0 },
                      }}
                      PaperProps={{
                        sx: {
                          backgroundColor: '#050a24',
                          minWidth: '200px',
                          boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                          zIndex: 1,
                          borderRadius: '10px',
                          overflow: 'hidden',
                        },
                      }}
                    >
                      {route.subItems.map((subItem) => (
                        <MenuItem
                          key={subItem.path}
                          onClick={() => {
                            handleCloseDropdown();
                            navigate(subItem.path);
                          }}
                          sx={{
                            px: 3,
                            py: 1.5,
                            color: 'white',
                            backgroundColor:
                              location.pathname === subItem.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            },
                          }}
                        >
                          {subItem.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                );
              } else {
                const active = isActive(route.path);
                return (
                  <Button
                    key={route.path}
                    onClick={() => navigate(route.path!)}
                    sx={{
                      mx: 1,
                      color: 'white',
                      fontSize: '1.1rem',
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: active ? 'white' : 'transparent',
                        transform: active ? 'scaleX(1)' : 'scaleX(0)',
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
                );
              }
            })}
          </Box>

          {/* Área do usuário */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir configurações">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Usuário" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-user"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{ sx: { backgroundColor: '#050a24', color: 'white' } }}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={handleCloseUserMenu}
                  sx={{ backgroundColor: '#050a24', color: '#ffffff' }}
                >
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
