import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Select, MenuItem, ButtonGroup, Snackbar, Grid, createTheme, ThemeProvider, Checkbox, FormControlLabel} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TextSwitch from './components/TextSwitch';
import MuiAlert from '@mui/material/Alert';
import InputFileUpload from './components/Upload';
import { uploadMedia } from './ServiceMedia';
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
  const [selectedOption, setSelectedOption] = useState('Mostrar ahora');
  const [showNow, setShowNow] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState('');
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
    const maxSize = 1.5 * 1024 * 1024; // 1.5 MB in bytes
    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  
    const validFiles = [];
    const invalidFiles = [];
    const verticalFiles = [];
  
    let filesToProcess = newFiles.length; // Counter to handle asynchronous events
  
    const checkCompletion = () => {
      if (filesToProcess === 0) {
        if (verticalFiles.length > 0) {
          setAlertMessage("No se permiten archivos verticales. Este archivo no se subirá.");
          setAlertSeverity("error");
          setAlertOpen(true);
        } else if (invalidFiles.length > 0) {
          setAlertMessage("Formato o tamaño de archivo inválido. Este archivo no se subirá.");
          setAlertSeverity("error");
          setAlertOpen(true);
        } else {
          setFiles(validFiles);
        }
      }
    };
  
    newFiles.forEach((file) => {
      // Validate size and format
      if (file.size > maxSize || !allowedFormats.includes(file.type)) {
        invalidFiles.push(file);
        filesToProcess--;
        checkCompletion(); // Check if all files are processed
      } else {
        // Validate orientation (image dimensions)
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (img.height > img.width) {
            verticalFiles.push(file);
          } else {
            validFiles.push(file);
          }
          filesToProcess--;
          checkCompletion(); // Check if all files are processed
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

    if (files.length > 10) {
      setAlertMessage("No se pueden subir más de 10 archivos.");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }
  
    if (enabled && text === "") {
      setAlertMessage("Rellene el campo texto o deshabilítelo.");
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
  
      if (selectedOption === "Mostrar ahora") {
        formData.append("showNow", showNow);
      } else if (selectedOption === "Programar") {
        if (is24Hours) {
          formData.append("is24Hours", 86400);
        } else {

          if (startDate.isBefore(dayjs(), 'day') || endDate.isBefore(dayjs(), 'day')) {
            setAlertMessage("La fecha de inicio o fin no puede ser inferior a la actual.");
            setAlertSeverity("error");
            setAlertOpen(true);
            return;
          }
          formData.append("startDate", startDate.format("YYYY-MM-DD"));
          formData.append("startTime", startTime.format("HH:mm"));
          formData.append("endDate", endDate.format("YYYY-MM-DD"));
          formData.append("endTime", endTime.format("HH:mm"));
        }
      }
  
      if (enabled) {
        formData.append("text", text);
      }
  
      console.log("Datos enviados al backend:", formData);
      const response = await uploadMedia(formData);
  
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

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  
    if (option === 'Mostrar ahora') {
      setShowNow('');
      setText('');
    } else if (option === 'Programar') {
      setShowNow('');
      setText('');
    }
  };

  const handle24HoursChange = (event) => {
    setIs24Hours(event.target.checked);
  };
  
  useEffect(() => {
    if (alertSeverity === 'success' && alertOpen) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1800);
  
      return () => clearTimeout(timer);
    }
  }, [alertSeverity, alertOpen]);

  return (
    <Box sx={{ width: '100%', height: '100vh', textAlign: 'left', justifyContent: 'center', overflowY: 'auto'}}>
      <Grid container spacing={1.5}>
        <Grid item xs={12}>
          <InputFileUpload onFileChange={handleFileChange} />
        </Grid>

        {/* <Grid item xs={12}>
          <Typography 
            sx={{ 
              fontFamily: 'Nunito, sans-serif', 
              fontWeight: 600, 
              fontSize: { xs: 12, sm: 19 } 
            }}
          >
            Seleccionar opciones de visualización
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <ButtonGroup
            variant="outlined"
            sx={{
              width: '100%',
              '& .MuiButtonGroup-root .MuiButton-outlined': {
                borderColor: '#FFA800',
              },
              '& .MuiButton-root': {
                borderColor: '#FFA800',
                '&.Mui-focused': {
                  borderColor: '#FFA800',
                },
                '&:hover': {
                  borderColor: '#FFA800',
                },
                '&:active': {
                  borderColor: '#FFA800',
                },
              },
            }}
          >
            <Button
              onClick={() => handleOptionChange('Mostrar ahora')}
              disableRipple
              sx={{
                borderRadius: '4px 0 0 4px',
                backgroundColor: selectedOption === 'Mostrar ahora' ? '#FFA800' : 'transparent',
                color: selectedOption === 'Mostrar ahora' ? 'black' : 'white',
                '&:hover': { backgroundColor: selectedOption === 'Mostrar ahora' ? '#FFA800' : '#404040' },
                textTransform: 'none',
                width: '50%',
                fontFamily: 'Nunito, sans-serif',
                fontSize: { xs: 9, sm: 14 },
                fontWeight: 700,
              }}
            >
              Mostrar ahora
            </Button>
            <Button
              onClick={() => handleOptionChange('Programar')}
              disableRipple
              sx={{
                borderRadius: '0 4px 4px 0',
                backgroundColor: selectedOption === 'Programar' ? '#FFA800' : 'transparent',
                color: selectedOption === 'Programar' ? 'black' : 'white',
                '&:hover': { backgroundColor: selectedOption === 'Programar' ? '#FFA800' : '#404040' },
                textTransform: 'capitalize',
                width: '50%',
                fontFamily: 'Nunito, sans-serif',
                fontSize: { xs: 9, sm: 14 },
                fontWeight: 700,
              }}
            >
              Programar
            </Button>
          </ButtonGroup>
        </Grid>

        {selectedOption === 'Mostrar ahora' && (
          <Grid item xs={12}>
            <Typography 
              sx={{ 
                fontFamily: 'Nunito, sans-serif', 
                fontWeight: 600, 
                fontSize: { xs: 12, sm: 18 } 
              }}
            >
              Tiempo a mostrar
            </Typography>
            <Select
              value={showNow}
              onChange={(e) => setShowNow(e.target.value)}
              sx={{
                height: '40px',
                width: '100%',
                mt: 1,
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
              <MenuItem value="">Seleccionar tiempo</MenuItem>
              <MenuItem value={60}>1 minuto</MenuItem>
              <MenuItem value={300}>5 minutos</MenuItem>
              <MenuItem value={600}>10 minutos</MenuItem>
            </Select>
          </Grid>
        )}

        {selectedOption === 'Programar' && (
          <>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox checked={is24Hours} onChange={handle24HoursChange} />}
                        label="Usar 24 horas"
                      />
                    </Grid>

                    {!is24Hours && (
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
                                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
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
                                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                              }}
                            />
                          </DemoContainer>
                        </Grid>
                      </>
                    )}

                    {!is24Hours && (
                      <>
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
                                '& .MuiSvgIcon-root': { color: '#FFA800' }, // Icono de calendario
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
                                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' }, // Evita el negro
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
                                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFA800' },
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
          </>
        )}

        <Grid item xs={12}>
          <TextSwitch enabled={enabled} setEnabled={setEnabled} text={text} setText={setText} />
        </Grid> */}

        <Grid item xs={12}>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleUpload}
            disabled={isUploading}
            sx={{
              mt: 0.5,
              width: '100%',
              textTransform: 'none',
              backgroundColor: isUploading ? 'grey' : '#FFA800',
              color: isUploading ? 'white' : 'black',
              fontSize: { xs: 11, sm: 15},
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
          <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
              {alertMessage}
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Box>
  );
}