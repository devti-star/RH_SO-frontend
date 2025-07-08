import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { apiURL } from "../config";

const ActivatePage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const activateUser = async () => {
            try {
                const response = await axios.get(`${apiURL}/activate/${token}`);

                if (response.status === 202) {
                    setSuccess(true);
                    setError(null); // limpa qualquer erro anterior
                } else {
                    setSuccess(false);
                    setError("Erro ao ativar conta.");
                }
            } catch (err) {
                setSuccess(false);
                setError("Erro ao ativar conta.");
            }
        };

        activateUser();
    }, [token]);

    const [modalAberto, setModalAberto] = useState(true);
    const modificarModal = () => setModalAberto(!modalAberto);

    const fecharModal = () => {
        setModalAberto(!modalAberto);
        navigate('/login');
    }


    return (
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
                Verificação de conta
                <IconButton onClick={fecharModal}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            {success && (<DialogContent>
                <p>
                    Sua conta foi ativada com sucesso.
                </p>
            </DialogContent>)
            }
            {error && (<DialogContent>
                <p>
                    Não foi possivel ativar sua conta.
                </p>
            </DialogContent>)
            }
        </Dialog>

    );
};

export default ActivatePage;
