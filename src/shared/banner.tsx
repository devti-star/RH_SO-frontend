import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";
import logo from "./images/logoBranca.png";

interface BannerProps extends BoxProps {
  largura_imagem?: string | number;
  altura_imagem?: string | number;
}

export default function Banner({ largura_imagem = "490px", altura_imagem = "350px", ...props }: BannerProps) {
  return (
    <Box
      {...props}
      sx={{
        height: altura_imagem,
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 50px 130px 50px",
        background: "linear-gradient(to bottom, #050A24 , #0E1C58)",
        borderRadius: "0px 30px",
        ...props.sx,
      }}
    >
      <img
        src={logo}
        alt="Logo da prefeitura"
        style={{
          width: typeof largura_imagem === "number" ? `${largura_imagem}px` : largura_imagem,
        }}
      />
    </Box>
  );
}
