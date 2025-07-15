import { useMediaQuery, useTheme } from '@mui/material';

export const useResponsiveBannerHeight = () => {

  const theme = useTheme();
  
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));
    const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
    // Dicionário dos tamanhos da imagem por breakpoint
    const sizes: Record<string, string> = {
      sm: "420px", // até 899
      md: "430px", // até 1199
      lg: "420px", // até 1535
      xl: "420px", //a partir de 1536
    };
  
    const altura =
      (isXs && sizes.xs) ||
      (isSm && sizes.sm) ||
      (isMd && sizes.md) ||
      (isLg && sizes.lg) ||
      (isXl && sizes.xl) ||
      sizes.md; // fallback padrão
  
    return altura;
};
