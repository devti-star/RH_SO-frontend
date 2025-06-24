import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import "./styles.css";
import CustomButton from "../../../shared/customButton";
import { handleLogin } from "./services";
import type { login } from "../../../models/login";

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
    const credenciais: login = {email, senha}
    handleLogin(credenciais)
  };

  return (
    <Box
      sx={{
        height: "350px",
        width: "490px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 50px 130px 50px",
        borderRadius: "0px 30px 30px 0px",
        boxShadow: "0px 6px 5px rgba(193, 192, 192, 0.6)",
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <Typography variant="h1" className="titulo-form">
          Acessar
        </Typography>

        <FormControl variant="outlined" fullWidth sx={{ marginTop: "10px" }}>
          <InputLabel htmlFor="campo-email">E-mail</InputLabel>
          <OutlinedInput
            id="campo-email"
            label="E-mail"
            placeholder="Insira seu email aqui"
            onChange={(e) => setEmail(e.target.value)}
          ></OutlinedInput>
        </FormControl>


        <Box className="recuperar-senha">
          <a href="#">Esqueceu Sua Senha?</a>
        </Box>

        <FormControl variant="outlined" fullWidth sx={{ marginTop: "10px" }}>
          <InputLabel htmlFor="campo-senha">Senha</InputLabel>
          <OutlinedInput
            id="campo-senha"
            type={showPassword ? "text" : "password"}
            label="Senha"
            placeholder="Insira a sua senha"
            onChange={(e) => setSenha(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  aria-label="Mostrar ou ocultar a senha"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          ></OutlinedInput>
        </FormControl>

        <CustomButton
          payload="Entrar"
          type="submit"
          sx={{ fontFamily: "Poppins, sans-serif" }}
        ></CustomButton>

        <CustomButton
          payload="Criar Conta"
          onClick={() => {}}
          sx={{
            alignItems: "center",
            backgroundColor: "white",
            color: "#08123d",
            borderRadius: "8px",
            borderStyle: "solid",
            borderColor: "#08123d",
            borderWidth: "1px",
          }}
        ></CustomButton>
      </Box>
    </Box>
  );
}
