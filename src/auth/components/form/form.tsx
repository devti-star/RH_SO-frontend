import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  type BoxProps,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import "./styles.css";
import CustomButton from "../../../shared/customButton";
import type { login } from "../../../models/login";
import { useNavigate } from "react-router-dom";
import { AuthService } from "./auth.service";

interface FormProps extends BoxProps {
  espacamento?: string;
}

export default function Form({ espacamento = "100px 50px 130px 50px", ...props }: FormProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // ✅ Correto: hook no topo

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credenciais: login = { email, senha };
    const servicoAutenticacao = AuthService.getInstance();
    servicoAutenticacao.login(credenciais, navigate);
    
  };

  return (
    <Box
      {...props}
      sx={{
        height: "350px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        padding: espacamento,
        ...props.sx,
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
          />
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
          />
        </FormControl>

        <CustomButton
          payload="Entrar"
          type="submit"
          sx={{ fontFamily: "Poppins, sans-serif", marginTop: "20px" }}
        />

        <CustomButton
          payload="Criar Conta"
          onClick={() => navigate("/cadastro")}
          sx={{
            alignItems: "center",
            backgroundColor: "white",
            color: "#08123d",
            borderRadius: "8px",
            borderStyle: "solid",
            borderColor: "#08123d",
            borderWidth: "1px",
            fontFamily: "Poppins, sans-serif",
            marginTop: "10px",
          }}
        />
      </Box>
    </Box>
  );
}
