import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useAuth } from './AuthContext';
import RoleGuard from './RoleGuard';

interface User {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
    description: string;
  };
}

interface Role {
  _id: string;
  name: string;
  description: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleId: '' });
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      setError('Failed to fetch roles');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleSubmit = async () => {
    try {
      const url = editUser ? `http://localhost:3001/api/users/${editUser._id}` : 'http://localhost:3001/api/users';
      const method = editUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchUsers();
        setOpen(false);
        setFormData({ name: '', email: '', password: '', roleId: '' });
        setEditUser(null);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`http://localhost:3001/api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) {
        setError('Delete failed');
      }
    }
  };

  const openDialog = (user?: User) => {
    if (user) {
      setEditUser(user);
      setFormData({ name: user.name, email: user.email, password: '', roleId: user.role._id });
    } else {
      setEditUser(null);
      setFormData({ name: '', email: '', password: '', roleId: '' });
    }
    setOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Users Management
          <RoleGuard allowedRoles={['admin']}>
            <Button startIcon={<Add />} variant="contained" sx={{ ml: 2 }} onClick={() => openDialog()}>
              Add User
            </Button>
          </RoleGuard>
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: user.role.name === 'admin' ? '#f44336' : user.role.name === 'manager' ? '#ff9800' : '#4caf50',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {user.role.name.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <RoleGuard allowedRoles={['admin']}>
                      <IconButton onClick={() => openDialog(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user._id)}>
                        <Delete />
                      </IconButton>
                    </RoleGuard>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label={editUser ? 'New Password (optional)' : 'Password'}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Role"
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              margin="normal"
              SelectProps={{ native: true }}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name} - {role.description}
                </option>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Users;