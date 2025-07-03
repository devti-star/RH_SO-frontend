import React from "react";
import { Box, Typography, IconButton, Dialog } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Atestado } from "../../../models/atestados";
import PdfViewer from "../../../shared/PdfViewer";

interface Props {
  docSelecionado: Atestado | undefined;
  isMobile: boolean;
  mobileDocOpen: boolean;
  setMobileDocOpen: (o: boolean) => void;
}

export default function DocumentViewer({
  docSelecionado,
  isMobile,
  mobileDocOpen,
  setMobileDocOpen,
}: Props) {
  if (isMobile) {
    return (
      <Dialog open={mobileDocOpen} onClose={() => setMobileDocOpen(false)} fullScreen PaperProps={{ style: { background: "#222" } }}>
        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#222", color: "#fff", p: 2, pb: 0 }}>
          <Typography sx={{ flex: 1, fontWeight: "bold" }}>{docSelecionado ? docSelecionado.arquivo : ""}</Typography>
          <IconButton onClick={() => setMobileDocOpen(false)} sx={{ color: "#fff" }}>
            <CancelIcon />
          </IconButton>
        </Box>
        <Box sx={{ width: "100vw", height: "100%", bgcolor: "#222", p: 0, pt: 2 }}>
          {docSelecionado && (
            <PdfViewer url={`/${docSelecionado.arquivo}`} height="100%" width="100%" />
          )}
        </Box>
      </Dialog>
    );
  }

  return (
    <Box
      sx={{
        width: "45%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        px: 4,
        pt: 5,
        bgcolor: "#f4f4f4",
        minHeight: "auto",
      }}
    >
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", mb: 1, ml: 1 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 18, color: "#111", flex: 1 }}>
          {docSelecionado ? docSelecionado.arquivo : "Nome do arquivo.pdf"}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          flex: 1,
          bgcolor: "#d6d6d6",
          border: "2px solid #7db2ff",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 350,
          mt: 2,
          mx: "auto",
          overflow: "auto",
        }}
      >
        {docSelecionado ? (
          <PdfViewer url={`/${docSelecionado.arquivo}`} height="100%" width="100%" />
        ) : (
          "DOCUMENTO"
        )}
      </Box>
    </Box>
  );
}

