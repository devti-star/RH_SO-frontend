import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  type BoxProps,
} from "@mui/material";
import CustomButton from "../../../shared/customButton";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface FormCadastroProps extends BoxProps {
  espacamento?: string;
}

export default function FormCadastro({
  espacamento = "100px 50px 130px 50px",
  ...props
}: FormCadastroProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit() {}

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
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
          Cadastro
        </Typography>

        <FormControl variant="outlined" sx={{ marginTop: "10px" }}>
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
