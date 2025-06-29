import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Paper, Box, Alert, CircularProgress } from '@mui/material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import RoleGuard from './RoleGuard';

interface DashboardData {
  message: string;
  stats: {
    totalUsers: number;
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const dashboardData = await response.json();
          setData(dashboardData);
        } else {
          setError('Failed to load dashboard');
        }
      } catch {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {data?.message}
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>
        <Typography variant="body1">
          Total Users: {data?.stats.totalUsers}
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <RoleGuard allowedRoles={['admin', 'manager']}>
          <Button variant="contained" onClick={() => navigate('/users')} sx={{ mr: 2 }}>
            Manage Users
          </Button>
        </RoleGuard>
        <RoleGuard allowedRoles={['admin']}>
          <Button variant="outlined" onClick={() => navigate('/roles')}>
            Manage Roles
          </Button>
        </RoleGuard>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Your Role: <strong>{user?.role?.toUpperCase()}</strong>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard;