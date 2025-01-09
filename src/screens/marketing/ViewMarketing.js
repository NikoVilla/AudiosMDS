import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Typography, CircularProgress, Grid, IconButton, Snackbar, Select, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Delete, Close } from '@mui/icons-material';
import { getMarketing, deleteMarketing, setImageTime } from './ServiceMarketing';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ConfirmDeleteModal from './../../shared/modal/deleteModal'

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ViewMarketing = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [fijo, setFijo] = useState(300);
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const publicidadFiles = await getMarketing();
        setImages(publicidadFiles.map(file => ({
          src: `${backendUrl}${file.path}`, 
          name: file.filename
        })));
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    await handleDeleteAll();
    setOpen(false);
  };

  const handleSetImageTime = async () => {
    if (currentImageIndex !== null && images[currentImageIndex]) {
      const imageName = images[currentImageIndex].name;
  
      try {
        await setImageTime(imageName, fijo);
        setAlertMessage(`La imagen se ha actualizado correctamente.`);
        setAlertSeverity("success");
        setAlertOpen(true);
      } catch (error) {
        console.error('Error al enviar el tiempo:', error);
        setAlertMessage('Error al fijar imagen. Inténtelo nuevamente.');
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    }
  };  

  const handleDeleteAll = async () => {
    if (images.length === 0) {
      setAlertMessage("Sin elementos a eliminar");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    setIsDeletingAll(true);
    try {
      await Promise.all(images.map(image => deleteMarketing(image.name)));
      setImages([]);
    } catch (error) {
      console.error('Error deleting all media:', error);
    }
    setIsDeletingAll(false);
  };

  const handleOpenModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    setImageLoading(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentImageIndex(null);
  };

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setImageLoading(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };
  
  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setImageLoading(true);
    }
  };

  const handleDeleteImage = async () => {
    if (currentImageIndex !== null && images[currentImageIndex]) {
      try {
        await deleteMarketing(images[currentImageIndex].name);
        setImages(images.filter((_, index) => index !== currentImageIndex));
        handleCloseModal();
      } catch (error) {
        console.error('Error deleting media:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '100%' },
        height: '100%', 
        backgroundColor: '#262626', 
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        position: 'relative',
        padding: 1,
        overflowY: 'auto',
        color: 'black',
        boxSizing: 'border-box',
      }}
    >
      <Box>
        <Button
          variant="contained"
          color='error'
          endIcon={<Delete />}
          sx={{
            position: 'center',
            justifyContent: 'center',
            textTransform: 'none',
          }}
          onClick={handleClickOpen}
          disabled={isDeletingAll}
        >
          {isDeletingAll ? 'Eliminando...' : 'Eliminar todo'}
        </Button>
        <ConfirmDeleteModal
          open={open}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
        />
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80%",
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : images.length > 0 ? (
        <Grid container spacing={2} sx={{ marginTop: 1 }}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index} sx={{ mr: 3, ml: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '66.67%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  cursor: 'pointer',
                }}
                onClick={() => handleOpenModal(index)}
              >
                {imageLoading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)' }} />}
                <Box
                  component="img"
                  src={image.src}
                  alt={image.name}
                  onLoad={() => setImageLoading(false)}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'translate(-50%, -50%)',
                    display: imageLoading ? 'none' : 'block',
                  }}
                />
              </Box>
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<Delete />}
                sx={{ marginTop: 1, marginBottom: 1, textTransform: 'none'}}
                onClick={async () => {
                  try {
                    await deleteMarketing(image.name);
                    setImages(images.filter(img => img.name !== image.name));
                  } catch (error) {
                    console.error('Error deleting media:', error);
                  }
                }}
              >
                Eliminar
              </Button>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ color: 'white', marginTop: 4, position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          Aún no hay imágenes cargadas
        </Typography>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '80%',
            height: '72%',
            backgroundColor: '#444444',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {currentImageIndex !== null && images[currentImageIndex] ? (
            <>
              <Box      
                sx={{
                  position: 'absolute',
                  top: 10,
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2, // Espacio entre el menú y el botón
                }}
              >
                <Select
                  value={fijo}
                  onChange={(e) => setFijo(e.target.value)}
                  sx={{
                    height: '40px',
                    width: 'auto',
                    borderRadius: 1,
                    color: '#FFA800',
                    borderColor: '#FFA800',
                    backgroundColor: '#262626',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFA800',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFA800',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#FFA800',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFA800',
                    },
                  }}
                >
                  <MenuItem value="0">Dejar de fijar</MenuItem>
                  <MenuItem value={300}>Fijar por 5 minuto</MenuItem>
                  <MenuItem value={600}>Fijar por 10 minutos</MenuItem>
                  <MenuItem value={900}>Fijar por 15 minutos</MenuItem>
                  <MenuItem value={1200}>Fijar por 20 minutos</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 500,
                    backgroundColor: fijo ? "#FFA800" : "grey",
                    color: fijo ? "#000" : "#666",
                    "&:hover": {
                      backgroundColor: fijo ? "#cc8500" : "#000",
                    },
                  }}
                  onClick={handleSetImageTime}
                  disabled={!fijo}
                >
                  Enviar
                </Button>
              </Box>

              {/* Botón de cerrar */}
              <IconButton
                sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
                onClick={handleCloseModal}
              >
                <Close sx={{ fontSize: 32 }} />
              </IconButton>
              <Box
                sx={{
                  height: 500,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {imageLoading && (
                  <CircularProgress
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
                <Box
                  component="img"
                  src={images[currentImageIndex].src}
                  alt={images[currentImageIndex].name}
                  onLoad={() => setImageLoading(false)}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    borderRadius: 1,
                    display: imageLoading ? 'none' : 'block',
                    transition: 'opacity 0.3s ease-in-out',
                    opacity: imageLoading ? 0 : 1,
                  }}
                />
              </Box>

              {/* Botones de navegación */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 50, // Altura fija para evitar movimientos
                }}
              >
                <Button
                  onClick={handlePreviousImage}
                  disabled={currentImageIndex === 0}
                  sx={{ color: '#FFA800' }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 40 }} />
                </Button>
                <Button
                  onClick={handleNextImage}
                  disabled={currentImageIndex === images.length - 1}
                  sx={{ color: '#FFA800' }}
                >
                  <ChevronRightIcon sx={{ fontSize: 40 }} />
                </Button>
              </Box>

              {/* Botón de eliminar */}
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                sx={{ 
                  mt: 1,
                  width: "fit-content",
                 }}
                onClick={handleDeleteImage}
              >
                Eliminar
              </Button>
            </>
          ) : (
            <CircularProgress color="inherit" />
          )}
        </Box>
      </Modal>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewMarketing;