import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Box, Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './App.css';

interface User {
  id: number;
  name: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messageRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api`),
          axios.get(`${API_BASE_URL}/api/users`)
        ]);
        
        setMessage(messageRes.data.message);
        setUsers(usersRes.data);
      } catch (err) {
        setError('Failed to fetch data from server');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              {message}
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
              Users
            </Typography>
            <List>
              {users.map(user => (
                <ListItem key={user.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;