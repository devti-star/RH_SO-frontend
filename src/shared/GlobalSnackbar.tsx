import { Alert, Snackbar } from "@mui/material";
import { useSnackbarStore } from "./useSnackbar";

export const GlobalSnackbar = () => {
  const { message, severity, open, closeSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={closeSnackbar}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
    >
        <Alert onClose={closeSnackbar} severity={severity} variant="filled">

        </Alert>
    </Snackbar>
  );
};
