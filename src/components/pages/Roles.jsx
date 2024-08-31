import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../ui/modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '../ui/ThemeContext';
import { Edit, Trash2 } from 'lucide-react'; // Importa los iconos

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [editRole, setEditRole] = useState(null);
  const { theme } = useTheme();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

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

  const handleAddRole = async () => {
    try {
      const response = await axios.post('http://localhost:5000/roles', { name: roleName }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setRoles([...roles, response.data]);
      setRoleName('');
      setIsRegisterModalOpen(false);
    } catch (error) {
      console.error('Error registering role', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/roles/${editRole.id}`, { name: roleName }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setRoles(roles.map(r => (r.id === editRole.id ? response.data : r)));
      setRoleName('');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving role', error);
    }
  };

  const handleEdit = (role) => {
    setEditRole(role);
    setRoleName(role.name);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (roleId) => {
    try {
      await axios.delete(`http://localhost:5000/roles/${roleId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setRoles(roles.filter(role => role.id !== roleId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting role', error);
    }
  };

  // Columnas de la DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70, headerClassName: 'super-app-theme--header' },
    { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150, headerClassName: 'super-app-theme--header' },
    {
      field: 'actions',
      headerName: 'Acciones',
      headerClassName: 'super-app-theme--header',
      width: 120,
      renderCell: (params) => (
        <div className="flex items-center justify-center w-full">
          <button
            onClick={() => handleEdit(params.row)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mx-1"
            title="Editar"
          >
            <Edit className="h-5 w-5 text-blue-500" />
          </button>
          <button
            onClick={() => {
              setEditRole(params.row);
              setIsDeleteModalOpen(true);
            }}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mx-1"
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
      display: 'flex',
      alignItems: 'center',
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
      <h2 className="text-2xl mb-4 dark:text-white">Control de Roles</h2>

      <button onClick={() => setIsRegisterModalOpen(true)}
        className="mb-4 text-white btn btn-success btn-sm mr-2 rounded">
        Registrar Rol
      </button>

      <div style={{ height: 400, width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <DataGrid
          rows={roles}
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

      {/* Modal para editar rol */}
      <Modal
        title="Editar Rol"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleSave}
      >
        <div className="mt-4">
          <div className="mb-2">
            <label className="block text-sm">Nombre</label>
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="border rounded w-full py-1 px-2"
            />
          </div>
        </div>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal
        title="¿Está seguro de eliminar este rol?"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => handleDelete(editRole.id)}
      >
        <p>Esta acción no se puede deshacer.</p>
      </Modal>

      {/* Modal para registrar rol */}
      <Modal
        title="Registrar Nuevo Rol"
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      >
        <div className="mt-4">
          <div className="mb-2">
            <label className="block text-sm">Nombre</label>
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="border rounded w-full py-1 px-2"
            />
          </div>
          <Button
            onClick={handleAddRole}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Registrar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Roles;