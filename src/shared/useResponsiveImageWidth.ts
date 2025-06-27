import { useMediaQuery, useTheme } from '@mui/material';

export const useResponsiveImageWidth = () => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));

  // Dicionário dos tamanhos da imagem por breakpoint
  const sizes: Record<string, number> = {
    xs: 200, //até 599
    sm: 240, // até 899
    md: 440, // até 1199
    lg: 490, // até 1535
    xl: 490, //a partir de 1536
  };

  const width =
    (isXs && sizes.xs) ||
    (isSm && sizes.sm) ||
    (isMd && sizes.md) ||
    (isLg && sizes.lg) ||
    (isXl && sizes.xl) ||
    sizes.md; // fallback padrão

  return width;
};
