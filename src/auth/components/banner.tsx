import { Box } from "@mui/material";
import logo from "../images/logoBranca.png";

export default function Banner() {
  return (
    <Box
      sx={{
        height: "350px",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 50px 130px 50px",
        background: "linear-gradient(to bottom, #050A24 , #0E1C58)",
        borderRadius: "0px 30px"
      }}
    >
        <img src={logo} alt="" style={{height: "330px"}}/>
    </Box>
  );
}
