import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookingModal = ({ doctor, isOpen, onClose, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Date selection (default tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [appointmentDate, setAppointmentDate] = useState(defaultDateStr);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsData, setSlotsData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Fetch slots whenever doctor or date changes
  useEffect(() => {
    if (!isOpen || !doctor?._id || !appointmentDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setErrorMessage('');
      setSelectedSlot('');
      try {
        const { data } = await API.get(`/doctors/${doctor._id}/available-slots?date=${appointmentDate}`);
        setSlotsData(data);
      } catch (err) {
        console.error('Error fetching available slots:', err);
        setErrorMessage('Failed to load slots for this date.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [isOpen, doctor?._id, appointmentDate]);

  // Reset state when modal is closed
  const handleClose = () => {
    setBookingConfirmed(null);
    setErrorMessage('');
    setSelectedSlot('');
    setReason('');
    setSymptoms('');
    setSelectedFiles([]);
    onClose();
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Validate size (10MB max per file)
      for (const file of filesArray) {
        if (file.size > 10 * 1024 * 1024) {
          setErrorMessage(`File "${file.name}" exceeds the 10MB limit.`);
          return;
        }
      }
      setSelectedFiles(filesArray);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/doctors/${doctor._id}` } });
      return;
    }

    if (!selectedSlot) {
      setErrorMessage('Please select an available time slot.');
      return;
    }

    if (!reason.trim()) {
      setErrorMessage('Please provide a reason for the consultation.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('doctorId', doctor._id);
      formData.append('appointmentDate', appointmentDate);
      formData.append('timeSlot', selectedSlot);
      formData.append('reason', reason.trim());
      formData.append('symptoms', symptoms.trim());
      formData.append('paymentMethod', paymentMethod);

      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('reports', file);
        });
      }

      const { data } = await API.post('/appointments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setBookingConfirmed(data);
      if (onBookingSuccess) onBookingSuccess(data);
    } catch (err) {
      console.error('Booking submission error:', err);
      const msg = err.response?.data?.message || 'Failed to complete appointment booking. Please try again.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !doctor) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header bg-primary text-white px-4 py-3 border-0">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                <i className="bi bi-calendar-check-fill fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">Book Consultation</h5>
                <small className="opacity-90">Instant schedule with {doctor.name}</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4">
            {bookingConfirmed ? (
              /* Confirmation Success Screen */
              <div className="text-center py-4">
                <div className="bg-success-subtle text-success rounded-circle d-inline-flex p-3 mb-3">
                  <i className="bi bi-check-circle-fill display-4"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">Appointment Confirmed!</h4>
                <p className="text-muted mb-4">
                  Your appointment with <strong>{doctor.name}</strong> has been successfully booked.
                </p>

                <div className="card bg-light border-0 rounded-3 p-3 max-w-500 mx-auto text-start mb-4">
                  <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                    <span className="text-muted">Appointment ID:</span>
                    <span className="fw-semibold font-monospace small">#{bookingConfirmed._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Specialty:</span>
                    <span className="fw-semibold">{doctor.specialization}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Date & Time:</span>
                    <span className="fw-semibold text-primary">{bookingConfirmed.appointmentDate} at {bookingConfirmed.timeSlot}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Clinic:</span>
                    <span className="fw-semibold">{doctor.clinicAddress?.hospitalName || 'PulseCare Clinic'}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Consultation Fee:</span>
                    <span className="fw-bold text-success">${bookingConfirmed.fee} (Paid)</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Status:</span>
                    <span className="badge bg-success-subtle text-success">Confirmed</span>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-outline-secondary px-4 rounded-pill"
                    onClick={handleClose}
                  >
                    Done
                  </button>
                  <button
                    className="btn btn-primary px-4 rounded-pill shadow-sm"
                    onClick={() => {
                      handleClose();
                      navigate('/patient/dashboard');
                    }}
                  >
                    <i className="bi bi-journal-medical me-2"></i>
                    View in Dashboard
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit}>
                {/* Doctor Summary Banner */}
                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border mb-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="rounded-circle object-fit-cover shadow-sm"
                    style={{ width: 64, height: 64 }}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <h6 className="fw-bold mb-0 text-dark">{doctor.name}</h6>
                      <span className="badge bg-primary-subtle text-primary">{doctor.department}</span>
                    </div>
                    <div className="small text-muted">{doctor.specialization} &bull; {doctor.experienceYears} Years Exp.</div>
                    <div className="small text-secondary">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {doctor.clinicAddress?.hospitalName}, {doctor.clinicAddress?.city}
                    </div>
                  </div>
                  <div className="text-end ps-2 border-start">
                    <small className="text-muted d-block">Fee</small>
                    <span className="fs-5 fw-bold text-success">${doctor.consultationFee}</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                    <div className="small">{errorMessage}</div>
                  </div>
                )}

                <div className="row g-3">
                  {/* Date Selection */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      <i className="bi bi-calendar-event me-1 text-primary"></i> Select Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      min={todayStr}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      <i className="bi bi-credit-card me-1 text-primary"></i> Payment Method
                    </label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Credit / Debit Card">Credit / Debit Card (Online)</option>
                      <option value="Health Savings / Insurance">Health Savings / Insurance</option>
                      <option value="Pay at Hospital Counter">Pay at Hospital Counter</option>
                    </select>
                  </div>

                  {/* Slot Selector */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small d-flex justify-content-between">
                      <span><i className="bi bi-clock me-1 text-primary"></i> Available Time Slots *</span>
                      {slotsData?.dayOfWeek && (
                        <span className="text-muted">{slotsData.dayOfWeek} Schedule</span>
                      )}
                    </label>

                    {loadingSlots ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                        <span className="small text-muted">Checking doctor schedule...</span>
                      </div>
                    ) : slotsData?.isWorkingDay === false ? (
                      <div className="alert alert-warning py-2 mb-0 small">
                        <i className="bi bi-info-circle me-1"></i>
                        {doctor.name} is not available on {slotsData?.dayOfWeek}s. Please pick another weekday.
                      </div>
                    ) : slotsData?.slots && slotsData.slots.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2 p-2 border rounded-3 bg-light" style={{ maxHeight: 160, overflowY: 'auto' }}>
                        {slotsData.slots.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={!s.available}
                            onClick={() => {
                              setSelectedSlot(s.time);
                              setErrorMessage('');
                            }}
                            className={`btn btn-sm rounded-pill px-3 py-1.5 transition ${
                              selectedSlot === s.time
                                ? 'btn-primary shadow-sm'
                                : s.available
                                ? 'btn-outline-primary bg-white'
                                : 'btn-outline-secondary opacity-50 text-decoration-line-through'
                            }`}
                          >
                            {s.time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted small p-2 border rounded bg-light">
                        No slots generated for this date.
                      </div>
                    )}
                    {selectedSlot && (
                      <div className="small text-success mt-1">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        Selected Slot: <strong>{selectedSlot}</strong>
                      </div>
                    )}
                  </div>

                  {/* Reason for Visit */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small">
                      <i className="bi bi-chat-text me-1 text-primary"></i> Reason for Visit *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Annual heart evaluation, chest discomfort, medication review"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>

                  {/* Symptoms description */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small">
                      <i className="bi bi-clipboard2-pulse me-1 text-primary"></i> Current Symptoms (Optional)
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Describe any symptoms, duration, previous prescriptions, or known allergies..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Medical Report / File Upload */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small">
                      <i className="bi bi-cloud-arrow-up me-1 text-primary"></i> Upload Medical Reports / Past Prescriptions (Optional)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <div className="form-text small">
                      Accepted formats: PDF, Images (PNG, JPG), Word docs. Max 10MB per file.
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        {selectedFiles.map((f, i) => (
                          <span key={i} className="badge bg-light text-dark border p-2">
                            <i className="bi bi-file-earmark-medical text-primary me-1"></i>
                            {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <div>
                    <span className="text-muted small d-block">Consultation Fee</span>
                    <span className="fs-5 fw-bold text-dark">${doctor.consultationFee}</span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-3"
                      onClick={handleClose}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill px-4 shadow-sm"
                      disabled={submitting || !selectedSlot || (slotsData?.isWorkingDay === false)}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Confirming...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-lock-fill me-1"></i>
                          Confirm & Book
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
