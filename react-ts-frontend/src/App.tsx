import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './AuthContext';
import { ThemeModeProvider, useThemeMode } from './ThemeContext';
import Login from './Login';
import Dashboard from './Dashboard';
import Users from './Users';
import Roles from './Roles';
import Permissions from './Permissions';
import Courses from './Courses';
import Students from './Students';
import Faculties from './Faculties';
import Batches from './Batches';
import Layout from './Layout';
import getTheme from './theme';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();
  
  if (isLoading) return null;
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const ThemedApp: React.FC = () => {
  const { isDarkMode } = useThemeMode();
  const theme = getTheme(isDarkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/roles" element={
              <ProtectedRoute>
                <Roles />
              </ProtectedRoute>
            } />
            <Route path="/permissions" element={
              <ProtectedRoute>
                <Permissions />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            } />
            <Route path="/faculties" element={
              <ProtectedRoute>
                <Faculties />
              </ProtectedRoute>
            } />
            <Route path="/batches" element={
              <ProtectedRoute>
                <Batches />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  );
};

export default App;