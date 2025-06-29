import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  useTheme,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from './ThemeContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { role: 'Super Admin', email: 'superadmin@arrow.com', password: 'SuperAdmin@2024', color: 'error' },
    { role: 'Admin', email: 'vamsee@example.com', password: 'password123', color: 'primary' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDarkMode
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                icon={<Brightness7 />}
                checkedIcon={<Brightness4 />}
              />
            }
            label=""
          />
        </Box>

        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            background: theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <School sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Arrow Institute
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Please sign in to your account
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Demo Accounts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {demoAccounts.map((account, index) => (
                <Card
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Chip
                          label={account.role}
                          color={account.color as any}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {account.email}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Click to use
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;