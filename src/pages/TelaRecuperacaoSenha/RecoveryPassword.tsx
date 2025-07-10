import { Box, Container, useMediaQuery } from "@mui/material";
import Banner from "../../shared/banner";
import { useResponsiveImageWidth } from "../../shared/useResponsiveImageWidth";
import logo from "../../shared/images/brasaoAzul.png";
import { useState } from "react";
import { useResponsivePadding } from "./Responsive/useResponsivePadding";
import { useResponsiveHeight } from "./Responsive/useResponsiveHeight";
import FormCadastro from "./form/form";
import { useLocation } from "react-router-dom";


export default function RecoveryPassword() {
  const isMobile = useMediaQuery("(max-width: 885px)");
  const isMobileTiny = useMediaQuery("(max-width: 619px)");
  const espacamento = useResponsivePadding();
  const altura = useResponsiveHeight();
  const location = useLocation(); // Adicione este hook


  
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        display: "flex",
        backgroundColor: "transparent",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            height: "100%",
            background: " #050A24",
            width: "40%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Banner largura_imagem={300} />
        </Box>
      )}
      <Box
        sx={{
          height: "100%",
          background: "white",
          width: isMobile ? "100%" : "60%",
          display: "flex",
          flexDirection: "row",
          justifyContent: isMobile ? "center" : "flex-start",
          alignItems: "center",

        }}
      >
        <Box
          sx={{
            minHeight: altura,
            width: "90%",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "center" : "flex-start",
            alignItems: "center",
            borderRadius: isMobile
              ? "30px 30px 30px 30px"
              : "0px 30px 30px 0px",
            boxShadow: "0px 6px 5px rgba(193, 192, 192, 0.6)",
            pt: isMobileTiny ? 25 : 0,
          }}
        >
          {isMobile && <img src={logo} style={{ width: "200px" }} />}
          <FormCadastro espacamento={espacamento} flex_direction={isMobileTiny ? "column" : "row"} />
        </Box>
      </Box>
    </Container>
  );
}
