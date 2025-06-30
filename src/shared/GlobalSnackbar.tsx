import { Alert, Slide, Snackbar, type SlideProps } from "@mui/material";
import { useSnackbarStore } from "./useSnackbar";

function TransitionRight(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export const GlobalSnackbar = () => {
  const { message, severity, open, closeSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={TransitionRight} // ✅ Transição correta
    >
      <Alert onClose={closeSnackbar} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};
