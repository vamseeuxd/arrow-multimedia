import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert, Chip, Box } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useAuth } from './AuthContext';

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface Permission {
  _id: string;
  name: string;
  description: string;
  category: string;
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] as string[] });
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      setError('Failed to fetch roles');
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/permissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      setError('Failed to fetch permissions');
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleSubmit = async () => {
    try {
      const url = editRole ? `http://localhost:3001/api/roles/${editRole._id}` : 'http://localhost:3001/api/roles';
      const method = editRole ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchRoles();
        setOpen(false);
        setFormData({ name: '', description: '', permissions: [] });
        setEditRole(null);
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
        await fetch(`http://localhost:3001/api/roles/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRoles();
      } catch (error) {
        setError('Delete failed');
      }
    }
  };

  const openDialog = (role?: Role) => {
    if (role) {
      setEditRole(role);
      setFormData({ name: role.name, description: role.description, permissions: role.permissions });
    } else {
      setEditRole(null);
      setFormData({ name: '', description: '', permissions: [] });
    }
    setOpen(true);
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Roles Management
          <Button startIcon={<Add />} variant="contained" sx={{ ml: 2 }} onClick={() => openDialog()}>
            Add Role
          </Button>
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role._id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {role.permissions.map((permission) => (
                        <Chip key={permission} label={permission} size="small" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => openDialog(role)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(role._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
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
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
            />
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Permissions:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {permissions.map((permission) => (
                <Chip
                  key={permission._id}
                  label={`${permission.name} (${permission.category})`}
                  clickable
                  color={formData.permissions.includes(permission.name) ? 'primary' : 'default'}
                  onClick={() => togglePermission(permission.name)}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editRole ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Roles;