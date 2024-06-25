import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ui/ThemeContext';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Modal from '../ui/modal';
import Select from 'react-select';

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
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
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

    fetchUsers();
    fetchRoles();
  }, []);

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

  return (
    <div className="overflow-x-auto" data-theme={theme}>
      <h2 className="text-2xl mb-4 dark:text-white">Control de Usuarios</h2>
      <button 
      onClick={() => setIsRegisterModalOpen(true)} 
      className="mb-4 text-white btn btn-success btn-sm  mr-2 rounded">Registrar Usuario</button>
      <table className="table">
        <thead>
          <tr>
            <th className="py-2 dark:text-white">ID</th>
            <th className="py-2 dark:text-white">Nombre</th>
            <th className="py-2 dark:text-white">Role</th>
            <th className="py-2 dark:text-white">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 dark:text-white">{user.id}</td>
              <td className="py-2 dark:text-white">{user.username}</td>
              <td className="py-2 dark:text-white">{getRoleName(user.role_id)}</td>
              <td className="py-1 dark:text-white">
                <button onClick={() => handleEdit(user)} className="btn btn-outline btn-success btn-sm mr-2">Editar</button>
                <button onClick={() => {
                  setUserToDelete(user);
                  setIsDeleteModalOpen(true);
                }} className="btn btn-outline btn-error btn-sm">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar el usuario */}
      <Modal 
        title="Edicion de Usuario" 
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
        onDelete={() => handleDelete(userToDelete.id)}>
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
            <Input value={username} onChange={(e) => setUsername(e.target.value)} className="border rounded w-full py-1 px-2" />
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
  