import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
  Avatar,
  Chip,
  useTheme,
  MenuItem,
  Fab,
  Grid,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  People as PeopleIcon,
  Email,
  Badge,
} from '@mui/icons-material';
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
  const { token } = useAuth();
  const theme = useTheme();

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'superadmin': return theme.palette.error.main;
      case 'admin': return theme.palette.warning.main;
      case 'manager': return theme.palette.info.main;
      case 'faculty': return theme.palette.success.main;
      case 'student': return theme.palette.secondary.main;
      default: return theme.palette.grey[500];
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:3001/api/users`, {
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
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:3001/api/users/roles`, {
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
      const url = editUser ? `${window.location.protocol}//${window.location.hostname}:3001/api/users/${editUser._id}` : `${window.location.protocol}//${window.location.hostname}:3001/api/users`;
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
        await fetch(`${window.location.protocol}//${window.location.hostname}:3001/api/users/${id}`, {
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
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Users Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage system users and their roles
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, mx: 'auto', mb: 2 }}>
                <PeopleIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {users.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: theme.palette.success.main, mx: 'auto', mb: 2 }}>
                <Badge />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                {roles.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Roles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Grid */}
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid key={user._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: getRoleColor(user.role.name),
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Email sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Chip
                  label={user.role.name.toUpperCase()}
                  sx={{
                    bgcolor: getRoleColor(user.role.name),
                    color: 'white',
                    fontWeight: 600,
                    mb: 2,
                  }}
                />
                
                <RoleGuard allowedRoles={['superAdmin', 'admin']}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => openDialog(user)}
                      sx={{ flex: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(user._id)}
                      sx={{ flex: 1 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </RoleGuard>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button */}
      <RoleGuard allowedRoles={['superAdmin', 'admin']}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
          onClick={() => openDialog()}
        >
          <Add />
        </Fab>
      </RoleGuard>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {editUser ? 'Edit User' : 'Add New User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editUser ? 'Update user information' : 'Create a new user account'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label={editUser ? 'New Password (optional)' : 'Password'}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              select
              label="User Role"
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              margin="normal"
              variant="outlined"
            >
              <MenuItem value="">Select a role</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {role.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={() => setOpen(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                px: 3,
              }}
            >
              {editUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogActions>
        </Dialog>
    </Container>
  );
};

export default Users;