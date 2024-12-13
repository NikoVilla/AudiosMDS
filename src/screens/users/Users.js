import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { visuallyHidden } from '@mui/utils';
import UserModal from './UserModal'; 
import Header from './../../shared/Header'; 
import Sidebar from './../../shared/sidebar'; 
import { getUsers, deleteUser } from './ServiceUser';
import ConfirmDeleteModal from './../../shared/modal/deleteModal'
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: 'first_name',
    numeric: false,
    disablePadding: true,
    label: 'Nombre',
  },
  {
    id: 'last_name',
    numeric: true,
    disablePadding: false,
    label: 'Apellido',
  },
  {
    id: 'username',
    numeric: true,
    disablePadding: false,
    label: 'Nombre de usuario',
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Rol',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ backgroundColor: '#F2F2F2' }}>
      <TableRow sx={{ backgroundColor: 'white' }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="#FFA800"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'Seleccionar todos los usuarios',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: 'bold' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
          Editar
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onAddUser, handleDelete } = props; 
  const [open, setOpen] = useState(false);

  const openDeleteModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    await handleDelete();
    setOpen(false);
  };
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          backgroundColor: '#FFA800',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.warning.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="black"
          variant="subtitle1"
          component="div"
        >
          {numSelected} Seleccionado
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%', fontWeight: 'bold'}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Usuarios
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={openDeleteModal} sx={{ color: 'black' }}>
            <DeleteIcon />
          </IconButton>
          <ConfirmDeleteModal
            open={open}
            handleClose={handleClose}
            handleConfirm={handleConfirm}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Agregar Usuario">
          <IconButton onClick={onAddUser} sx={{ color: 'black' }}>
            <PersonAddAltIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onAddUser: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('first_name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = React.useState(false);
  const [rows, setRows] = useState([]); 
  const [userId, setUserId] = React.useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);

  const fetchData = async () => {
    try {
      const users = await getUsers();
      setRows(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await Promise.all(selected.map(async (id) => {
        await deleteUser(id);
      }));
  
      const newRows = rows.filter((row) => !selected.includes(row.id));
      setRows(newRows);
      setSelected([]);
      setAlertMessage('Usuarios eliminados con éxito');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      console.error('Error deleting users:', error);
      setAlertMessage('Error al eliminar usuarios');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddUser = () => {
    setUserId(null); // No hay userId cuando se agrega un nuevo usuario
    setOpenModal(true);
  };

  const handleEditUser = (id) => {
    setUserId(id); // Establece el userId del usuario que se va a editar
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleListItemClick = (item) => {
    setActiveItem(item);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#000000' }}>
      <Box sx={{ flexShrink: 0 }}>
        <Header toggleDrawer={toggleDrawer} />
      </Box>   
      <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}> 
        <Sidebar open={open} toggleDrawer={toggleDrawer} handleListItemClick={handleListItemClick} activeItem={activeItem} />
        
        <Box sx={{ flex: 1, padding: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} onAddUser={handleAddUser} handleDelete={handleDelete} />
            
            <TableContainer sx={{ 
              backgroundColor: '#D9D9D9', 
              maxHeight: 'calc(100vh - 200px)',
              overflow: 'auto' 
            }}>
              <Table sx={{ minWidth: 700 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={rows.length}
                />
                
                <TableBody sx={{ backgroundColor: '#D9D9D9' }}>
                  {rows
                    .sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const isItemSelected = selected.indexOf(row.id) !== -1;
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox color="warning" checked={isItemSelected} />
                          </TableCell>
                          <TableCell component="th" id={`enhanced-table-checkbox-${row.id}`} scope="row" padding="none">
                            {row.first_name}
                          </TableCell>
                          <TableCell align="right">{row.last_name}</TableCell>
                          <TableCell align="right">{row.username}</TableCell>
                          <TableCell align="right">{row.role}</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEditUser(row.id);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
  
            <TablePagination
              rowsPerPageOptions={[5, 8]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
            />
          </Paper>
        </Box>
      </Box>
      <UserModal open={openModal} onClose={handleCloseModal} refreshTable={fetchData} userId={userId} />
      <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleCloseAlert}>
        <MuiAlert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}  