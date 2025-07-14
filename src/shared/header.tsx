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
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { AuthService } from '../auth/components/form/auth.service';
import { getUsuario } from "../shared/services/usuario.service";
import { ApiService } from "../interceptors/Api/api.intercept";
import { Roles, type RolesType } from '../models/roles';

// Rotas e settings (não alterei)
type RouteItem = {
  label: string;
  path?: string;
  subItems?: Array<{ label: string; path: string }>;
  roles?: RolesType[];
};
const routes: RouteItem[] = [
  {
    label: 'Minhas Solicitações',
    path: '/MinhasSolicitacoes',
    roles: [Roles.ADMIN, Roles.ENFERMEIRO, Roles.MEDICO, Roles.PADRAO, Roles.PS, Roles.RH, Roles.TRIAGEM]
  },
  {
    label: 'Enviar Atestado',
    path: '/enviar-atestado',
    roles: [Roles.ADMIN, Roles.ENFERMEIRO, Roles.MEDICO, Roles.PADRAO, Roles.PS, Roles.RH, Roles.TRIAGEM]
  },
  {
    label: 'Painel SESMT',
    path: '/admin',
    roles: [Roles.ADMIN, Roles.ENFERMEIRO, Roles.MEDICO, Roles.PS, Roles.RH, Roles.TRIAGEM]
  },
];

type SettingItem = {
  label: string;
  roles?: RolesType[];
};
const settings: SettingItem[] = [
  { label: 'Meus Dados', roles: [Roles.PADRAO, Roles.ADMIN, Roles.RH, Roles.PS, Roles.TRIAGEM, Roles.MEDICO, Roles.ENFERMEIRO] },
  { label: 'Sair', roles: [Roles.PADRAO, Roles.ADMIN, Roles.RH, Roles.PS, Roles.TRIAGEM, Roles.MEDICO, Roles.ENFERMEIRO] }
];

// --------- Estilos customizados MUI -----------
const appBarStyles = {
  background: 'linear-gradient(90deg, #050A24 70%, #173557 100%)',
  boxShadow: '0 1px 8px rgba(5,10,36,0.09)',
  minHeight: '58px',
  justifyContent: 'center',
};

const logoBox = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  mr: { xs: 1, md: 4 }
};

const logoImg = {
  height: { xs: 40, sm: 48 },
  width: 'auto',
  transition: 'transform .14s',
  '&:hover': {
    transform: 'scale(1.04)'
  }
};

const navButton = (active: boolean) => ({
  color: '#fff',
  fontWeight: active ? 600 : 400,
  borderRadius: '8px',
  mx: 1,
  fontSize: '1rem',
  letterSpacing: '.01em',
  textTransform: 'none',
  background: active ? 'rgba(255,255,255,0.10)' : 'none',
  boxShadow: active ? '0 2px 6px rgba(5,10,36,0.09)' : 'none',
  px: 2.2,
  transition: 'all 0.18s',
  borderBottom: active ? '2.5px solid #fff' : '2.5px solid transparent',
  '&:hover': {
    background: 'rgba(255,255,255,0.12)',
    color: '#fff'
  }
});


const userBox = {
  flexGrow: 0,
  display: 'flex',
  alignItems: 'center',
  ml: 2
};
// --------- Fim dos estilos customizados ---------

function ResponsiveAppBar() {

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = React.useState<string | null>(null);
  const [dropdownAnchor, setDropdownAnchor] = React.useState<null | HTMLElement>(null);
  const [hoverDropdown, setHoverDropdown] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const authService: AuthService = AuthService.getInstance();
  const usuario = authService.getUserStorage();
  const usuarioId = usuario?.id ?? null;
  const usuarioRole = usuario?.role
    ? Number(usuario.role) as RolesType
    : undefined;
  const [fotoPerfilUrl, setFotoPerfilUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!usuarioId) return;

    const buscarFoto = async () => {
      try {
        const usuario = await getUsuario(usuarioId);
        if (!usuario.foto) {
          setFotoPerfilUrl(null);
          return;
        }
        const api = ApiService.getInstance();
        const resp = await api.get(`/usuarios/foto/${usuarioId}`, { responseType: "blob" });
        console.log("resposta: ", resp);
        const url = URL.createObjectURL(resp.data);
        setFotoPerfilUrl(url);
      } catch {
        setFotoPerfilUrl(null);
      }
    };

    buscarFoto();

    return () => {
      if (fotoPerfilUrl) URL.revokeObjectURL(fotoPerfilUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId]);

  // Filtrar rotas baseado na role do usuário
  const visibleRoutes = React.useMemo(() => {
    return routes.filter(route =>
      !route.roles || (usuarioRole !== undefined && route.roles.includes(usuarioRole))
    );
  }, [usuarioRole]);

  // Filtrar configurações baseado na role
  const visibleSettings = React.useMemo(() => {
    return settings.filter(setting =>
      !setting.roles || (usuarioRole !== undefined && setting.roles.includes(usuarioRole))
    );
  }, [usuarioRole]);

  // Determinar home baseado na role
  const getHomePath = () => {
    if (usuarioRole === undefined) return '/login';
    switch (usuarioRole) {
      case Roles.PADRAO:
        return '/MinhasSolicitacoes'
      default:
        return '/admin';
    }
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (path?: string) => {
    setAnchorElNav(null);
    setMobileDropdownOpen(null);
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
    <AppBar position="static" sx={appBarStyles}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: { xs: 62, md: 64 }, px: 2 }}>

          {/* Menu Hamburguer (mobile) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo institucional e nome do sistema */}
          <Box
            sx={logoBox}
            onClick={() => navigate(getHomePath())}
          >
            <Box
              component="img"
              sx={logoImg}
              src="src\shared\images\logoBranca.png"
              alt="Prefeitura de Três Lagoas"
            />
            <Typography
              sx={{
                ml: 2,
                fontWeight: 600,
                fontSize: '1.13rem',
                color: '#fff',
                letterSpacing: '.01em',
                display: { xs: 'none', sm: 'block' }
              }}>
              Sistema PGA
            </Typography>
          </Box>

          {/* Botões centralizados (desktop) */}
          <Box sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {visibleRoutes.map((route) => {
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
                      sx={navButton(active)}
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
                          backgroundColor: '#173557',
                          minWidth: '200px',
                          boxShadow: '0px 8px 24px 0px rgba(5,10,36,0.11)',
                          zIndex: 1,
                          borderRadius: '10px',
                          overflow: 'hidden',
                          color: '#fff'
                        },
                      }}
                    >
                      {route.subItems?.map((subItem) => (
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
                              location.pathname === subItem.path ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.13)',
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
                    sx={navButton(active)}
                  >
                    {route.label}
                  </Button>
                );
              }
            })}
          </Box>

          {/* Menu Hamburguer (conteúdo mobile) */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElNav)}
            onClose={() => handleCloseNavMenu()}
            sx={{
              display: { xs: 'block', md: 'none' }
            }}
            PaperProps={{
              sx: {
                backgroundColor: '#173557',
                color: 'white',
                width: '100%',
                maxWidth: '100vw',
                borderRadius: '0 0 14px 14px'
              }
            }}
          >
            {visibleRoutes.map((route) => {
              if (route.subItems) {
                return (
                  <React.Fragment key={route.label}>
                    <MenuItem
                      onClick={() => handleOpenMobileDropdown(route.label)}
                      sx={{ py: 1.5 }}
                    >
                      <Typography variant="body1">{route.label}</Typography>
                      {mobileDropdownOpen === route.label ? <ExpandLess sx={{ ml: 'auto' }} /> : <ExpandMore sx={{ ml: 'auto' }} />}
                    </MenuItem>

                    <Collapse in={mobileDropdownOpen === route.label} timeout="auto" unmountOnExit>
                      {route.subItems.map((subItem) => (
                        <MenuItem
                          key={subItem.path}
                          onClick={() => handleCloseNavMenu(subItem.path)}
                          sx={{
                            py: 1.5,
                            pl: 4,
                            backgroundColor: location.pathname === subItem.path ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                          }}
                        >
                          {subItem.label}
                        </MenuItem>
                      ))}
                    </Collapse>
                  </React.Fragment>
                );
              } else {
                return (
                  <MenuItem
                    key={route.label}
                    onClick={() => route.path && handleCloseNavMenu(route.path)}
                    sx={{
                      py: 1.5,
                      backgroundColor: isActive(route.path) ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    }}
                  >
                    <Typography variant="body1">{route.label}</Typography>
                  </MenuItem>
                );
              }
            })}
          </Menu>

          {/* Área do usuário */}
          <Box sx={userBox}>
            <Tooltip title="Abrir configurações">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: { xs: 0, md: 1 } }}>
                <Avatar alt="Usuário" src={fotoPerfilUrl ?? undefined} sx={{ bgcolor: '#173557', width: 38, height: 38 }} />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 500,
                fontSize: '1rem',
                ml: 1,
                display: { xs: 'none', md: 'block' },
                opacity: .92,
                maxWidth: 120,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {usuario?.nomeCompleto?.split(' ')[0] ?? ''}
            </Typography>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-user"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{ sx: { backgroundColor: '#173557', color: 'white', borderRadius: 2, minWidth: 150 } }}
            >
              {visibleSettings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting.label === 'Meus Dados') navigate('/meus-dados');
                    if (setting.label === 'Sair') {
                      authService.logout();
                      navigate('/login');
                    }
                  }}
                  sx={{ backgroundColor: 'transparent', color: '#fff', fontSize: '.97rem' }}
                >
                  <Typography textAlign="center">{setting.label}</Typography>
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
