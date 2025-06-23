import { Box, Container, useMediaQuery } from "@mui/material";
import Banner from "./components/banner";
import backgroundIMage from "./images/logoBranca.png";
import Form from "./components/form/form";

export default function Login() {
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      <Box
        sx={{
          height: "100vh",
          background: " #050A24",
          width: "50%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center"
        }}
      >
        <Banner />
      </Box>
      <Box
        sx={{
          height: "100vh",
          background: "white",
          width: "50%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <Form />
      </Box>
    </Container>
  );
}
