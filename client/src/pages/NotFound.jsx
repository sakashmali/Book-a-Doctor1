import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center min-vh-75 d-flex align-items-center justify-content-center">
      <div className="card border-0 shadow-sm rounded-4 p-5 max-w-500 mx-auto">
        <div className="text-primary display-1 fw-bold mb-2">404</div>
        <h3 className="fw-bold text-dark mb-2">Page Not Found</h3>
        <p className="text-secondary mb-4">
          The medical page or resource you requested could not be located.
        </p>
        <div>
          <Link to="/" className="btn btn-primary rounded-pill px-4 shadow-sm">
            <i className="bi bi-house-door me-1"></i> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
