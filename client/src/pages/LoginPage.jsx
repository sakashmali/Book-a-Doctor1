import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterLogin = (role) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }
    if (role === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (role === 'doctor') navigate('/doctor/dashboard', { replace: true });
    else navigate('/patient/dashboard', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      redirectAfterLogin(data.role);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo helper
  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    try {
      const data = await login(demoEmail, demoPass);
      redirectAfterLogin(data.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light py-5 min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7 col-sm-9">
            {/* Demo Quick-Login Banner Card */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white border-start border-4 border-primary">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-lightning-charge-fill text-warning"></i>
                <span className="fw-bold small text-dark">One-Click Demo Evaluator Logins</span>
              </div>
              <div className="d-flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm rounded-pill flex-grow-1"
                  onClick={() => handleQuickLogin('patient@pulsecare.com', 'patient123')}
                  disabled={loading}
                >
                  <i className="bi bi-person-fill me-1"></i> Patient Demo
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm rounded-pill flex-grow-1"
                  onClick={() => handleQuickLogin('dr.carter@pulsecare.com', 'doctor123')}
                  disabled={loading}
                >
                  <i className="bi bi-heart-pulse me-1"></i> Doctor Demo
                </button>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm rounded-pill flex-grow-1"
                  onClick={() => handleQuickLogin('admin@pulsecare.com', 'admin123')}
                  disabled={loading}
                >
                  <i className="bi bi-shield-lock-fill me-1"></i> Admin Demo
                </button>
              </div>
            </div>

            {/* Login Card */}
            <div className="card border-0 shadow-lg rounded-4 p-4 p-sm-5 bg-white">
              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-3 p-2.5 d-inline-flex align-items-center justify-content-center mb-2 shadow-sm" style={{ width: 48, height: 48 }}>
                  <i className="bi bi-heart-pulse-fill fs-4"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
                <p className="text-muted small">Sign in to manage appointments & healthcare records</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">
                    <i className="bi bi-envelope me-1 text-primary"></i> Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control py-2.5"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold text-secondary small mb-0">
                      <i className="bi bi-lock me-1 text-primary"></i> Password
                    </label>
                  </div>
                  <input
                    type="password"
                    className="form-control py-2.5"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 rounded-pill fw-semibold shadow-sm mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="text-center text-muted small">
                  Don't have an account yet?{' '}
                  <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                    Register here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
