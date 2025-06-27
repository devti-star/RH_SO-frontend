import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
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
import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./styles.css";
import type { secretaria } from "../../../models/secretaria.interface";
import CloseIcon from "@mui/icons-material/Close";
import {
  mascaraCPF,
  mascaraRG,
  mascaraTelefone,
} from "../../../shared/mascaras/services";
import type { Cadastro } from "../../../models/cadastro.interface";
import { handleCadastro } from "./service";

interface FormCadastroProps extends BoxProps {
  espacamento?: string;
}

const secretarias: secretaria[] = [
  { id: 0, secretaria: "Gabinete" },
  { id: 1, secretaria: "Procuradoria" },
  { id: 2, secretaria: "SMS - Secretaria Municipal de Saúde Pública" },
  {
    id: 3,
    secretaria: "SEGOV - Secretaria Municipal de Governo e Políticas Públicas",
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
    secretaria: "SEJUVEL – Secretaria Municipal de Esporte, Juventude e Lazer",
  },
  {
    id: 9,
    secretaria: "SEFIRC – Secretaria Municipal de Finanças, Receita e Controle",
  },
  { id: 10, secretaria: "SEMAD – Secretaria Municipal de Administração" },
  {
    id: 11,
    secretaria:
      "SEDECT – Secretaria Municipal de Desenvolvimento Econômico, Ciência e Tecnologia",
  },
];

export default function FormCadastro({
  espacamento = "100px 50px 130px 50px",
  ...props
}: FormCadastroProps) {
  const [nome, setNome] = useState("");
  const [secretaria, setSecretaria] = useState("");
  const [cpf, setCPF] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [rg, setRG] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");

  //Para a imagem
  const [foto, setFoto] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previaFoto, setPreviaFoto] = useState<string | undefined>(undefined);
  const [modalAberto, setModalAberto] = useState(false);

  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [erroSenhas, setErroSenhas] = useState(false);

  const [mostrarModal,setMostrarModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let sucesso: boolean;

    if (senha !== senhaConfirm) {
      setErroSenhas(true);
    } else {
      setErroSenhas(false);
      const cadastro: Cadastro = {
        nome: nome.trim(),
        secretaria: secretaria,
        cpf: cpf.replace(/[().-\s+]/g,''),
        departamento: departamento.trim(),
        rg: rg.replace(/[().-\s+]/g,''),
        matricula: matricula.trim(),
        email: email.trim(),
        cargo: cargo.trim(),
        telefone: telefone.replace(/[().-\s+]/g,''),
        foto: foto,
        senha: senha
      };
      
      sucesso = await handleCadastro(cadastro);
      setMostrarModal(sucesso)
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const modificarModal = () => setModalAberto(!modalAberto);

  useEffect(() => {
    return () => {
      if (previaFoto) {
        URL.revokeObjectURL(previaFoto);
      }
    };
  }, [previaFoto]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreviaFoto(URL.createObjectURL(file)); //Criação de URL temporária para visualização da foto carregada
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleTogglePasswordConfirm = () => {
    setShowPasswordConfirm((prev) => !prev);
  };

  const handleChangeRG = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = mascaraRG(e);

    setRG(value);
  };

  const handleChangeCPF = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = mascaraCPF(e);

    setCPF(value);
  };

  const handleChangeTelefone = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = mascaraTelefone(e);

    setTelefone(value);
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
          required
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
          required
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
          required
        >
          <InputLabel htmlFor="campo-cpf">CPF</InputLabel>
          <OutlinedInput
            id="campo-cpf"
            type="text"
            label="CPF"
            value={cpf}
            placeholder="111.111.111-11"
            onChange={handleChangeCPF}
            inputProps={{
              pattern: "[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}",
              title: "Formato esperado: 111.111.111-11",
            }}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
          required
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
          required
        >
          <InputLabel htmlFor="campo-rg">RG</InputLabel>
          <OutlinedInput
            id="campo-rg"
            type="text"
            label="RG"
            value={rg}
            placeholder="11.111.111-x"
            onChange={handleChangeRG}
            inputProps={{
              pattern: "[0-9]{2}\\.[0-9]{3}\\.[0-9]{3}-[0-9a-z]",
              title: "Formato esperado: 11.111.111-x",
            }}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
          required
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
          required
        >
          <InputLabel htmlFor="campo-email">E-mail</InputLabel>
          <OutlinedInput
            id="campo-email"
            label="E-mail"
            type="email"
            placeholder="Insira seu email aqui"
            onChange={(e) => setEmail(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
          required
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
          required
        >
          <InputLabel htmlFor="campo-telefone">Telefone/Whatsapp</InputLabel>
          <OutlinedInput
            id="campo-telefone"
            type={"text"}
            value={telefone}
            label="Telefone/Whatsapp"
            placeholder="(11) 11111-1111"
            onChange={handleChangeTelefone}
            inputProps={{
              pattern: "\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}",
              title: "Formato esperado: (11) 11111-1111",
            }}
          ></OutlinedInput>
        </FormControl>

        <FormControl
          variant="outlined"
          className="campo"
          sx={{ marginTop: "10px" }}
          required
        >
          <FormLabel sx={{ mb: 0, color: "black" }}>Foto</FormLabel>
          <input
            type="file"
            hidden
            ref={inputRef}
            onChange={handleFileChange}
            accept=".png, .jpg, .jpeg"
          ></input>
          <CustomButton
            payload="Carregar foto .png, .jpg ou .jpeg"
            onClick={handleClick}
            sx={{ mt: 0 }}
          ></CustomButton>

          {foto && previaFoto && (
            <>
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  mb: 1,
                  cursor: "pointer",
                  width: "fit-content",
                  color: "rgb(0, 102, 204)",
                }}
                onClick={modificarModal}
              >
                {foto.name}
              </Typography>
              <Dialog
                open={modalAberto}
                onClose={modificarModal}
                maxWidth="sm"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: "15px" } } }}
              >
                <DialogTitle
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  Pré-visualização da Imagem
                  <IconButton onClick={modificarModal}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <img
                    src={previaFoto}
                    alt="Pré-visualização"
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </FormControl>

        <FormControl
          variant="outlined"
          sx={{ marginTop: "10px" }}
          className="campo"
          required
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
          sx={{ marginTop: "15px" }}
          className="campo"
          required
        >
          <InputLabel htmlFor="campo-senha-confirmacao">
            Confirme a sua senha
          </InputLabel>
          <OutlinedInput
            id="campo-senha-confirmacao"
            type={showPasswordConfirm ? "text" : "password"}
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
          {erroSenhas && (
            <FormHelperText
              sx={{ m: 0, mt: 1, color: "red", fontSize: "15px" }}
            >
              As senhas não coincidem
            </FormHelperText>
          )}
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
