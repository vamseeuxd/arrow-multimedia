import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert, Chip, Box } from '@mui/material';
import { Edit, Delete, Add, ArrowBack } from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
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
  const [formData, setFormData] = useState({ name: '', description: '', permissionIds: [] as string[] });
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

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
        setFormData({ name: '', description: '', permissionIds: [] });
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
      setFormData({ name: role.name, description: role.description, permissionIds: role.permissions.map(p => p._id) });
    } else {
      setEditRole(null);
      setFormData({ name: '', description: '', permissionIds: [] });
    }
    setOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(p => p !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Roles Management
          </Typography>
          <Button startIcon={<Add />} variant="contained" onClick={() => openDialog()}>
            Add Role
          </Button>
        </Box>

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
                        <Chip key={permission._id} label={permission.name} size="small" />
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
                  color={formData.permissionIds.includes(permission._id) ? 'primary' : 'default'}
                  onClick={() => togglePermission(permission._id)}
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