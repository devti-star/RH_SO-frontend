import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography, type BoxProps } from "@mui/material";
import { useState } from "react";
import CustomButton from "../../shared/customButton";

interface FormProps extends BoxProps{
  espacamento?: string
}

export default function FormMeusDados() {
    const [nomeCompleto, setNomeCOmpleto] = useState("Murilo Aparecido Nascimento");
    const [cpf, setCpf] = useState("753.159.369-66");
    const [rg, setRG] = useState("99.365.003-4");
    const [telefone, setTelefone] = useState("(18) 99876-6971");
    const [departamento, setDepartamento] = useState("T.I");
    const [secretaria, setCretaroa] = useState("DPTI");
    const [cargo, setCargo] = useState("Desenvolvedor Fullstack");
    const [matricula, setMatricula] = useState("35715978936");
    const [email, setEmail] = useState("murilo_nas_carv@gmail.com");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return(
        <Box component="form" sx={{ width: "100%" , padding: "2rem"}}>
            <Typography variant="h1" className="titulo-form">
            Dados Pessoais
            </Typography>

            <FormControl variant="outlined" fullWidth sx={{ marginTop: "10px" }}>
            <InputLabel htmlFor="campo-nome">Nome Completo</InputLabel>
            <OutlinedInput
                id="campo-nome-completo"
                label="Nome Completo"
                value={nomeCompleto}
                onChange={(e) => setNomeCOmpleto(e.target.value)}
            ></OutlinedInput>
            </FormControl>

            <FormControl variant="outlined" fullWidth sx={{ marginTop: "10px" }}>
            <InputLabel htmlFor="campo-nome">CPF</InputLabel>
            <OutlinedInput
                id="campo-cpf"
                label="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
            ></OutlinedInput>
            </FormControl>

            <FormControl variant="outlined" fullWidth sx={{ marginTop: "10px" }}>
            <InputLabel htmlFor="campo-nome">RG</InputLabel>
            <OutlinedInput
                id="campo-rg"
                label="RG"
                value={rg}
                onChange={(e) => setRG(e.target.value)}
            ></OutlinedInput>
            </FormControl>

            <FormControl variant="outlined" fullWidth sx={{ marginTop: "10px" }}>
            <InputLabel htmlFor="campo-nome">Telefone</InputLabel>
            <OutlinedInput
                id="campo-telefone"
                label="Telefone/Whatsapp"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
            ></OutlinedInput>
            </FormControl>

            <Typography variant="h1" className="titulo-form" sx={{ marginTop: "25px" }}>
            Dados do Trabalho
            </Typography>

            <FormControl variant="outlined" fullWidth sx={{ marginTop: "10px" }}>
            <InputLabel htmlFor="campo-departamento">Departamento</InputLabel>
            <OutlinedInput
                id="campo-teldepartamentoefone"
                label="Departamento"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
            ></OutlinedInput>
            </FormControl>

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
    )
}