import { create } from "zustand";

type SnackbarState = {
  message: string;
  severity: "error" | "success" | "info" | "warning";
  open: boolean;
  showSnackbar: (msg: string, sev?: SnackbarState["severity"]) => void;
  closeSnackbar: () => void;
};

export const useSnackbarStore = create<SnackbarState>((set) => ({
  message: "",
  severity: "info",
  open: false,
  showSnackbar: (msg, sev = "info") =>
    set({ message: msg, severity: sev, open: true }),
  closeSnackbar: () => set({ open: false }),
}));
