import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  type BoxProps,
} from "@mui/material";
import CustomButton from "../../../shared/customButton";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./styles.css";
import type { secretaria } from "../../../models/secretaria.interface";

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
  const [foto, setFoto] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const secretarias: secretaria[] = [
    { id: 0, secretaria: "Gabinete" },
    { id: 1, secretaria: "Procuradoria" },
    { id: 2, secretaria: "SMS - Secretaria Municipal de Saúde Pública" },
    {
      id: 3,
      secretaria:
        "SEGOV - Secretaria Municipal de Governo e Políticas Públicas",
    },
    { id: 4, secretaria: "SMAS – Secretaria Municipal de Assistência Social" },
    { id: 5, secretaria: "SEMEC – Secretaria Municipal de Educação e Cultura" },
    {
      id: 6,
      secretaria: "SEMEA – Secretaria Municipal de Meio Ambiente e Agronegócio",
    },
    {
      id: 7,
      secretaria:
        "SEINTRA – Secretaria Municipal de Infraestrutura, Transporte e Trânsito",
    },
    {
      id: 8,
      secretaria:
        "SEJUVEL – Secretaria Municipal de Esporte, Juventude e Lazer",
    },
    {
      id: 9,
      secretaria:
        "SEFIRC – Secretaria Municipal de Finanças, Receita e Controle",
    },
    { id: 10, secretaria: "SEMAD – Secretaria Municipal de Administração" },
    {
      id: 11,
      secretaria:
        "SEDECT – Secretaria Municipal de Desenvolvimento Econômico, Ciência e Tecnologia",
    },
  ];

  function handleSubmit() {}


  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
    }
  };



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
          <InputLabel htmlFor="campo-secretaria" id="secretaria">
            Secretaria
          </InputLabel>
          <Select
            labelId="secretaria"
            value={secretaria}
            label="Secretaria"
            onChange={(e) => setSecretaria(e.target.value)}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              PaperProps: {
                sx: {
                  mt: 1, // Margem opcional para espaçar do campo
                  minWidth: "45%",
                },
              },
            }}
          >
            {secretarias.map((sec) => {
              return <MenuItem value={sec.id}>{sec.secretaria}</MenuItem>;
            })}
          </Select>
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
            type="file"
            label="Foto"
            placeholder="Insira a sua foto"
            onChange={(e) => setFoto(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <input type="file" hidden ref={handleClick}></input>

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
