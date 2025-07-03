import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";

interface Props {
  open: boolean;
  acao: "reprovar" | "ajustes" | "informar" | "";
  value: string;
  setValue: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function JustifyDialog({ open, acao, value, setValue, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {acao === "reprovar" ? "Justificar Reprovação" : acao === "ajustes" ? "Enviar para Ajustes" : "Justificativa ao Usuário"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {acao === "reprovar" && "Digite a justificativa para reprovação do atestado. Esta mensagem será enviada ao usuário."}
          {acao === "ajustes" && "Digite a mensagem para o usuário ajustar e reenviar o atestado. Esta mensagem será enviada ao usuário."}
          {acao === "informar" && "Digite a justificativa que será enviada ao usuário sobre o indeferimento do atestado."}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Mensagem"
          type="text"
          fullWidth
          multiline
          minRows={2}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={acao === "reprovar" ? "error" : acao === "ajustes" ? "warning" : "primary"}
          disabled={value.trim().length === 0}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

