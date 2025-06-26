import { Box, Container } from "@mui/material";
import { useResponsiveBoxFormWidth } from "../../auth/components/form/responsive/useResponsiveBoxFormWidth";
import { useResponsivePadding } from "../../auth/components/form/responsive/useResponsivePadding";
import { useResponsiveImageWidth } from "../../shared/useResponsiveImageWidth";
import FormMeusDados from "./form-meus-dados";


export default function MeusDados(){
    const largura_form = useResponsiveBoxFormWidth();


    return(
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          height: "100vh",
          display: "flex",
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Box
            sx={{
              height: "780px",
              width: "1280px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              borderRadius: "0px 30px 30px 0px",
              boxShadow: "0px 6px 5px rgba(193, 192, 192, 0.6)",
            }}
          >
          <FormMeusDados></FormMeusDados>
        </Box>
      </Container>
    );
}