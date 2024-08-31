import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ui/ThemeContext';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Modal from '../ui/modal';
import Select from 'react-select';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Edit, Trash2 } from 'lucide-react'; // Importa los iconos

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const { theme } = useTheme();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/roles', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles', error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setUsername(user.username);
    setRole(user.role_id);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${editUser.id}`, { username, role }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.map(u => u.id === editUser.id ? response.data : u));
      setEditUser(null);
      setUsername('');
      setRole('');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving user', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.filter(u => u.id !== id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/users`, { username, password, role }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers([...users, response.data]);
      setIsRegisterModalOpen(false);
      setUsername('');
      setPassword('');
      setRole('');
    } catch (error) {
      console.error('Error registering user', error);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'N/A';
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, headerClassName: 'super-app-theme--header' },
    { field: 'username', headerName: 'Nombre', flex: 1, minWidth: 150, headerClassName: 'super-app-theme--header' },
    { 
      field: 'role_id', 
      headerName: 'Role', 
      flex: 1,
      minWidth: 150, 
      headerClassName: 'super-app-theme--header',
      valueGetter: (params) => getRoleName(params.value)
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      headerClassName: 'super-app-theme--header',
      width: 120,
      renderCell: (params) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(params.row)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Editar"
          >
            <Edit className="h-5 w-5 text-blue-500" />
          </button>
          <button
            onClick={() => {
              setEditUser(params.row);
              setIsDeleteModalOpen(true);
            }}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Eliminar"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        </div>
      )
    }
  ];

  const getThemeStyles = (theme) => ({
    backgroundColor: theme === 'dark' ? '#1d232a' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    '& .MuiDataGrid-cell': {
      borderBottom: theme === 'dark' ? '1px solid #2d3748' : '1px solid #e2e8f0',
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: theme === 'dark' ? '#2d3748' : '#edf2f7',
      borderBottom: theme === 'dark' ? '2px solid #4a5568' : '2px solid #cbd5e0',
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: theme === 'dark' ? '2px solid #4a5568' : '2px solid #cbd5e0',
      backgroundColor: theme === 'dark' ? '#2d3748' : '#edf2f7',
    },
    '& .MuiButtonBase-root': {
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: theme === 'dark' ? '#4a5568' : '#edf2f7',
    },
    '& .MuiDataGrid-virtualScroller': {
      backgroundColor: theme === 'dark' ? '#1d232a' : '#fff',
    },
    '& .MuiDataGrid-overlayWrapper': {
      backgroundColor: theme === 'dark' ? '#1d232a' : '#fff',
    },
    '& .super-app-theme--header': {
      backgroundColor: theme === 'dark' ? '#1d232a' : '#fff',
      borderBottom: `1px solid ${theme === 'dark' ? '#555' : '#e0e0e0'}`,
      color: theme === 'dark' ? '#fff' : '#000',
    },
  });

  return (
    <div className="overflow-x-auto" data-theme={theme}>
      <h2 className="text-2xl mb-4 dark:text-white">Control de Usuarios</h2>
      <button 
        onClick={() => setIsRegisterModalOpen(true)} 
        className="mb-4 text-white btn btn-success btn-sm mr-2 rounded">
        Registrar Usuario
      </button>

      <div style={{ height: 400, width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <DataGrid
          rows={users}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick
          sx={getThemeStyles(theme)}
        />
      </div>

      {/* Modal para editar el usuario */}
      <Modal 
        title="Edición de Usuario" 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleSave}>
        <div className="mt-4">
          <div className="mb-2">
            <label className="block text-sm">Nombre</label>
            <Input value={username} data-theme={theme} onChange={(e) => setUsername(e.target.value)} className="border rounded w-full py-1 px-2" />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Role</label>
            <Select 
              value={{ value: role, label: getRoleName(role) }}
              onChange={(selectedOption) => setRole(selectedOption.value)}
              options={roles.map(r => ({ value: r.id, label: r.name }))}
              className="rounded w-full py-1 px-2 dark:placeholder-gray-700" data-theme={theme}
            />
          </div>
        </div>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal 
        title="¿Está seguro de eliminar este usuario?" 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => handleDelete(editUser.id)}>
        <p>Esta acción no se puede deshacer.</p>
      </Modal>

      {/* Modal para registrar usuario */}
      <Modal 
        title="Registrar Nuevo Usuario" 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}>
        <div className="mt-4">
          <div className="mb-2">
            <label className="block text-sm">Nombre</label>
            <Input  onChange={(e) => setUsername(e.target.value)} className="border rounded w-full py-1 px-2" />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Contraseña</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="border rounded w-full py-1 px-2" />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Role</label>
            <Select 
              value={{ value: role, label: getRoleName(role) }}
              onChange={(selectedOption) => setRole(selectedOption.value)}
              options={roles.map(r => ({ value: r.id, label: r.name }))}
              className="border rounded w-full py-1 px-2"
            />
          </div>
          <Button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded">Registrar</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Users;