import React from "react";
import { Box, Tabs, Tab, Badge, Divider, TextField, IconButton } from "@mui/material";
import type { TabItem } from "../useSesmtDashboard";

interface Props {
  tab: number;
  setTab: (v: number) => void;
  tabs: TabItem[];
  getBadge: (idx: number) => number;
  busca: string;
  setBusca: (v: string) => void;
  isMobile: boolean;
}

export default function TabsNavigation({ tab, setTab, tabs, getBadge, busca, setBusca, isMobile }: Props) {
  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        sx={{
          mb: 2,
          ".MuiTabs-flexContainer": {
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 2 : 0,
          },
        }}
        orientation="horizontal"
        variant={isMobile ? "scrollable" : "standard"}
      >
        {tabs.map((t, idx) => (
          <Tab
            key={t.label}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontWeight: "bold" }}>{t.label}</span>
                {idx === 0 && (
                  <Badge badgeContent={getBadge(idx)} color="error" sx={{ ml: 2, mb: "0px", "& .MuiBadge-badge": { top: -10, right: 2 } }} />
                )}
              </Box>
            }
            sx={{ textTransform: "none" }}
          />
        ))}
      </Tabs>
      <Divider sx={{ mb: 2 }} />
      <TextField
        variant="outlined"
        placeholder="Pesquisa"
        size="small"
        sx={{ width: "100%", mb: 2 }}
        value={busca}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton size="small" onClick={() => setBusca("")}>×</IconButton>
          ),
        }}
      />
    </Box>
  );
}

