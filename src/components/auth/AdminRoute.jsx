import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import AccessDenied from '../common/AccessDenied';
import { adminAccounts, ADMIN_ROLES } from '../../config/adminConfig';

function AdminRoute({ children, requiredRole = 'admin' }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Find admin account
  const adminAccount = adminAccounts.find(acc => acc.email === user.email);

  // Check if user is an admin
  if (!adminAccount) {
    return <AccessDenied type="denied" />;
  }

  // Check role-based access
  if (requiredRole && requiredRole !== 'any') {
    const hasRequiredRole =
      adminAccount.role === requiredRole ||
      adminAccount.role === ADMIN_ROLES.SUPER_ADMIN;

    if (!hasRequiredRole) {
      return (
        <AccessDenied
          type="insufficient"
          role={adminAccount.role}
          requiredRole={requiredRole}
        />
      );
    }
  }

  return children;
}

export default AdminRoute;
