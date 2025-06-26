import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 

type CustomModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
};

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

export default function CustomModal({ open, onClose, title, children, showCloseButton = true }: CustomModalProps) {
    
    return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {showCloseButton && (
          <IconButton
            aria-label="fechar"
            onClick={onClose} 
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        {title && (
          <Typography variant="h6" component="h2" gutterBottom sx={{fontWeight: 'bold', textAlign: 'center'}}>
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Modal>
  );
}
