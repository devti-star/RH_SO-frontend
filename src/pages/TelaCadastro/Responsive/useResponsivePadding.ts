import { useMediaQuery, useTheme } from '@mui/material';

export const useResponsivePadding = () => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));

  // Dicionário dos tamanhos da imagem por breakpoint
  const sizes: Record<string, string> = {
    xs: "10px 10px 10px 10px", //até 599
    sm: "10px 10px 10px 10px", // até 899
    md: "10px 10px 20px 10px", // até 1199
    lg: "10px 50px 10px 50px", // até 1535
    xl: "10px 50px 10px 50px", //a partir de 1536
  };

  const espacamento =
    (isXs && sizes.xs) ||
    (isSm && sizes.sm) ||
    (isMd && sizes.md) ||
    (isLg && sizes.lg) ||
    (isXl && sizes.xl) ||
    sizes.md; // fallback padrão

  return espacamento;
};
