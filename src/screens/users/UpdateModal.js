import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createUser } from './ServiceUser';

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
  'Boletería',
  'Marketing',
  'Crupier',
];

export default function UserModal({ open, onClose, refreshTable }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
    if (!name || !surname || !username || !password || !confirmPassword) {
      alert('Por favor, complete todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (role.length === 0) {
      alert('Por favor, seleccione al menos un rol');
      return;
    }
  
    const normalizedRoles = [...role].sort();
    const isAdminCombination =
      normalizedRoles.length === 3 &&
      normalizedRoles.includes('Boleteria') &&
      normalizedRoles.includes('Marketing') &&
      normalizedRoles.includes('Crupier');


    const roleText = isAdminCombination
      ? 'Administrador' 
      : role.join(', ');
  
    const userData = {
      first_name: name,
      last_name: surname,
      username,
      role: roleText,
      password,
    };
  
    console.log('Rol enviado:', roleText);
    console.log('Datos del usuario enviados:', userData);
  
    try {
      await createUser(userData);
      alert('Usuario creado con éxito');
      refreshTable(); 
      handleCancel();
    } catch (error) {
      alert('Error al crear el usuario');
    }
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
        },
      }}
    >
      <DialogTitle sx={{ color: 'white' }}>Agregar Usuario</DialogTitle>
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
  );
}