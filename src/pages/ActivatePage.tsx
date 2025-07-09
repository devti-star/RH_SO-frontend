import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiURL } from "../config";
import NotFoundPage from "./notFoundPage";

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
          setError(null);
        } else {
          setSuccess(false);
          setError("Erro ao ativar conta.");
        }
      } catch (err) {
        setSuccess(false);
        setError("Erro ao ativar conta.");
      }
    };

    if (token) activateUser();
    else {
      setError("Token inválido");
    }
  }, [token]);

  const [modalAberto, setModalAberto] = useState(true);

  const modificarModal = () => setModalAberto(!modalAberto);

  const fecharModal = () => {
    setModalAberto(false);
    navigate("/login");
  };

  if (error) return <NotFoundPage />;

  return (
    <>
      {success && (
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
          <DialogContent>
            <p>Sua conta foi ativada com sucesso.</p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ActivatePage;
