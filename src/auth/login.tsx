import { Box, Container, useMediaQuery } from "@mui/material";
import Banner from "../shared/banner";
import Form from "./components/form/form";
import { useResponsiveImageWidth } from "../shared/useResponsiveImageWidth";
import logo from "./../shared/images/brasaoAzul.png";
import { useResponsivePadding } from "./components/form/responsive/useResponsivePadding";
import { useResponsiveBoxFormWidth } from "./components/form/responsive/useResponsiveBoxFormWidth";

export default function Login() {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const largura_imagem = useResponsiveImageWidth();
  const espacamento = useResponsivePadding();
  const largura_form = useResponsiveBoxFormWidth();

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        display: "flex",
        backgroundColor: "transparent",
        flexDirection: "row",
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            height: "100vh",
            background: " #050A24",
            width: "50%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Banner largura_imagem={largura_imagem} />
        </Box>
      )}
      <Box
        sx={{
          height: "100vh",
          background: "white",
          width: isMobile ? "100%" : "50%",
          display: "flex",
          flexDirection: "row",
          justifyContent: isMobile ? "center" : "flex-start",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "580px",
            width: largura_form,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "center" : "flex-start",
            alignItems: "center",
            borderRadius: isMobile ? "30px 30px 30px 30px" : "0px 30px 30px 0px",
            boxShadow: "0px 6px 5px rgba(193, 192, 192, 0.6)",
          }}
        >
          {isMobile && <img src={logo} style={{ width: "200px" }} />}
          <Form espacamento={espacamento}/>
        </Box>
      </Box>
    </Container>
  );
}
