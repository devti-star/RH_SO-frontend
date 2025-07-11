import { Box, Container, FormControl, InputLabel, OutlinedInput, useMediaQuery, Typography } from "@mui/material";
import Banner from "../../shared/banner";
import logo from "../../shared/images/brasaoAzul.png";
import { useState } from "react";
import { useResponsivePadding } from "./Responsive/useResponsivePadding";
import { useResponsiveHeight } from "./Responsive/useResponsiveHeight";
import CustomButton from "../../shared/customButton";
import { enviarEmail } from "./form/services/submit";
import Modal from "./form/ModalEnvio";

export default function ForgotPassword() {
    const isMobile = useMediaQuery("(max-width: 885px)");
    const isMobileTiny = useMediaQuery("(max-width: 619px)");
    const espacamento = useResponsivePadding();
    const altura = useResponsiveHeight();
    const [email, setEmail] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        // Validação básica de e-mail
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Por favor, insira um e-mail válido.");
            return;
        }

        setLoading(true);
        try {
            await enviarEmail(email);
            setMostrarModal(true);
        } catch (err) {
            setError("Falha ao enviar e-mail. Por favor, tente novamente.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            disableGutters
            maxWidth={false}
            sx={{
                display: "flex",
                backgroundColor: "transparent",
                flexDirection: "row",
                height: "100vh",
                position: "relative",
            }}
        >
            {!isMobile && (
                <Box
                    sx={{
                        height: "100%",
                        background: " #050A24",
                        width: "40%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Banner largura_imagem={300} />
                </Box>
            )}
            
            <Box
                sx={{
                    height: "100%",
                    background: "white",
                    width: isMobile ? "100%" : "60%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        minHeight: altura,
                        width: isMobile ? "90%" : "70%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "30px",
                        boxShadow: "0px 6px 5px rgba(193, 192, 192, 0.6)",
                        pt: isMobileTiny ? 25 : 0,
                        pb: 4,
                        px: 4,
                        gap: 3,
                    }}
                >
                    {isMobile && <img src={logo} alt="Logo" style={{ width: "200px" }} />}
                    
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Recuperação de Senha
                    </Typography>
                    
                    <Typography sx={{ textAlign: 'center', mb: 2 }}>
                        Insira seu e-mail para receber o link de redefinição de senha
                    </Typography>
                    
                    <FormControl
                        variant="outlined"
                        sx={{ width: '100%', maxWidth: '400px' }}
                        required
                        error={!!error}
                    >
                        <InputLabel htmlFor="campo-email">E-mail</InputLabel>
                        <OutlinedInput
                            id="campo-email"
                            label="E-mail"
                            type="email"
                            placeholder="Insira seu email aqui"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                    </FormControl>
                    
                    <CustomButton
                        payload={loading ? "Enviando..." : "Enviar Link"}
                        type="submit"
                        sx={{ 
                            fontFamily: "Poppins, sans-serif", 
                            width: '100%', 
                            maxWidth: '400px',
                            py: 1.5,
                            fontSize: '1rem'
                        }}
                        disabled={loading}
                    />
                </Box>
            </Box>
            
            {mostrarModal && (
                <Modal onClose={() => setMostrarModal(false)} />
            )}
        </Container>
    );
}