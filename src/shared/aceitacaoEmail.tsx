import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 

export default function AceitacaoEmail() {
    const [modalAberto, setModalAberto] = useState(true);
    const modificarModal = () => setModalAberto(!modalAberto);
    
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
                  <IconButton onClick={modificarModal}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <p>
                    Um link para confirmar a criação da sua conta foi enviado para o e-mail cadastrado. 
                Por favor, acesse-o e conclua a confirmação para poder utilizar o sistema.
                  </p>
                </DialogContent>
              </Dialog>
    );
}
