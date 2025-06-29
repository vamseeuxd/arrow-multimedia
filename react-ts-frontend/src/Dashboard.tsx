import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Avatar,
  Chip,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  Class as ClassIcon,
  Security as SecurityIcon,
  TrendingUp,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
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
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${window.location.protocol}//${window.location.hostname}:3001/api/dashboard`, {
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

  const quickActions = [
    {
      title: 'Users',
      description: 'Manage system users',
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
      path: '/users',
      roles: ['superAdmin', 'admin', 'manager'],
    },
    {
      title: 'Courses',
      description: 'Manage courses',
      icon: <SchoolIcon />,
      color: theme.palette.success.main,
      path: '/courses',
      roles: ['superAdmin', 'admin', 'manager', 'faculty'],
    },
    {
      title: 'Students',
      description: 'Manage students',
      icon: <GroupsIcon />,
      color: theme.palette.info.main,
      path: '/students',
      roles: ['superAdmin', 'admin', 'manager', 'faculty'],
    },
    {
      title: 'Faculties',
      description: 'Manage faculty members',
      icon: <PeopleIcon />,
      color: theme.palette.warning.main,
      path: '/faculties',
      roles: ['superAdmin', 'admin', 'manager'],
    },
    {
      title: 'Batches',
      description: 'Manage batches',
      icon: <ClassIcon />,
      color: theme.palette.secondary.main,
      path: '/batches',
      roles: ['superAdmin', 'admin', 'manager', 'faculty'],
    },
    {
      title: 'Roles',
      description: 'Manage user roles',
      icon: <SecurityIcon />,
      color: theme.palette.error.main,
      path: '/roles',
      roles: ['superAdmin', 'admin'],
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Welcome Section */}
      <Card sx={{ mb: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '2rem',
                mr: 3,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome back, {user?.name}!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                {data?.message || 'Ready to manage your institute'}
              </Typography>
              <Chip
                label={`Role: ${user?.role?.name?.toUpperCase()}`}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>
            <DashboardIcon sx={{ fontSize: 60, opacity: 0.3 }} />
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, mx: 'auto', mb: 2 }}>
                <PeopleIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {data?.stats.totalUsers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Avatar sx={{ bgcolor: theme.palette.success.main, mx: 'auto', mb: 2 }}>
                <SchoolIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Avatar sx={{ bgcolor: theme.palette.info.main, mx: 'auto', mb: 2 }}>
                <GroupsIcon />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                156
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Avatar sx={{ bgcolor: theme.palette.warning.main, mx: 'auto', mb: 2 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Batches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action) => (
          <RoleGuard key={action.title} allowedRoles={action.roles}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[12],
                  },
                }}
                onClick={() => navigate(action.path)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: action.color,
                        mr: 2,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: action.color,
                      color: action.color,
                      '&:hover': {
                        bgcolor: action.color,
                        color: 'white',
                      },
                    }}
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </RoleGuard>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;