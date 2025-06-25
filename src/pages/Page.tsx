import ResponsiveAppBar from "../shared/header";
import Footer from "../shared/footer";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function Page() {
  return (
    <>
      <Box>
        <ResponsiveAppBar></ResponsiveAppBar>
        <Outlet />
        <Footer />
      </Box>
    </>
  );
}
