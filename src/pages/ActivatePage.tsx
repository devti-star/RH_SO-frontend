import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { apiURL } from '../config';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

const ActivatePage = () => {
    const navigate = useNavigate();

    const { token } = useParams<{ token: string }>();
    const [message, setMessage] = useState<string>('Ativando...');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) return;

        fetch(`${apiURL}/activate/${token}`)
            .then((res) => {
                if (!res.ok) throw new Error('Erro na ativação');
                setSuccess(true);
            })
            .catch((err) => {
                setSuccess(false);
            })
            .finally(() => setLoading(false));
    }, [token]);

    const [modalAberto, setModalAberto] = useState(true);
    const modificarModal = () => setModalAberto(!modalAberto);

    const fecharModal = () => {
        setModalAberto(!modalAberto);
        navigate('/login');
    }


    return (<>

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
            {!success && (<DialogContent>
                <p>
                    Não foi possivel ativar sua conta.
                </p>
            </DialogContent>)
            }
        </Dialog>
    </>);
};

export default ActivatePage;
