import React from 'react';
import { Alert } from '@mui/material';
import { useAuth } from './AuthContext';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback }) => {
  const { user } = useAuth();

  if (!user || !user.role || !allowedRoles.includes(user.role.name)) {
    return <>{fallback || <Alert severity="error">Access denied. Insufficient permissions.</Alert>}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;