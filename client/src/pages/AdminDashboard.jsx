import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'doctors', 'patients', 'departments', 'appointments'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab Data States
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Doctor filter
  const [doctorApprovalFilter, setDoctorApprovalFilter] = useState('all');

  // Appointment filter
  const [apptStatusFilter, setApptStatusFilter] = useState('all');

  // Department Modal State
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [deptForm, setDeptForm] = useState({
    id: null,
    name: '',
    description: '',
    icon: 'bi-hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
  });
  const [savingDept, setSavingDept] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Load Overview Stats
  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  // Load Tab-specific data
  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        await fetchStats();
      } else if (activeTab === 'doctors') {
        const query = doctorApprovalFilter === 'all' ? '' : `?approval=${doctorApprovalFilter}`;
        const { data } = await API.get(`/admin/doctors${query}`);
        setDoctors(data || []);
      } else if (activeTab === 'patients') {
        const { data } = await API.get('/admin/patients');
        setPatients(data || []);
      } else if (activeTab === 'departments') {
        const { data } = await API.get('/departments');
        setDepartments(data || []);
      } else if (activeTab === 'appointments') {
        const query = apptStatusFilter === 'all' ? '' : `?status=${apptStatusFilter}`;
        const { data } = await API.get(`/admin/appointments${query}`);
        setAppointments(data || []);
      }
    } catch (err) {
      console.error('Error fetching tab data:', err);
      setStatusMessage({ text: 'Error loading data.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    loadTabData();
  }, [activeTab, doctorApprovalFilter, apptStatusFilter]);

  // Doctor Approval Action
  const handleToggleApproval = async (docId, currentApproval) => {
    try {
      await API.put(`/admin/doctors/${docId}/approval`, { isApproved: !currentApproval });
      setStatusMessage({ text: `Doctor approval status updated successfully.`, type: 'success' });
      loadTabData();
      fetchStats();
    } catch (err) {
      setStatusMessage({ text: err.response?.data?.message || 'Error updating doctor approval.', type: 'danger' });
    }
  };

  // Doctor Active/Inactive Action
  const handleToggleDoctorActive = async (docId) => {
    try {
      await API.put(`/admin/doctors/${docId}/toggle-status`);
      setStatusMessage({ text: 'Doctor account status updated.', type: 'success' });
      loadTabData();
    } catch (err) {
      setStatusMessage({ text: err.response?.data?.message || 'Error updating status.', type: 'danger' });
    }
  };

  // Patient Toggle Active Action
  const handleTogglePatientActive = async (patientId) => {
    try {
      await API.put(`/admin/patients/${patientId}/toggle-status`);
      setStatusMessage({ text: 'Patient account status updated.', type: 'success' });
      loadTabData();
    } catch (err) {
      setStatusMessage({ text: err.response?.data?.message || 'Error updating status.', type: 'danger' });
    }
  };

  // Department Form Save
  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    setSavingDept(true);
    try {
      if (deptForm.id) {
        await API.put(`/departments/${deptForm.id}`, deptForm);
        setStatusMessage({ text: 'Department updated successfully.', type: 'success' });
      } else {
        await API.post('/departments', deptForm);
        setStatusMessage({ text: 'New department added successfully.', type: 'success' });
      }
      setDeptModalOpen(false);
      setDeptForm({ id: null, name: '', description: '', icon: 'bi-hospital', image: '' });
      loadTabData();
      fetchStats();
    } catch (err) {
      setStatusMessage({ text: err.response?.data?.message || 'Error saving department.', type: 'danger' });
    } finally {
      setSavingDept(false);
    }
  };

  // Department Delete
  const handleDeleteDepartment = async (deptId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await API.delete(`/departments/${deptId}`);
      setStatusMessage({ text: 'Department deleted successfully.', type: 'success' });
      loadTabData();
      fetchStats();
    } catch (err) {
      setStatusMessage({ text: err.response?.data?.message || 'Error deleting department.', type: 'danger' });
    }
  };

  // Appointment Status update by Admin
  const handleAdminUpdateAppt = async (apptId, newStatus) => {
    try {
      await API.put(`/appointments/${apptId}/status`, { status: newStatus });
      setStatusMessage({ text: `Appointment status updated to ${newStatus}.`, type: 'success' });
      loadTabData();
      fetchStats();
    } catch (err) {
      setStatusMessage({ text: err.response?.data?.message || 'Error updating appointment.', type: 'danger' });
    }
  };

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        {/* Banner Alert */}
        {statusMessage.text && (
          <div className={`alert alert-${statusMessage.type} alert-dismissible fade show mb-4`} role="alert">
            {statusMessage.text}
            <button type="button" className="btn-close" onClick={() => setStatusMessage({ text: '', type: '' })}></button>
          </div>
        )}

        {/* Admin Header */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-dark text-white px-2.5 py-1 rounded-pill">PulseCare Central Admin</span>
                <span className="badge bg-success-subtle text-success">Live Management</span>
              </div>
              <h3 className="fw-bold text-dark mb-0">System Administration Console</h3>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex flex-wrap gap-1 bg-light p-1.5 rounded-pill border">
              {[
                { id: 'overview', label: 'Overview', icon: 'bi-grid-fill' },
                { id: 'doctors', label: 'Doctors', icon: 'bi-heart-pulse-fill' },
                { id: 'patients', label: 'Patients', icon: 'bi-people-fill' },
                { id: 'departments', label: 'Departments', icon: 'bi-hospital-fill' },
                { id: 'appointments', label: 'Appointments', icon: 'bi-calendar2-check-fill' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${activeTab === tab.id ? 'btn-primary text-white shadow-sm' : 'text-secondary'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`bi ${tab.icon} me-1`}></i>
                  {tab.label}
                  {tab.id === 'doctors' && stats?.counts?.pendingDoctors > 0 && (
                    <span className="badge bg-warning text-dark ms-1.5">{stats.counts.pendingDoctors}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat Counter Cards */}
            <div className="row g-3 mb-4">
              <div className="col-lg-3 col-sm-6">
                <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>Total Patients</small>
                      <h3 className="fw-bold text-dark mb-0">{stats?.counts?.patients || 0}</h3>
                    </div>
                    <div className="bg-primary-subtle text-primary rounded-3 p-3 fs-4">
                      <i className="bi bi-people-fill"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6">
                <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>Total Doctors</small>
                      <h3 className="fw-bold text-dark mb-0">{stats?.counts?.doctors || 0}</h3>
                      <small className="text-success fw-semibold">{stats?.counts?.approvedDoctors || 0} Approved</small>
                    </div>
                    <div className="bg-success-subtle text-success rounded-3 p-3 fs-4">
                      <i className="bi bi-heart-pulse-fill"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6">
                <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>Total Consultations</small>
                      <h3 className="fw-bold text-dark mb-0">{stats?.counts?.appointments || 0}</h3>
                      <small className="text-primary fw-semibold">{stats?.counts?.completedAppointments || 0} Completed</small>
                    </div>
                    <div className="bg-info-subtle text-info rounded-3 p-3 fs-4">
                      <i className="bi bi-calendar2-check-fill"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6">
                <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>System Revenue</small>
                      <h3 className="fw-bold text-dark mb-0">${stats?.counts?.totalRevenue || 0}</h3>
                      <small className="text-muted">From paid visits</small>
                    </div>
                    <div className="bg-warning-subtle text-warning rounded-3 p-3 fs-4">
                      <i className="bi bi-cash-coin"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Overview Tables */}
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">Recent Consultation Bookings</h5>
                    <button className="btn btn-sm btn-link text-decoration-none" onClick={() => setActiveTab('appointments')}>
                      View All
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm align-middle small mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Date</th>
                          <th>Fee</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentAppointments?.map((a) => (
                          <tr key={a._id}>
                            <td className="fw-semibold text-dark">{a.patient?.name}</td>
                            <td>{a.doctor?.name} ({a.doctor?.department})</td>
                            <td>{a.appointmentDate}</td>
                            <td className="fw-bold text-success">${a.fee}</td>
                            <td>
                              <span className={`badge ${a.status === 'confirmed' ? 'bg-success-subtle text-success' : a.status === 'completed' ? 'bg-primary-subtle text-primary' : 'bg-danger-subtle text-danger'}`}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">Newly Registered Users</h5>
                    <button className="btn btn-sm btn-link text-decoration-none" onClick={() => setActiveTab('patients')}>
                      View All
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-2.5">
                    {stats?.recentUsers?.map((u) => (
                      <div key={u._id} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
                        <div>
                          <strong className="text-dark d-block small">{u.name}</strong>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{u.email}</span>
                        </div>
                        <span className="badge bg-secondary-subtle text-secondary text-capitalize" style={{ fontSize: '11px' }}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCTORS MANAGEMENT */}
        {activeTab === 'doctors' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <div>
                <h4 className="fw-bold text-dark mb-0">Doctor Practitioners</h4>
                <small className="text-muted">Manage credentials, review doctor registrations, and approve licenses</small>
              </div>

              <div className="btn-group btn-group-sm p-1 bg-light rounded-pill border">
                <button
                  className={`btn rounded-pill px-3 ${doctorApprovalFilter === 'all' ? 'btn-primary text-white' : 'text-secondary'}`}
                  onClick={() => setDoctorApprovalFilter('all')}
                >
                  All ({doctors.length})
                </button>
                <button
                  className={`btn rounded-pill px-3 ${doctorApprovalFilter === 'pending' ? 'btn-primary text-white' : 'text-secondary'}`}
                  onClick={() => setDoctorApprovalFilter('pending')}
                >
                  Pending Approval
                </button>
                <button
                  className={`btn rounded-pill px-3 ${doctorApprovalFilter === 'approved' ? 'btn-primary text-white' : 'text-secondary'}`}
                  onClick={() => setDoctorApprovalFilter('approved')}
                >
                  Approved
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Doctor</th>
                      <th>Department & Specialty</th>
                      <th>Experience / Fee</th>
                      <th>Approval Status</th>
                      <th>Active</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc) => (
                      <tr key={doc._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80'}
                              alt={doc.name}
                              className="rounded-circle object-fit-cover shadow-sm"
                              style={{ width: 44, height: 44 }}
                            />
                            <div>
                              <strong className="text-dark d-block">{doc.name}</strong>
                              <small className="text-muted">{doc.email} &bull; {doc.phone}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary d-inline-block mb-1">{doc.department}</span>
                          <small className="text-secondary d-block">{doc.specialization}</small>
                        </td>
                        <td>
                          <span className="d-block small fw-semibold text-dark">{doc.experienceYears} Years Exp.</span>
                          <span className="fw-bold text-success">${doc.consultationFee}</span>
                        </td>
                        <td>
                          {doc.isApproved ? (
                            <span className="badge bg-success-subtle text-success">
                              <i className="bi bi-check-circle me-1"></i> Approved
                            </span>
                          ) : (
                            <span className="badge bg-warning-subtle text-warning">
                              <i className="bi bi-hourglass-split me-1"></i> Pending Approval
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${doc.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {doc.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              className={`btn ${doc.isApproved ? 'btn-outline-warning' : 'btn-success text-white'}`}
                              onClick={() => handleToggleApproval(doc._id, doc.isApproved)}
                              title={doc.isApproved ? 'Revoke Approval' : 'Approve Doctor'}
                            >
                              {doc.isApproved ? 'Revoke' : 'Approve'}
                            </button>
                            <button
                              className={`btn ${doc.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => handleToggleDoctorActive(doc._id)}
                              title="Toggle Active Status"
                            >
                              {doc.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PATIENTS MANAGEMENT */}
        {activeTab === 'patients' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h4 className="fw-bold text-dark mb-1">Registered Patients</h4>
            <p className="text-secondary small mb-4">View patient contact details, health metrics, and account status</p>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Patient</th>
                      <th>Blood Group & Age</th>
                      <th>Contact & Address</th>
                      <th>Total Bookings</th>
                      <th>Account Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <strong className="text-dark d-block">{p.name}</strong>
                          <small className="text-muted">{p.email}</small>
                        </td>
                        <td>
                          <span className="badge bg-danger-subtle text-danger me-1">{p.patientDetails?.bloodGroup || 'N/A'}</span>
                          <small className="text-secondary">{p.patientDetails?.age ? `${p.patientDetails.age} yrs` : '–'} / {p.patientDetails?.gender || '–'}</small>
                        </td>
                        <td>
                          <small className="text-dark d-block">{p.phone || '–'}</small>
                          <small className="text-muted text-truncate d-block" style={{ maxWidth: 200 }}>{p.address || '–'}</small>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary fw-bold">
                            {p.appointmentCount || 0} Appointments
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${p.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {p.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className={`btn btn-sm ${p.isActive ? 'btn-outline-danger' : 'btn-outline-success'} rounded-pill px-3`}
                            onClick={() => handleTogglePatientActive(p._id)}
                          >
                            {p.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DEPARTMENTS MANAGEMENT */}
        {activeTab === 'departments' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold text-dark mb-0">Departments & Specialties</h4>
                <small className="text-muted">Manage clinical divisions, icons, and descriptions</small>
              </div>
              <button
                className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm"
                onClick={() => {
                  setDeptForm({
                    id: null,
                    name: '',
                    description: '',
                    icon: 'bi-hospital',
                    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
                  });
                  setDeptModalOpen(true);
                }}
              >
                <i className="bi bi-plus-lg me-1"></i> Add Department
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <div className="row g-3">
                {departments.map((dept) => (
                  <div key={dept._id} className="col-lg-4 col-md-6">
                    <div className="card h-100 border rounded-4 p-3.5 bg-light">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                            <i className={`bi ${dept.icon || 'bi-hospital'}`}></i>
                          </div>
                          <h6 className="fw-bold text-dark mb-0">{dept.name}</h6>
                        </div>
                        <span className="badge bg-white text-primary border">{dept.doctorCount || 0} Doctors</span>
                      </div>
                      <p className="text-secondary small mb-3 flex-grow-1">{dept.description}</p>
                      <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                        <button
                          className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                          onClick={() => {
                            setDeptForm({
                              id: dept._id,
                              name: dept.name,
                              description: dept.description,
                              icon: dept.icon,
                              image: dept.image
                            });
                            setDeptModalOpen(true);
                          }}
                        >
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleDeleteDepartment(dept._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: APPOINTMENTS MASTER */}
        {activeTab === 'appointments' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <div>
                <h4 className="fw-bold text-dark mb-0">System Consultations Master</h4>
                <small className="text-muted">Global tracking of all patient appointments across all doctors</small>
              </div>

              <select
                className="form-select form-select-sm"
                style={{ width: 160 }}
                value={apptStatusFilter}
                onChange={(e) => setApptStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-4">
                <p className="text-muted mb-0">No appointments found matching this status.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date & Slot</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th className="text-end">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a._id}>
                        <td>
                          <strong className="text-dark d-block">{a.patient?.name}</strong>
                          <small className="text-muted">{a.patient?.email}</small>
                        </td>
                        <td>
                          <strong className="text-dark d-block">{a.doctor?.name}</strong>
                          <small className="text-primary">{a.doctor?.department}</small>
                        </td>
                        <td>
                          <span className="fw-semibold text-dark d-block">{a.appointmentDate}</span>
                          <span className="badge bg-light text-dark border">{a.timeSlot}</span>
                        </td>
                        <td className="fw-bold text-success">${a.fee}</td>
                        <td>
                          <span className={`badge ${
                            a.status === 'confirmed'
                              ? 'bg-success-subtle text-success'
                              : a.status === 'completed'
                              ? 'bg-primary-subtle text-primary'
                              : 'bg-danger-subtle text-danger'
                          } text-capitalize`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            {a.status !== 'completed' && (
                              <button
                                className="btn btn-outline-success"
                                title="Mark Completed"
                                onClick={() => handleAdminUpdateAppt(a._id, 'completed')}
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                            )}
                            {a.status !== 'cancelled' && (
                              <button
                                className="btn btn-outline-danger"
                                title="Cancel"
                                onClick={() => handleAdminUpdateAppt(a._id, 'cancelled')}
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Department Modal */}
      {deptModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">
                  {deptForm.id ? 'Edit Department' : 'Create New Department'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDeptModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSaveDepartment}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Department Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Oncology, ENT, Urology"
                      value={deptForm.name}
                      onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Bootstrap Icon Class</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="bi-heart-pulse-fill"
                      value={deptForm.icon}
                      onChange={(e) => setDeptForm({ ...deptForm, icon: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Banner Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={deptForm.image}
                      onChange={(e) => setDeptForm({ ...deptForm, image: e.target.value })}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Summary of specialized care in this department..."
                      value={deptForm.description}
                      onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-0 bg-light">
                  <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setDeptModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={savingDept}>
                    {savingDept ? 'Saving...' : 'Save Department'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
