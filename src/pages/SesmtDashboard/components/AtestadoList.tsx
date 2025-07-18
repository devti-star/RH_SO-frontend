import { Box, Stack, Typography, Button } from "@mui/material";
import type { Atestado } from "../../../models/atestados";
import type { Config } from "../useSesmtDashboard";
import AtestadoCard from "./AtestadoCard";

interface Props {
  atestados: Atestado[];
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  config: Config;
  tab: number;
  isMobile: boolean;
  onExpandChecklist: (a: Atestado) => void;
  onCheckChange: (a: Atestado, idx: number) => void;
  onAprovar: (id: number) => void;
  onJustificar: (id: number, acao: "reprovar" | "ajustes" | "informar") => void;
  setSelectedDoc: (id: number) => void;
  setMobileDocOpen: (open: boolean) => void;
  handleGerarDocumento: (id: number) => void;
}

export default function AtestadoList({
  atestados,
  page,
  totalPages,
  setPage,
  config,
  tab,
  isMobile,
  onExpandChecklist,
  onCheckChange,
  onAprovar,
  onJustificar,
  setSelectedDoc,
  setMobileDocOpen,
  handleGerarDocumento
}: Props) {
  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: isMobile ? 0 : 1 }}>
      <Stack spacing={2}>
        {atestados.length === 0 && (
          <Typography sx={{ mt: 5, textAlign: "center", color: "#bbb" }}>
            Nenhum resultado encontrado.
          </Typography>
        )}
        {atestados.map((a) => (
          <AtestadoCard
            key={a.id}
            atestado={a}
            tab={tab}
            config={config}
            isMobile={isMobile}
            onExpandChecklist={onExpandChecklist}
            onCheckChange={onCheckChange}
            onAprovar={onAprovar}
            onJustificar={onJustificar}
            setSelectedDoc={setSelectedDoc}
            setMobileDocOpen={setMobileDocOpen}
            handleGerarDocumento={handleGerarDocumento}
          />
        ))}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2, gap: 2 }}>
            <Button variant="outlined" size="small" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Anterior
            </Button>
            <Typography>
              Página {page} de {totalPages}
            </Typography>
            <Button variant="outlined" size="small" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Próxima
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

