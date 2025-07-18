import ResponsiveAppBar from "../shared/header";
import Footer from "../shared/footer/footer";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material"; // Importa Toolbar do MUI

export default function Page() {
  return (
    <>
      <Box>
        <ResponsiveAppBar />
        <Toolbar sx={{ minHeight: { xs: 62, md: 64 } }} /> {/* OFFSET para o header */}
        <Outlet />
        <Footer />
      </Box>
    </>
  );
}
