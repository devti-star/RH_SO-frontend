import { Dialog, DialogContent, DialogTitle, IconButton, Button, DialogActions, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  onClose: () => void;
}

export default function Modal({ onClose }: ModalProps) {
    const navigate = useNavigate();

    const fecharModal = () => {
        onClose();
        navigate('/login');
    };

    return (
        <Dialog
            open={true}
            onClose={fecharModal}
            maxWidth="sm"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: "15px", padding: "16px" } } }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    padding: "16px 24px",
                }}
            >
                E-mail Enviado!
                <IconButton 
                    onClick={fecharModal}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ padding: "20px 24px" }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Um link para redefinir sua senha foi enviado.
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 3 }}>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Caso não encontre o e-mail, verifique sua pasta de spam.
                </Typography>
            </DialogContent>
            
            <DialogActions sx={{ padding: "16px 24px" }}>
                <Button 
                    onClick={fecharModal}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ borderRadius: '8px', py: 1 }}
                >
                    Voltar para Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}