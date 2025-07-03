import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PrintIcon from "@mui/icons-material/Print";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";


interface PdfViewerProps {
  url: string;
  height?: string | number;
  width?: string | number;
}

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PdfViewer({ url, height = "100%", width = "100%" }: PdfViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [numPages, setNumPages] = useState(0);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const handlePrint = () => {
    const win = window.open(url, "_blank");
    win?.print();
  };
  const openNewTab = () => window.open(url, "_blank");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height, width }}>
      <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
        <IconButton size="small" onClick={handlePrint} title="Imprimir">
          <PrintIcon />
        </IconButton>
        <IconButton size="small" onClick={zoomOut} title="Zoom out">
          <ZoomOutIcon />
        </IconButton>
        <IconButton size="small" onClick={zoomIn} title="Zoom in">
          <ZoomInIcon />
        </IconButton>
        <IconButton size="small" onClick={openNewTab} title="Abrir em nova aba">
          <OpenInNewIcon />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Document
          key={`${url}_${zoom}`}
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={null}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}_${zoom}`}
              pageNumber={index + 1}
              scale={zoom}
              width={undefined}
            />
          ))}
        </Document>
      </Box>
    </Box>
  );
}
