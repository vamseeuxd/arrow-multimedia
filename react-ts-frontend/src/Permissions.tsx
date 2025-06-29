import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert, Chip, Box } from '@mui/material';
import { Edit, Delete, Add, ArrowBack } from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Permission {
  _id: string;
  name: string;
  description: string;
  category: string;
}

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [open, setOpen] = useState(false);
  const [editPermission, setEditPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '' });
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchPermissions = async () => {
    try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:3001/api/permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      setError('Failed to fetch permissions');
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleSubmit = async () => {
    try {
      const url = editPermission ? `${window.location.protocol}//${window.location.hostname}:3001/api/permissions/${editPermission._id}` : `${window.location.protocol}//${window.location.hostname}:3001/api/permissions`;
      const method = editPermission ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPermissions();
        setOpen(false);
        setFormData({ name: '', description: '', category: '' });
        setEditPermission(null);
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
        await fetch(`${window.location.protocol}//${window.location.hostname}:3001/api/permissions/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPermissions();
      } catch (error) {
        setError('Delete failed');
      }
    }
  };

  const openDialog = (permission?: Permission) => {
    if (permission) {
      setEditPermission(permission);
      setFormData({ name: permission.name, description: permission.description, category: permission.category });
    } else {
      setEditPermission(null);
      setFormData({ name: '', description: '', category: '' });
    }
    setOpen(true);
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Permissions Management
          </Typography>
          <Button startIcon={<Add />} variant="contained" onClick={() => openDialog()}>
            Add Permission
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
          <Paper key={category} sx={{ mb: 3, p: 2 }} elevation={1}>
            <Typography variant="h6" gutterBottom>
              <Chip label={category} color="primary" sx={{ mr: 1 }} />
              ({categoryPermissions.length} permissions)
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryPermissions.map((permission) => (
                    <TableRow key={permission._id}>
                      <TableCell><code>{permission.name}</code></TableCell>
                      <TableCell>{permission.description}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => openDialog(permission)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(permission._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editPermission ? 'Edit Permission' : 'Add Permission'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              placeholder="e.g., user.create"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              placeholder="e.g., Create new users"
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
              placeholder="e.g., User Management"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editPermission ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Permissions;