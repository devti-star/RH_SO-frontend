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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// --- Tipos Originais ---
type RouteItem = {
  label: string;
  path?: string;
  subItems?: Array<{ label: string; path: string }>;
  roles?: RolesType[];
};
type SettingItem = {
  label: string;
  roles?: RolesType[];
};
// --- Tipos de Item para o menu mobile (usando discriminated union) ---
type MobileMenuRoute = RouteItem & { kind: 'route' };
type MobileMenuSetting = SettingItem & { kind: 'setting' };
type MobileMenuItem = MobileMenuRoute | MobileMenuSetting;

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
   zIndex: 1301,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const visibleRoutes = React.useMemo(() => {
    return routes.filter(route =>
      !route.roles || (usuarioRole !== undefined && route.roles.includes(usuarioRole))
    );
  }, [usuarioRole]);
  const visibleSettings = React.useMemo(() => {
    return settings.filter(setting =>
      !setting.roles || (usuarioRole !== undefined && setting.roles.includes(usuarioRole))
    );
  }, [usuarioRole]);
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
  if (anchorElNav) {
    setAnchorElNav(null); // Fecha se já está aberto
  } else {
    setAnchorElNav(event.currentTarget); // Abre se estiver fechado
  }
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

  const mobileMenuItems: MobileMenuItem[] = [
    ...visibleRoutes.map(route => ({ ...route, kind: 'route' as const })),
    ...visibleSettings.map(setting => ({ ...setting, kind: 'setting' as const }))
  ];

  return (
    <AppBar position="fixed" sx={{ ...appBarStyles }}>
      
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: { xs: 62, md: 64 }, px: 2, minHeight: 58 }}>

          {/* Logo à esquerda sempre */}
          <Box
            sx={{ ...logoBox, ml: 0, mr: { xs: 1, md: 4 }, flexGrow: 1, justifyContent: 'flex-start' }}
            onClick={() => navigate(getHomePath())}
          >
            <Box
              component="img"
              sx={logoImg}
              src="src/shared/images/logoBranca.png"
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

          {/* Menu Hamburguer à direita (mobile) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
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

          {/* Área do usuário (apenas desktop) */}
          <Box sx={{ ...userBox, display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Abrir configurações">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 1 }}>
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
                  sx={{
                    backgroundColor: 'transparent',
                    color: setting.label === 'Sair' ? '#f44336' : '#fff',
                    fontWeight: setting.label === 'Sair' ? 700 : 400,
                    fontSize: '.97rem',
                    justifyContent: 'center'
                  }}
                >
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Menu hamburguer (mobile): rotas + configurações */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElNav)}
            onClose={() => handleCloseNavMenu()}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiPaper-root': {
                width: '100vw !important',
                maxWidth: '100vw !important',
                left: '0 !important',
                borderRadius: '0 0 14px 14px',
                // zIndex:'1',

              }
            }}
            PaperProps={{
              sx: {
                // gradiente igual do navbar!
                background: 'linear-gradient(90deg, #050A24 70%, #173557 100%)',
                color: 'white',
                width: '100vw',
                maxWidth: '100vw',
                left: 0,
                borderRadius: '0 0 14px 14px',
                pt: { xs: '100px', md: 2 }, // Altura do seu AppBar em mobile (ajuste se for diferente)
                marginTop: {xs:'0vh', md:'5vh' },
                pb: 2, // espaçamento inferior
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                
              }
            }}
          >
            {mobileMenuItems.map((item) => {
              // Rotas com subitens
              if (item.kind === 'route' && item.subItems) {
                return (
                  <React.Fragment key={item.label}>
                    <MenuItem
                      onClick={() => handleOpenMobileDropdown(item.label)}
                      sx={{ py: 1.5, justifyContent: 'center', width: '100%' }}
                    >
                      <Typography variant="body1" sx={{ width: '100%', textAlign: 'center' }}>{item.label}</Typography>
                      {mobileDropdownOpen === item.label ? <ExpandLess sx={{ ml: 'auto' }} /> : <ExpandMore sx={{ ml: 'auto' }} />}
                    </MenuItem>

                    <Collapse in={mobileDropdownOpen === item.label} timeout="auto" unmountOnExit>
                      {item.subItems.map((subItem) => (
                        <MenuItem
                          key={subItem.path}
                          onClick={() => handleCloseNavMenu(subItem.path)}
                          sx={{
                            py: 1.5,
                            pl: 4,
                            width: '100%',
                            justifyContent: 'center',
                            backgroundColor: location.pathname === subItem.path ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                          }}
                        >
                          <Typography sx={{ width: '100%', textAlign: 'center' }}>{subItem.label}</Typography>
                        </MenuItem>
                      ))}
                    </Collapse>
                  </React.Fragment>
                );
              }
              // Rotas simples
              else if (item.kind === 'route') {
                return (
                  <MenuItem
                    key={item.label}
                    onClick={() => item.path && handleCloseNavMenu(item.path)}
                    sx={{
                      py: 1.5,
                      backgroundColor: item.path && isActive(item.path) ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body1" sx={{ width: '100%', textAlign: 'center' }}>{item.label}</Typography>
                  </MenuItem>
                );
              }
              // Configurações
              else if (item.kind === 'setting') {
                return (
                  <MenuItem
                    key={item.label}
                    onClick={() => {
                      handleCloseNavMenu();
                      if (item.label === 'Meus Dados') navigate('/meus-dados');
                      if (item.label === 'Sair') {
                        authService.logout();
                        navigate('/login');
                      }
                    }}
                    sx={{
                      py: 1.5,
                      color: item.label === 'Sair' ? '#f44336' : '#fff',
                      fontWeight: item.label === 'Sair' ? 700 : 400,
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body1" sx={{
                      width: '100%',
                      textAlign: 'center',
                      color: item.label === 'Sair' ? '#f44336' : '#fff',
                      fontWeight: item.label === 'Sair' ? 700 : 400,
                    }}>
                      {item.label}
                    </Typography>
                  </MenuItem>
                );
              }
              return null;
            })}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
    
  );
}

export default ResponsiveAppBar;
