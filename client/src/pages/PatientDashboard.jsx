import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const PatientDashboard = () => {
  const { user, updateUser } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Cancel modal state
  const [cancellingAppt, setCancellingAppt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Prescription modal state
  const [viewingPrescription, setViewingPrescription] = useState(null);

  // Upload report modal state
  const [uploadAppt, setUploadAppt] = useState(null);
  const [reportFiles, setReportFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Profile edit modal state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bloodGroup: user?.patientDetails?.bloodGroup || 'O+',
    age: user?.patientDetails?.age || '',
    gender: user?.patientDetails?.gender || 'Male',
    emergencyContact: user?.patientDetails?.emergencyContact || '',
    medicalHistory: user?.patientDetails?.medicalHistory || ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const url = filterStatus === 'all'
        ? '/appointments/my-appointments'
        : `/appointments/my-appointments?status=${filterStatus}`;
      const { data } = await API.get(url);
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus]);

  // Handle Cancel Appointment
  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    if (!cancellingAppt) return;
    setCancelLoading(true);
    try {
      await API.put(`/appointments/${cancellingAppt._id}/cancel`, {
        reason: cancelReason.trim() || 'Cancelled by patient'
      });
      setStatusMessage({ text: 'Appointment successfully cancelled.', type: 'success' });
      setCancellingAppt(null);
      setCancelReason('');
      fetchAppointments();
    } catch (err) {
      setStatusMessage({
        text: err.response?.data?.message || 'Failed to cancel appointment.',
        type: 'danger'
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // Handle Upload Report
  const handleUploadReport = async (e) => {
    e.preventDefault();
    if (!uploadAppt || reportFiles.length === 0) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      Array.from(reportFiles).forEach((f) => {
        formData.append('reports', f);
      });

      await API.post(`/appointments/${uploadAppt._id}/upload-report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStatusMessage({ text: 'Medical reports uploaded successfully!', type: 'success' });
      setUploadAppt(null);
      setReportFiles([]);
      fetchAppointments();
    } catch (err) {
      setStatusMessage({
        text: err.response?.data?.message || 'Failed to upload reports.',
        type: 'danger'
      });
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const { data } = await API.put('/auth/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address,
        patientDetails: {
          bloodGroup: profileForm.bloodGroup,
          age: profileForm.age ? Number(profileForm.age) : null,
          gender: profileForm.gender,
          emergencyContact: profileForm.emergencyContact,
          medicalHistory: profileForm.medicalHistory
        }
      });
      updateUser(data);
      setStatusMessage({ text: 'Patient profile updated successfully!', type: 'success' });
      setEditingProfile(false);
    } catch (err) {
      setStatusMessage({
        text: err.response?.data?.message || 'Failed to update profile.',
        type: 'danger'
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-success-subtle text-success border border-success-subtle"><i className="bi bi-check-circle me-1"></i> Confirmed</span>;
      case 'completed':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle"><i className="bi bi-patch-check-fill me-1"></i> Completed</span>;
      case 'cancelled':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle"><i className="bi bi-x-circle me-1"></i> Cancelled</span>;
      default:
        return <span className="badge bg-warning-subtle text-warning"><i className="bi bi-hourglass me-1"></i> Pending</span>;
    }
  };

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        {/* Banner Alert if any */}
        {statusMessage.text && (
          <div className={`alert alert-${statusMessage.type} alert-dismissible fade show mb-4`} role="alert">
            {statusMessage.text}
            <button type="button" className="btn-close" onClick={() => setStatusMessage({ text: '', type: '' })}></button>
          </div>
        )}

        <div className="row g-4">
          {/* Left Column: Patient Profile Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <div className="text-center mb-3">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold fs-2 shadow-sm" style={{ width: 80, height: 80 }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <h5 className="fw-bold text-dark mb-0">{user?.name}</h5>
                <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill mt-1">Patient Portal</span>
                <div className="text-muted small mt-1">{user?.email}</div>
              </div>

              <hr className="my-3 opacity-25" />

              <h6 className="fw-bold text-secondary small text-uppercase mb-3">Health Details</h6>
              <div className="d-flex flex-column gap-2 small mb-4">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Blood Group:</span>
                  <strong className="text-dark">{user?.patientDetails?.bloodGroup || 'Not set'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Age / Gender:</span>
                  <strong className="text-dark">
                    {user?.patientDetails?.age ? `${user.patientDetails.age} yrs` : '–'} / {user?.patientDetails?.gender || '–'}
                  </strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Phone:</span>
                  <strong className="text-dark">{user?.phone || '–'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Emergency:</span>
                  <strong className="text-dark text-truncate ps-2" style={{ maxWidth: 160 }} title={user?.patientDetails?.emergencyContact}>
                    {user?.patientDetails?.emergencyContact || '–'}
                  </strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Address:</span>
                  <strong className="text-dark text-truncate ps-2" style={{ maxWidth: 160 }} title={user?.address}>
                    {user?.address || '–'}
                  </strong>
                </div>
              </div>

              <button
                className="btn btn-outline-primary btn-sm rounded-pill w-100"
                onClick={() => setEditingProfile(true)}
              >
                <i className="bi bi-pencil-square me-1"></i> Edit Profile & Health Info
              </button>
            </div>

            {/* Quick Action Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white">
              <h5 className="fw-bold mb-2">Need a Doctor?</h5>
              <p className="small opacity-90 mb-3">
                Browse our 10+ certified physicians across cardiology, neurology, pediatrics, and more.
              </p>
              <Link to="/doctors" className="btn btn-light text-primary rounded-pill fw-bold shadow-sm">
                <i className="bi bi-search me-1"></i> Book New Consultation
              </Link>
            </div>
          </div>

          {/* Right Column: Appointments List */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-2">
                <div>
                  <h4 className="fw-bold text-dark mb-0">My Consultations</h4>
                  <small className="text-muted">Manage your upcoming and past doctor visits</small>
                </div>

                {/* Filter Pills */}
                <div className="btn-group btn-group-sm p-1 bg-light rounded-pill border" role="group">
                  <button
                    type="button"
                    className={`btn rounded-pill px-3 ${filterStatus === 'all' ? 'btn-primary text-white' : 'text-secondary'}`}
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`btn rounded-pill px-3 ${filterStatus === 'confirmed' ? 'btn-primary text-white' : 'text-secondary'}`}
                    onClick={() => setFilterStatus('confirmed')}
                  >
                    Upcoming
                  </button>
                  <button
                    type="button"
                    className={`btn rounded-pill px-3 ${filterStatus === 'completed' ? 'btn-primary text-white' : 'text-secondary'}`}
                    onClick={() => setFilterStatus('completed')}
                  >
                    Completed
                  </button>
                  <button
                    type="button"
                    className={`btn rounded-pill px-3 ${filterStatus === 'cancelled' ? 'btn-primary text-white' : 'text-secondary'}`}
                    onClick={() => setFilterStatus('cancelled')}
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 p-4">
                  <i className="bi bi-calendar-x text-muted display-4 mb-3"></i>
                  <h5 className="fw-bold text-dark">No Appointments Found</h5>
                  <p className="text-secondary small mb-3">
                    You have no {filterStatus !== 'all' ? filterStatus : ''} appointments scheduled.
                  </p>
                  <Link to="/doctors" className="btn btn-primary rounded-pill px-4">
                    Book an Appointment
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {appointments.map((appt) => (
                    <div key={appt._id} className="card border rounded-4 p-3.5 hover-shadow transition">
                      <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mb-2">
                        {/* Doctor info */}
                        <div className="d-flex gap-3 align-items-center">
                          <img
                            src={appt.doctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'}
                            alt={appt.doctor?.name}
                            className="rounded-circle object-fit-cover shadow-sm flex-shrink-0"
                            style={{ width: 56, height: 56 }}
                          />
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <h6 className="fw-bold mb-0 text-dark">{appt.doctor?.name}</h6>
                              <span className="badge bg-primary-subtle text-primary small">{appt.doctor?.department}</span>
                            </div>
                            <small className="text-muted d-block">{appt.doctor?.specialization}</small>
                            <small className="text-secondary">
                              <i className="bi bi-geo-alt me-1 text-danger"></i>
                              {appt.doctor?.clinicAddress?.hospitalName || 'PulseCare Clinic'}
                            </small>
                          </div>
                        </div>

                        {/* Status & Fee */}
                        <div className="text-sm-end">
                          <div className="mb-1">{getStatusBadge(appt.status)}</div>
                          <span className="fw-bold text-success">${appt.fee}</span>
                        </div>
                      </div>

                      {/* Date & Reason Bar */}
                      <div className="bg-light p-2.5 rounded-3 mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2 small">
                        <div>
                          <i className="bi bi-calendar-check text-primary me-1"></i>
                          <strong>{appt.appointmentDate}</strong> at <strong className="text-primary">{appt.timeSlot}</strong>
                        </div>
                        <div className="text-secondary text-truncate" style={{ maxWidth: '350px' }}>
                          <span className="text-muted">Reason:</span> {appt.reason}
                        </div>
                      </div>

                      {/* Uploaded Reports Preview */}
                      {appt.medicalReports && appt.medicalReports.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted fw-semibold d-block mb-1">
                            <i className="bi bi-paperclip me-1"></i> Attached Medical Records ({appt.medicalReports.length}):
                          </small>
                          <div className="d-flex flex-wrap gap-2">
                            {appt.medicalReports.map((report, idx) => (
                              <a
                                key={idx}
                                href={report.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="badge bg-light text-dark border p-2 text-decoration-none hover-shadow"
                              >
                                <i className="bi bi-file-earmark-pdf text-danger me-1"></i>
                                {report.originalName || report.fileName}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Action Buttons */}
                      <div className="d-flex flex-wrap justify-content-end gap-2 pt-2 border-top">
                        {/* Upload report button */}
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm rounded-pill"
                          onClick={() => setUploadAppt(appt)}
                        >
                          <i className="bi bi-cloud-arrow-up me-1"></i> Upload Reports
                        </button>

                        {/* View Prescription Button */}
                        {appt.prescription?.diagnosis && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm rounded-pill text-white"
                            onClick={() => setViewingPrescription(appt)}
                          >
                            <i className="bi bi-prescription2 me-1"></i> View Prescription
                          </button>
                        )}

                        {/* Cancel Appointment Button */}
                        {appt.status === 'confirmed' && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-pill"
                            onClick={() => setCancellingAppt(appt)}
                          >
                            <i className="bi bi-x-circle me-1"></i> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancellingAppt && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
              <div className="modal-header bg-danger text-white border-0 py-3">
                <h5 className="modal-title fw-bold">Cancel Appointment</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setCancellingAppt(null)}></button>
              </div>
              <form onSubmit={handleConfirmCancel}>
                <div className="modal-body p-4">
                  <p className="text-secondary">
                    Are you sure you want to cancel your consultation with <strong>{cancellingAppt.doctor?.name}</strong> on <strong>{cancellingAppt.appointmentDate} ({cancellingAppt.timeSlot})</strong>?
                  </p>
                  <label className="form-label small fw-semibold text-secondary">Reason for Cancellation</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="e.g. Schedule conflict, feeling better, need to reschedule..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setCancellingAppt(null)}>
                    Keep Appointment
                  </button>
                  <button type="submit" className="btn btn-danger rounded-pill px-4" disabled={cancelLoading}>
                    {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Digital Prescription Viewer Modal */}
      {viewingPrescription && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-prescription2 fs-4"></i>
                  <h5 className="modal-title fw-bold mb-0">Official Digital Prescription</h5>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setViewingPrescription(null)}></button>
              </div>
              <div className="modal-body p-4">
                {/* Prescription Header */}
                <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{viewingPrescription.doctor?.name}</h5>
                    <small className="text-muted d-block">{viewingPrescription.doctor?.specialization} &bull; {viewingPrescription.doctor?.qualifications}</small>
                    <small className="text-secondary">{viewingPrescription.doctor?.clinicAddress?.hospitalName}</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success-subtle text-success mb-1">Prescription Slip</span>
                    <small className="d-block text-muted">
                      Date: {viewingPrescription.prescription?.issuedAt ? new Date(viewingPrescription.prescription.issuedAt).toLocaleDateString() : viewingPrescription.appointmentDate}
                    </small>
                  </div>
                </div>

                {/* Patient Summary */}
                <div className="bg-light p-3 rounded-3 mb-3 small d-flex justify-content-between">
                  <div>
                    <span className="text-muted">Patient:</span> <strong>{user?.name}</strong>
                  </div>
                  <div>
                    <span className="text-muted">Age/Gender:</span> <strong>{user?.patientDetails?.age || '–'} / {user?.patientDetails?.gender || '–'}</strong>
                  </div>
                  <div>
                    <span className="text-muted">Blood Group:</span> <strong>{user?.patientDetails?.bloodGroup || '–'}</strong>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="mb-4">
                  <h6 className="fw-bold text-dark mb-1">
                    <i className="bi bi-clipboard2-pulse text-primary me-1"></i> Clinical Diagnosis:
                  </h6>
                  <p className="bg-light p-2.5 rounded-3 mb-0 text-dark fw-medium">
                    {viewingPrescription.prescription?.diagnosis || 'General assessment'}
                  </p>
                </div>

                {/* Medicines Table */}
                <div className="mb-4">
                  <h6 className="fw-bold text-dark mb-2">
                    <i className="bi bi-capsule-pill text-danger me-1"></i> Prescribed Medications:
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm small align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Medicine Name</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                          <th>Instructions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingPrescription.prescription?.medicines?.map((m, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td className="fw-bold text-primary">{m.name}</td>
                            <td>{m.dosage}</td>
                            <td>{m.frequency}</td>
                            <td>{m.duration}</td>
                            <td className="text-secondary">{m.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Doctor's Notes & Advice */}
                {viewingPrescription.prescription?.notes && (
                  <div className="mb-3">
                    <h6 className="fw-bold text-dark mb-1">Doctor's Clinical Notes & Advice:</h6>
                    <p className="small text-secondary bg-light p-3 rounded-3 mb-0">
                      {viewingPrescription.prescription.notes}
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 bg-light">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer me-1"></i> Print Prescription
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => setViewingPrescription(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Reports Modal */}
      {uploadAppt && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">Upload Medical Documents</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setUploadAppt(null)}></button>
              </div>
              <form onSubmit={handleUploadReport}>
                <div className="modal-body p-4">
                  <p className="text-secondary small">
                    Attach lab results, ECG, scans, or medical records for appointment with <strong>{uploadAppt.doctor?.name}</strong>.
                  </p>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Choose Files (PDF, JPG, PNG, DOCX)</label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) => setReportFiles(e.target.files)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setUploadAppt(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={uploadLoading}>
                    {uploadLoading ? 'Uploading...' : 'Upload Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">Update Profile & Health Records</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEditingProfile(false)}></button>
              </div>
              <form onSubmit={handleSaveProfile}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Blood Group</label>
                      <select
                        className="form-select"
                        value={profileForm.bloodGroup}
                        onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not specified'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        value={profileForm.age}
                        onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Gender</label>
                      <select
                        className="form-select"
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Not specified">Not specified</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Emergency Contact Person & Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.emergencyContact}
                        onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Medical History / Chronic Conditions</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={profileForm.medicalHistory}
                        onChange={(e) => setProfileForm({ ...profileForm, medicalHistory: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 bg-light">
                  <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setEditingProfile(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={profileSaving}>
                    {profileSaving ? 'Saving...' : 'Save Changes'}
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

export default PatientDashboard;
