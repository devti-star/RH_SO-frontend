import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PrintIcon from "@mui/icons-material/Print";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface PdfViewerProps {
  url: string;
  height?: string | number;
  width?: string | number;
}

export default function PdfViewer({ url, height = "100%", width = "100%" }: PdfViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const handlePrint = () => iframeRef.current?.contentWindow?.print();
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
        <iframe
          ref={iframeRef}
          src={`${url}#toolbar=0`}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
          title="Visualizador de PDF"
        />
      </Box>
    </Box>
  );
}
