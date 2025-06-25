import { Box, Container, useMediaQuery } from "@mui/material";
import Banner from "../../shared/banner";
import logo from '../../shared/images/logoBranca.png'
import FormCadastro from "./components/FormCadastro";

export default function TelaCadastro() {

    const isMobile = useMediaQuery("(max-width: 600px)");

    
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
          <Banner  />
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
            width: "490px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "center" : "flex-start",
            alignItems: "center",
            borderRadius: isMobile ? "30px 30px 30px 30px" : "0px 30px 30px 0px",
            boxShadow: "0px 6px 5px rgba(193, 192, 192, 0.6)",
          }}
        >
          {isMobile && <img src={logo} style={{ width: "200px" }} />}
          <FormCadastro />
        </Box>
      </Box>
    </Container>
  );
}
