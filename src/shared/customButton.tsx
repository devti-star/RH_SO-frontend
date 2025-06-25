import { Button  } from "@mui/material";
import type {ButtonProps} from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  payload: string;
}

export default function CustomButton({ payload, ...props }: CustomButtonProps) {
  return (
    <>
      <Button
        {...props}
        sx={{
          height: "42px",
          display: "block",
          backgroundColor: "#08123d",
          color: "white",
          marginTop: "15px",
          fontWeight: "550",
          width: "100%",
          textTransform: "none",
          borderRadius: "8px",
          ...props.sx,
        }}
      >
        {payload}
      </Button>
    </>
  );
}
