import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function InputFileUpload({ onFileChange }) {
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);

  const handleFileChange = (event) => {
    const newFiles = [...event.target.files];
    setFiles(newFiles);
    onFileChange(newFiles);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAll = () => {
    setFiles([]);
    onFileChange([]);
    handleClose();
  };

  const handleDeleteFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFileChange(newFiles);
    if (newFiles.length === 0) {
      handleClose();
    }
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'left' }}>
      <Typography 
        sx={{ 
          fontFamily: 'Nunito, sans-serif', 
          fontWeight: 600, 
          fontSize: { xs: 11, sm: 19 } ,
          mb: 1,
        }}
      >
        Seleccionar imagen a cargar
      </Typography>
      <Button
        component="label"
        variant="contained"
        sx={{
          width: '100%',
          mb: 1,
          backgroundColor: '#FFA800',
          color: 'black',
          '& svg': { color: 'black' },
          height: '60px',
          textTransform: 'none',
          fontSize: { xs: 11, sm: 16}, // Ajusta el tamaño según la pantalla
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
        }}
        startIcon={<CloudUploadIcon />}
      >
        Subir archivo
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileChange}
          multiple
        />
      </Button>
      
      {files.length > 0 && (
        <Button
          variant="contained"
          sx={{
            width: '100%',
            height: '70%',
            mb: 1,
            backgroundColor: '#FFA800',
            color: 'black',
            '& svg': { color: 'black' },
            textTransform: 'none'
          }}
          onClick={handleClickOpen}
        >
          Ver archivos cargados
        </Button>
      )}
      
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Archivos Cargados
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.name}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color={!['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(file.type) ? 'error' : 'textPrimary'}
                      >
                        Tipo: {file.type}
                      </Typography>
                      ;  
                      <Typography
                        component="span"
                        variant="body2"
                        color={file.size > 1.5 * 1024 * 1024 ? 'error' : 'textPrimary'}
                      >
                        Tamaño: {(file.size / 1024).toFixed(2)} KB
                      </Typography>
                      {(!['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(file.type) || file.size > 1.5 * 1024 * 1024) && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="error"
                        >
                          {' '}[ELIMINAR]
                        </Typography>
                      )}
                    </>
                  }
                />
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFile(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          {files.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteAll}
              startIcon={<DeleteIcon />}
              sx={{
                width: '100%',
                height: '40px',
                mb: 1,
                mt: 1,
                backgroundColor: '#FFA800',
                color: 'black',
                '& svg': { color: 'black' },
                textTransform: 'none'
              }}
            >
              Eliminar todos los archivos
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <Typography 
        sx={{ 
          fontFamily: 'Nunito, sans-serif', 
          fontWeight: 400, 
          fontSize: { xs: 8, sm: 14 } 
        }}
      >
        Formatos: jpg, png, gif. Tamaño max: 1.5 MB. Subir foto en horizontal.
      </Typography>
    </Box>
  );
}