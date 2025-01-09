import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Snackbar, Grid, createTheme, ThemeProvider, Checkbox, FormControlLabel} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MuiAlert from '@mui/material/Alert';
import InputFileUpload from './../media/components/Upload';
import { uploadMarketing } from './ServiceMarketing';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Content() {
  const [files, setFiles] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [isUploading, setIsUploading] = useState(false);
  const [startDate, setStartDate] = React.useState(dayjs());
  const [startTime, setStartTime] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());
  const [endTime, setEndTime] = React.useState(dayjs());
  const [is24Hours, setIs24Hours] = React.useState(false);
  const [shownow, setNoExpiration] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFA800',
      },
    },
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: '#FFA800',
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: '#FFA800',
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: '#FFA800',
          },
        },
      },
    },
  });

  const handleFileChange = (newFiles) => {
    const maxSize = 1.5 * 1024 * 1024;
    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  
    const validFiles = [];
    const invalidFiles = [];
    const verticalFiles = [];
  
    let filesToProcess = newFiles.length;
  
    const checkCompletion = () => {
      if (filesToProcess === 0) {
        if (verticalFiles.length > 0) {
          setAlertMessage("No se permiten archivos verticales. Elimínalos de los cargados.");
          setAlertSeverity("error");
          setAlertOpen(true);
        } else if (invalidFiles.length > 0) {
          setAlertMessage("Formato o tamaño de archivo inválido. Elimínalos de los cargados.");
          setAlertSeverity("error");
          setAlertOpen(true);
        } else {
          setFiles(validFiles);
        }
      }
    };
  
    newFiles.forEach((file) => {
      // Validar tamaño y formato
      if (file.size > maxSize || !allowedFormats.includes(file.type)) {
        invalidFiles.push(file);
        filesToProcess--;
        checkCompletion(); // Verificar si ya procesamos todos los archivos
      } else {
        // Validar orientación (dimensiones de la imagen)
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (img.height > img.width) {
            verticalFiles.push(file);
          } else {
            validFiles.push(file);
          }
          filesToProcess--;
          checkCompletion(); // Verificar si ya procesamos todos los archivos
        };
      }
    });
  };  

  const handleUpload = async () => {
    if (files.length === 0) {
      setAlertMessage("No hay archivos para subir.");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }
  
    if (files.length > 15) {
      setAlertMessage("No se pueden subir más de 15 archivos.");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }
  
    setIsUploading(true);
  
    try {
      const formData = new FormData();
  
      files.forEach((file) => {
        formData.append("files", file);
      });
  
      if (shownow) {
        formData.append("shownow", -1);
      } else if (is24Hours) {
        formData.append("is24Hours", 86400);
      } else {
        // Validaciones de fecha y hora
        if (startDate.isBefore(dayjs(), 'day') || endDate.isBefore(dayjs(), 'day')) {
          setAlertMessage("La fecha de inicio o fin no puede ser inferior a la actual.");
          setAlertSeverity("error");
          setAlertOpen(true);
          return;
        }
      
        const startDateTime = startDate.hour(startTime.hour()).minute(startTime.minute());
        const endDateTime = endDate.hour(endTime.hour()).minute(endTime.minute());
      
        if (endDateTime.isBefore(startDateTime)) {
          setAlertMessage("La hora de fin no puede ser anterior a la hora de inicio.");
          setAlertSeverity("error");
          setAlertOpen(true);
          return;
        }
      
        formData.append("startDate", startDate.format("YYYY-MM-DD"));
        formData.append("startTime", startTime.format("HH:mm"));
        formData.append("endDate", endDate.format("YYYY-MM-DD"));
        formData.append("endTime", endTime.format("HH:mm"));
        console.log("Programado para:", {
          startDate: startDate.format("YYYY-MM-DD"),
          startTime: startTime.format("HH:mm"),
          endDate: endDate.format("YYYY-MM-DD"),
          endTime: endTime.format("HH:mm"),
        });
      }      
  
      console.log("Datos enviados al backend:", formData);
      const response = await uploadMarketing(formData);
  
      setAlertMessage("Archivos subidos con éxito.");
      setAlertSeverity("success");
      setAlertOpen(true);
      console.log("Respuesta del servidor:", response);
    } catch (error) {
      console.error("Error al subir los archivos:", error);
      setAlertMessage(error.message || "Error al subir los archivos.");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setIsUploading(false);
    }
  };
  
  
  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handle24HoursChange = (event) => {
    setIs24Hours(event.target.checked);
  };

  const handleNoExpirationChange = (event) => {
    setNoExpiration(event.target.checked);
  };
  
  // useEffect(() => {
  //   if (alertSeverity === 'success' && alertOpen) {
  //     const timer = setTimeout(() => {
  //       window.location.reload();
  //     }, 1800); // 2 segundos de retraso
  
  //     return () => clearTimeout(timer);
  //   }
  // }, [alertSeverity, alertOpen]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        textAlign: 'left',
        justifyContent: 'center',
        overflowY: 'auto',
      }}
    >
      <Grid container spacing={0.5}>
        <Grid item xs={12}>
          <InputFileUpload onFileChange={handleFileChange} />
        </Grid>
  
        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 600,
              fontSize: { xs: 12, sm: 19 },
              mt: 3,
            }}
          >
            Seleccionar tiempo de expiración de la imagen
          </Typography>
        </Grid>
  
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={shownow} onChange={handleNoExpirationChange} />
                    }
                    label="Sin tiempo de expiración"
                  />
                </Grid>
  
                {!shownow && (
                  <Grid item xs={12} sx={{mb:1}}>
                    <FormControlLabel
                      control={<Checkbox checked={is24Hours} onChange={handle24HoursChange} />}
                      label="Usar 24 horas"
                    />
                  </Grid>
                )}
  
                {!shownow && !is24Hours && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <DemoContainer components={['TimePicker']}>
                        <TimePicker
                          label="Hora de Inicio"
                          value={startTime}
                          onChange={(newValue) => setStartTime(newValue)}
                          sx={{
                            height: '70%',
                            backgroundColor: '#262626',
                            '& .MuiInputBase-root': { color: '#FFA800' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                            '& .MuiSvgIcon-root': { color: '#FFA800' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#FFA800',
                            },
                          }}
                        />
                      </DemoContainer>
                    </Grid>
  
                    <Grid item xs={12} sm={6}>
                      <DemoContainer components={['TimePicker']}>
                        <TimePicker
                          label="Hora de Fin"
                          value={endTime}
                          onChange={(newValue) => setEndTime(newValue)}
                          sx={{
                            height: '70%',
                            backgroundColor: '#262626',
                            '& .MuiInputBase-root': { color: '#FFA800' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                            '& .MuiSvgIcon-root': { color: '#FFA800' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#FFA800',
                            },
                          }}
                        />
                      </DemoContainer>
                    </Grid>
  
                    <Grid item xs={12} sm={6}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          label="Fecha de Inicio"
                          value={startDate}
                          onChange={(newValue) => setStartDate(newValue)}
                          sx={{
                            height: '70%',
                            backgroundColor: '#262626',
                            '& .MuiInputBase-root': { color: '#FFA800' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                            '& .MuiSvgIcon-root': { color: '#FFA800' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#FFA800',
                            },
                          }}
                        />
                      </DemoContainer>
                    </Grid>
  
                    <Grid item xs={12} sm={6}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          label="Fecha de Fin"
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          sx={{
                            height: '70%',
                            backgroundColor: '#262626',
                            '& .MuiInputBase-root': { color: '#FFA800' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                            '& .MuiSvgIcon-root': { color: '#FFA800' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#FFA800',
                            },
                          }}
                        />
                      </DemoContainer>
                    </Grid>
                  </>
                )}
              </Grid>
            </LocalizationProvider>
          </ThemeProvider>
        </Grid>

  
        <Grid item xs={12}>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleUpload}
            disabled={isUploading}
            sx={{
              mt: 2,
              width: '100%',
              textTransform: 'none',
              backgroundColor: isUploading ? 'grey' : '#28a745',
              color: isUploading ? 'white' : 'black',
              fontSize: { xs: 11, sm: 15 },
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              '&:disabled': {
                backgroundColor: 'grey',
                color: 'white',
              },
            }}
          >
            {isUploading ? 'Enviando...' : 'Enviar'}
          </Button>
        </Grid>
  
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </Box>
  );
}  