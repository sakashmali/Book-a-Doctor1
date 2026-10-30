import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 max-w-500 mx-auto border-0">
          <div className="text-danger mb-3">
            <i className="bi bi-shield-lock-fill display-3"></i>
          </div>
          <h3 className="fw-bold">Access Restricted</h3>
          <p className="text-muted">
            You do not have permission to view this page. You are currently logged in as a <strong>{user.role}</strong>.
          </p>
          <div>
            <a href="/" className="btn btn-primary px-4 me-2">Back to Home</a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
