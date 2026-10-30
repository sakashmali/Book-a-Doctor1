import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'doctor') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    if (user.role === 'admin') return 'Admin Dashboard';
    if (user.role === 'doctor') return 'Doctor Portal';
    return 'My Appointments';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 40, height: 40 }}>
            <i className="bi bi-heart-pulse-fill fs-5"></i>
          </div>
          <div>
            <span className="fw-bold fs-4 text-dark tracking-tight">Pulse<span className="text-primary">Care</span></span>
            <small className="d-block text-muted" style={{ fontSize: '10px', marginTop: '-4px', letterSpacing: '0.5px' }}>
              HEALTHCARE PORTAL
            </small>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navbarMain">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link fw-semibold px-2 ${isActive ? 'text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
                onClick={() => setNavOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/doctors"
                className={({ isActive }) => `nav-link fw-semibold px-2 ${isActive ? 'text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
                onClick={() => setNavOpen(false)}
              >
                Find Doctors
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/departments"
                className={({ isActive }) => `nav-link fw-semibold px-2 ${isActive ? 'text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
                onClick={() => setNavOpen(false)}
              >
                Departments
              </NavLink>
            </li>

            {/* Role specific quick link for logged in users */}
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  to={getDashboardPath()}
                  className={({ isActive }) => `nav-link fw-semibold px-2 ${isActive ? 'text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
                  onClick={() => setNavOpen(false)}
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  {getDashboardLabel()}
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Buttons */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="d-flex align-items-center gap-2 text-decoration-none bg-light px-3 py-1.5 rounded-pill border"
                  onClick={() => setNavOpen(false)}
                >
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 32, height: 32, fontSize: '13px' }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-start d-none d-sm-block">
                    <span className="fw-semibold text-dark d-block text-truncate" style={{ maxWidth: '120px', fontSize: '13px' }}>
                      {user?.name}
                    </span>
                    <span className="badge bg-primary-subtle text-primary text-capitalize" style={{ fontSize: '10px' }}>
                      {user?.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1"
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-md-inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary rounded-pill px-3 fw-semibold">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary rounded-pill px-3 fw-semibold shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
