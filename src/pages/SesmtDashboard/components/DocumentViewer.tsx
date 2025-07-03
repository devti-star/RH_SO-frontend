import React from "react";
import { Box, Typography, IconButton, Dialog } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CancelIcon from "@mui/icons-material/Cancel";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { Atestado } from "../../../models/atestados";

interface Props {
  docSelecionado: Atestado | undefined;
  handlePdfLoad: (pdf: PDFDocumentProxy) => void;
  isMobile: boolean;
  mobileDocOpen: boolean;
  setMobileDocOpen: (o: boolean) => void;
}

export default function DocumentViewer({
  docSelecionado,
  handlePdfLoad,
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
        <Box sx={{ width: "100vw", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#222", p: 0, pt: 2 }}>
          {docSelecionado && (
            <Document file={`/${docSelecionado.arquivo}`} loading="Carregando PDF..." onLoadSuccess={handlePdfLoad}>
              <Page pageNumber={1} width={window.innerWidth - 24} />
            </Document>
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
        {docSelecionado && (
          <IconButton onClick={() => window.open(`/${docSelecionado.arquivo}`, "_blank")} title="Abrir PDF em nova aba">
            <FullscreenIcon />
          </IconButton>
        )}
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
          <Document file={`/${docSelecionado.arquivo}`} loading="Carregando PDF..." onLoadSuccess={handlePdfLoad}>
            <Page pageNumber={1} width={500} height={330} />
          </Document>
        ) : (
          "DOCUMENTO"
        )}
      </Box>
    </Box>
  );
}

