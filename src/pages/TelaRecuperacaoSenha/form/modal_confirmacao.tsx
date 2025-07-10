import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

export default function Modal() {
    const [modalAberto, setModalAberto] = useState(true);
    const modificarModal = () => setModalAberto(!modalAberto);
    const navigate = useNavigate();

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
                Alteração Concluida
                <IconButton onClick={fecharModal}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <p>
                    Um email foi enviado para confirmar a alteração da sua conta foi enviado para o e-mail cadastrado.
                    Acesse a sua conta para poder utilizar o sistema.
                </p>
            </DialogContent>
        </Dialog>
    );
}
