import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'profile'
  const [stats, setStats] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter appointments
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  // Prescription modal state
  const [prescribingAppt, setPrescribingAppt] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }
  ]);
  const [savingPrescription, setSavingPrescription] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Doctor Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    specialization: '',
    qualifications: '',
    experienceYears: 5,
    consultationFee: 80,
    hospitalName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    bio: '',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '17:00',
    slotDurationMinutes: 30
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const [statsRes, apptsRes] = await Promise.all([
        API.get('/doctors/dashboard/stats'),
        API.get(`/appointments/doctor-appointments?status=${filterStatus}${filterDate ? `&date=${filterDate}` : ''}`)
      ]);

      setStats(statsRes.data?.stats);
      setDoctorProfile(statsRes.data?.doctor);
      setAppointments(apptsRes.data || []);

      if (statsRes.data?.doctor) {
        const d = statsRes.data.doctor;
        setProfileForm({
          name: d.name || '',
          phone: d.phone || '',
          specialization: d.specialization || '',
          qualifications: d.qualifications || '',
          experienceYears: d.experienceYears || 5,
          consultationFee: d.consultationFee || 80,
          hospitalName: d.clinicAddress?.hospitalName || '',
          street: d.clinicAddress?.street || '',
          city: d.clinicAddress?.city || '',
          state: d.clinicAddress?.state || '',
          zipCode: d.clinicAddress?.zipCode || '',
          bio: d.bio || '',
          workingDays: d.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          startTime: d.timeSlots?.startTime || '09:00',
          endTime: d.timeSlots?.endTime || '17:00',
          slotDurationMinutes: d.timeSlots?.slotDurationMinutes || 30
        });
      }
    } catch (err) {
      console.error('Error loading doctor dashboard:', err);
      setStatusMessage({ text: 'Error loading dashboard data.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [filterStatus, filterDate]);

  // Update appointment status
  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await API.put(`/appointments/${apptId}/status`, { status: newStatus });
      setStatusMessage({ text: `Appointment marked as ${newStatus}.`, type: 'success' });
      fetchDoctorData();
    } catch (err) {
      setStatusMessage({ text: err.response?.data?.message || 'Error updating status.', type: 'danger' });
    }
  };

  // Medicine list management in Prescription modal
  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }
    ]);
  };

  const handleRemoveMedicineRow = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  // Issue prescription
  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!prescribingAppt) return;
    setSavingPrescription(true);

    try {
      await API.post(`/appointments/${prescribingAppt._id}/prescription`, {
        diagnosis,
        notes: clinicalNotes,
        medicines: medicines.filter((m) => m.name.trim() !== ''),
        markCompleted: true
      });

      setStatusMessage({ text: 'Digital prescription issued & appointment marked as completed!', type: 'success' });
      setPrescribingAppt(null);
      setDiagnosis('');
      setClinicalNotes('');
      setMedicines([{ name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }]);
      fetchDoctorData();
    } catch (err) {
      setStatusMessage({ text: err.response?.data?.message || 'Failed to record prescription.', type: 'danger' });
    } finally {
      setSavingPrescription(false);
    }
  };

  // Save Doctor Profile & Availability
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      await API.put('/doctors/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        specialization: profileForm.specialization,
        qualifications: profileForm.qualifications,
        experienceYears: Number(profileForm.experienceYears),
        consultationFee: Number(profileForm.consultationFee),
        clinicAddress: {
          hospitalName: profileForm.hospitalName,
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          zipCode: profileForm.zipCode
        },
        bio: profileForm.bio,
        workingDays: profileForm.workingDays,
        timeSlots: {
          startTime: profileForm.startTime,
          endTime: profileForm.endTime,
          slotDurationMinutes: Number(profileForm.slotDurationMinutes)
        }
      });

      setStatusMessage({ text: 'Doctor profile and weekly availability updated successfully!', type: 'success' });
      fetchDoctorData();
    } catch (err) {
      setStatusMessage({ text: err.response?.data?.message || 'Failed to update profile.', type: 'danger' });
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleWorkingDay = (day) => {
    const current = profileForm.workingDays || [];
    if (current.includes(day)) {
      setProfileForm({ ...profileForm, workingDays: current.filter((d) => d !== day) });
    } else {
      setProfileForm({ ...profileForm, workingDays: [...current, day] });
    }
  };

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        {/* Status Message */}
        {statusMessage.text && (
          <div className={`alert alert-${statusMessage.type} alert-dismissible fade show mb-4`} role="alert">
            {statusMessage.text}
            <button type="button" className="btn-close" onClick={() => setStatusMessage({ text: '', type: '' })}></button>
          </div>
        )}

        {/* Doctor Header Banner */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={doctorProfile?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'}
                alt={doctorProfile?.name}
                className="rounded-4 object-fit-cover shadow-sm"
                style={{ width: 70, height: 70 }}
              />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h4 className="fw-bold mb-0 text-dark">{doctorProfile?.name || user?.name}</h4>
                  <span className="badge bg-success-subtle text-success">
                    {doctorProfile?.isApproved ? 'Approved Physician' : 'Pending Approval'}
                  </span>
                </div>
                <div className="text-secondary small">
                  {doctorProfile?.specialization} &bull; {doctorProfile?.department}
                </div>
                <small className="text-muted">
                  <i className="bi bi-geo-alt me-1 text-danger"></i>
                  {doctorProfile?.clinicAddress?.hospitalName || 'PulseCare Clinic'}
                </small>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="btn-group p-1 bg-light rounded-pill border" role="group">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-4 ${activeTab === 'appointments' ? 'btn-primary text-white shadow-sm' : 'text-secondary'}`}
                onClick={() => setActiveTab('appointments')}
              >
                <i className="bi bi-calendar2-check me-1"></i> Patient Appointments
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-4 ${activeTab === 'profile' ? 'btn-primary text-white shadow-sm' : 'text-secondary'}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="bi bi-clock-history me-1"></i> Availability & Profile
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>Total Bookings</small>
                  <h3 className="fw-bold text-dark mb-0">{stats?.totalAppointments || 0}</h3>
                </div>
                <div className="bg-primary-subtle text-primary rounded-3 p-3 fs-4">
                  <i className="bi bi-calendar-event"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>Today's Visits</small>
                  <h3 className="fw-bold text-dark mb-0">{stats?.todayAppointments || 0}</h3>
                </div>
                <div className="bg-info-subtle text-info rounded-3 p-3 fs-4">
                  <i className="bi bi-clock-history"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>Completed</small>
                  <h3 className="fw-bold text-success mb-0">{stats?.completedAppointments || 0}</h3>
                </div>
                <div className="bg-success-subtle text-success rounded-3 p-3 fs-4">
                  <i className="bi bi-check2-circle"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-3.5 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>Total Earnings</small>
                  <h3 className="fw-bold text-dark mb-0">${stats?.totalEarnings || 0}</h3>
                </div>
                <div className="bg-warning-subtle text-warning rounded-3 p-3 fs-4">
                  <i className="bi bi-cash-stack"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Appointments Management */}
        {activeTab === 'appointments' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <div>
                <h4 className="fw-bold text-dark mb-0">Consultation Schedule</h4>
                <small className="text-muted">Review patient medical records, confirm visits, and issue digital prescriptions</small>
              </div>

              {/* Filters */}
              <div className="d-flex flex-wrap gap-2">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  style={{ width: '160px' }}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                <select
                  className="form-select form-select-sm"
                  style={{ width: '150px' }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {filterDate && (
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setFilterDate('')}>
                    Clear Date
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-4">
                <i className="bi bi-calendar2-x text-muted display-4 mb-2"></i>
                <h5 className="fw-bold text-dark">No Consultations Found</h5>
                <p className="text-secondary small mb-0">There are no appointments matching your active date or status filters.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Patient</th>
                      <th>Schedule</th>
                      <th>Reason & Symptoms</th>
                      <th>Medical Records</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary-subtle text-primary rounded-circle fw-bold d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, fontSize: '13px' }}>
                              {appt.patient?.name ? appt.patient.name.charAt(0) : 'P'}
                            </div>
                            <div>
                              <strong className="text-dark d-block">{appt.patient?.name}</strong>
                              <small className="text-muted">
                                {appt.patient?.patientDetails?.bloodGroup} &bull; {appt.patient?.patientDetails?.age || '–'} yrs &bull; {appt.patient?.phone || ''}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong className="text-dark d-block">{appt.appointmentDate}</strong>
                          <span className="badge bg-light text-primary border">{appt.timeSlot}</span>
                        </td>
                        <td style={{ maxWidth: 220 }}>
                          <span className="fw-medium text-dark d-block text-truncate" title={appt.reason}>
                            {appt.reason}
                          </span>
                          {appt.symptoms && (
                            <small className="text-secondary text-truncate d-block" title={appt.symptoms}>
                              {appt.symptoms}
                            </small>
                          )}
                        </td>
                        <td>
                          {appt.medicalReports && appt.medicalReports.length > 0 ? (
                            <div className="d-flex flex-wrap gap-1">
                              {appt.medicalReports.map((r, i) => (
                                <a
                                  key={i}
                                  href={r.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="badge bg-light text-primary border text-decoration-none py-1 px-2"
                                  title={r.originalName}
                                >
                                  <i className="bi bi-file-earmark-medical me-1"></i>
                                  Report #{i + 1}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted small">None</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${
                            appt.status === 'confirmed'
                              ? 'bg-success-subtle text-success'
                              : appt.status === 'completed'
                              ? 'bg-primary-subtle text-primary'
                              : 'bg-danger-subtle text-danger'
                          } text-capitalize`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            {/* Write prescription button */}
                            {appt.status !== 'cancelled' && (
                              <button
                                className="btn btn-outline-success"
                                title="Write / Edit Digital Prescription"
                                onClick={() => {
                                  setPrescribingAppt(appt);
                                  if (appt.prescription) {
                                    setDiagnosis(appt.prescription.diagnosis || '');
                                    setClinicalNotes(appt.prescription.notes || '');
                                    if (appt.prescription.medicines?.length > 0) {
                                      setMedicines(appt.prescription.medicines);
                                    }
                                  }
                                }}
                              >
                                <i className="bi bi-prescription2 me-1"></i> Rx
                              </button>
                            )}

                            {/* Mark Completed */}
                            {appt.status === 'confirmed' && (
                              <button
                                className="btn btn-outline-primary"
                                title="Mark Completed"
                                onClick={() => handleUpdateStatus(appt._id, 'completed')}
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                            )}

                            {/* Cancel */}
                            {appt.status === 'confirmed' && (
                              <button
                                className="btn btn-outline-danger"
                                title="Cancel Visit"
                                onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
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

        {/* Tab 2: Profile & Availability Management */}
        {activeTab === 'profile' && (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h4 className="fw-bold text-dark mb-1">Manage Profile & Practice Availability</h4>
            <p className="text-secondary small mb-4">
              Configuring your working days, hours, and fees directly controls the appointment slots patients can book on PulseCare.
            </p>

            <form onSubmit={handleSaveProfile}>
              <h6 className="fw-bold text-primary mb-3 pb-1 border-bottom">
                <i className="bi bi-person-badge me-1"></i> Practitioner Profile
              </h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Doctor Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Specialization</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.specialization}
                    onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Qualifications</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.qualifications}
                    onChange={(e) => setProfileForm({ ...profileForm, qualifications: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold">Experience (Yrs)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={profileForm.experienceYears}
                    onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold">Fee ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="10"
                    value={profileForm.consultationFee}
                    onChange={(e) => setProfileForm({ ...profileForm, consultationFee: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Bio / Philosophy</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <h6 className="fw-bold text-primary mb-3 pb-1 border-bottom">
                <i className="bi bi-hospital me-1"></i> Clinic / Hospital Practice Address
              </h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Hospital / Clinic Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.hospitalName}
                    onChange={(e) => setProfileForm({ ...profileForm, hospitalName: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Street Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.street}
                    onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">State</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Zip Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.zipCode}
                    onChange={(e) => setProfileForm({ ...profileForm, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <h6 className="fw-bold text-primary mb-3 pb-1 border-bottom">
                <i className="bi bi-calendar2-range me-1"></i> Weekly Availability & Slot Generator
              </h6>
              <div className="mb-4">
                <label className="form-label small fw-semibold d-block">Operating Days</label>
                <div className="d-flex flex-wrap gap-2">
                  {allDays.map((day) => {
                    const active = profileForm.workingDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWorkingDay(day)}
                        className={`btn btn-sm rounded-pill px-3 py-1.5 ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
                      >
                        <i className={`bi ${active ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Start Time (24h format)</label>
                  <input
                    type="time"
                    className="form-control"
                    value={profileForm.startTime}
                    onChange={(e) => setProfileForm({ ...profileForm, startTime: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">End Time (24h format)</label>
                  <input
                    type="time"
                    className="form-control"
                    value={profileForm.endTime}
                    onChange={(e) => setProfileForm({ ...profileForm, endTime: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Slot Duration</label>
                  <select
                    className="form-select"
                    value={profileForm.slotDurationMinutes}
                    onChange={(e) => setProfileForm({ ...profileForm, slotDurationMinutes: Number(e.target.value) })}
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={savingProfile}>
                {savingProfile ? 'Updating Profile...' : 'Save Availability & Profile'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Write Prescription Modal */}
      {prescribingAppt && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-prescription2 fs-4"></i>
                  <h5 className="modal-title fw-bold mb-0">Issue Digital Prescription</h5>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setPrescribingAppt(null)}></button>
              </div>

              <form onSubmit={handleSavePrescription}>
                <div className="modal-body p-4">
                  <div className="bg-light p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted small d-block">Patient Name</span>
                      <strong className="text-dark">{prescribingAppt.patient?.name}</strong>
                    </div>
                    <div>
                      <span className="text-muted small d-block">Consultation Date</span>
                      <strong className="text-dark">{prescribingAppt.appointmentDate} ({prescribingAppt.timeSlot})</strong>
                    </div>
                    <div>
                      <span className="text-muted small d-block">Chief Complaint</span>
                      <strong className="text-dark">{prescribingAppt.reason}</strong>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Clinical Diagnosis *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Acute Bronchitis, Essential Hypertension Grade 1"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      required
                    />
                  </div>

                  {/* Medicines List */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label small fw-semibold text-secondary mb-0">
                        Prescribed Medications
                      </label>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-pill"
                        onClick={handleAddMedicineRow}
                      >
                        <i className="bi bi-plus-lg me-1"></i> Add Medication
                      </button>
                    </div>

                    {medicines.map((med, idx) => (
                      <div key={idx} className="card p-2.5 mb-2 bg-light border-0 rounded-3">
                        <div className="row g-2 align-items-center">
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Medicine Name"
                              value={med.name}
                              onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Dosage (1 tab)"
                              value={med.dosage}
                              onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Frequency"
                              value={med.frequency}
                              onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Duration"
                              value={med.duration}
                              onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Instructions"
                              value={med.instructions}
                              onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                            />
                          </div>
                          <div className="col-md-1 text-end">
                            {medicines.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm p-1"
                                onClick={() => handleRemoveMedicineRow(idx)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notes & Advice */}
                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-secondary">
                      Clinical Notes, Dietary Advice & Follow-up
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Advised hydration, avoid salt, follow up in 2 weeks..."
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-0 bg-light">
                  <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setPrescribingAppt(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={savingPrescription}>
                    {savingPrescription ? 'Saving...' : 'Issue Prescription'}
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

export default DoctorDashboard;
