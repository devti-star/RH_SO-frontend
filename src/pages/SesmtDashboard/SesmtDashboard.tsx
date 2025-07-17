import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import useSesmtDashboard from "./useSesmtDashboard";
import TabsNavigation from "./components/TabsNavigation";
import AtestadoList from "./components/AtestadoList";
import DocumentViewer from "./components/DocumentViewer";
import JustifyDialog from "./components/JustifyDialog";

export default function SesmtDashboard() {
  const ds = useSesmtDashboard();
  const theme = useTheme();

  // Valores típicos de header/footer fixos; ajuste conforme seu layout real!
  const isMobile = ds.isMobile ?? useMediaQuery(theme.breakpoints.down("sm"));
  const HEADER_HEIGHT = isMobile ? 56 : 64; // px
  const FOOTER_HEIGHT = isMobile ? 62 : 72; // px

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#f8f8f8",
        display: "flex",
        alignItems: ds.isMobile ? "flex-start" : "center",
        justifyContent: "center",
        p: 0,
        overflow: "auto",
        boxSizing: "border-box",
        // Reservando espaço do header/footer
        paddingBottom: "7vh",
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 3,
          width: ds.isMobile ? "100vw" : "90vw",
          maxWidth: 1450,
          height: ds.isMobile ? "100%" : "80vh",
          minHeight: 620,
          display: "flex",
          flexDirection: ds.isMobile ? "column" : "row",
          alignItems: "stretch",
          p: 0,
          minWidth: ds.isMobile ? "100vw" : 0,
        }}
      >
        <Box
          sx={{
            width: ds.isMobile ? "100%" : "55%",
            minWidth: ds.isMobile ? 0 : 370,
            borderRight: ds.isMobile ? "none" : "1.5px solid #e0e0e0",
            borderBottom: ds.isMobile ? "1.5px solid #e0e0e0" : "none",
            display: "flex",
            flexDirection: "column",
            p: ds.isMobile ? "20px 0 0 0" : "38px 0 0 0",
            maxHeight: ds.isMobile ? "none" : "100%",
          }}
        >
          <Box sx={{ px: ds.isMobile ? 2 : 5, height: "100%", display: "flex", flexDirection: "column" }}>
            <TabsNavigation
              tab={ds.tab}
              setTab={ds.setTab}
              tabs={ds.config.tabs}
              getBadge={ds.getBadge}
              busca={ds.busca}
              setBusca={ds.setBusca}
              isMobile={ds.isMobile}
            />
            <AtestadoList
              atestados={ds.paginatedAtestados}
              page={ds.page}
              totalPages={ds.totalPages}
              setPage={ds.setPage}
              config={ds.config}
              tab={ds.tab}
              isMobile={ds.isMobile}
              onExpandChecklist={ds.handleExpandChecklist}
              onCheckChange={ds.handleCheckChange}
              onAprovar={ds.handleAprovar}
              onJustificar={ds.handleJustificar}
              setSelectedDoc={ds.setSelectedDoc}
              setMobileDocOpen={ds.setMobileDocOpen}
              handleGerarDocumento={ds.handleGerarDocumento}
            />
          </Box>
        </Box>
        {!ds.isMobile && (
          <DocumentViewer
            docSelecionado={ds.docSelecionado}
            isMobile={false}
            mobileDocOpen={ds.mobileDocOpen}
            setMobileDocOpen={ds.setMobileDocOpen}
          />
        )}
      </Box>
      <JustifyDialog
        open={ds.justifyOpen}
        acao={ds.acaoJustificar}
        value={ds.justifyValue}
        setValue={ds.setJustifyValue}
        onClose={() => ds.setJustifyOpen(false)}
        onConfirm={ds.confirmarJustificar}
      />
      {ds.isMobile && (
        <DocumentViewer
          docSelecionado={ds.docSelecionado}
          isMobile
          mobileDocOpen={ds.mobileDocOpen}
          setMobileDocOpen={ds.setMobileDocOpen}
        />
      )}
    </Box>
  );
}
