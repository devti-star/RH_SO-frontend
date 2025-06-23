import { Box, Typography, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export default function Form() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //Temporário
    console.log("Autenticando com:", { email, senha });
  };

  return (
    <Box
      sx={{
        height: "350px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 50px 130px 50px",
        borderRadius: "0px 30px 30px 0px",
        boxShadow: "0px 6px 5px rgba(193, 192, 192, 0.6)",

      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Typography
          variant="h1"
          sx={{
            fontSize: "30px",
            fontWeight: "500",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Acessar
        </Typography>

        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Insira seu e-mail aqui"
          required
          fullWidth
          sx={{ marginTop: "20px" }}
        ></TextField>

        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          fullWidth
          sx={{ marginTop: "20px" }}
          InputProps={}
        ></TextField>

        <Button
          type="submit"
          sx={{
            height: "42px",
            display: "block",
            backgroundColor: "#08123d",
            color: "white",
            marginTop: "10px",
            fontWeight: "550",
            width: "100%",
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Entrar
        </Button>

        <Button
          onClick={() => {}}
          sx={{
            height: "42px",
            display: "block",
            backgroundColor: "white",
            color: "#08123d",
            marginTop: "10px",
            fontWeight: "550",
            width: "100%",
            textTransform: "none",
            borderRadius: "8px",
            borderStyle: "solid",
            borderColor: "#08123d",
            borderWidth: "1px",
          }}
        >
          Criar Conta
        </Button>
      </Box>
    </Box>
  );
}
