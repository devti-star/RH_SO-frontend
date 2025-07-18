import {
    Box,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
    type BoxProps,
} from "@mui/material";
import CustomButton from "../../../shared/customButton";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { resetPassword } from "./services/submit";
import Modal from "./modal_confirmacao";


interface FormCadastroProps extends BoxProps {
    espacamento?: string;
    flex_direction?: string;
}

export default function FormCadastro({
    espacamento = "100px 50px 130px 50px",
    flex_direction = "row",
    ...props
}: FormCadastroProps) {
    const [senha, setSenha] = useState("");
    const [senhaConfirm, setSenhaConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [erroSenhas, setErroSenhas] = useState(false);
    const { token } = useParams<{ token: string }>();
    const [mostrarModal, setMostrarModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (senha !== senhaConfirm) {
            setErroSenhas(true);
            return;
        }

        setErroSenhas(false);

        try {
            // Token agora vem diretamente de useParams()
            if (!token) {
                throw new Error('Token inválido ou expirado');
            }

            await resetPassword(token, senha);
            setMostrarModal(true);
        } catch (error) {
        } 
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleTogglePasswordConfirm = () => {
        setShowPasswordConfirm((prev) => !prev);
    };

    return (
        <Box className="teste"
            {...props}
            sx={{
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
                    flexDirection: flex_direction,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h1" className="titulo-form" sx={{ width: "100%" }}>
                    Nova Senha
                </Typography>

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
                        payload="Redefinir Senha"
                        type="submit"
                        sx={{ fontFamily: "Poppins, sans-serif", width: "80%" }}
                        onClick={handleSubmit}
                    ></CustomButton>
                </Box>
            </Box>
            {mostrarModal && (<Modal></Modal>)}
        </Box>
    );
}
