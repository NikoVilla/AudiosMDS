import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function ConfirmDeleteModal({ open, handleClose, handleConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{color:'black', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: { xs: 12, sm: 19 } }}>{"Confirmar eliminación"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{color:'black'}}>
          ¿Estás seguro de que deseas hacer la eliminación?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="#FFA800" sx={{textTransform:'none'}}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="error" autoFocus sx={{textTransform:'none'}}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteModal;