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
import "./styles.css";

interface FormCadastroProps extends BoxProps {
  espacamento?: string;
}

export default function FormCadastro({
  espacamento = "100px 50px 130px 50px",
  ...props
}: FormCadastroProps) {
  const [nome, setNome] = useState("");
  const [secretaria, setSecretaria] = useState("");
  const [cpf, setCPF] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [rg, setRG] = useState("");
  const [maticula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [foto, setFoto] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  function handleSubmit() {}

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleTogglePasswordConfirm = () => {
    setShowPasswordConfirm((prev) => !prev);
  };

  return (
    <Box
      {...props}
      sx={{
        height: "350px",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        padding: espacamento,
        ...props.sx,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h1" className="titulo-form" sx={{ width: "100%" }}>
          Cadastrar
        </Typography>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-nome">Nome Completo</InputLabel>
          <OutlinedInput
            id="campo-nome"
            type="text"
            label="Nome Completo"
            placeholder="Insira seu nome completo aqui"
            onChange={(e) => setNome(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-secretaria">Secretaria</InputLabel>
          <OutlinedInput
            id="campo-secretaria"
            type={"text"}
            label="Secretaria"
            placeholder="Insira a sua senha"
            onChange={(e) => setSecretaria(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-cpf">CPF</InputLabel>
          <OutlinedInput
            id="campo-cpf"
            type="text"
            label="CPF"
            placeholder="111.111.11-11"
            onChange={(e) => setCPF(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-departamento">Departamento</InputLabel>
          <OutlinedInput
            id="campo-departamento"
            type={"text"}
            label="Departamento"
            placeholder="Insira aqui o seu departamento"
            onChange={(e) => setDepartamento(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-rg">RG</InputLabel>
          <OutlinedInput
            id="campo-rg"
            type={"text"}
            label="RG"
            placeholder="11.111.111-x"
            onChange={(e) => setRG(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-matricula">Matrícula</InputLabel>
          <OutlinedInput
            id="campo-matricula"
            type={"text"}
            label="Matrícula"
            placeholder="Insira aqui sua matrícula"
            onChange={(e) => setMatricula(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-email">E-mail</InputLabel>
          <OutlinedInput
            id="campo-email"
            label="E-mail"
            placeholder="Insira seu email aqui"
            onChange={(e) => setEmail(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-cargo">Cargo</InputLabel>
          <OutlinedInput
            id="campo-cargo"
            type={"text"}
            label="Cargo"
            placeholder="Insira aqui seu cargo"
            onChange={(e) => setCargo(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-telefone">Telefone/Whatsapp</InputLabel>
          <OutlinedInput
            id="campo-telefone"
            type={"text"}
            label="Telefone/Whatsapp"
            placeholder="(11)11111-1111"
            onChange={(e) => setTelefone(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-foto">Foto</InputLabel>
          <OutlinedInput
            id="campo-foto"
            type={"text"}
            label="Foto"
            placeholder="Insira a sua foto"
            onChange={(e) => setFoto(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
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

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
        >
          <InputLabel htmlFor="campo-senha-confirmacao">
            Confirme a sua senha
          </InputLabel>
          <OutlinedInput
            id="campo-senha-confirmacao"
            type={showPassword ? "text" : "password"}
            label="Confirme a sua senha"
            placeholder="Confirme a sua senha"
            onChange={(e) => setSenhaConfirm(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordConfirm}
                  edge="end"
                  aria-label="Mostrar ou ocultar a senha"
                >
                  {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          ></OutlinedInput>
        </FormControl>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomButton
            payload="Criar conta"
            type="submit"
            sx={{ fontFamily: "Poppins, sans-serif", width: "80%" }}
          ></CustomButton>
        </Box>
      </Box>
    </Box>
  );
}
