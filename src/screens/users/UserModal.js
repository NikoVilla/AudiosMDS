import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput, InputAdornment, IconButton, Snackbar } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createUser, updateUser, getUserById } from './ServiceUser';
import MuiAlert from '@mui/material/Alert';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const roles = [
  'Administrador',
  'Taquilla',
  'Marketing',
  'Slot',
];

export default function UserModal({ open, onClose, refreshTable, userId }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);


  useEffect(() => {
    if (open && userId) { 
      const fetchUserData = async () => {
        try {
          const user = await getUserById(userId);
          console.log('Datos del usuario obtenidos:', user);
          setName(user.first_name);
          setSurname(user.last_name);
          setUsername(user.username);
          setRole(user.role.split(', '));
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        }
      };
      fetchUserData();
    }
  }, [open, userId]);

  const handleSave = async () => {
    if (!name || !surname || !username || !password || !confirmPassword) {
      setAlertMessage('Por favor, complete todos los campos');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    if (password !== confirmPassword) {
      setAlertMessage('Las contraseñas no coinciden');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    if (role.length === 0) {
      setAlertMessage('Por favor, seleccione al menos un rol');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    const normalizedRoles = [...role].sort();
    const isAdminCombination =
      normalizedRoles.length === 3 &&
      normalizedRoles.includes('Taquilla') &&
      normalizedRoles.includes('Marketing') &&
      normalizedRoles.includes('Slot');

    const roleText = isAdminCombination
      ? 'Administrador'
      : role.join(', ');

    const userData = {
      first_name: name,
      last_name: surname,
      username,
      role: roleText,
      password: password || undefined,
    };

    console.log('Rol enviado:', roleText);
    console.log('Datos del usuario enviados:', userData);

    try {
      if (userId) {
        await updateUser(userId, userData);
        setAlertMessage('Usuario actualizado con éxito');
        setAlertSeverity('success');
        setAlertOpen(true);
      } else {
        await createUser(userData);
        setAlertMessage('Usuario creado con éxito');
        setAlertSeverity('success');
        setAlertOpen(true);
      }
      refreshTable();
      handleCancel();
    } catch (error) {
      setAlertMessage(`Error al ${userId ? 'actualizar' : 'crear'} el usuario`);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleRoleChange = (event) => {
    const { value } = event.target;
    const newRoles = typeof value === 'string' ? value.split(',') : value;
  
    if (newRoles.includes('Administrador')) {
      setRole(['Administrador']);
    } else {
      setRole(newRoles);
    }
  };

  const handleCancel = () => {
    setName('');
    setSurname('');
    setUsername('');
    setRole([]);
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        PaperProps={{
          style: {
            backgroundColor: '#111111',
            width:{ xs: '80%', sm: '60%', md: '60%', lg: '60%' },
            borderRadius: 15,
            borderWidth: 2,
            borderColor: '#FFA800',
            borderStyle: 'solid',
            // maxWidth: '90vw',
          },
        }}
      >
        <DialogTitle sx={{color:'white', fontWeight:'bold'}}>{userId ? 'Editar usuario' : 'Agregar usuario'}</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            margin='dense'
            fullWidth
            id="name"
            label="Nombre"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              style: { backgroundColor: '#262626', color: 'white', borderRadius: 15, paddingLeft: '12px' }
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 18 }
            }}
            sx={{
              mb: 2,
              width: '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#FFA800',
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            id="surname"
            label="Apellido"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            InputProps={{
              style: { backgroundColor: '#262626', color: 'white', borderRadius: 15, paddingLeft: '12px' }
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 18 }
            }}
            sx={{
              mb: 2,
              width: '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#FFA800',
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            id="username"
            label="Nombre de usuario"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              style: { backgroundColor: '#262626', color: 'white', borderRadius: 15, paddingLeft: '12px' }
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 18 }
            }}
            sx={{
              mb: 2,
              width: '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#FFA800',
                },
              },
            }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel
                  id="role-label"
                  shrink
                  sx={{
                    color: 'white',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 600,
                    fontSize: 18,
                    '&.Mui-focused': {
                      color: 'white',
                    },
                  }}
              >
                  Roles
              </InputLabel>
            <Select
              labelId="role-label"
              multiple
              value={role}
              onChange={handleRoleChange}
              input={<OutlinedInput label="Roles" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
              sx={{
                borderRadius: 4,
                color: 'white',
                backgroundColor: '#262626',
                '& .MuiSelect-icon': {
                  color: '#FFA800',
                },  
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFA800',
                },
                '&.Mui-checked': {
                  color: '#FFA800',
                },
              }}
            >
              {roles.map((roleItem) => (
                <MenuItem key={roleItem} value={roleItem}>
                  <Checkbox color="warning" checked={role.includes(roleItem)} />
                  <ListItemText primary={roleItem} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            id="password"
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { backgroundColor: '#262626', color: 'white', borderRadius: 15, paddingLeft: '12px' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff style={{ color: '#FFA800' }} /> : <Visibility style={{ color: '#FFA800' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 18 }
            }}
            sx={{
              mb: 2,
              width: '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#FFA800',
                },
              },
            }}
          />

          {/* Campo para Confirmar Contraseña */}
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            id="confirm-password"
            label="Confirmar Contraseña"
            name="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              style: { backgroundColor: '#262626', color: 'white', borderRadius: 15, paddingLeft: '12px' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff style={{ color: '#FFA800' }} /> : <Visibility style={{ color: '#FFA800' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 18 }
            }}
            sx={{
              mb: 2,
              width: '100%',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#FFA800',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
          <Button onClick={handleCancel} sx={{ backgroundColor: '#FFA800', textTransform: 'capitalize', color: 'black', '&:hover': { backgroundColor: '#FFA800' } }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name || !surname || !username || !password || !confirmPassword || role.length === 0}
            sx={{ 
              backgroundColor: '#FFA800', 
              textTransform: 'capitalize', 
              color: 'black', 
              '&:hover': { backgroundColor: '#FFA800' }, 
              '&.Mui-disabled': { backgroundColor: '#555', color: '#aaa' } 
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleCloseAlert}>
        <MuiAlert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}