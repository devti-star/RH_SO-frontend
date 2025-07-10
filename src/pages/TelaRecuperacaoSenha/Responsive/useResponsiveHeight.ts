import { useMediaQuery } from '@mui/material';

export const useResponsiveHeight = () => {

  const isMobile = useMediaQuery("(max-width: 885px)");
  const isMobileTiny = useMediaQuery("(max-width: 619px)");

  const sizes: Record<string, string> = {
    mobile: "690px",
    mobileTiny: "1000px", 
  };

  const altura =
    (isMobile && sizes.mobile) ||
    (isMobileTiny && sizes.mobileTiny) || "580px";

  return altura;
};
