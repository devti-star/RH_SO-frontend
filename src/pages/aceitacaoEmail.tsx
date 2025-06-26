import CustomModal from '../shared/modal.tsx';
import { Typography } from '@mui/material'; // Importe o Typography

export default function AceitacaoEmail() {
    return (
        <CustomModal 
            open={open} 
            title="Verificação de conta"
            showCloseButton={false}
        >
            <Typography 
                variant="body1" 
                sx={{
                    fontSize: '1.1rem',    // Tamanho
                    color: '#333',        // Cor
                    textAlign: 'center',   // Centralizado
                    my: 2,                 // Margem vertical
                    px: 1                  // Margem horizontal
                }}
            >
                Um link para confirmar a criação da sua conta foi enviado para o e-mail cadastrado. 
                Por favor, acesse-o e conclua a confirmação para poder utilizar o sistema.
            </Typography>
        </CustomModal>
    );
}